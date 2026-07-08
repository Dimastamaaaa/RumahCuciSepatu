// Seed data — initial mock database sesuai PRD dan HTML reference

export const SEED_USERS = [
  { id: 'u1', nama: 'Pak Broto', username: 'owner@rumahcucisepatu', password: 'owner123', role: 'owner', status: true },
  { id: 'u2', nama: 'Sari Dewi', username: '0812-3456-7801', password: 'kasir123', role: 'kasir', status: true },
  { id: 'u3', nama: 'Yusuf Hamdi', username: '0812-3456-7802', password: 'kasir123', role: 'kasir', status: true },
  { id: 'u4', nama: 'Rian Saputra', username: '0812-3456-7803', password: 'teknisi123', role: 'teknisi', status: true },
  { id: 'u5', nama: 'Dwi Prasetyo', username: '0812-3456-7804', password: 'teknisi123', role: 'teknisi', status: false },
];

export const SEED_SERVICES = [
  { id: 's1', kategori: 'Fast Cleaning', nama: 'Sneaker', harga: 25000, catatan: '', tampil_di_web: true },
  { id: 's2', kategori: 'Fast Cleaning', nama: 'Sepatu Bot', harga: 30000, catatan: '', tampil_di_web: true },
  { id: 's3', kategori: 'Fast Cleaning', nama: 'Sepatu Kulit', harga: 35000, catatan: '', tampil_di_web: true },
  { id: 's4', kategori: 'Fast Cleaning', nama: 'Sepatu Suede', harga: 35000, catatan: '', tampil_di_web: true },
  { id: 's5', kategori: 'Deep Cleaning', nama: 'Sneaker', harga: 35000, catatan: '', tampil_di_web: true },
  { id: 's6', kategori: 'Deep Cleaning', nama: 'Sepatu Bot', harga: 40000, catatan: '', tampil_di_web: true },
  { id: 's7', kategori: 'Deep Cleaning', nama: 'Sepatu Kulit', harga: 50000, catatan: '', tampil_di_web: true },
  { id: 's8', kategori: 'Deep Cleaning', nama: 'Sepatu Suede', harga: 50000, catatan: '', tampil_di_web: true },
  { id: 's9', kategori: 'Special Treatment', nama: 'Whitening (Upper)', harga: 70000, catatan: 'Sudah termasuk Deep Cleaning', tampil_di_web: true },
  { id: 's10', kategori: 'Special Treatment', nama: 'Unyellowing (Midsole)', harga: 80000, catatan: 'Sudah termasuk Deep Cleaning', tampil_di_web: true },
  { id: 's11', kategori: 'Special Treatment', nama: 'Package: Whitening + Unyellowing', harga: 140000, catatan: 'Hemat Rp10.000 dari harga terpisah', tampil_di_web: true },
  { id: 's12', kategori: 'Bag Cleaning', nama: 'Tas Kecil', harga: 35000, catatan: '', tampil_di_web: true },
  { id: 's13', kategori: 'Bag Cleaning', nama: 'Tas Sedang', harga: 45000, catatan: '', tampil_di_web: true },
  { id: 's14', kategori: 'Bag Cleaning', nama: 'Tas Besar', harga: 60000, catatan: '', tampil_di_web: true },
  { id: 's15', kategori: 'Add-On', nama: 'Express (prioritas antrian)', harga: 15000, catatan: '', tampil_di_web: true },
  { id: 's16', kategori: 'Add-On', nama: 'Leather / Suede Care', harga: 10000, catatan: '', tampil_di_web: true },
  { id: 's17', kategori: 'Add-On', nama: 'Extra Treatment (noda berat/jamur)', harga: 10000, catatan: '', tampil_di_web: true },
];

export const STAGES_STANDARD = ['Diterima', 'Proses Pencucian', 'Finishing', 'QC', 'Siap Diambil', 'Selesai'];
export const STAGES_JEMPUT_ANTAR = ['Menunggu Dijemput', 'Dijemput', 'Diterima', 'Proses Pencucian', 'Finishing', 'QC', 'Siap Diambil', 'Selesai'];

export const SEED_TRANSACTIONS = [
  {
    id: 'trx1', kode: 'TRX-0512', pelanggan: 'Dhea Ramadhani', hp: '0812-1111-2222',
    tanggal: '2026-07-06', metode: 'jemput-antar', alamatJemput: 'Jl. Melati No. 5, Bandung',
    jadwalJemput: '6 Jul 2026, 10.00', statusBayar: 'Lunas', metodeBayar: 'Transfer',
    biayaJemputAntar: 15000, createdBy: 'u2',
    sepatu: [
      { id: 'shoe1', tracking: 'RCS-1042', jenis: 'Nike Air Force 1', treatment: 'Whitening (Upper)', addons: [], harga: 70000, stage: 3, stages: STAGES_JEMPUT_ANTAR, estimasi: '2026-07-08', foto: [], catatan: '', riwayat: [
        { stage: 'Menunggu Dijemput', timestamp: '2026-07-06T09:00:00', by: 'Sari Dewi' },
        { stage: 'Dijemput', timestamp: '2026-07-06T10:15:00', by: 'Sari Dewi' },
        { stage: 'Diterima', timestamp: '2026-07-06T11:00:00', by: 'Sari Dewi' },
        { stage: 'Proses Pencucian', timestamp: '2026-07-06T14:00:00', by: 'Rian Saputra' },
        { stage: 'Finishing', timestamp: '2026-07-07T09:00:00', by: 'Rian Saputra' },
      ]},
      { id: 'shoe2', tracking: 'RCS-1043', jenis: 'Adidas Samba', treatment: 'Deep Cleaning', addons: ['Leather / Suede Care'], harga: 45000, stage: 2, stages: STAGES_JEMPUT_ANTAR, estimasi: '2026-07-09', foto: [], catatan: '', riwayat: [
        { stage: 'Menunggu Dijemput', timestamp: '2026-07-06T09:00:00', by: 'Sari Dewi' },
        { stage: 'Dijemput', timestamp: '2026-07-06T10:15:00', by: 'Sari Dewi' },
        { stage: 'Diterima', timestamp: '2026-07-06T11:00:00', by: 'Sari Dewi' },
        { stage: 'Proses Pencucian', timestamp: '2026-07-07T08:00:00', by: 'Rian Saputra' },
      ]},
      { id: 'shoe3', tracking: 'RCS-1044', jenis: 'Tas Ransel Sedang', treatment: 'Bag Cleaning', addons: [], harga: 45000, stage: 1, stages: STAGES_JEMPUT_ANTAR, estimasi: '2026-07-09', foto: [], catatan: '', riwayat: [
        { stage: 'Menunggu Dijemput', timestamp: '2026-07-06T09:00:00', by: 'Sari Dewi' },
        { stage: 'Dijemput', timestamp: '2026-07-06T10:15:00', by: 'Sari Dewi' },
        { stage: 'Diterima', timestamp: '2026-07-06T11:00:00', by: 'Sari Dewi' },
      ]},
    ],
  },
  {
    id: 'trx2', kode: 'TRX-0511', pelanggan: 'Bagas Purnomo', hp: '0813-2222-3333',
    tanggal: '2026-07-06', metode: 'outlet', statusBayar: 'Lunas', metodeBayar: 'Cash',
    biayaJemputAntar: 0, createdBy: 'u2',
    sepatu: [
      { id: 'shoe4', tracking: 'RCS-1039', jenis: 'Adidas Samba', treatment: 'Deep Cleaning', addons: [], harga: 35000, stage: 2, stages: STAGES_STANDARD, estimasi: '2026-07-09', foto: [], catatan: '', riwayat: [
        { stage: 'Diterima', timestamp: '2026-07-06T13:00:00', by: 'Sari Dewi' },
        { stage: 'Proses Pencucian', timestamp: '2026-07-07T08:30:00', by: 'Rian Saputra' },
      ]},
    ],
  },
  {
    id: 'trx3', kode: 'TRX-0510', pelanggan: 'Nadia Wulandari', hp: '0857-3333-4444',
    tanggal: '2026-07-05', metode: 'outlet', statusBayar: 'Lunas', metodeBayar: 'QRIS',
    biayaJemputAntar: 0, createdBy: 'u3',
    sepatu: [
      { id: 'shoe5', tracking: 'RCS-1035', jenis: 'Vans Old Skool', treatment: 'Fast Cleaning', addons: ['Express (prioritas antrian)'], harga: 40000, stage: 5, stages: STAGES_STANDARD, estimasi: '2026-07-06', foto: [], catatan: '', riwayat: [
        { stage: 'Diterima', timestamp: '2026-07-05T10:00:00', by: 'Yusuf Hamdi' },
        { stage: 'Proses Pencucian', timestamp: '2026-07-05T11:00:00', by: 'Rian Saputra' },
        { stage: 'Finishing', timestamp: '2026-07-05T15:00:00', by: 'Rian Saputra' },
        { stage: 'QC', timestamp: '2026-07-05T16:00:00', by: 'Rian Saputra' },
        { stage: 'Siap Diambil', timestamp: '2026-07-05T17:00:00', by: 'Rian Saputra' },
      ]},
      { id: 'shoe6', tracking: 'RCS-1036', jenis: 'New Balance 550', treatment: 'Deep Cleaning', addons: [], harga: 35000, stage: 5, stages: STAGES_STANDARD, estimasi: '2026-07-07', foto: [], catatan: '', riwayat: [
        { stage: 'Diterima', timestamp: '2026-07-05T10:00:00', by: 'Yusuf Hamdi' },
        { stage: 'Proses Pencucian', timestamp: '2026-07-06T08:00:00', by: 'Rian Saputra' },
        { stage: 'Finishing', timestamp: '2026-07-06T14:00:00', by: 'Rian Saputra' },
        { stage: 'QC', timestamp: '2026-07-07T09:00:00', by: 'Rian Saputra' },
        { stage: 'Siap Diambil', timestamp: '2026-07-07T10:00:00', by: 'Rian Saputra' },
      ]},
    ],
  },
  {
    id: 'trx4', kode: 'TRX-0509', pelanggan: 'Farid Akbar', hp: '0878-4444-5555',
    tanggal: '2026-07-05', metode: 'jemput-antar', alamatJemput: 'Jl. Sukamaju No. 12, Bandung',
    jadwalJemput: '5 Jul 2026, 14.00', statusBayar: 'DP', metodeBayar: 'Transfer',
    biayaJemputAntar: 15000, createdBy: 'u2',
    sepatu: [
      { id: 'shoe7', tracking: 'RCS-1031', jenis: 'Sepatu Bot Kulit', treatment: 'Deep Cleaning', addons: ['Leather / Suede Care'], harga: 60000, stage: 1, stages: STAGES_JEMPUT_ANTAR, estimasi: '2026-07-08', foto: [], catatan: '', riwayat: [
        { stage: 'Menunggu Dijemput', timestamp: '2026-07-05T13:00:00', by: 'Sari Dewi' },
        { stage: 'Dijemput', timestamp: '2026-07-05T14:20:00', by: 'Sari Dewi' },
        { stage: 'Diterima', timestamp: '2026-07-05T15:00:00', by: 'Sari Dewi' },
      ]},
    ],
  },
  {
    id: 'trx5', kode: 'TRX-0508', pelanggan: 'Melati Suci', hp: '0819-5555-6666',
    tanggal: '2026-07-04', metode: 'jemput-antar', alamatJemput: 'Jl. Anggrek No. 7, Bandung',
    jadwalJemput: '4 Jul 2026, 09.00', statusBayar: 'Lunas', metodeBayar: 'Cash',
    biayaJemputAntar: 15000, createdBy: 'u3',
    sepatu: [
      { id: 'shoe8', tracking: 'RCS-1028', jenis: 'Converse Chuck Taylor', treatment: 'Fast Cleaning', addons: [], harga: 25000, stage: 7, stages: STAGES_JEMPUT_ANTAR, estimasi: '2026-07-06', foto: [], catatan: '', riwayat: [
        { stage: 'Menunggu Dijemput', timestamp: '2026-07-04T08:00:00', by: 'Yusuf Hamdi' },
        { stage: 'Dijemput', timestamp: '2026-07-04T09:10:00', by: 'Yusuf Hamdi' },
        { stage: 'Diterima', timestamp: '2026-07-04T10:00:00', by: 'Yusuf Hamdi' },
        { stage: 'Proses Pencucian', timestamp: '2026-07-04T11:00:00', by: 'Rian Saputra' },
        { stage: 'Finishing', timestamp: '2026-07-04T15:00:00', by: 'Rian Saputra' },
        { stage: 'QC', timestamp: '2026-07-05T08:00:00', by: 'Rian Saputra' },
        { stage: 'Siap Diambil', timestamp: '2026-07-05T09:00:00', by: 'Rian Saputra' },
      ]},
    ],
  },
];

export const SEED_EXPENSES = [
  { id: 'e1', tanggal: '2026-07-05', kategori: 'Deterjen', jumlah: 350000, catatan: 'Restock bulanan', bukti: null },
  { id: 'e2', tanggal: '2026-07-03', kategori: 'Listrik', jumlah: 820000, catatan: 'Tagihan Juni', bukti: null },
  { id: 'e3', tanggal: '2026-07-01', kategori: 'Gaji', jumlah: 6500000, catatan: 'Gaji staff Juni', bukti: null },
  { id: 'e4', tanggal: '2026-06-28', kategori: 'Sewa', jumlah: 3000000, catatan: 'Sewa outlet Juli', bukti: null },
];

export const SEED_FEEDBACKS = [
  { id: 'f1', nama: 'Dhea R.', rating: 5, komentar: 'Air Force putih balik cerah, mantap.', tanggal: '2026-07-06', noStruk: 'TRX-0512', verified: true, tampilWeb: true, status: 'Ditinjau' },
  { id: 'f2', nama: 'Bagas P.', rating: 5, komentar: 'Jemput-antar tepat waktu terus.', tanggal: '2026-07-05', noStruk: 'TRX-0511', verified: true, tampilWeb: true, status: 'Ditinjau' },
  { id: 'f3', nama: 'Anonim', rating: 3, komentar: 'Agak lama dari estimasi awal.', tanggal: '2026-07-04', noStruk: '', verified: false, tampilWeb: false, status: 'Belum Ditinjau' },
  { id: 'f4', nama: 'Nadia W.', rating: 4, komentar: 'Deep cleaning bersih sampai sela jahitan.', tanggal: '2026-07-03', noStruk: 'TRX-0510', verified: true, tampilWeb: true, status: 'Ditinjau' },
];

export const SEED_FAQ = [
  { id: 'faq1', pertanyaan: 'Berapa lama proses pencuciannya?', jawaban: 'Estimasi pengerjaan 2–3 hari kerja tergantung jenis layanan dan antrian. Bisa dipercepat dengan add-on Express.', tampilWeb: true },
  { id: 'faq2', pertanyaan: 'Apakah warna sepatu bisa berubah/pudar setelah dicuci?', jawaban: 'Metode cuci disesuaikan dengan jenis bahan — kanvas, kulit, atau suede — untuk meminimalkan risiko warna pudar. Untuk bahan sensitif, kami sarankan add-on Leather/Suede Care.', tampilWeb: true },
  { id: 'faq3', pertanyaan: 'Bagaimana cara cek status sepatu saya?', jawaban: 'Gunakan "Lacak Sepatu Saya" di halaman ini, masukkan nomor struk atau nomor HP yang kamu daftarkan saat transaksi.', tampilWeb: true },
  { id: 'faq4', pertanyaan: 'Apa bedanya Fast Cleaning dan Deep Cleaning?', jawaban: 'Fast Cleaning untuk perawatan rutin dan noda ringan. Deep Cleaning membersihkan lebih menyeluruh, termasuk sela-sela sulit dan noda membandel.', tampilWeb: true },
  { id: 'faq5', pertanyaan: 'Metode pembayaran apa saja yang diterima?', jawaban: 'Cash, transfer bank, dan QRIS manual.', tampilWeb: true },
  { id: 'faq6', pertanyaan: 'Apakah bisa titip sepatu tanpa datang langsung (jemput-antar)?', jawaban: 'Bisa — pilih opsi Jemput-Antar saat order, tim kami akan menjemput sepatu ke alamatmu dan mengantarkannya kembali setelah selesai.', tampilWeb: true },
  { id: 'faq7', pertanyaan: 'Apakah Whitening dan Unyellowing bisa dipesan terpisah?', jawaban: 'Bisa, keduanya tersedia sebagai layanan individual — atau ambil sebagai Package Deal dengan harga lebih hemat jika dipesan bersamaan.', tampilWeb: true },
];

export const SEED_TOKO = {
  nama: 'Rumah Cuci Sepatu',
  alamat: 'Jl. Kemuning Raya No. 18, Bandung, Jawa Barat',
  noWA: '0812-3456-7890',
  linkMaps: 'https://maps.google.com/',
  jamOperasional: [
    { hari: 'Senin–Jumat', buka: '08.00', tutup: '20.00' },
    { hari: 'Sabtu–Minggu', buka: '09.00', tutup: '18.00' },
  ],
};

export const EXPENSE_CATEGORIES = ['Deterjen', 'Listrik', 'Sewa', 'Gaji', 'Peralatan', 'Lainnya'];
export const SHOE_TYPES = ['Sneaker', 'Sepatu Bot', 'Sepatu Kulit', 'Sepatu Suede', 'Tas Kecil', 'Tas Sedang', 'Tas Besar'];
export const PAYMENT_METHODS = ['Cash', 'Transfer', 'QRIS'];
export const PAYMENT_STATUS = ['Lunas', 'DP', 'Belum Bayar'];
