import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './application/auth.service';
import { EmailService } from './infrastructure/services/email.service';
import { AuthController } from './presentation/controllers/auth.controller';
import { JwtStrategy } from './presentation/strategies/jwt.strategy';
import { JwtAuthGuard } from './presentation/guards/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from '@pms/data-access';
import { UserRepository } from './infrastructure/repositories/user.repository';
import { TenantRepository } from './infrastructure/repositories/tenant.repository';
import { SubscriptionModule } from '@pms/feature-subscription';

@Module({
  imports: [
    PrismaModule,
    SubscriptionModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'default-secret-change-in-production',
        signOptions: {
          expiresIn: '7d',
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserRepository,
    TenantRepository,
    EmailService,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  exports: [AuthService, EmailService],
})
export class AuthModule {}
