// src/lib/queryClient.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: (failureCount, error: any) => {
        console.log('🔄 Query retry attempt:', failureCount, 'Error:', error?.message);
        // Don't retry on 4xx errors (client errors)
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

// Add global error handling
queryClient.setMutationDefaults(['hotel-mutation'], {
  onError: (error: any) => {
    console.error('❌ Mutation error:', error);
  },
});

// Add query cache event listeners for debugging
queryClient.getQueryCache().subscribe((event) => {
  console.log('📊 Query cache event:', {
    type: event.type,
    query: event.query.queryKey,
    state: event.query.state.status,
  });
});