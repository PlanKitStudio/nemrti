import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { CACHE } from '@/lib/cache-config';

export const useUsers = () => {
  return useQuery({
    queryKey: ['admin', 'users'],
    queryFn: async () => {
      const response = await adminAPI.getUsers();
      return response.data;
    },
    staleTime: CACHE.DYNAMIC,
    gcTime: CACHE.GC_TIME,
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await adminAPI.updateUser(id, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      toast({
        title: 'تم تحديث المستخدم',
        description: 'تم تحديث بيانات المستخدم بنجاح',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'خطأ في تحديث المستخدم',
        description: error.response?.data?.message || 'حدث خطأ أثناء التحديث',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      const response = await adminAPI.updateUser(userId, { role });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      toast({
        title: 'تم تحديث الدور',
        description: 'تم تحديث دور المستخدم بنجاح',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'خطأ في تحديث الدور',
        description: error.response?.data?.message || 'حدث خطأ أثناء التحديث',
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await adminAPI.deleteUser(id);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      toast({
        title: 'تم حذف المستخدم',
        description: 'تم حذف المستخدم بنجاح',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'خطأ في حذف المستخدم',
        description: error.response?.data?.message || 'حدث خطأ أثناء الحذف',
        variant: 'destructive',
      });
    },
  });
};
