import axios from 'axios';
import { toast } from 'sonner';
import { useAuthStore } from '../app/store/useAuthStore';
import { useTenantStore } from '../app/store/useTenantStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://api.jagokasir.store/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    const currentTenant = useTenantStore.getState().currentTenant;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (currentTenant) {
      config.headers['X-Tenant-ID'] = currentTenant.id;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/auth/login')) {
      originalRequest._retry = true;
      useAuthStore.getState().logout();
      toast.error('Sesi telah berakhir, silakan login kembali.');
      return Promise.reject(error);
    }

    const message = error.response?.data?.message || 'Terjadi kesalahan pada server gudang';

    if (error.response?.status === 403) {
      toast.error('Akses Ditolak', { description: message });
    } else if (error.response?.status === 422) {
      toast.error('Data tidak valid', { description: message });
    } else if (error.response?.status === 500) {
      toast.error('Server Error', { description: 'Mohon coba lagi nanti atau hubungi bantuan' });
    }

    return Promise.reject(error);
  }
);

export default api;
