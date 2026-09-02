import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes fresh data (mengurangi request berulang)
      gcTime: 1000 * 60 * 15, // 15 minutes cache retention
      refetchOnWindowFocus: false, // Tidak refetch otomatis saat ganti window/tab
      retry: 1, // 1x retry jika gagal
    },
  },
});

