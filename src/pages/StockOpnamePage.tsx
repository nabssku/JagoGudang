import React, { useState } from 'react';
import { useInventoryStore } from '../app/store/useInventoryStore';
import { stockService } from '../services/stockService';
import { ClipboardCheck, Save, AlertTriangle, CheckCircle2, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

export const StockOpnamePage: React.FC = () => {
  const { ingredients, updateIngredient, addStockMovement } = useInventoryStore();

  // Audit counts per ingredient ID
  const [actualCounts, setActualCounts] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    ingredients.forEach((ing) => {
      initial[ing.id] = ing.current_stock;
    });
    return initial;
  });

  const [notes, setNotes] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleActualChange = (id: string, value: number) => {
    setActualCounts((prev) => ({ ...prev, [id]: Math.max(0, value) }));
  };

  const handleNotesChange = (id: string, value: string) => {
    setNotes((prev) => ({ ...prev, [id]: value }));
  };

  const handleReset = () => {
    const resetCounts: Record<string, number> = {};
    ingredients.forEach((ing) => {
      resetCounts[ing.id] = ing.current_stock;
    });
    setActualCounts(resetCounts);
    setNotes({});
    toast.info('Form hitung ulang di-reset ke nilai stok sistem.');
  };

  const handleSubmitOpname = async () => {
    setIsSubmitting(true);
    try {
      const itemsToAdjust = ingredients.filter(
        (ing) => (actualCounts[ing.id] ?? ing.current_stock) !== ing.current_stock
      );

      if (itemsToAdjust.length === 0) {
        toast.info('Semua hasil opname sesuai dengan stok sistem! Tidak ada perubahan.');
        setIsSubmitting(false);
        return;
      }

      for (const ing of itemsToAdjust) {
        const actual = actualCounts[ing.id];
        const diff = actual - ing.current_stock;

        // Update ingredient in store
        updateIngredient(ing.id, { current_stock: actual });

        // Record stock movement adjustment
        const mov = await stockService.recordMovement({
          ingredient_id: ing.id,
          type: 'adjustment',
          quantity: Math.abs(diff),
          notes: `Stock Opname Audit (${diff > 0 ? '+' : ''}${diff} ${ing.unit}). Catatan: ${notes[ing.id] || 'Audit rutin'}`,
        });
        addStockMovement({ ...mov, ingredient: ing });
      }

      toast.success(`Stock Opname selesai! ${itemsToAdjust.length} bahan baku disesuaikan.`);
    } catch {
      toast.error('Gagal menyimpan hasil stock opname.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <ClipboardCheck className="w-7 h-7 text-amber-500" />
            <span>Audit & Stock Opname Fisik</span>
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Bandingkan jumlah bahan fisik di gudang dengan catatan di aplikasi, lalu perbarui penyesuaian.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-xs flex items-center gap-1.5 transition"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Form</span>
          </button>
          <button
            onClick={handleSubmitOpname}
            disabled={isSubmitting}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-2xl text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Simpan Hasil Opname</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Audit Form Table */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="pb-3">Nama Bahan Baku</th>
                <th className="pb-3">Kategori</th>
                <th className="pb-3">Stok Sistem</th>
                <th className="pb-3">Stok Fisik Hitungan</th>
                <th className="pb-3">Selisih</th>
                <th className="pb-3">Keterangan / Alasan Selisih</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ingredients.map((ing) => {
                const actual = actualCounts[ing.id] ?? ing.current_stock;
                const diff = actual - ing.current_stock;
                const hasDiff = diff !== 0;

                return (
                  <tr key={ing.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 font-bold text-slate-900">{ing.name}</td>
                    <td className="py-3.5 text-xs text-slate-500">{ing.category || 'Umum'}</td>
                    <td className="py-3.5 font-mono text-slate-600 font-bold">
                      {ing.current_stock} {ing.unit}
                    </td>
                    <td className="py-3.5">
                      <div className="flex items-center gap-1.5 w-36">
                        <input
                          type="number"
                          value={actual}
                          onChange={(e) => handleActualChange(ing.id, Number(e.target.value))}
                          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold focus:outline-none focus:border-amber-500"
                          min={0}
                        />
                        <span className="text-xs text-slate-500 font-medium">{ing.unit}</span>
                      </div>
                    </td>
                    <td className="py-3.5">
                      {hasDiff ? (
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold border ${
                            diff < 0
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}
                        >
                          <AlertTriangle className="w-3.5 h-3.5" />
                          {diff > 0 ? `+${diff}` : diff} {ing.unit}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          Cocok
                        </span>
                      )}
                    </td>
                    <td className="py-3.5">
                      <input
                        type="text"
                        value={notes[ing.id] || ''}
                        onChange={(e) => handleNotesChange(ing.id, e.target.value)}
                        placeholder="Alasan jika ada selisih..."
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-amber-500"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
