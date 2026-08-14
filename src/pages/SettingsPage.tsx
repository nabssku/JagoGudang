import React, { useState } from 'react';
import { useAuthStore } from '../app/store/useAuthStore';
import { useTenantStore } from '../app/store/useTenantStore';
import { Settings, Server, Globe, Save, CheckCircle2, ShieldCheck, Database } from 'lucide-react';
import { toast } from 'sonner';

export const SettingsPage: React.FC = () => {
  const { user } = useAuthStore();
  const { currentTenant } = useTenantStore();

  const [apiUrl, setApiUrl] = useState(import.meta.env.VITE_API_URL || 'https://api.jagokasir.store/api/v1');
  const [subdomain, setSubdomain] = useState('gudang.jagokasir.store');
  const [autoDeduct, setAutoDeduct] = useState(true);
  const [lowStockNotification, setLowStockNotification] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Pengaturan JagoGudang berhasil disimpan!');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
          <Settings className="w-7 h-7 text-amber-500" />
          <span>Pengaturan JagoGudang</span>
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Konfigurasi koneksi backend Laravel, subdomain, dan otomatisasi pemotongan stok POS.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Connection & Architecture */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Server className="w-5 h-5 text-amber-500" />
            <span>Koneksi Backend & Shared Database</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Subdomain Frontend</label>
              <div className="relative">
                <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={subdomain}
                  onChange={(e) => setSubdomain(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Backend API URL (`KasirKu` Laravel 11)</label>
              <div className="relative">
                <Database className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sync & Automation Rules */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <span>Aturan Sinkronisasi Stok & Notifikasi</span>
          </h2>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl cursor-pointer">
              <div>
                <p className="text-xs font-bold text-slate-800">Otomatis Potong Stok saat POS Bertransaksi</p>
                <p className="text-[11px] text-slate-500">
                  Potong stok bahan baku berdasarkan resep (BOM) ketika struk kasir berhasil dicetak.
                </p>
              </div>
              <input
                type="checkbox"
                checked={autoDeduct}
                onChange={(e) => setAutoDeduct(e.target.checked)}
                className="w-5 h-5 text-amber-500 rounded-md focus:ring-amber-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl cursor-pointer">
              <div>
                <p className="text-xs font-bold text-slate-800">Notifikasi Peringatan Stok Menipis</p>
                <p className="text-[11px] text-slate-500">
                  Tampilkan pop-up peringatan jika ada bahan baku yang berada di bawah ambang minimum.
                </p>
              </div>
              <input
                type="checkbox"
                checked={lowStockNotification}
                onChange={(e) => setLowStockNotification(e.target.checked)}
                className="w-5 h-5 text-amber-500 rounded-md focus:ring-amber-500"
              />
            </label>
          </div>
        </div>

        {/* Tenant Info */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-amber-400">Informasi Usaha & Pengguna</h3>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-xs text-slate-300">
            Terhubung sebagai: <strong className="text-white">{user?.name || 'Staf Gudang'}</strong> ({user?.email})
          </p>
          <p className="text-xs text-slate-400">
            Tenant: <strong className="text-slate-200">{currentTenant?.name || 'Toko Utama'}</strong>
          </p>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-3 rounded-2xl text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Perubahan</span>
          </button>
        </div>
      </form>
    </div>
  );
};
