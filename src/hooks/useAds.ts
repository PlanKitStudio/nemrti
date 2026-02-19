import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAPI, adsAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { CACHE } from '@/lib/cache-config';

// ─── Public hooks ────────────────────────────────────────────

export const useAdsByPosition = (position: string) => {
  return useQuery({
    queryKey: ['ads', 'position', position],
    queryFn: () => adsAPI.getByPosition(position),
    staleTime: CACHE.MODERATE,
    gcTime: CACHE.GC_TIME,
    enabled: !!position,
  });
};

// ─── Admin hooks ─────────────────────────────────────────────

export const useAdminAds = (filters?: {
  position?: string;
  status?: string;
  search?: string;
  page?: number;
  per_page?: number;
}) => {
  return useQuery({
    queryKey: ['admin_ads', filters],
    queryFn: () => adminAPI.getAds(filters),
    staleTime: CACHE.SHORT,
    gcTime: CACHE.GC_TIME,
  });
};

export const useCreateAd = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (adData: any) => adminAPI.createAd(adData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_ads'] });
      queryClient.invalidateQueries({ queryKey: ['ads'] });
      toast({ title: 'تم إنشاء الإعلان', description: 'تم إضافة الإعلان بنجاح' });
    },
    onError: (error: any) => {
      toast({
        title: 'خطأ في إنشاء الإعلان',
        description: error.response?.data?.message || 'حدث خطأ',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateAd = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => adminAPI.updateAd(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_ads'] });
      queryClient.invalidateQueries({ queryKey: ['ads'] });
      toast({ title: 'تم تحديث الإعلان', description: 'تم تحديث الإعلان بنجاح' });
    },
    onError: (error: any) => {
      toast({
        title: 'خطأ في تحديث الإعلان',
        description: error.response?.data?.message || 'حدث خطأ',
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteAd = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => adminAPI.deleteAd(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_ads'] });
      queryClient.invalidateQueries({ queryKey: ['ads'] });
      toast({ title: 'تم حذف الإعلان', description: 'تم حذف الإعلان بنجاح' });
    },
    onError: (error: any) => {
      toast({
        title: 'خطأ في حذف الإعلان',
        description: error.response?.data?.message || 'حدث خطأ',
        variant: 'destructive',
      });
    },
  });
};

export const useAdAnalytics = (params?: {
  period?: string;
  page?: string;
  start_date?: string;
  end_date?: string;
}) => {
  return useQuery({
    queryKey: ['ad_analytics', params],
    queryFn: () => adminAPI.getAdAnalytics(params),
    staleTime: CACHE.SHORT,
    gcTime: CACHE.GC_TIME,
  });
};
