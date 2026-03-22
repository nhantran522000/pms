import { Injectable, NestMiddleware } from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';
import { randomUUID } from 'crypto';
import {
  runWithTenantContext,
  getTenantContext
} from './async-local-storage';

/**
 * Tenant context middleware
 * Extracts tenant information from authenticated requests
 * Stores in AsyncLocalStorage for request duration
 */
@Injectable()
export class TenantContextMiddleware implements NestMiddleware {
  use(req: FastifyRequest, reply: FastifyReply, next: () => void) {
    // Extract tenant from JWT payload (set by auth guard - future)
    // For now, use default tenant for unauthenticated requests
    const user = (req as any).user;
    const tenantId = user?.tenantId || 'default';
    const userId = user?.id;
    const correlationId = (req.headers['x-correlation-id'] as string) || randomUUID();

    const context = {
      tenantId,
      userId,
      correlationId,
    };

    // Store in AsyncLocalStorage and continue
    runWithTenantContext(context, () => {
      // Add correlation ID to response headers
      reply.header('x-correlation-id', correlationId);

      next();
    });
  }
}
