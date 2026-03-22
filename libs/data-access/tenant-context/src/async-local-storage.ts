import { AsyncLocalStorage } from 'async_hooks';

/**
 * Tenant context stored in AsyncLocalStorage
 * Provides request-scoped access to tenant information
 */
export interface TenantContext {
  tenantId: string;
  userId?: string;
  correlationId?: string;
}

// Create singleton instance
const asyncLocalStorage = new AsyncLocalStorage<TenantContext>();

/**
 * Run code within tenant context
 */
export function runWithTenantContext<T>(
  context: TenantContext,
  callback: () => T,
): T {
  return asyncLocalStorage.run(context, callback);
}

/**
 * Get current tenant context
 */
export function getTenantContext(): TenantContext | undefined {
  return asyncLocalStorage.getStore();
}

/**
 * Get current tenant ID
 */
export function getTenantId(): string | undefined {
  return asyncLocalStorage.getStore()?.tenantId;
}

/**
 * Get current user ID
 */
export function getUserId(): string | undefined {
  return asyncLocalStorage.getStore()?.userId;
}

/**
 * Get correlation ID
 */
export function getCorrelationId(): string | undefined {
  return asyncLocalStorage.getStore()?.correlationId;
}
