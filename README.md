# JagoGudang 📦

**JagoGudang** (`gudang.jagokasir.store`) adalah aplikasi Manajemen Stok, Bahan Baku, Resep (Bill of Materials / BOM), dan Purchase Order terintegrasi yang merupakan bagian dari ekosistem **JagoSuite / JagoKasir**.

Aplikasi ini dirancang khusus untuk operasional gudang UMKM dan toko retail/F&B, terhubung ke 1 Shared Backend Laravel 11 (`KasirKu`) di `api.jagokasir.store`.

---

## 🌟 Fitur Utama JagoGudang

1. **Dashboard & Peringatan Stok Menipis**
   - Ringkasan total bahan baku, estimasi nilai modal inventaris (Rp), dan notifikasi alert stok menipis secara real-time.
2. **Manajemen Bahan Baku & Harga Modal (Cost/Unit)**
   - Pendaftaran bahan baku, unit/satuan (Liter, Kg, Gram, Pcs, dll), harga modal, dan ambang batas minimum alert.
3. **Resep & Bill of Materials (BOM)**
   - Menghubungkan produk kasir (`pos.jagokasir.store`) dengan bahan baku gudang untuk kalkulasi HPP / COGS dan pemotongan stok otomatis.
4. **Riwayat Mutasi & Pergerakan Stok**
   - Pencatatan transaksi stok masuk, stok keluar, barang rusak (*waste*), dan penyesuaian audit.
5. **Purchase Order (PO) & Stok Masuk dari Supplier**
   - Pembuatan PO ke supplier/vendor dan verifikasi penerimaan barang otomatis menambah stok fisik.
6. **Stock Opname (Audit Fisik vs Sistem)**
   - Alat bantu perhitungan fisik bahan baku di gudang vs angka di aplikasi dengan penghitungan selisih otomatis.
7. **Direktori Supplier / Pemasok**
   - Manajemen kontak PIC vendor, alamat, nomor telepon, dan catatan histori pesanan.

---

## 🚀 Panduan Pengoperasian & Subdomain Deployment

### Subdomain Strategy:
- **JagoGudang (Web App):** `https://gudang.jagokasir.store`
- **JagoKasir (POS):** `https://pos.jagokasir.store`
- **Backend API (Laravel):** `https://api.jagokasir.store/api/v1`

---

## 💻 Cara Install & Menjalankan Lokal

```bash
# 1. Clone repositori
git clone https://github.com/nabssku/JagoGudang.git
cd JagoGudang

# 2. Install Dependencies
npm install

# 3. Jalankan Mode Development (Port 3001)
npm run dev

# 4. Build untuk Production
npm run build
```

---

## 🔒 Otentikasi & Akun
- **Single Sign-On (SSO) / Shared JWT:** Token login pengguna dibagikan dengan `auth-storage` JagoKasir, memungkinkan pengguna yang berwenang beralih antar aplikasi tanpa login ulang.
- **Support Login PIN 6-digit & Login Email/Password.**

---

*Dikembangkan untuk ekosistem JagoKasir & JagoSuite UMKM.* 🚀
