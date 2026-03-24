import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { PrismaModule, TenantContextModule, TenantContextMiddleware } from '@pms/data-access';
import { AllExceptionsFilter, TransformInterceptor } from '@pms/shared-kernel';
import { AuthModule } from '@pms/feature-auth';
import { FinancialModule } from '@pms/feature-financial';
import { HobbiesModule } from '@pms/feature-hobbies';
import { AiModule } from './ai/ai.module';
import configuration from './config/configuration';
import { validationSchema } from './config/validation.schema';
import { HealthModule } from './health/health.module';
import { LoggingModule } from './logging/logging.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validate: (config: Record<string, unknown>) => validationSchema.parse(config),
    }),
    LoggingModule,
    PrismaModule,
    TenantContextModule,
    HealthModule,
    AuthModule,
    FinancialModule,
    HobbiesModule,
    AiModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // TenantContextMiddleware handles both tenant context and correlation ID
    consumer.apply(TenantContextMiddleware).forRoutes('*');
  }
}
