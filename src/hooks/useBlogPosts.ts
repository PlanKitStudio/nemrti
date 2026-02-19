import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { blogAPI, adminAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { CACHE } from '@/lib/cache-config';

export const useBlogPosts = (filters?: {
  category_id?: string;
  search?: string;
}) => {
  return useQuery({
    queryKey: ['blog_posts', filters],
    queryFn: async () => {
      const response = await blogAPI.getPosts(filters);
      return response.data;
    },
    staleTime: CACHE.DYNAMIC,
    gcTime: CACHE.GC_TIME,
  });
};

export const useBlogPost = (slug: string) => {
  return useQuery({
    queryKey: ['blog_post', slug],
    queryFn: async () => {
      const response = await blogAPI.getPostBySlug(slug);
      return response.data;
    },
    enabled: !!slug,
    staleTime: CACHE.MODERATE,
    gcTime: CACHE.GC_TIME,
  });
};

export const useBlogCategories = () => {
  return useQuery({
    queryKey: ['blog_categories'],
    queryFn: async () => {
      const response = await blogAPI.getCategories();
      return response.data;
    },
    staleTime: CACHE.STATIC,
    gcTime: CACHE.GC_TIME,
  });
};

// Admin hooks
export const useAdminBlogPosts = (filters?: {
  category_id?: string;
  search?: string;
  status?: string;
}) => {
  return useQuery({
    queryKey: ['admin_blog_posts', filters],
    queryFn: async () => {
      const response = await adminAPI.getAdminBlogPosts(filters);
      return response.data;
    },
    staleTime: CACHE.DYNAMIC,
    gcTime: CACHE.GC_TIME,
  });
};

export const useCreateBlogPost = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (postData: any) => {
      const response = await adminAPI.createBlogPost(postData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog_posts'] });
      queryClient.invalidateQueries({ queryKey: ['admin_blog_posts'] });
      toast({
        title: 'تم نشر المقال',
        description: 'تم نشر المقال بنجاح',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'خطأ في نشر المقال',
        description: error.response?.data?.message || 'حدث خطأ أثناء نشر المقال',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateBlogPost = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await adminAPI.updateBlogPost(id, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog_posts'] });
      queryClient.invalidateQueries({ queryKey: ['admin_blog_posts'] });
      queryClient.invalidateQueries({ queryKey: ['blog_post'] });
      toast({
        title: 'تم تحديث المقال',
        description: 'تم تحديث المقال بنجاح',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'خطأ في تحديث المقال',
        description: error.response?.data?.message || 'حدث خطأ أثناء تحديث المقال',
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteBlogPost = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await adminAPI.deleteBlogPost(id);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog_posts'] });
      queryClient.invalidateQueries({ queryKey: ['admin_blog_posts'] });
      queryClient.invalidateQueries({ queryKey: ['blog_post'] });
      toast({
        title: 'تم حذف المقال',
        description: 'تم حذف المقال بنجاح',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'خطأ في حذف المقال',
        description: error.response?.data?.message || 'حدث خطأ أثناء حذف المقال',
        variant: 'destructive',
      });
    },
  });
};
