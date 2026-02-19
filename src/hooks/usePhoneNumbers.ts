import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { phoneNumbersAPI, adminAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { CACHE } from '@/lib/cache-config';

export const useAdminPhoneNumbers = () => {
  return useQuery({
    queryKey: ['admin', 'phone_numbers'],
    queryFn: async () => {
      const response = await adminAPI.getAllPhoneNumbers();
      return response.data;
    },
    staleTime: CACHE.DYNAMIC,
    gcTime: CACHE.GC_TIME,
  });
};

export const usePhoneNumbers = (filters?: {
  search?: string;
  category_id?: string;
  price_min?: number;
  price_max?: number;
  provider?: string;
  is_featured?: boolean;
  is_available?: boolean;
}) => {
  return useQuery({
    queryKey: ['phone_numbers', filters],
    queryFn: async () => {
      const response = await phoneNumbersAPI.getAll(filters);
      return response.data;
    },
    staleTime: CACHE.DYNAMIC,
    gcTime: CACHE.GC_TIME,
  });
};

export const usePhoneNumber = (id: string) => {
  return useQuery({
    queryKey: ['phone_number', id],
    queryFn: async () => {
      const response = await phoneNumbersAPI.getById(id);
      return response.data;
    },
    enabled: !!id,
    staleTime: CACHE.DYNAMIC,
    gcTime: CACHE.GC_TIME,
  });
};

export const useFeaturedPhoneNumbers = () => {
  return useQuery({
    queryKey: ['phone_numbers', 'featured'],
    queryFn: async () => {
      const response = await phoneNumbersAPI.getFeatured();
      return response.data;
    },
    staleTime: CACHE.MODERATE,
    gcTime: CACHE.GC_TIME,
  });
};

export const useCreatePhoneNumber = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (phoneData: any) => {
      const response = await adminAPI.createPhoneNumber(phoneData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['phone_numbers'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'phone_numbers'] });
      toast({
        title: 'تم إضافة الرقم بنجاح',
        description: 'تم إضافة الرقم إلى قائمة الأرقام',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'خطأ في إضافة الرقم',
        description: error.response?.data?.message || 'حدث خطأ أثناء إضافة الرقم',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdatePhoneNumber = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await adminAPI.updatePhoneNumber(id, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['phone_numbers'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'phone_numbers'] });
      toast({
        title: 'تم تحديث الرقم بنجاح',
        description: 'تم تحديث بيانات الرقم',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'خطأ في تحديث الرقم',
        description: error.response?.data?.message || 'حدث خطأ أثناء تحديث الرقم',
        variant: 'destructive',
      });
    },
  });
};

export const useDeletePhoneNumber = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await adminAPI.deletePhoneNumber(id);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['phone_numbers'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'phone_numbers'] });
      toast({
        title: 'تم حذف الرقم بنجاح',
        description: 'تم حذف الرقم من قائمة الأرقام',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'خطأ في حذف الرقم',
        description: error.response?.data?.message || 'حدث خطأ أثناء حذف الرقم',
        variant: 'destructive',
      });
    },
  });
};
