import { Injectable, NestMiddleware } from '@nestjs/common';
import { IncomingMessage, ServerResponse } from 'http';
import { TrialService } from '@pms/feature-subscription';

/**
 * Trial expiry middleware
 * Checks if tenant's trial has expired and downgrades to FREE tier
 * Runs after JWT authentication so user is available on request
 *
 * This should be registered after JwtAuthGuard in the middleware chain
 */
@Injectable()
export class TrialExpiryMiddleware implements NestMiddleware {
  constructor(private readonly trialService: TrialService) {}

  async use(req: IncomingMessage, res: ServerResponse, next: () => void) {
    const user = (req as any).user;

    // Only check for authenticated requests
    if (!user?.tenantId) {
      return next();
    }

    try {
      // Check and handle trial expiry
      // This will downgrade the tenant to FREE tier if trial has expired
      await this.trialService.checkAndHandleExpiry(user.tenantId);
    } catch (error) {
      // Log but don't block requests on expiry check failures
      // The trial can be checked on the next request
      console.error(`Trial expiry check failed for tenant ${user.tenantId}:`, error);
    }

    next();
  }
}
