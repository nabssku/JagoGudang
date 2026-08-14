import React from 'react';
import { useAuthStore } from '../../app/store/useAuthStore';
import { useTenantStore } from '../../app/store/useTenantStore';
import { LogOut, User as UserIcon, Building2, Bell } from 'lucide-react';
import { toast } from 'sonner';

export const Header: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { currentTenant } = useTenantStore();

  const handleLogout = () => {
    logout();
    toast.success('Berhasil keluar dari akun Gudang');
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-4 md:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold px-3 py-1.5 rounded-full">
          <Building2 className="w-3.5 h-3.5 text-amber-600" />
          <span>{currentTenant?.name || 'Toko Utama'}</span>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-medium px-2.5 py-1 rounded-md border border-emerald-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Subdomain Active: <code className="font-mono font-bold">gudang.jagokasir.store</code>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => toast.info('Notifikasi Stok: 2 Bahan baku hampir habis!')}
          className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition"
          title="Notifikasi Gudang"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-amber-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="h-6 w-px bg-slate-200"></div>

        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-sm shadow-sm shadow-amber-200">
            {user?.name ? user.name.charAt(0).toUpperCase() : <UserIcon className="w-5 h-5" />}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-bold text-slate-800 leading-tight">{user?.name || 'Staf Gudang'}</p>
            <p className="text-[10px] text-slate-500 leading-tight">{user?.email || 'gudang@jagokasir.store'}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
          title="Keluar"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
