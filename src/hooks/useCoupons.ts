import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminCouponsAPI, couponsAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { CACHE } from '@/lib/cache-config';

export const useAdminCoupons = () => {
  return useQuery({
    queryKey: ['admin', 'coupons'],
    queryFn: async () => {
      const response = await adminCouponsAPI.getAll();
      return response.data || response;
    },
    staleTime: CACHE.DYNAMIC,
    gcTime: CACHE.GC_TIME,
  });
};

export const useCreateCoupon = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (couponData: any) => {
      const response = await adminCouponsAPI.create(couponData);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'coupons'] });
      toast({
        title: 'تم إنشاء الكوبون',
        description: 'تم إنشاء كوبون الخصم بنجاح',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'خطأ',
        description: error.response?.data?.message || 'حدث خطأ أثناء إنشاء الكوبون',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateCoupon = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await adminCouponsAPI.update(id, data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'coupons'] });
      toast({
        title: 'تم تحديث الكوبون',
        description: 'تم تحديث بيانات الكوبون بنجاح',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'خطأ',
        description: error.response?.data?.message || 'حدث خطأ أثناء التحديث',
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteCoupon = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await adminCouponsAPI.delete(id);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'coupons'] });
      toast({
        title: 'تم حذف الكوبون',
        description: 'تم حذف كوبون الخصم بنجاح',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'خطأ',
        description: error.response?.data?.message || 'حدث خطأ أثناء الحذف',
        variant: 'destructive',
      });
    },
  });
};

export const useValidateCoupon = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (code: string) => {
      const response = await couponsAPI.validate(code);
      return response;
    },
    onError: (error: any) => {
      toast({
        title: 'كوبون غير صالح',
        description: error.response?.data?.message || 'الكوبون غير صالح أو منتهي الصلاحية',
        variant: 'destructive',
      });
    },
  });
};
