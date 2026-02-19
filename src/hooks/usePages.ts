import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export interface Page {
  id: number;
  title: string;
  slug: string;
  content: string;
  meta_description: string | null;
  is_published: boolean;
  order: number;
  created_at: string;
  updated_at: string;
}

export const usePages = () => {
  return useQuery<Page[]>({
    queryKey: ['pages'],
    queryFn: async () => {
      const { data } = await api.get('/pages');
      return data;
    }
  });
};

export const usePage = (slug: string) => {
  return useQuery<Page>({
    queryKey: ['page', slug],
    queryFn: async () => {
      const { data } = await api.get(`/pages/${slug}`);
      return data;
    },
    enabled: !!slug
  });
};

// Admin hooks
export const useAdminPages = () => {
  return useQuery<Page[]>({
    queryKey: ['admin', 'pages'],
    queryFn: async () => {
      const { data } = await api.get('/admin/pages');
      return data;
    }
  });
};

export const useAdminPage = (id: number) => {
  return useQuery<Page>({
    queryKey: ['admin', 'page', id],
    queryFn: async () => {
      const { data } = await api.get(`/admin/pages/${id}`);
      return data;
    },
    enabled: !!id
  });
};

export const useCreatePage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (pageData: Partial<Page>) => {
      const { data } = await api.post('/admin/pages', pageData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'pages'] });
      queryClient.invalidateQueries({ queryKey: ['pages'] });
      queryClient.invalidateQueries({ queryKey: ['page'] });
    }
  });
};

export const useUpdatePage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...pageData }: Partial<Page> & { id: number }) => {
      const { data } = await api.put(`/admin/pages/${id}`, pageData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'pages'] });
      queryClient.invalidateQueries({ queryKey: ['pages'] });
      queryClient.invalidateQueries({ queryKey: ['page'] });
    }
  });
};

export const useDeletePage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.delete(`/admin/pages/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'pages'] });
      queryClient.invalidateQueries({ queryKey: ['pages'] });
      queryClient.invalidateQueries({ queryKey: ['page'] });
    }
  });
};
