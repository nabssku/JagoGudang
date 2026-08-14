import api from '../lib/axios';
import type { PurchaseOrder } from '../types';

export const purchaseOrderService = {
  getAll: async (): Promise<PurchaseOrder[]> => {
    try {
      const res = await api.get('/purchase-orders');
      const data = res.data?.data ?? res.data;
      return Array.isArray(data) ? data : defaultPurchaseOrders;
    } catch {
      return defaultPurchaseOrders;
    }
  },

  create: async (data: Omit<PurchaseOrder, 'id' | 'po_number' | 'created_at'>): Promise<PurchaseOrder> => {
    const poNumber = `PO-${Date.now().toString().slice(-6)}`;
    try {
      const res = await api.post('/purchase-orders', { ...data, po_number: poNumber });
      return res.data?.data ?? res.data;
    } catch {
      return {
        ...data,
        id: 'po-' + Date.now(),
        po_number: poNumber,
        created_at: new Date().toISOString(),
      };
    }
  },

  updateStatus: async (id: string, status: PurchaseOrder['status']): Promise<PurchaseOrder> => {
    try {
      const res = await api.patch(`/purchase-orders/${id}/status`, { status });
      return res.data?.data ?? res.data;
    } catch {
      return { id, status } as any;
    }
  },
};

export const defaultPurchaseOrders: PurchaseOrder[] = [
  {
    id: 'po-101',
    po_number: 'PO-202608-01',
    tenant_id: 't-1',
    supplier_id: 'sup-1',
    status: 'received',
    total_amount: 540000,
    order_date: '2026-08-10',
    received_date: '2026-08-11',
    supplier: {
      id: 'sup-1',
      tenant_id: 't-1',
      name: 'PT Indomilk Jaya Supplier',
      is_active: true,
      created_at: '',
    },
    items: [
      {
        ingredient_id: 'ing-1',
        quantity: 30,
        unit_price: 18000,
        total_price: 540000,
      },
    ],
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: 'po-102',
    po_number: 'PO-202608-02',
    tenant_id: 't-1',
    supplier_id: 'sup-2',
    status: 'ordered',
    total_amount: 1500000,
    order_date: '2026-08-13',
    supplier: {
      id: 'sup-2',
      tenant_id: 't-1',
      name: 'Roastery Nusantara Coffee',
      is_active: true,
      created_at: '',
    },
    items: [
      {
        ingredient_id: 'ing-2',
        quantity: 10,
        unit_price: 150000,
        total_price: 1500000,
      },
    ],
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
];
