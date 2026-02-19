import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersAPI, adminAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { CACHE } from '@/lib/cache-config';

export const useOrders = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const response = await ordersAPI.getMyOrders();
      return response.data;
    },
    staleTime: CACHE.DYNAMIC,
    gcTime: CACHE.GC_TIME,
  });
};

export const useOrder = (id: string) => {
  return useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      const response = await ordersAPI.getById(id);
      return response.data;
    },
    enabled: !!id,
    staleTime: CACHE.DYNAMIC,
    gcTime: CACHE.GC_TIME,
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (orderData: any) => {
      const response = await ordersAPI.create(orderData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['phone_numbers'] });
      toast({
        title: 'تم إنشاء الطلب بنجاح',
        description: 'سيتم التواصل معك قريباً',
      });
    },
    onError: (error: any) => {
      const data = error.response?.data;
      let description = data?.message || 'حدث خطأ أثناء إنشاء الطلب';

      // Show specific validation errors
      if (data?.errors) {
        const firstError = Object.values(data.errors).flat()[0];
        if (firstError) description = String(firstError);
      }

      toast({
        title: 'خطأ في إنشاء الطلب',
        description,
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await ordersAPI.updateStatus(id, status);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
      queryClient.invalidateQueries({ queryKey: ['order'] });
      toast({
        title: 'تم تحديث حالة الطلب',
        description: 'تم تحديث حالة الطلب بنجاح',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'خطأ في تحديث حالة الطلب',
        description: error.response?.data?.message || 'حدث خطأ أثناء التحديث',
        variant: 'destructive',
      });
    },
  });
};

// Admin hooks
export const useAllOrders = () => {
  return useQuery({
    queryKey: ['admin', 'orders'],
    queryFn: async () => {
      const response = await adminAPI.getAllOrders();
      return response.data;
    },
    staleTime: CACHE.DYNAMIC,
    gcTime: CACHE.GC_TIME,
  });
};

export const useAdminUpdateOrder = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await adminAPI.updateOrder(id, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order'] });
      toast({
        title: 'تم تحديث الطلب',
        description: 'تم تحديث بيانات الطلب بنجاح',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'خطأ في تحديث الطلب',
        description: error.response?.data?.message || 'حدث خطأ أثناء التحديث',
        variant: 'destructive',
      });
    },
  });
};
