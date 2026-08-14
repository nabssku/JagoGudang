import api from '../lib/axios';
import type { Product } from '../types';

export const productService = {
  getAll: async (): Promise<Product[]> => {
    try {
      const res = await api.get('/products');
      const rawData = res.data?.data ?? res.data;
      if (Array.isArray(rawData)) {
        return rawData;
      }
      if (rawData && Array.isArray(rawData.data)) {
        return rawData.data;
      }
      return [];
    } catch (err) {
      console.warn('Failed to fetch products from backend:', err);
      return [];
    }
  },

  updateStock: async (id: string, newStock: number): Promise<Product | null> => {
    try {
      const res = await api.put(`/products/${id}`, { stock: newStock });
      return res.data?.data ?? res.data;
    } catch {
      return null;
    }
  },
};
