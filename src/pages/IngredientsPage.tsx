import React, { useState, useMemo } from 'react';
import { useInventoryStore } from '../app/store/useInventoryStore';
import { ingredientService } from '../services/ingredientService';
import { productService } from '../services/productService';
import { Modal } from '../components/shared/Modal';
import { formatRupiah } from '../lib/auth';
import { Plus, Search, Filter, Edit3, Trash2, Boxes, AlertCircle, CheckCircle2, ShoppingBag, Layers } from 'lucide-react';
import { toast } from 'sonner';
import type { Ingredient, Product } from '../types';

export const IngredientsPage: React.FC = () => {
  const { products, ingredients, addIngredient, updateIngredient, deleteIngredient, updateProductStock } = useInventoryStore();
  const [activeTab, setActiveTab] = useState<'products' | 'ingredients'>('products');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Ingredient Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Ingredient | null>(null);
  const [name, setName] = useState('');
  const [unit, setUnit] = useState('Liter');
  const [costPerUnit, setCostPerUnit] = useState<number>(0);
  const [currentStock, setCurrentStock] = useState<number>(0);
  const [minStock, setMinStock] = useState<number>(5);
  const [category, setCategory] = useState('Umum');

  // Product Stock Edit Modal State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productStock, setProductStock] = useState<number>(0);

  const categories = useMemo(() => {
    const set = new Set<string>();
    if (activeTab === 'products') {
      products.forEach((p) => {
        if (p.category?.name) set.add(p.category.name);
      });
    } else {
      ingredients.forEach((ing) => {
        if (ing.category) set.add(ing.category);
      });
    }
    return Array.from(set);
  }, [activeTab, products, ingredients]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchCategory = selectedCategory === 'all' || p.category?.name === selectedCategory;
      return matchSearch && matchCategory;
    });
  }, [products, search, selectedCategory]);

  const filteredIngredients = useMemo(() => {
    return ingredients.filter((ing) => {
      const matchSearch = ing.name.toLowerCase().includes(search.toLowerCase());
      const matchCategory = selectedCategory === 'all' || ing.category === selectedCategory;
      return matchSearch && matchCategory;
    });
  }, [ingredients, search, selectedCategory]);

  const handleOpenModal = (item?: Ingredient) => {
    if (item) {
      setEditingItem(item);
      setName(item.name);
      setUnit(item.unit);
      setCostPerUnit(item.cost_per_unit);
      setCurrentStock(item.current_stock);
      setMinStock(item.min_stock);
      setCategory(item.category || 'Umum');
    } else {
      setEditingItem(null);
      setName('');
      setUnit('Liter');
      setCostPerUnit(0);
      setCurrentStock(0);
      setMinStock(5);
      setCategory('Umum');
    }
    setIsModalOpen(true);
  };

  const handleSaveIngredient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Nama bahan baku wajib diisi');
      return;
    }

    if (editingItem) {
      const updated = await ingredientService.update(editingItem.id, {
        name,
        unit,
        cost_per_unit: Number(costPerUnit),
        current_stock: Number(currentStock),
        min_stock: Number(minStock),
        category,
      });
      updateIngredient(editingItem.id, updated);
      toast.success('Bahan baku berhasil diperbarui');
    } else {
      const created = await ingredientService.create({
        tenant_id: 't-1',
        name,
        unit,
        cost_per_unit: Number(costPerUnit),
        current_stock: Number(currentStock),
        min_stock: Number(minStock),
        category,
      });
      addIngredient(created);
      toast.success('Bahan baku baru berhasil ditambahkan');
    }

    setIsModalOpen(false);
  };

  const handleSaveProductStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    await productService.updateStock(editingProduct.id, Number(productStock));
    updateProductStock(editingProduct.id, Number(productStock));
    toast.success(`Stok produk "${editingProduct.name}" berhasil diperbarui!`);
    setEditingProduct(null);
  };

  const handleDeleteIngredient = async (id: string, name: string) => {
    if (confirm(`Yakin ingin menghapus bahan baku "${name}"?`)) {
      await ingredientService.delete(id);
      deleteIngredient(id);
      toast.success('Bahan baku berhasil dihapus');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Boxes className="w-7 h-7 text-amber-500" />
            <span>Manajemen Stok Gudang</span>
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Kelola stok produk Kasir POS maupun bahan baku mentah (F&B) terhubung ke API `KasirKu`.
          </p>
        </div>

        {activeTab === 'ingredients' && (
          <button
            onClick={() => handleOpenModal()}
            className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-4 py-2.5 rounded-2xl text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Bahan Baku</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-200/70 p-1.5 rounded-2xl max-w-md border border-slate-300/50">
        <button
          onClick={() => {
            setActiveTab('products');
            setSelectedCategory('all');
          }}
          className={`flex-1 py-2.5 px-4 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 ${
            activeTab === 'products' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShoppingBag className="w-4 h-4 text-amber-500" />
          <span>Produk POS ({products.length})</span>
        </button>
        <button
          onClick={() => {
            setActiveTab('ingredients');
            setSelectedCategory('all');
          }}
          className={`flex-1 py-2.5 px-4 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 ${
            activeTab === 'ingredients' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Layers className="w-4 h-4 text-emerald-500" />
          <span>Bahan Baku ({ingredients.length})</span>
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={activeTab === 'products' ? 'Cari produk kasir...' : 'Cari bahan baku...'}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-amber-500 transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold px-3 py-2 text-slate-700 focus:outline-none focus:border-amber-500 transition"
          >
            <option value="all">Semua Kategori</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* TAB 1: POS PRODUCTS GRID */}
      {activeTab === 'products' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-white rounded-3xl border border-dashed border-slate-200 p-6">
              <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-base font-bold text-slate-800">Belum Ada Produk POS</p>
              <p className="text-xs text-slate-500 mt-1">
                Produk yang didaftarkan di aplikasi kasir (`pos.jagokasir.store`) akan otomatis muncul di sini.
              </p>
            </div>
          ) : (
            filteredProducts.map((p) => {
              const isLowStock = p.stock <= (p.min_stock || 5);
              return (
                <div
                  key={p.id}
                  className={`bg-white border rounded-2xl p-5 shadow-xs transition hover:shadow-md flex flex-col justify-between ${
                    isLowStock ? 'border-rose-200 ring-2 ring-rose-500/10' : 'border-slate-200/80'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                          {p.category?.name || 'Produk POS'}
                        </span>
                        <h3 className="text-base font-extrabold text-slate-900 mt-1">{p.name}</h3>
                      </div>

                      <button
                        onClick={() => {
                          setEditingProduct(p);
                          setProductStock(p.stock);
                        }}
                        className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
                        title="Edit Stok Gudang"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 my-3 p-3 bg-slate-50 rounded-xl text-xs">
                      <div>
                        <p className="text-slate-400 text-[10px] font-semibold">Harga Jual POS</p>
                        <p className="font-bold text-slate-800">{formatRupiah(p.price)}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-[10px] font-semibold">Harga Modal</p>
                        <p className="font-bold text-slate-800">{p.cost_price ? formatRupiah(p.cost_price) : '-'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500">Stok Produk POS:</span>
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black border ${
                        isLowStock
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}
                    >
                      {isLowStock ? <AlertCircle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                      {p.stock} Pcs
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 2: INGREDIENTS GRID */}
      {activeTab === 'ingredients' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredIngredients.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-white rounded-3xl border border-dashed border-slate-200 p-6">
              <Layers className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-base font-bold text-slate-800">Belum Ada Bahan Baku Mentah</p>
              <p className="text-xs text-slate-500 mt-1">
                Klik tombol "Tambah Bahan Baku" di atas untuk mendaftarkan bahan mentah (F&B / resep).
              </p>
            </div>
          ) : (
            filteredIngredients.map((item) => {
              const isLowStock = item.current_stock <= item.min_stock;
              return (
                <div
                  key={item.id}
                  className={`bg-white border rounded-2xl p-5 shadow-xs transition hover:shadow-md flex flex-col justify-between ${
                    isLowStock ? 'border-rose-200 ring-2 ring-rose-500/10' : 'border-slate-200/80'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                          {item.category || 'Umum'}
                        </span>
                        <h3 className="text-base font-extrabold text-slate-900 mt-1">{item.name}</h3>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenModal(item)}
                          className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteIngredient(item.id, item.name)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 my-3 p-3 bg-slate-50 rounded-xl text-xs">
                      <div>
                        <p className="text-slate-400 text-[10px] font-semibold">Harga Modal</p>
                        <p className="font-bold text-slate-800">{formatRupiah(item.cost_per_unit)} / {item.unit}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-[10px] font-semibold">Batas Minimum</p>
                        <p className="font-bold text-slate-800">{item.min_stock} {item.unit}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500">Stok Fisik:</span>
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black border ${
                        isLowStock
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}
                    >
                      {isLowStock ? <AlertCircle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                      {item.current_stock} {item.unit}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Modal Add/Edit Ingredient */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Bahan Baku' : 'Tambah Bahan Baku Baru'}
      >
        <form onSubmit={handleSaveIngredient} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Nama Bahan Baku</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Susu UHT Full Cream"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Kategori</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Contoh: Diari & Susu"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Satuan (Unit)</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-amber-500"
              >
                <option value="Liter">Liter</option>
                <option value="ml">Milliliter (ml)</option>
                <option value="Kg">Kilogram (Kg)</option>
                <option value="Gram">Gram</option>
                <option value="Pcs">Pieces (Pcs)</option>
                <option value="Pack">Pack / Dus</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Modal / Unit (Rp)</label>
              <input
                type="number"
                value={costPerUnit}
                onChange={(e) => setCostPerUnit(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-amber-500"
                min={0}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Stok Awal</label>
              <input
                type="number"
                value={currentStock}
                onChange={(e) => setCurrentStock(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-amber-500"
                min={0}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Min. Alert Stok</label>
              <input
                type="number"
                value={minStock}
                onChange={(e) => setMinStock(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-amber-500"
                min={0}
              />
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
              {editingItem ? 'Simpan Perubahan' : 'Tambah Bahan'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Edit Product Stock */}
      <Modal
        isOpen={!!editingProduct}
        onClose={() => setEditingProduct(null)}
        title={`Update Stok POS: ${editingProduct?.name || ''}`}
      >
        <form onSubmit={handleSaveProductStock} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Jumlah Stok Produk di Kasir (Pcs)</label>
            <input
              type="number"
              value={productStock}
              onChange={(e) => setProductStock(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold focus:outline-none focus:border-amber-500"
              min={0}
              required
            />
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setEditingProduct(null)}
              className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-amber-500 rounded-xl hover:bg-amber-600 shadow-md"
            >
              Update Stok POS
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
