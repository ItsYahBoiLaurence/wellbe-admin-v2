import { QueryClient } from 'react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 50000,
      retry: 1,
      retryDelay: 300000,
    },
  },
});

export default queryClient;
