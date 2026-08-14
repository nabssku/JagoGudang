import React, { useState } from 'react';
import { useInventoryStore } from '../app/store/useInventoryStore';
import { purchaseOrderService } from '../services/purchaseOrderService';
import { stockService } from '../services/stockService';
import { formatRupiah } from '../lib/auth';
import { Modal } from '../components/shared/Modal';
import { ShoppingCart, Plus, CheckCircle2, Clock, Truck, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import type { PurchaseOrder } from '../types';

export const PurchaseOrdersPage: React.FC = () => {
  const { suppliers, ingredients, purchaseOrders, addPurchaseOrder, setPurchaseOrders, updateIngredient, addStockMovement } = useInventoryStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [supplierId, setSupplierId] = useState(suppliers[0]?.id || '');
  const [selectedIngredientId, setSelectedIngredientId] = useState(ingredients[0]?.id || '');
  const [quantity, setQuantity] = useState<number>(10);
  const [unitPrice, setUnitPrice] = useState<number>(15000);

  const handleCreatePO = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplierId || !selectedIngredientId) {
      toast.error('Lengkapi data supplier dan bahan baku');
      return;
    }

    const supplier = suppliers.find((s) => s.id === supplierId);
    const ingredient = ingredients.find((i) => i.id === selectedIngredientId);

    const newPO = await purchaseOrderService.create({
      tenant_id: 't-1',
      supplier_id: supplierId,
      status: 'ordered',
      total_amount: Number(quantity) * Number(unitPrice),
      order_date: new Date().toISOString().split('T')[0],
      supplier: supplier || undefined,
      items: [
        {
          ingredient_id: selectedIngredientId,
          quantity: Number(quantity),
          unit_price: Number(unitPrice),
          total_price: Number(quantity) * Number(unitPrice),
          ingredient: ingredient || undefined,
        },
      ],
    });

    addPurchaseOrder(newPO);
    toast.success(`Purchase Order ${newPO.po_number} berhasil dibuat!`);
    setIsModalOpen(false);
  };

  const handleReceivePO = async (po: PurchaseOrder) => {
    if (confirm(`Konfirmasi penerimaan barang untuk ${po.po_number}? Stok bahan akan bertambah otomatis.`)) {
      await purchaseOrderService.updateStatus(po.id, 'received');

      // Update PO status locally
      const updatedPOList = purchaseOrders.map((p) =>
        p.id === po.id ? { ...p, status: 'received' as const, received_date: new Date().toISOString().split('T')[0] } : p
      );
      setPurchaseOrders(updatedPOList);

      // Auto increase stock for each PO item
      for (const item of po.items) {
        const ing = ingredients.find((i) => i.id === item.ingredient_id);
        if (ing) {
          const newStock = ing.current_stock + item.quantity;
          updateIngredient(ing.id, { current_stock: newStock });

          const mov = await stockService.recordMovement({
            ingredient_id: ing.id,
            type: 'in',
            quantity: item.quantity,
            notes: `Stok Masuk dari ${po.po_number}`,
          });
          addStockMovement({ ...mov, ingredient: ing });
        }
      }

      toast.success(`Barang ${po.po_number} telah diterima & stok gudang otomatis bertambah!`);
    }
  };

  const getStatusBadge = (status: PurchaseOrder['status']) => {
    switch (status) {
      case 'received':
        return { label: 'Selesai & Diterima', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle2 };
      case 'ordered':
        return { label: 'Dalam Pengiriman', bg: 'bg-blue-50 text-blue-700 border-blue-200', icon: Truck };
      case 'cancelled':
        return { label: 'Dibatalkan', bg: 'bg-rose-50 text-rose-700 border-rose-200', icon: XCircle };
      default:
        return { label: 'Draft', bg: 'bg-slate-100 text-slate-700 border-slate-200', icon: Clock };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <ShoppingCart className="w-7 h-7 text-amber-500" />
            <span>Purchase Order (Stok Masuk & PO)</span>
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Pemesanan bahan baku ke supplier/vendor & verifikasi barang masuk ke gudang.
          </p>
        </div>

        <button
          onClick={() => {
            if (suppliers.length > 0) setSupplierId(suppliers[0].id);
            if (ingredients.length > 0) {
              setSelectedIngredientId(ingredients[0].id);
              setUnitPrice(ingredients[0].cost_per_unit);
            }
            setIsModalOpen(true);
          }}
          className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-4 py-2.5 rounded-2xl text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Purchase Order Baru</span>
        </button>
      </div>

      {/* PO Table */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="pb-3">No. PO</th>
                <th className="pb-3">Supplier / Vendor</th>
                <th className="pb-3">Tanggal Order</th>
                <th className="pb-3">Total Belanja</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {purchaseOrders.map((po) => {
                const info = getStatusBadge(po.status);
                const Icon = info.icon;
                return (
                  <tr key={po.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 font-bold font-mono text-slate-900">{po.po_number}</td>
                    <td className="py-3.5 font-semibold text-slate-800">
                      {po.supplier?.name || 'Supplier Utama'}
                    </td>
                    <td className="py-3.5 text-xs text-slate-500">{po.order_date}</td>
                    <td className="py-3.5 font-black text-slate-900">{formatRupiah(po.total_amount)}</td>
                    <td className="py-3.5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${info.bg}`}>
                        <Icon className="w-3.5 h-3.5" />
                        {info.label}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      {po.status === 'ordered' && (
                        <button
                          onClick={() => handleReceivePO(po)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3 py-1.5 rounded-xl transition shadow-xs"
                        >
                          Terima Barang
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create PO Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Buat Purchase Order Baru">
        <form onSubmit={handleCreatePO} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Pilih Supplier / Vendor</label>
            <select
              value={supplierId}
              onChange={(e) => setSupplierId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-amber-500"
              required
            >
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.contact_person || 'Vendor'})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Pilih Bahan Baku</label>
            <select
              value={selectedIngredientId}
              onChange={(e) => {
                setSelectedIngredientId(e.target.value);
                const ing = ingredients.find((i) => i.id === e.target.value);
                if (ing) setUnitPrice(ing.cost_per_unit);
              }}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-amber-500"
              required
            >
              {ingredients.map((ing) => (
                <option key={ing.id} value={ing.id}>
                  {ing.name} ({ing.unit})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Jumlah Pesanan</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-amber-500 font-bold"
                min={1}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Harga per Unit (Rp)</label>
              <input
                type="number"
                value={unitPrice}
                onChange={(e) => setUnitPrice(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-amber-500 font-bold"
              />
            </div>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-xs font-bold text-amber-900">
            <span>Total Nilai PO:</span>
            <span className="text-base text-amber-600">{formatRupiah(quantity * unitPrice)}</span>
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
              Kirim PO ke Supplier
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
