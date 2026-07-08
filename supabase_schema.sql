-- ==========================================
-- SKEMA DATABASE RUMAH CUCI SEPATU (SUPABASE)
-- ==========================================

DROP TABLE IF EXISTS faqs, feedbacks, expenses, shoes, transactions, toko_settings, services, users CASCADE;


-- 1. TABEL PENGGUNA (Kasir, Teknisi, Owner)
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  nama TEXT NOT NULL,
  role TEXT NOT NULL,
  status BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Insert Default Owner
INSERT INTO users (username, password, nama, role) 
VALUES ('owner', 'owner123', 'Owner Budi', 'Owner');

-- 2. TABEL LAYANAN & HARGA
CREATE TABLE services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  kategori TEXT NOT NULL,
  nama TEXT NOT NULL,
  harga INTEGER NOT NULL,
  catatan TEXT,
  tampil_web BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Insert Layanan Default (Berdasarkan PRD)
INSERT INTO services (kategori, nama, harga, catatan, tampil_web) VALUES
('Fast Cleaning', 'Sneaker', 25000, '', true),
('Fast Cleaning', 'Sepatu Bot', 30000, '', true),
('Fast Cleaning', 'Sepatu Kulit', 35000, '', true),
('Fast Cleaning', 'Sepatu Suede', 35000, '', true),
('Deep Cleaning', 'Sneaker', 35000, '', true),
('Deep Cleaning', 'Sepatu Bot', 40000, '', true),
('Deep Cleaning', 'Sepatu Kulit', 50000, '', true),
('Deep Cleaning', 'Sepatu Suede', 50000, '', true),
('Special Treatment', 'Whitening (Upper)', 70000, 'Sudah termasuk Deep Cleaning', true),
('Special Treatment', 'Unyellowing (Midsole)', 80000, 'Sudah termasuk Deep Cleaning', true),
('Special Treatment', 'Package: Whitening + Unyellowing', 140000, 'Hemat Rp10.000 dari harga terpisah', true),
('Bag Cleaning', 'Tas Kecil', 35000, '', true),
('Bag Cleaning', 'Tas Sedang', 45000, '', true),
('Bag Cleaning', 'Tas Besar', 60000, '', true),
('Add-On', 'Express (prioritas antrian)', 15000, '', true),
('Add-On', 'Leather / Suede Care', 10000, '', true),
('Add-On', 'Extra Treatment (noda berat/jamur)', 10000, '', true);

-- 3. TABEL PENGATURAN TOKO
CREATE TABLE toko_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nama_toko TEXT NOT NULL,
  alamat TEXT NOT NULL,
  jam_buka TEXT,
  jam_tutup TEXT,
  wa TEXT,
  instagram TEXT,
  map_link TEXT
);

INSERT INTO toko_settings (nama_toko, alamat, wa) 
VALUES ('Rumah Cuci Sepatu', 'Jl. Merdeka No 123, Jakarta', '081234567890');

-- 4. TABEL TRANSAKSI INDUK
CREATE TABLE transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  kode TEXT UNIQUE NOT NULL,
  pelanggan TEXT NOT NULL,
  hp TEXT NOT NULL,
  tanggal DATE NOT NULL,
  metode TEXT NOT NULL, -- 'datang' atau 'jemput-antar'
  alamat_jemput TEXT,
  alamat_antar TEXT,
  jadwal_jemput TEXT,
  status_bayar TEXT NOT NULL, -- 'Lunas', 'DP', 'Belum Bayar'
  metode_bayar TEXT,
  biaya_jemput_antar INTEGER DEFAULT 0,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- 5. TABEL SEPATU (Anak dari Transaksi)
CREATE TABLE shoes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trx_id UUID REFERENCES transactions(id) ON DELETE CASCADE,
  jenis TEXT NOT NULL,
  treatment TEXT NOT NULL,
  harga INTEGER NOT NULL,
  estimasi DATE NOT NULL,
  addons JSONB DEFAULT '[]'::jsonb,
  tracking TEXT UNIQUE NOT NULL,
  stage INTEGER DEFAULT 1,
  stages JSONB NOT NULL,
  riwayat JSONB DEFAULT '[]'::jsonb,
  foto_awal TEXT,
  foto_akhir TEXT,
  catatan TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- 6. TABEL PENGELUARAN
CREATE TABLE expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tanggal DATE NOT NULL,
  kategori TEXT NOT NULL,
  jumlah INTEGER NOT NULL,
  catatan TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- 7. TABEL FEEDBACK
CREATE TABLE feedbacks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nama TEXT,
  no_struk TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  komentar TEXT,
  status TEXT DEFAULT 'Belum Ditinjau',
  tampil_web BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Insert Feedback Default (Kata Pelanggan Dummy)
INSERT INTO feedbacks (nama, no_struk, rating, komentar, status, tampil_web) VALUES
('Dhea R.', 'TRX-0512', 5, 'Air Force putih balik cerah, mantap.', 'Ditinjau', true),
('Bagas P.', 'TRX-0511', 5, 'Jemput-antar tepat waktu terus.', 'Ditinjau', true),
('Nadia W.', 'TRX-0510', 4, 'Deep cleaning bersih sampai sela jahitan.', 'Ditinjau', true);

-- 8. TABEL FAQ
CREATE TABLE faqs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pertanyaan TEXT NOT NULL,
  jawaban TEXT NOT NULL,
  tampil_web BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Insert FAQ Default
INSERT INTO faqs (pertanyaan, jawaban, tampil_web) VALUES
('Berapa lama proses pencuciannya?', 'Estimasi pengerjaan 2-3 hari kerja tergantung jenis layanan dan antrian. Bisa dipercepat dengan add-on Express.', true),
('Apakah warna sepatu bisa berubah/pudar setelah dicuci?', 'Metode cuci disesuaikan dengan jenis bahan (kanvas, kulit, atau suede) untuk meminimalkan risiko warna pudar. Untuk bahan sensitif, kami sarankan add-on Leather/Suede Care.', true),
('Bagaimana cara cek status sepatu saya?', 'Gunakan "Lacak Sepatu Saya" di halaman ini, masukkan nomor struk atau nomor HP yang kamu daftarkan saat transaksi.', true),
('Apa bedanya Fast Cleaning dan Deep Cleaning?', 'Fast Cleaning untuk perawatan rutin dan noda ringan. Deep Cleaning membersihkan lebih menyeluruh, termasuk sela-sela sulit dan noda membandel.', true),
('Metode pembayaran apa saja yang diterima?', 'Cash, transfer bank, dan QRIS manual.', true),
('Apakah bisa titip sepatu tanpa datang langsung (jemput-antar)?', 'Bisa! Pilih opsi Jemput-Antar saat order, tim kami akan menjemput sepatu ke alamatmu dan mengantarkannya kembali setelah selesai.', true),
('Apakah Whitening dan Unyellowing bisa dipesan terpisah?', 'Bisa, keduanya tersedia sebagai layanan individual — atau ambil sebagai Package Deal dengan harga lebih hemat jika dipesan bersamaan.', true);

-- ==========================================
-- POLICIES / RLS (Row Level Security)
-- ==========================================
-- Matikan sementara RLS agar mudah digunakan tanpa Auth Supabase asli (hanya pakai API Key biasa)
-- Untuk keamanan ke depannya, RLS harus diaktifkan.
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE services DISABLE ROW LEVEL SECURITY;
ALTER TABLE toko_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE shoes DISABLE ROW LEVEL SECURITY;
ALTER TABLE expenses DISABLE ROW LEVEL SECURITY;
ALTER TABLE feedbacks DISABLE ROW LEVEL SECURITY;
ALTER TABLE faqs DISABLE ROW LEVEL SECURITY;
