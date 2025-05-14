import { QueryClient } from 'react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 50000,
      retryDelay: 50000,
      retry: false,
    },
  },
});

export default queryClient;
