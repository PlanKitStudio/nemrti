import { useQuery } from '@tanstack/react-query';
import { adminAPI } from '@/lib/api';
import { CACHE } from '@/lib/cache-config';

export const useStats = () => {
  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: async () => {
      const response = await adminAPI.getStats();
      return response;
    },
    staleTime: CACHE.SHORT,
    gcTime: CACHE.GC_TIME,
    refetchInterval: 30000,
  });
};

export const useSalesChart = (days?: number) => {
  return useQuery({
    queryKey: ['admin', 'sales-chart', days],
    queryFn: async () => {
      const response = await adminAPI.getSalesChart(days);
      return response;
    },
    staleTime: CACHE.MODERATE,
    gcTime: CACHE.GC_TIME,
  });
};

export const usePopularNumbers = () => {
  return useQuery({
    queryKey: ['admin', 'popular-numbers'],
    queryFn: async () => {
      const response = await adminAPI.getPopularNumbers();
      return response;
    },
    staleTime: CACHE.MODERATE,
    gcTime: CACHE.GC_TIME,
  });
};
