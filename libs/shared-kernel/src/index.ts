// Shared kernel - core domain utilities

export * from './pipes/zod-validation.pipe';
export * from './filters/all-exceptions.filter';
export * from './interceptors/transform.interceptor';
export * from './middleware/correlation-id.middleware';
export * from './decorators/current-user.decorator';
export * from './decorators/tenant.decorator';

export const SHARED_KERNEL_VERSION = '1.0.0';
