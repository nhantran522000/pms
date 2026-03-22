import { Injectable, NestMiddleware } from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';
import { randomUUID } from 'crypto';

/**
 * Correlation ID middleware
 * Adds a unique correlation ID to each request for log tracing
 */
@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  use(req: FastifyRequest, res: FastifyReply, next: () => void) {
    const correlationId = (req.headers['x-correlation-id'] as string) || randomUUID();

    // Store in request for access in handlers
    (req as any).correlationId = correlationId;

    // Add to response headers
    res.header('x-correlation-id', correlationId);

    next();
  }
}
