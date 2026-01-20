import { QueryClient } from 'react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 50000,
      retry: 1,
      retryDelay: 300000,
      refetchInterval: 60000, // 1 minute
      refetchIntervalInBackground: true,
    },
  },
});

export default queryClient;
