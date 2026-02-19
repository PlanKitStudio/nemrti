import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contactsAPI, adminAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { CACHE } from '@/lib/cache-config';

export const useCreateContact = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (contactData: any) => {
      const response = await contactsAPI.create(contactData);
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: 'تم إرسال رسالتك',
        description: 'سنتواصل معك في أقرب وقت',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'خطأ في إرسال الرسالة',
        description: error.response?.data?.message || 'حدث خطأ أثناء إرسال الرسالة',
        variant: 'destructive',
      });
    },
  });
};

// Admin hooks
export const useAllContacts = () => {
  return useQuery({
    queryKey: ['admin', 'contacts'],
    queryFn: async () => {
      const response = await adminAPI.getAllContacts();
      return response.data;
    },
    staleTime: CACHE.DYNAMIC,
    gcTime: CACHE.GC_TIME,
  });
};

export const useUpdateContact = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await adminAPI.updateContactStatus(id, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'contacts'] });
      toast({
        title: 'تم تحديث الرسالة',
        description: 'تم تحديث حالة الرسالة بنجاح',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'خطأ في تحديث الرسالة',
        description: error.response?.data?.message || 'حدث خطأ أثناء التحديث',
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteContact = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await adminAPI.deleteContact(id);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'contacts'] });
      toast({
        title: 'تم حذف الرسالة',
        description: 'تم حذف الرسالة بنجاح',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'خطأ في حذف الرسالة',
        description: error.response?.data?.message || 'حدث خطأ أثناء الحذف',
        variant: 'destructive',
      });
    },
  });
};
