import { QueryClient } from '@tanstack/react-query';

/**
 * TanStack Query client configuration
 *
 * Per CONTEXT.md decisions:
 * - Stale time: 30 seconds (fresh data without excessive API calls)
 * - Refetch on window focus: enabled (keeps data current when user returns)
 * - Retry: 1 attempt on failure
 * - Retry delay: 1 second
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000, // 30 seconds
      refetchOnWindowFocus: true,
      retry: 1,
      retryDelay: 1000, // 1 second
    },
  },
});
