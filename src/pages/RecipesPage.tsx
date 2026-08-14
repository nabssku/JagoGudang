import React, { useState } from 'react';
import { useInventoryStore } from '../app/store/useInventoryStore';
import { formatRupiah } from '../lib/auth';
import { BookOpen, Plus, Info } from 'lucide-react';
import { Modal } from '../components/shared/Modal';
import { toast } from 'sonner';

interface ProductRecipe {
  id: string;
  product_name: string;
  category: string;
  selling_price: number;
  ingredients: {
    ingredient_id: string;
    quantity: number;
  }[];
}

const mockRecipes: ProductRecipe[] = [
  {
    id: 'rec-1',
    product_name: 'Es Kopi Susu Aren',
    category: 'Minuman Kopi',
    selling_price: 22000,
    ingredients: [
      { ingredient_id: 'ing-1', quantity: 0.12 },
      { ingredient_id: 'ing-2', quantity: 0.018 },
      { ingredient_id: 'ing-3', quantity: 0.03 },
      { ingredient_id: 'ing-4', quantity: 1 },
      { ingredient_id: 'ing-5', quantity: 1 },
    ],
  },
  {
    id: 'rec-2',
    product_name: 'Americano Ice',
    category: 'Minuman Kopi',
    selling_price: 18000,
    ingredients: [
      { ingredient_id: 'ing-2', quantity: 0.018 },
      { ingredient_id: 'ing-4', quantity: 1 },
      { ingredient_id: 'ing-5', quantity: 1 },
    ],
  },
];

export const RecipesPage: React.FC = () => {
  const { ingredients } = useInventoryStore();
  const [recipes, setRecipes] = useState<ProductRecipe[]>(mockRecipes);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Recipe Form State
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('Minuman Kopi');
  const [sellingPrice, setSellingPrice] = useState<number>(20000);
  const [recipeItems, setRecipeItems] = useState<{ ingredient_id: string; quantity: number }[]>([
    { ingredient_id: ingredients[0]?.id || '', quantity: 1 },
  ]);

  const calculateCogs = (recipe: ProductRecipe) => {
    return recipe.ingredients.reduce((sum, item) => {
      const ing = ingredients.find((i) => i.id === item.ingredient_id);
      if (!ing) return sum;
      return sum + ing.cost_per_unit * item.quantity;
    }, 0);
  };

  const handleAddItemRow = () => {
    setRecipeItems((prev) => [...prev, { ingredient_id: ingredients[0]?.id || '', quantity: 1 }]);
  };

  const handleRemoveItemRow = (index: number) => {
    setRecipeItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: 'ingredient_id' | 'quantity', value: any) => {
    setRecipeItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const handleSaveRecipe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim()) {
      toast.error('Nama produk wajib diisi');
      return;
    }

    const newRecipe: ProductRecipe = {
      id: 'rec-' + Date.now(),
      product_name: productName,
      category,
      selling_price: Number(sellingPrice),
      ingredients: recipeItems,
    };

    setRecipes((prev) => [newRecipe, ...prev]);
    toast.success('Resep & Bill of Materials baru berhasil ditambahkan!');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <BookOpen className="w-7 h-7 text-amber-500" />
            <span>Resep & Bill of Materials (BOM)</span>
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Hubungkan menu produk Kasir dengan takaran bahan baku Gudang untuk potong stok & kalkulasi COGS/HPP otomatis.
          </p>
        </div>

        <button
          onClick={() => {
            setProductName('');
            setRecipeItems([{ ingredient_id: ingredients[0]?.id || '', quantity: 1 }]);
            setIsModalOpen(true);
          }}
          className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-4 py-2.5 rounded-2xl text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Resep Produk</span>
        </button>
      </div>

      {/* Info Banner */}
      <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-900">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold">Bagaimana Resep Bekerja?</p>
          <p className="mt-0.5 text-amber-800">
            Setiap kali pesanan terjual di <code className="font-mono font-bold">pos.jagokasir.store</code>, sistem otomatis memotong stok bahan baku di <code className="font-mono font-bold">gudang.jagokasir.store</code> sesuai takaran resep di bawah ini.
          </p>
        </div>
      </div>

      {/* Recipes Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recipes.map((rec) => {
          const cogs = calculateCogs(rec);
          const margin = rec.selling_price - cogs;
          const marginPercent = rec.selling_price > 0 ? ((margin / rec.selling_price) * 100).toFixed(1) : 0;

          return (
            <div key={rec.id} className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full">
                      {rec.category}
                    </span>
                    <h3 className="text-lg font-black text-slate-900 mt-1">{rec.product_name}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 font-semibold">Harga Jual POS</p>
                    <p className="text-base font-black text-emerald-600">{formatRupiah(rec.selling_price)}</p>
                  </div>
                </div>

                {/* Ingredients List */}
                <div className="space-y-2 mb-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Komposisi Bahan Baku:</p>
                  {rec.ingredients.map((item, idx) => {
                    const ing = ingredients.find((i) => i.id === item.ingredient_id);
                    const itemCost = ing ? ing.cost_per_unit * item.quantity : 0;
                    return (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-800">
                          {ing?.name || item.ingredient_id} ({item.quantity} {ing?.unit})
                        </span>
                        <span className="font-mono text-slate-500">{formatRupiah(itemCost)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* COGS & Profit Margin Footer */}
              <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-100/70 p-2.5 rounded-xl">
                  <p className="text-[10px] text-slate-400 font-semibold">COGS / HPP Modal</p>
                  <p className="font-bold text-slate-900">{formatRupiah(cogs)}</p>
                </div>
                <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                  <p className="text-[10px] text-emerald-600 font-semibold">Laba Kotor ({marginPercent}%)</p>
                  <p className="font-bold text-emerald-700">{formatRupiah(margin)}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Add Recipe */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Buat Resep Produk (BOM)">
        <form onSubmit={handleSaveRecipe} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Nama Produk Kasir</label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Contoh: Matcha Latte Float"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Kategori Produk</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Harga Jual (Rp)</label>
              <input
                type="number"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-amber-500 font-bold"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-700">Komposisi Takaran Bahan</label>
              <button
                type="button"
                onClick={handleAddItemRow}
                className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah Takaran
              </button>
            </div>

            <div className="space-y-2">
              {recipeItems.map((item, idx) => {
                const targetIng = ingredients.find((i) => i.id === item.ingredient_id);
                return (
                  <div key={idx} className="flex items-center gap-2">
                    <select
                      value={item.ingredient_id}
                      onChange={(e) => handleItemChange(idx, 'ingredient_id', e.target.value)}
                      className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    >
                      {ingredients.map((ing) => (
                        <option key={ing.id} value={ing.id}>
                          {ing.name} ({ing.unit})
                        </option>
                      ))}
                    </select>

                    <div className="w-28 flex items-center gap-1">
                      <input
                        type="number"
                        step="any"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(idx, 'quantity', Number(e.target.value))}
                        className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold"
                      />
                      <span className="text-[10px] text-slate-400">{targetIng?.unit}</span>
                    </div>

                    {recipeItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItemRow(idx)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
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
              Simpan Resep
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
