import { Injectable } from '@nestjs/common';
import { PrismaService } from '@pms/data-access';
import { UserEntity } from '../../domain/entities/user.entity';
import { User } from '@prisma/client';

export interface CreateUserInput {
  email: string;
  passwordHash: string;
  name?: string;
  tenantId: string;
}

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreateUserInput): Promise<UserEntity> {
    const user = await this.prisma.user.create({
      data: {
        email: input.email,
        passwordHash: input.passwordHash,
        name: input.name,
        tenantId: input.tenantId,
        emailVerified: false,
      },
    });
    return UserEntity.fromPrisma(user);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    return user ? UserEntity.fromPrisma(user) : null;
  }

  async findById(id: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    return user ? UserEntity.fromPrisma(user) : null;
  }

  async updateEmailVerified(id: string, verified: boolean): Promise<UserEntity> {
    const user = await this.prisma.user.update({
      where: { id },
      data: { emailVerified: verified },
    });
    return UserEntity.fromPrisma(user);
  }

  async updatePassword(id: string, passwordHash: string): Promise<UserEntity> {
    const user = await this.prisma.user.update({
      where: { id },
      data: { passwordHash },
    });
    return UserEntity.fromPrisma(user);
  }

  async updateVerificationToken(id: string, token: string | null, expiresAt: Date | null): Promise<UserEntity> {
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        verificationToken: token,
        verificationTokenExpires: expiresAt,
      },
    });
    return UserEntity.fromPrisma(user);
  }

  async findByVerificationToken(token: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        verificationToken: token,
        verificationTokenExpires: { gte: new Date() },
      },
    });
    return user ? UserEntity.fromPrisma(user) : null;
  }

  async updatePasswordResetToken(id: string, token: string | null, expiresAt: Date | null): Promise<UserEntity> {
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        passwordResetToken: token,
        passwordResetTokenExpires: expiresAt,
      },
    });
    return UserEntity.fromPrisma(user);
  }

  async findByPasswordResetToken(token: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        passwordResetToken: token,
        passwordResetTokenExpires: { gte: new Date() },
      },
    });
    return user ? UserEntity.fromPrisma(user) : null;
  }
}
