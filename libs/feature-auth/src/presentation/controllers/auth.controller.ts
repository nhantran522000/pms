import { Controller, Post, Body, Get, UseGuards, Res, HttpStatus } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { AuthService } from '../../application/auth.service';
import { ZodValidationPipe } from '@pms/shared-kernel';
import { SignupDto, signupSchema, LoginDto, loginSchema, VerifyEmailDto, verifyEmailSchema, ForgotPasswordDto, forgotPasswordSchema, ResetPasswordDto, resetPasswordSchema } from '@pms/shared-types';
import { Public, CurrentUser } from '../decorators';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signup')
  async signup(
    @Body(new ZodValidationPipe(signupSchema)) dto: SignupDto,
    @Res() res: FastifyReply,
  ) {
    const authResponse = await this.authService.signup(dto);

    // Set httpOnly cookie
    res.setCookie('jwt', authResponse.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
    });

    return res.status(HttpStatus.CREATED).send({
      success: true,
      data: authResponse,
    });
  }

  @Public()
  @Post('login')
  async login(
    @Body(new ZodValidationPipe(loginSchema)) dto: LoginDto,
    @Res() res: FastifyReply,
  ) {
    const authResponse = await this.authService.login(dto);

    // Set httpOnly cookie
    res.setCookie('jwt', authResponse.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
    });

    return res.status(HttpStatus.OK).send({
      success: true,
      data: authResponse,
    });
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Res() res: FastifyReply) {
    // Clear jwt cookie
    res.clearCookie('jwt', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });

    return res.status(HttpStatus.OK).send({
      success: true,
      data: { message: 'Logged out successfully' },
    });
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(@CurrentUser() user: { userId: string; email: string; tenantId: string }) {
    return {
      success: true,
      data: {
        id: user.userId,
        email: user.email,
        tenantId: user.tenantId,
      },
    };
  }

  @Public()
  @Post('verify-email')
  async verifyEmail(
    @Body(new ZodValidationPipe(verifyEmailSchema)) dto: VerifyEmailDto,
  ) {
    const result = await this.authService.verifyEmail(dto);

    return {
      success: true,
      data: result,
    };
  }

  @Public()
  @Post('resend-verification')
  async resendVerificationEmail(
    @Body(new ZodValidationPipe(forgotPasswordSchema)) dto: ForgotPasswordDto,
  ) {
    const result = await this.authService.resendVerificationEmail(dto.email);

    return {
      success: true,
      data: result,
    };
  }

  @Public()
  @Post('forgot-password')
  async forgotPassword(
    @Body(new ZodValidationPipe(forgotPasswordSchema)) dto: ForgotPasswordDto,
  ) {
    const result = await this.authService.forgotPassword(dto);

    return {
      success: true,
      data: result,
    };
  }

  @Public()
  @Post('reset-password')
  async resetPassword(
    @Body(new ZodValidationPipe(resetPasswordSchema)) dto: ResetPasswordDto,
  ) {
    const result = await this.authService.resetPassword(dto);

    return {
      success: true,
      data: result,
    };
  }
}
