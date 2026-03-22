import { Injectable, NestMiddleware } from '@nestjs/common';
import { IncomingMessage, ServerResponse } from 'http';
import { randomUUID } from 'crypto';
import { runWithTenantContext } from './async-local-storage';

/**
 * Tenant context middleware
 * Extracts tenant information from authenticated requests
 * Stores in AsyncLocalStorage for request duration
 *
 * Uses raw Node.js types because NestJS middleware with Fastify
 * receives IncomingMessage/ServerResponse, not Fastify request/reply.
 */
@Injectable()
export class TenantContextMiddleware implements NestMiddleware {
  use(req: IncomingMessage, res: ServerResponse, next: () => void) {
    const user = (req as any).user;
    const tenantId = user?.tenantId || 'default';
    const userId = user?.id;
    const correlationId = (req.headers['x-correlation-id'] as string) || randomUUID();

    const context = {
      tenantId,
      userId,
      correlationId,
    };

    runWithTenantContext(context, () => {
      res.setHeader('x-correlation-id', correlationId);
      next();
    });
  }
}
