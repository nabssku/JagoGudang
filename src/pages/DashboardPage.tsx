import React from 'react';
import { useInventoryStore } from '../app/store/useInventoryStore';
import { StatCard } from '../components/shared/StatCard';
import { formatRupiah } from '../lib/auth';
import {
  AlertTriangle,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  ClipboardCheck,
  ShoppingCart,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const { products, ingredients, stockMovements, purchaseOrders } = useInventoryStore();

  const lowStockProducts = (Array.isArray(products) ? products : []).filter(
    (p) => p.stock <= (p.min_stock || 5)
  );
  const lowStockIngredients = (Array.isArray(ingredients) ? ingredients : []).filter(
    (item) => item.current_stock <= item.min_stock
  );
  const totalLowStock = lowStockProducts.length + lowStockIngredients.length;

  const totalProductValuation = (Array.isArray(products) ? products : []).reduce(
    (sum, p) => sum + p.stock * (p.cost_price || p.price),
    0
  );
  const totalIngredientValuation = (Array.isArray(ingredients) ? ingredients : []).reduce(
    (sum, item) => sum + item.current_stock * item.cost_per_unit,
    0
  );
  const totalValuation = totalProductValuation + totalIngredientValuation;

  const activeOrdersCount = (Array.isArray(purchaseOrders) ? purchaseOrders : []).filter(
    (po) => po.status === 'ordered'
  ).length;

  return (
    <div className="space-y-6">
      {/* Top Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-600 rounded-3xl p-6 text-white shadow-xl shadow-amber-500/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-white/20 backdrop-blur-md text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
              Hub Operasional Gudang
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">Ringkasan Gudang & Stok POS</h1>
          <p className="text-amber-100 text-sm mt-1">
            Terhubung langsung dengan produk di aplikasi kasir (`pos.jagokasir.store`) & bahan baku mentah.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/ingredients?tab=products"
            className="bg-white text-amber-900 hover:bg-amber-50 font-bold px-4 py-2.5 rounded-2xl text-xs flex items-center gap-2 shadow-md transition"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Lihat Stok POS</span>
          </Link>
          <Link
            to="/purchase-orders"
            className="bg-slate-900 text-white hover:bg-slate-800 font-bold px-4 py-2.5 rounded-2xl text-xs flex items-center gap-2 shadow-md transition"
          >
            <ShoppingCart className="w-4 h-4 text-amber-400" />
            <span>Buat PO Supplier</span>
          </Link>
        </div>
      </div>

      {/* Key Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Produk Kasir (POS)"
          value={`${products.length} Item`}
          subtitle={`${ingredients.length} Bahan Baku Mentah`}
          icon={ShoppingBag}
          color="amber"
        />
        <StatCard
          title="Stok Menipis"
          value={`${totalLowStock} Item`}
          subtitle={totalLowStock > 0 ? 'Perlu Restok Segera!' : 'Stok Aman'}
          icon={AlertTriangle}
          color={totalLowStock > 0 ? 'rose' : 'emerald'}
        />
        <StatCard
          title="Nilai Inventaris Gudang"
          value={formatRupiah(totalValuation)}
          subtitle="Total Modal Produk & Bahan"
          icon={Wallet}
          color="emerald"
        />
        <StatCard
          title="PO Aktif / Menunggu"
          value={`${activeOrdersCount} Order`}
          subtitle="Dalam proses supplier"
          icon={ShoppingCart}
          color="blue"
        />
      </div>

      {/* Low Stock Alert & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Low Stock Table */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-rose-50 border border-rose-200 rounded-xl text-rose-600">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900">Stok Menipis / Perlu Restok</h2>
                <p className="text-xs text-slate-500">Produk Kasir & Bahan Baku yang berada di bawah batas minimum</p>
              </div>
            </div>
            <Link
              to="/ingredients"
              className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
            >
              <span>Kelola Stok</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          {totalLowStock === 0 ? (
            <div className="text-center py-10 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
              <Sparkles className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">Semua Stok Aman!</p>
              <p className="text-xs text-slate-400">Tidak ada produk POS maupun bahan baku yang berada di bawah stok minimum.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="pb-3">Nama Item</th>
                    <th className="pb-3">Tipe</th>
                    <th className="pb-3">Sisa Stok</th>
                    <th className="pb-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {lowStockProducts.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 font-bold text-slate-900">{item.name}</td>
                      <td className="py-3 text-xs text-slate-500 font-semibold">Produk POS</td>
                      <td className="py-3">
                        <span className="font-extrabold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg text-xs border border-rose-200">
                          {item.stock} Pcs
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <Link
                          to="/ingredients?tab=products"
                          className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs px-3 py-1.5 rounded-xl transition"
                        >
                          Restok POS
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {lowStockIngredients.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 font-bold text-slate-900">{item.name}</td>
                      <td className="py-3 text-xs text-slate-500 font-semibold">Bahan Baku Mentah</td>
                      <td className="py-3">
                        <span className="font-extrabold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg text-xs border border-rose-200">
                          {item.current_stock} {item.unit}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <Link
                          to={`/purchase-orders?ingredientId=${item.id}`}
                          className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs px-3 py-1.5 rounded-xl transition"
                        >
                          Restok PO
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Stock Movements Feed */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-extrabold text-slate-900">Aktivitas Stok Terbaru</h2>
              <Link to="/stock-movements" className="text-xs font-bold text-amber-600 hover:text-amber-700">
                Lihat Semua
              </Link>
            </div>

            <div className="space-y-3">
              {(Array.isArray(stockMovements) ? stockMovements : []).slice(0, 4).map((mov) => {
                const isPositive = mov.type === 'in';
                return (
                  <div key={mov.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                          isPositive ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                        }`}
                      >
                        {isPositive ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">{mov.ingredient_id}</p>
                        <p className="text-[10px] text-slate-500">{mov.notes || mov.user_name || 'Penyesuaian Sistem'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs font-black ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {isPositive ? `+${mov.quantity}` : `-${mov.quantity}`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <Link
              to="/stock-opname"
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-2xl flex items-center justify-center gap-2 transition"
            >
              <ClipboardCheck className="w-4 h-4 text-amber-400" />
              <span>Mulai Audit Stock Opname</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
