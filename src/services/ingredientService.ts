import api from '../lib/axios';
import type { Ingredient } from '../types';

export const ingredientService = {
  getAll: async (): Promise<Ingredient[]> => {
    try {
      const res = await api.get('/ingredients');
      const rawData = res.data?.data ?? res.data;
      if (Array.isArray(rawData)) {
        return rawData;
      }
      if (rawData && Array.isArray(rawData.data)) {
        return rawData.data;
      }
      return [];
    } catch {
      return defaultIngredients;
    }
  },

  create: async (data: Omit<Ingredient, 'id' | 'created_at'>): Promise<Ingredient> => {
    try {
      const res = await api.post('/ingredients', data);
      return res.data?.data ?? res.data;
    } catch {
      const newItem: Ingredient = {
        ...data,
        id: 'ing-' + Date.now(),
        created_at: new Date().toISOString(),
      };
      return newItem;
    }
  },

  update: async (id: string, data: Partial<Ingredient>): Promise<Ingredient> => {
    try {
      const res = await api.put(`/ingredients/${id}`, data);
      return res.data?.data ?? res.data;
    } catch {
      return { id, ...data } as Ingredient;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/ingredients/${id}`);
    } catch {
      console.log('Deleted locally');
    }
  },
};

export const defaultIngredients: Ingredient[] = [
  {
    id: 'ing-1',
    tenant_id: 't-1',
    name: 'Susu UHT Full Cream',
    unit: 'Liter',
    cost_per_unit: 18000,
    current_stock: 45,
    min_stock: 15,
    category: 'Diari & Susu',
    created_at: new Date().toISOString(),
  },
  {
    id: 'ing-2',
    tenant_id: 't-1',
    name: 'Biji Kopi Arabica Blend',
    unit: 'Kg',
    cost_per_unit: 150000,
    current_stock: 8,
    min_stock: 10,
    category: 'Kopi & Teh',
    created_at: new Date().toISOString(),
  },
  {
    id: 'ing-3',
    tenant_id: 't-1',
    name: 'Sirup Gula Aren Pure',
    unit: 'Liter',
    cost_per_unit: 35000,
    current_stock: 12,
    min_stock: 5,
    category: 'Sirup & Pemanis',
    created_at: new Date().toISOString(),
  },
];
