import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { favoritesAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { CACHE } from '@/lib/cache-config';

export const useFavorites = () => {
  return useQuery({
    queryKey: ['favorites'],
    queryFn: async () => {
      const response = await favoritesAPI.getAll();
      return response.data || response;
    },
    staleTime: CACHE.DYNAMIC,
    gcTime: CACHE.GC_TIME,
  });
};

export const useCheckFavorite = (phoneNumberId: string) => {
  return useQuery({
    queryKey: ['favorite-check', phoneNumberId],
    queryFn: async () => {
      const response = await favoritesAPI.check(phoneNumberId);
      return response.is_favorite || response.data?.is_favorite || false;
    },
    enabled: !!phoneNumberId,
    staleTime: CACHE.DYNAMIC,
    gcTime: CACHE.GC_TIME,
  });
};

export const useAddFavorite = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (phoneNumberId: string) => {
      const response = await favoritesAPI.add(phoneNumberId);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      queryClient.invalidateQueries({ queryKey: ['favorite-check'] });
      toast({
        title: 'تمت الإضافة للمفضلة',
        description: 'تم إضافة الرقم إلى قائمة المفضلة',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'خطأ',
        description: error.response?.data?.message || 'حدث خطأ أثناء الإضافة للمفضلة',
        variant: 'destructive',
      });
    },
  });
};

export const useRemoveFavorite = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (phoneNumberId: string) => {
      const response = await favoritesAPI.remove(phoneNumberId);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      queryClient.invalidateQueries({ queryKey: ['favorite-check'] });
      toast({
        title: 'تمت الإزالة من المفضلة',
        description: 'تم إزالة الرقم من قائمة المفضلة',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'خطأ',
        description: error.response?.data?.message || 'حدث خطأ أثناء الإزالة من المفضلة',
        variant: 'destructive',
      });
    },
  });
};

export const useToggleFavorite = () => {
  const addFavorite = useAddFavorite();
  const removeFavorite = useRemoveFavorite();

  const toggle = async (phoneNumberId: string, isFavorite: boolean) => {
    if (isFavorite) {
      await removeFavorite.mutateAsync(phoneNumberId);
    } else {
      await addFavorite.mutateAsync(phoneNumberId);
    }
  };

  return {
    toggle,
    isPending: addFavorite.isPending || removeFavorite.isPending,
  };
};
