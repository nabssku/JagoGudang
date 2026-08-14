import api from '../lib/axios';
import type { Supplier } from '../types';

export const supplierService = {
  getAll: async (): Promise<Supplier[]> => {
    try {
      const res = await api.get('/suppliers');
      return res.data.data || res.data;
    } catch {
      return defaultSuppliers;
    }
  },

  create: async (data: Omit<Supplier, 'id' | 'created_at'>): Promise<Supplier> => {
    try {
      const res = await api.post('/suppliers', data);
      return res.data.data || res.data;
    } catch {
      return {
        ...data,
        id: 'sup-' + Date.now(),
        created_at: new Date().toISOString(),
      };
    }
  },
};

export const defaultSuppliers: Supplier[] = [
  {
    id: 'sup-1',
    tenant_id: 't-1',
    name: 'PT Indomilk Jaya Supplier',
    contact_person: 'Pak Anton',
    phone: '081234567890',
    email: 'orders@indomilk-supplier.com',
    address: 'Jl. Raya Industri No. 45, Jakarta',
    notes: 'Pengiriman 1x24 jam setelah PO',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'sup-2',
    tenant_id: 't-1',
    name: 'Roastery Nusantara Coffee',
    contact_person: 'Mbak Dewi',
    phone: '081987654321',
    email: 'halo@roasterynusantara.id',
    address: 'Bandung, Jawa Barat',
    notes: 'Biji kopi sangrai fresh weekly',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'sup-3',
    tenant_id: 't-1',
    name: 'Grosir Kemasan Murah POS',
    contact_person: 'Ko Steven',
    phone: '085711223344',
    address: 'Surabaya',
    notes: 'Kemasan paper cup & sedotan eco',
    is_active: true,
    created_at: new Date().toISOString(),
  },
];
