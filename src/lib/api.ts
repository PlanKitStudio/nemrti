import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const BACKEND_URL = API_URL.replace(/\/api\/?$/, '');

/**
 * Convert a relative storage path (e.g. /storage/blog/img.jpg) to an absolute URL
 * pointing at the Laravel backend. Returns the original value if already absolute.
 */
export const getStorageUrl = (path?: string | null): string => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('blob:')) {
    return path;
  }
  return `${BACKEND_URL}${path.startsWith('/') ? '' : '/'}${path}`;
};

// Create axios instance
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — clear stored auth state
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      // Only redirect if this is NOT the initial profile check
      // (AuthContext handles the initial 401 gracefully)
      const isProfileCheck = error.config?.url?.includes('/user') && error.config?.method === 'get';
      if (!isProfileCheck) {
        window.location.href = '/auth';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const { data } = await api.post('/login', { email, password });
    return data;
  },
  
  register: async (name: string, email: string, password: string, password_confirmation: string, phone?: string) => {
    const { data } = await api.post('/register', { 
      full_name: name,
      email, 
      password, 
      password_confirmation,
      phone
    });
    return data;
  },
  
  logout: async () => {
    const { data } = await api.post('/logout');
    return data;
  },
  
  getProfile: async () => {
    const { data } = await api.get('/user');
    return data;
  },
  
  updateProfile: async (profileData: any) => {
    const { data } = await api.put('/user', profileData);
    return data;
  },
};

// Phone Numbers API
export const phoneNumbersAPI = {
  getAll: async (params?: any) => {
    const { data } = await api.get('/phone-numbers', { params });
    return data;
  },
  
  getById: async (id: string) => {
    const { data } = await api.get(`/phone-numbers/${id}`);
    return data;
  },
  
  getFeatured: async () => {
    const { data } = await api.get('/phone-numbers/featured');
    return data;
  },
};

// Categories API
export const categoriesAPI = {
  getAll: async () => {
    const { data } = await api.get('/categories');
    return data;
  },
  
  getById: async (id: string) => {
    const { data } = await api.get(`/categories/${id}`);
    return data;
  },
};

// Orders API
export const ordersAPI = {
  getMyOrders: async () => {
    const { data } = await api.get('/orders');
    return data;
  },
  
  getById: async (id: string) => {
    const { data } = await api.get(`/orders/${id}`);
    return data;
  },
  
  create: async (orderData: any) => {
    const { data } = await api.post('/orders', orderData);
    return data;
  },

  uploadPaymentProof: async (orderId: string, file: File) => {
    const formData = new FormData();
    formData.append('payment_proof', file);
    const { data } = await api.post(`/orders/${orderId}/payment-proof`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },
  
  updateStatus: async (id: string, status: string) => {
    const { data } = await api.put(`/admin/orders/${id}/status`, { status });
    return data;
  },
};

// Payment Settings API
export const paymentSettingsAPI = {
  get: async () => {
    const { data } = await api.get('/payment-settings');
    return data;
  },
  update: async (settings: Record<string, string>) => {
    const { data } = await api.put('/admin/payment-settings', { settings });
    return data;
  },
};

// Blog API
export const blogAPI = {
  getPosts: async (params?: any) => {
    const { data } = await api.get('/blog-posts', { params });
    return data;
  },
  
  getPostBySlug: async (slug: string) => {
    const { data } = await api.get(`/blog-posts/${slug}`);
    return data;
  },
  
  getCategories: async () => {
    const { data } = await api.get('/blog-categories');
    return data;
  },
};

// Contacts API
export const contactsAPI = {
  create: async (contactData: any) => {
    const { data } = await api.post('/contact', contactData);
    return data;
  },
};

// Favorites API
export const favoritesAPI = {
  getAll: async () => {
    const { data } = await api.get('/favorites');
    return data;
  },
  
  add: async (phoneNumberId: string) => {
    const { data } = await api.post('/favorites', { phone_number_id: phoneNumberId });
    return data;
  },

  remove: async (phoneNumberId: string) => {
    const { data } = await api.delete(`/favorites/${phoneNumberId}`);
    return data;
  },

  check: async (phoneNumberId: string) => {
    const { data } = await api.get(`/favorites/check/${phoneNumberId}`);
    return data;
  },
};

// Coupons API
export const couponsAPI = {
  validate: async (code: string) => {
    const { data } = await api.post('/coupons/validate', { code });
    return data;
  },
};

// Admin Coupons API
export const adminCouponsAPI = {
  getAll: async () => {
    const { data } = await api.get('/admin/coupons');
    return data;
  },
  create: async (couponData: any) => {
    const { data } = await api.post('/admin/coupons', couponData);
    return data;
  },
  update: async (id: string, couponData: any) => {
    const { data } = await api.put(`/admin/coupons/${id}`, couponData);
    return data;
  },
  delete: async (id: string) => {
    const { data } = await api.delete(`/admin/coupons/${id}`);
    return data;
  },
};

// Admin Settings API (PayMob etc.)
export const adminSettingsAPI = {
  getPaymobSettings: async () => {
    const { data } = await api.get('/admin/settings/paymob');
    return data;
  },
  updatePaymobSettings: async (settings: any) => {
    const { data } = await api.post('/admin/settings/paymob', settings);
    return data;
  },
};

// Admin APIs
export const adminAPI = {
  // Stats
  getStats: async () => {
    const { data } = await api.get('/admin/statistics');
    return data;
  },
  
  // Users
  getUsers: async () => {
    const { data } = await api.get('/admin/users');
    return data;
  },
  
  updateUser: async (id: string, userData: any) => {
    const { data } = await api.put(`/admin/users/${id}`, userData);
    return data;
  },
  
  deleteUser: async (id: string) => {
    const { data } = await api.delete(`/admin/users/${id}`);
    return data;
  },
  
  // Phone Numbers
  getAllPhoneNumbers: async () => {
    const { data } = await api.get('/phone-numbers', { params: { per_page: 500 } });
    return data;
  },

  createPhoneNumber: async (phoneData: any) => {
    const { data } = await api.post('/admin/phone-numbers', phoneData);
    return data;
  },
  
  updatePhoneNumber: async (id: string, phoneData: any) => {
    const { data } = await api.put(`/admin/phone-numbers/${id}`, phoneData);
    return data;
  },
  
  deletePhoneNumber: async (id: string) => {
    const { data } = await api.delete(`/admin/phone-numbers/${id}`);
    return data;
  },
  
  // Orders
  getAllOrders: async () => {
    const { data } = await api.get('/admin/orders');
    return data;
  },
  
  updateOrder: async (id: string, orderData: any) => {
    const { data } = await api.put(`/admin/orders/${id}/status`, orderData);
    return data;
  },
  
  // Blog Posts
  getAdminBlogPosts: async (params?: any) => {
    const { data } = await api.get('/admin/blog', { params });
    return data;
  },

  createBlogPost: async (postData: any) => {
    const isFormData = postData instanceof FormData;
    const { data } = await api.post('/admin/blog', postData, isFormData ? {
      headers: { 'Content-Type': 'multipart/form-data' },
    } : undefined);
    return data;
  },
  
  updateBlogPost: async (id: string, postData: any) => {
    const isFormData = postData instanceof FormData;
    if (isFormData) {
      // Laravel requires POST with _method=PUT for FormData
      postData.append('_method', 'PUT');
      const { data } = await api.post(`/admin/blog/${id}`, postData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    }
    const { data } = await api.put(`/admin/blog/${id}`, postData);
    return data;
  },
  
  deleteBlogPost: async (id: string) => {
    const { data } = await api.delete(`/admin/blog/${id}`);
    return data;
  },
  
  // Contacts
  getAllContacts: async () => {
    const { data } = await api.get('/admin/contacts');
    return data;
  },
  
  updateContactStatus: async (id: string, status: string) => {
    const { data } = await api.put(`/admin/contacts/${id}/status`, { status });
    return data;
  },
  
  deleteContact: async (id: string) => {
    const { data } = await api.delete(`/admin/contacts/${id}`);
    return data;
  },

  // Statistics
  getSalesChart: async (days?: number) => {
    const { data } = await api.get('/admin/statistics/sales-chart', { params: { days } });
    return data;
  },

  getPopularNumbers: async () => {
    const { data } = await api.get('/admin/statistics/popular');
    return data;
  },

  // Ads management
  getAds: async (params?: any) => {
    const { data } = await api.get('/admin/ads', { params });
    return data;
  },

  createAd: async (adData: any) => {
    // Support FormData for file uploads
    const isFormData = adData instanceof FormData;
    const { data } = await api.post('/admin/ads', adData, isFormData ? {
      headers: { 'Content-Type': 'multipart/form-data' },
    } : undefined);
    return data;
  },

  updateAd: async (id: string, adData: any) => {
    const isFormData = adData instanceof FormData;
    if (isFormData) {
      // Laravel requires POST with _method=PUT for FormData
      adData.append('_method', 'PUT');
      const { data } = await api.post(`/admin/ads/${id}`, adData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    }
    const { data } = await api.put(`/admin/ads/${id}`, adData);
    return data;
  },

  deleteAd: async (id: string) => {
    const { data } = await api.delete(`/admin/ads/${id}`);
    return data;
  },

  getAdAnalytics: async (params?: any) => {
    const { data } = await api.get('/admin/ads-analytics', { params });
    return data;
  },
};

// Ads public API
export const adsAPI = {
  getByPosition: async (position: string) => {
    const { data } = await api.get(`/ads/position/${position}`);
    return data;
  },

  trackImpression: async (adId: string, pageUrl: string) => {
    const { data } = await api.post(`/ads/${adId}/impression`, { page_url: pageUrl });
    return data;
  },

  trackClick: async (adId: string, pageUrl: string) => {
    const { data } = await api.post(`/ads/${adId}/click`, { page_url: pageUrl });
    return data;
  },

  trackConversion: async (adId: string, pageUrl: string) => {
    const { data } = await api.post(`/ads/${adId}/conversion`, { page_url: pageUrl });
    return data;
  },
};

// ===== Tracking Scripts =====
export const trackingScriptsAPI = {
  // Public: get active scripts for a page
  getForPage: async (page: string) => {
    const { data } = await api.get('/tracking-scripts', { params: { page } });
    return data as {
      head: string[];
      body_start: string[];
      body_end: string[];
    };
  },
};

export const adminTrackingScriptsAPI = {
  getAll: async () => {
    const { data } = await api.get('/admin/tracking-scripts');
    return data;
  },
  create: async (scriptData: any) => {
    const { data } = await api.post('/admin/tracking-scripts', scriptData);
    return data;
  },
  update: async (id: string, scriptData: any) => {
    const { data } = await api.put(`/admin/tracking-scripts/${id}`, scriptData);
    return data;
  },
  delete: async (id: string) => {
    const { data } = await api.delete(`/admin/tracking-scripts/${id}`);
    return data;
  },
};

export default api;
