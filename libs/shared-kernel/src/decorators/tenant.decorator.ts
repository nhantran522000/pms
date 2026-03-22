import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { getTenantId } from '@pms/data-access';

/**
 * Decorator to extract tenant ID from AsyncLocalStorage
 * Usage: @Tenant() tenantId: string
 */
export const Tenant = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    return getTenantId();
  },
);

/**
 * Decorator to require tenant context (throws if not set)
 * Usage: @RequireTenant() tenantId: string
 */
export const RequireTenant = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const tenantId = getTenantId();
    if (!tenantId) {
      throw new Error('Tenant context not set');
    }
    return tenantId;
  },
);
