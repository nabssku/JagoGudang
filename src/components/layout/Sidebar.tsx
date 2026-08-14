import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Boxes,
  ArrowRightLeft,
  ClipboardCheck,
  BookOpen,
  Truck,
  ShoppingCart,
  Settings,
  Package,
  Layers,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/ingredients', label: 'Stok Bahan Baku', icon: Boxes },
  { path: '/stock-movements', label: 'Riwayat Stok', icon: ArrowRightLeft },
  { path: '/stock-opname', label: 'Stock Opname', icon: ClipboardCheck },
  { path: '/recipes', label: 'Resep & BOM', icon: BookOpen },
  { path: '/purchase-orders', label: 'Stok Masuk (PO)', icon: ShoppingCart },
  { path: '/suppliers', label: 'Supplier / Vendor', icon: Truck },
  { path: '/settings', label: 'Pengaturan Gudang', icon: Settings },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen sticky top-0 border-r border-slate-800 shadow-xl shrink-0">
      {/* Brand Header */}
      <div className="h-16 px-6 flex items-center gap-3 border-b border-slate-800/80 bg-slate-950/40">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20 text-white font-black text-lg">
          <Package className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="font-extrabold text-lg text-white tracking-tight">JagoGudang</h1>
            <span className="bg-amber-500/20 text-amber-400 text-[10px] font-bold px-1.5 py-0.5 rounded border border-amber-500/30">
              v1.0
            </span>
          </div>
          <p className="text-[10px] text-slate-400 font-medium">Ekosistem JagoKasir</p>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto no-scrollbar">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Menu Gudang
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/25'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Ecosystem Cross-Link Footer */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/30">
        <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50">
          <div className="flex items-center justify-between text-xs text-slate-300 font-bold mb-1">
            <span className="flex items-center gap-1.5 text-amber-400">
              <Layers className="w-3.5 h-3.5" /> JagoSuite
            </span>
            <Sparkles className="w-3 h-3 text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
          </div>
          <p className="text-[11px] text-slate-400 mb-2">
            Terhubung dengan POS & Backend Laravel KasirKu
          </p>
          <a
            href="https://pos.jagokasir.store"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-amber-400 hover:text-amber-300 transition bg-amber-500/10 py-1.5 rounded-lg border border-amber-500/20"
          >
            <span>Buka JagoKasir (POS)</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </aside>
  );
};
