import React, { useState } from 'react';
import { useInventoryStore } from '../app/store/useInventoryStore';
import { stockService } from '../services/stockService';
import { Modal } from '../components/shared/Modal';
import { ArrowRightLeft, ArrowDownRight, ArrowUpRight, Plus } from 'lucide-react';
import { toast } from 'sonner';

export const StockMovementsPage: React.FC = () => {
  const { ingredients, stockMovements, addStockMovement, updateIngredient } = useInventoryStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [selectedIngredientId, setSelectedIngredientId] = useState('');
  const [type, setType] = useState<'in' | 'out' | 'adjustment' | 'waste'>('in');
  const [quantity, setQuantity] = useState<number>(1);
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIngredientId) {
      toast.error('Pilih bahan baku terlebih dahulu');
      return;
    }

    const ing = ingredients.find((i) => i.id === selectedIngredientId);
    if (!ing) return;

    const newMovement = await stockService.recordMovement({
      ingredient_id: selectedIngredientId,
      type,
      quantity: Number(quantity),
      notes,
    });

    let newStock = ing.current_stock;
    if (type === 'in') newStock += Number(quantity);
    else if (type === 'out' || type === 'waste') newStock -= Number(quantity);
    else if (type === 'adjustment') newStock = Number(quantity);

    updateIngredient(ing.id, { current_stock: Math.max(0, newStock) });
    addStockMovement({ ...newMovement, ingredient: ing });

    toast.success('Mutasi stok berhasil dicatat');
    setIsModalOpen(false);
  };

  const getMovementLabel = (t: string) => {
    switch (t) {
      case 'in':
        return { label: 'Stok Masuk', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: ArrowDownRight };
      case 'out':
        return { label: 'Stok Keluar (POS)', bg: 'bg-rose-50 text-rose-700 border-rose-200', icon: ArrowUpRight };
      case 'waste':
        return { label: 'Rusak / Waste', bg: 'bg-amber-50 text-amber-700 border-amber-200', icon: ArrowUpRight };
      default:
        return { label: 'Penyesuaian Audit', bg: 'bg-blue-50 text-blue-700 border-blue-200', icon: ArrowRightLeft };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <ArrowRightLeft className="w-7 h-7 text-amber-500" />
            <span>Riwayat Mutasi & Pergerakan Stok</span>
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Catatan detail barang masuk, barang keluar dari transaksi POS, retur, hingga waste.
          </p>
        </div>

        <button
          onClick={() => {
            if (ingredients.length > 0) setSelectedIngredientId(ingredients[0].id);
            setIsModalOpen(true);
          }}
          className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-4 py-2.5 rounded-2xl text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Catat Mutasi Stok</span>
        </button>
      </div>

      {/* Movement History Table */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="pb-3">Waktu</th>
                <th className="pb-3">Bahan Baku</th>
                <th className="pb-3">Jenis Mutasi</th>
                <th className="pb-3">Jumlah</th>
                <th className="pb-3">Catatan / Keterangan</th>
                <th className="pb-3">Petugas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stockMovements.map((mov) => {
                const targetIng = ingredients.find((i) => i.id === mov.ingredient_id);
                const info = getMovementLabel(mov.type);
                const Icon = info.icon;
                return (
                  <tr key={mov.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 text-xs text-slate-500 font-mono">
                      {new Date(mov.created_at).toLocaleString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-3.5 font-bold text-slate-900">
                      {targetIng?.name || mov.ingredient_id}
                    </td>
                    <td className="py-3.5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${info.bg}`}>
                        <Icon className="w-3.5 h-3.5" />
                        {info.label}
                      </span>
                    </td>
                    <td className="py-3.5 font-black text-slate-800">
                      {mov.type === 'in' ? `+${mov.quantity}` : `-${mov.quantity}`} {targetIng?.unit || ''}
                    </td>
                    <td className="py-3.5 text-xs text-slate-600 max-w-xs truncate">
                      {mov.notes || '-'}
                    </td>
                    <td className="py-3.5 text-xs text-slate-500 font-medium">
                      {mov.user_name || 'Petugas Gudang'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Movement Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Catat Mutasi Stok">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Pilih Bahan Baku</label>
            <select
              value={selectedIngredientId}
              onChange={(e) => setSelectedIngredientId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-amber-500"
              required
            >
              {ingredients.map((ing) => (
                <option key={ing.id} value={ing.id}>
                  {ing.name} (Stok Sekarang: {ing.current_stock} {ing.unit})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tipe Mutasi</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-amber-500 font-bold"
              >
                <option value="in">Stok Masuk (+)</option>
                <option value="out">Stok Keluar (-)</option>
                <option value="waste">Kerusakan / Waste (-)</option>
                <option value="adjustment">Penyesuaian Set Stok</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Jumlah</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-amber-500 font-mono font-bold"
                min={1}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Catatan / Alasan</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Pembelian mendadak di toko grosir lokal..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-amber-500 h-20"
            ></textarea>
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-amber-500 rounded-xl hover:bg-amber-600 shadow-md"
            >
              Simpan Mutasi
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
