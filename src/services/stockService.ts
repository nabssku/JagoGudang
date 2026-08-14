import api from '../lib/axios';
import type { StockMovement, StockOpname } from '../types';

export const stockService = {
  getMovements: async (): Promise<StockMovement[]> => {
    try {
      const res = await api.get('/stock-movements');
      return res.data.data || res.data;
    } catch {
      return defaultStockMovements;
    }
  },

  recordMovement: async (data: {
    ingredient_id: string;
    type: 'in' | 'out' | 'adjustment' | 'waste';
    quantity: number;
    notes?: string;
  }): Promise<StockMovement> => {
    try {
      const res = await api.post('/stock-movements', data);
      return res.data.data || res.data;
    } catch {
      const newMovement: StockMovement = {
        id: 'mov-' + Date.now(),
        ingredient_id: data.ingredient_id,
        type: data.type,
        quantity: data.quantity,
        quantity_before: 50,
        quantity_after: data.type === 'in' ? 50 + data.quantity : 50 - data.quantity,
        notes: data.notes,
        created_at: new Date().toISOString(),
        user_name: 'Staf Gudang',
      };
      return newMovement;
    }
  },

  submitOpname: async (data: Omit<StockOpname, 'id' | 'created_at'>): Promise<StockOpname> => {
    try {
      const res = await api.post('/stock-opnames', data);
      return res.data.data || res.data;
    } catch {
      return {
        ...data,
        id: 'opname-' + Date.now(),
        created_at: new Date().toISOString(),
      };
    }
  },
};

export const defaultStockMovements: StockMovement[] = [
  {
    id: 'mov-1',
    ingredient_id: 'ing-1',
    type: 'in',
    quantity: 20,
    quantity_before: 25,
    quantity_after: 45,
    notes: 'Restok dari Supplier Indomilk',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    user_name: 'Budi (Gudang)',
  },
  {
    id: 'mov-2',
    ingredient_id: 'ing-2',
    type: 'waste',
    quantity: 2,
    quantity_before: 10,
    quantity_after: 8,
    notes: 'Kemasan rusak / bocor pas dibongkar',
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    user_name: 'Budi (Gudang)',
  },
  {
    id: 'mov-3',
    ingredient_id: 'ing-5',
    type: 'out',
    quantity: 120,
    quantity_before: 200,
    quantity_after: 80,
    notes: 'Penjualan POS Shift Pagi',
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    user_name: 'Sistem Kasir',
  },
];
