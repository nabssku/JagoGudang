import React, { useState } from 'react';
import { useInventoryStore } from '../app/store/useInventoryStore';
import { supplierService } from '../services/supplierService';
import { Truck, Plus, Phone, Mail, MapPin, User } from 'lucide-react';
import { Modal } from '../components/shared/Modal';
import { toast } from 'sonner';

export const SuppliersPage: React.FC = () => {
  const { suppliers, addSupplier } = useInventoryStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');

  const handleAddSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Nama supplier wajib diisi');
      return;
    }

    const created = await supplierService.create({
      tenant_id: 't-1',
      name,
      contact_person: contactPerson,
      phone,
      email,
      address,
      notes,
      is_active: true,
    });

    addSupplier(created);
    toast.success('Supplier baru berhasil ditambahkan');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Truck className="w-7 h-7 text-amber-500" />
            <span>Daftar Supplier & Vendor</span>
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Direktori kontak pemasok bahan baku, distributor resmi, dan grosir langganan.
          </p>
        </div>

        <button
          onClick={() => {
            setName('');
            setContactPerson('');
            setPhone('');
            setEmail('');
            setAddress('');
            setNotes('');
            setIsModalOpen(true);
          }}
          className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-4 py-2.5 rounded-2xl text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Supplier Baru</span>
        </button>
      </div>

      {/* Supplier Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {suppliers.map((sup) => (
          <div key={sup.id} className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition">
            <div>
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center font-bold">
                  <Truck className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                  Aktif
                </span>
              </div>

              <h3 className="text-lg font-black text-slate-900">{sup.name}</h3>
              {sup.contact_person && (
                <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mt-1">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>PIC: {sup.contact_person}</span>
                </p>
              )}

              <div className="space-y-2 mt-4 text-xs text-slate-600">
                {sup.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                    <span className="font-mono">{sup.phone}</span>
                  </div>
                )}
                {sup.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>{sup.email}</span>
                  </div>
                )}
                {sup.address && (
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>{sup.address}</span>
                  </div>
                )}
              </div>
            </div>

            {sup.notes && (
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 italic">
                "{sup.notes}"
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal Form */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Tambah Supplier Baru">
        <form onSubmit={handleAddSupplier} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Nama Perusahaan / Supplier</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: PT Indomilk Jaya Supplier"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nama Kontak PIC</label>
              <input
                type="text"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                placeholder="Contoh: Pak Anton"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">No. WhatsApp / HP</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="081234567890"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Alamat Gudang Supplier</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Alamat lengkap supplier..."
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
              Simpan Supplier
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
