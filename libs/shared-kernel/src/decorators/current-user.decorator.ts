import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Decorator to extract current user from request
 * Usage: @CurrentUser() user: User
 */
export const CurrentUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return null;
    }

    // Return specific property if data is provided
    return data ? user[data] : user;
  },
);

/**
 * Type for current user in request
 */
export interface RequestUser {
  id: string;
  email: string;
  tenantId: string;
}
