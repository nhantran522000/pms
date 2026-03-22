import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TenantContextMiddleware } from './tenant-context.middleware';

@Module({})
export class TenantContextModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply to all routes except health check
    consumer
      .apply(TenantContextMiddleware)
      .exclude('health');
  }
}
