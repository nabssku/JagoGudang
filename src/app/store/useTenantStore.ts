import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Tenant, Outlet } from '../../types';

interface TenantState {
  currentTenant: Tenant | null;
  currentOutlet: Outlet | null;
  setTenant: (tenant: Tenant) => void;
  setOutlet: (outlet: Outlet | null) => void;
}

export const useTenantStore = create<TenantState>()(
  persist(
    (set) => ({
      currentTenant: null,
      currentOutlet: null,
      setTenant: (tenant) => set({ currentTenant: tenant }),
      setOutlet: (outlet) => set({ currentOutlet: outlet }),
    }),
    {
      name: 'tenant-storage',
    }
  )
);
