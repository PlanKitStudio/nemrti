import { useQuery } from '@tanstack/react-query';
import { categoriesAPI } from '@/lib/api';
import { CACHE } from '@/lib/cache-config';

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await categoriesAPI.getAll();
      return response.data;
    },
    staleTime: CACHE.STATIC,
    gcTime: CACHE.GC_TIME,
  });
};

export const useCategory = (id: string) => {
  return useQuery({
    queryKey: ['category', id],
    queryFn: async () => {
      const response = await categoriesAPI.getById(id);
      return response.data;
    },
    enabled: !!id,
    staleTime: CACHE.STATIC,
    gcTime: CACHE.GC_TIME,
  });
};
