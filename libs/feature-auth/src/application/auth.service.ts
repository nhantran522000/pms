import { Injectable, Logger, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { UserRepository } from '../infrastructure/repositories/user.repository';
import { TenantRepository } from '../infrastructure/repositories/tenant.repository';
import { EmailService } from '../infrastructure/services/email.service';
import { Password } from '../domain/value-objects/password.vo';
import { UserEntity } from '../domain/entities/user.entity';
import { SignupDto, LoginDto, VerifyEmailDto, ForgotPasswordDto, ResetPasswordDto } from '@pms/shared-types';
import { AuthResponse, JwtPayload } from './dto/auth.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly jwtExpiration: number;

  constructor(
    private readonly userRepository: UserRepository,
    private readonly tenantRepository: TenantRepository,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    // JWT expires in 7 days (per CONTEXT.md decision)
    this.jwtExpiration = 7 * 24 * 60 * 60; // 7 days in seconds
  }

  async signup(dto: SignupDto): Promise<AuthResponse> {
    // Check if email already exists
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }

    // Create password with Zxcvbn validation (score 3+)
    const password = await Password.create(dto.password);

    // Create tenant
    const tenant = await this.tenantRepository.create(
      randomUUID(),
      `${dto.email}'s Workspace`,
    );

    // Create user with verification token
    const verificationToken = randomUUID();
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const user = await this.userRepository.create({
      email: dto.email,
      passwordHash: password.hash,
      name: dto.name,
      tenantId: tenant.id,
      verificationToken,
      verificationTokenExpires: verificationExpires,
    });

    // Send verification email
    await this.emailService.sendVerificationEmail(dto.email, verificationToken);

    this.logger.log(`User signed up: ${dto.email}`);

    // Generate JWT token
    return this.generateAuthResponse(UserEntity.fromPrisma(user));
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = await this.userRepository.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const password = Password.fromHash(user.passwordHash);
    const isValid = await password.compare(dto.password);

    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check email verification
    if (!user.emailVerified) {
      throw new UnauthorizedException('Please verify your email first');
    }

    this.logger.log(`User logged in: ${user.email}`);

    return this.generateAuthResponse(UserEntity.fromPrisma(user));
  }

  async verifyEmail(dto: VerifyEmailDto): Promise<{ message: string }> {
    const user = await this.userRepository.findByVerificationToken(dto.token);

    if (!user) {
      throw new BadRequestException('Invalid or expired verification token');
    }

    // Check if token is expired
    if (user.verificationTokenExpires && user.verificationTokenExpires < new Date()) {
      throw new BadRequestException('Verification token has expired');
    }

    // Mark email as verified and clear token
    await this.userRepository.updateEmailVerified(user.id, true);
    await this.userRepository.updateVerificationToken(user.id, null);

    this.logger.log(`Email verified: ${user.email}`);

    return { message: 'Email verified successfully' };
  }

  async resendVerificationEmail(email: string): Promise<{ message: string }> {
    const user = await this.userRepository.findByEmail(email);

    // Don't reveal if email exists or not
    if (!user) {
      this.logger.log(`Resend verification requested for non-existent email: ${email}`);
      return { message: 'If the email exists, check your inbox for a verification link' };
    }

    if (user.emailVerified) {
      return { message: 'Email already verified' };
    }

    // Generate new verification token
    const verificationToken = randomUUID();
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await this.userRepository.updateVerificationToken(user.id, verificationToken, verificationExpires);
    await this.emailService.sendVerificationEmail(user.email, verificationToken);

    this.logger.log(`Verification email resent to: ${email}`);

    return { message: 'If the email exists, check your inbox for a verification link' };
  }

  async forgotPassword(dto: ForgotPasswordDto): Promise<{ message: string }> {
    const user = await this.userRepository.findByEmail(dto.email);

    // Don't reveal if email exists
    if (!user) {
      this.logger.log(`Password reset requested for non-existent email: ${dto.email}`);
      return { message: 'If the email exists, check your inbox for a reset password link' };
    }

    // Generate reset token
    const resetToken = randomUUID();
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await this.userRepository.updatePasswordResetToken(user.id, resetToken, resetExpires);
    await this.emailService.sendPasswordResetEmail(user.email, resetToken);

    this.logger.log(`Password reset email sent to: ${dto.email}`);

    return { message: 'If the email exists, check your inbox for a reset password link' };
  }

  async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
    const user = await this.userRepository.findByPasswordResetToken(dto.token);

    if (!user) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    // Check if token is expired
    if (user.passwordResetTokenExpires && user.passwordResetTokenExpires < new Date()) {
      throw new BadRequestException('Reset token has expired');
    }

    // Create new password with Zxcvbn validation
    const password = await Password.create(dto.password);

    // Update password and clear reset token
    await this.userRepository.updatePassword(user.id, password.hash);
    await this.userRepository.updatePasswordResetToken(user.id, null);

    this.logger.log(`Password reset completed for: ${user.email}`);

    return { message: 'Password reset successfully' };
  }

  private generateAuthResponse(user: UserEntity): AuthResponse {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      tenantId: user.tenantId,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.jwtExpiration,
    });

    return {
      accessToken,
      user: user.toJSON(),
    };
  }

  validateToken(payload: JwtPayload): { userId: string; email: string; tenantId: string } {
    return {
      userId: payload.sub,
      email: payload.email,
      tenantId: payload.tenantId,
    };
  }
}
