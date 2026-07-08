import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { STAGES_STANDARD, STAGES_JEMPUT_ANTAR } from '../data/seedData';

const AppContext = createContext(null);

// ==========================================
// MAPPERS: Supabase snake_case <-> React camelCase
// ==========================================

const mapServiceToFE = (db) => ({
  ...db,
  tampil_di_web: db.tampil_web
});

const mapTransactionToFE = (db) => ({
  ...db,
  alamatJemput: db.alamat_jemput,
  alamatAntar: db.alamat_antar,
  jadwalJemput: db.jadwal_jemput,
  statusBayar: db.status_bayar,
  metodeBayar: db.metode_bayar,
  biayaJemputAntar: db.biaya_jemput_antar,
  createdBy: db.created_by
});

const mapShoeToFE = (db) => ({
  ...db,
  estimasi: db.estimasi,
  fotoAwal: db.foto_awal,
  fotoAkhir: db.foto_akhir
});

const mapFeedbackToFE = (db) => ({
  ...db,
  noStruk: db.no_struk,
  tampilWeb: db.tampil_web
});

const mapFaqToFE = (db) => ({
  ...db,
  tampilWeb: db.tampil_web
});

const mapTokoToFE = (db) => {
  if (!db || !db.id) return {};
  return {
    ...db,
    nama: db.nama_toko,
    noWA: db.wa,
    linkMaps: db.map_link,
    jamOperasional: [
      { hari: 'Setiap Hari', buka: db.jam_buka || '09:00', tutup: db.jam_tutup || '21:00' }
    ]
  };
};

export function AppProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [services, setServices] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [shoes, setShoes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [faq, setFaq] = useState([]);
  const [toko, setToko] = useState({});
  
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem('rcs_currentUser');
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });
  
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem('rcs_theme') || 'system';
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => { localStorage.setItem('rcs_theme', theme); }, [theme]);
  useEffect(() => { localStorage.setItem('rcs_currentUser', JSON.stringify(currentUser)); }, [currentUser]);

  // Theme
  const setTheme = useCallback((t) => {
    setThemeState(t);
    if (t === 'dark') document.body.classList.add('dark');
    else if (t === 'light') document.body.classList.remove('dark');
    else {
      const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
      document.body.classList.toggle('dark', prefersDark);
    }
  }, []);

  useEffect(() => { setTheme(theme); }, [theme, setTheme]);

  // Initial Fetch
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [u, s, t, sh, e, f, fq, tk] = await Promise.all([
          supabase.from('users').select('*').order('created_at', { ascending: true }),
          supabase.from('services').select('*').order('created_at', { ascending: true }),
          supabase.from('transactions').select('*').order('created_at', { ascending: false }),
          supabase.from('shoes').select('*').order('created_at', { ascending: true }),
          supabase.from('expenses').select('*').order('created_at', { ascending: false }),
          supabase.from('feedbacks').select('*').order('created_at', { ascending: false }),
          supabase.from('faqs').select('*').order('created_at', { ascending: true }),
          supabase.from('toko_settings').select('*').limit(1).single()
        ]);
        
        if (u.data) setUsers(u.data);
        if (s.data) setServices(s.data.map(mapServiceToFE));
        if (t.data) setTransactions(t.data.map(mapTransactionToFE));
        if (sh.data) setShoes(sh.data.map(mapShoeToFE));
        if (e.data) setExpenses(e.data);
        if (f.data) setFeedbacks(f.data.map(mapFeedbackToFE));
        if (fq.data) setFaq(fq.data.map(mapFaqToFE));
        if (tk.data) setToko(mapTokoToFE(tk.data));
      } catch (err) {
        console.error('Error fetching data:', err);
      }
      setLoading(false);
    };
    fetchAll();
  }, []);

  // Auth
  const login = async (username, password) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .eq('password', password)
      .eq('status', true)
      .single();
    if (data && !error) {
      setCurrentUser(data);
      return data;
    }
    return null;
  };

  const logout = () => setCurrentUser(null);

  // Generate unique codes (Fallback lokal untuk UX cepat)
  const generateTrxCode = useCallback(() => {
    const nums = transactions.map(t => parseInt(t.kode.replace('TRX-', ''), 10)).filter(n => !isNaN(n));
    const next = nums.length > 0 ? Math.max(...nums) + 1 : 1;
    return `TRX-${next.toString().padStart(4, '0')}`;
  }, [transactions]);

  const generateTrackingCode = useCallback(() => {
    const nums = shoes.map(s => parseInt(s.tracking.replace('RCS-', ''), 10)).filter(n => !isNaN(n));
    const next = nums.length > 0 ? Math.max(...nums) + 1 : 1;
    return `RCS-${next.toString().padStart(4, '0')}`;
  }, [shoes]);

  // Transactions
  const addTransaction = async (data) => {
    const kode = generateTrxCode();
    const trxData = {
      kode,
      pelanggan: data.pelanggan,
      hp: data.hp,
      tanggal: new Date().toISOString().split('T')[0],
      metode: data.metode,
      alamat_jemput: data.alamatJemput || null,
      alamat_antar: data.alamatAntar || null,
      jadwal_jemput: data.jadwalJemput || null,
      status_bayar: data.statusBayar,
      metode_bayar: data.metodeBayar || null,
      biaya_jemput_antar: data.metode === 'jemput-antar' ? 15000 : 0,
      created_by: currentUser?.id || null
    };

    const { data: newTrx, error } = await supabase.from('transactions').insert([trxData]).select().single();
    if (error || !newTrx) throw error;

    const shoePromises = data.sepatu.map((s, i) => {
      const trackBase = generateTrackingCode();
      const trackNum = parseInt(trackBase.replace('RCS-', ''), 10) + i;
      const stages = data.metode === 'jemput-antar' ? STAGES_JEMPUT_ANTAR : STAGES_STANDARD;
      return supabase.from('shoes').insert([{
        trx_id: newTrx.id,
        jenis: s.jenis,
        treatment: s.treatment,
        harga: s.harga || 0,
        estimasi: s.estimasi || new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
        addons: s.addons || [],
        tracking: `RCS-${trackNum.toString().padStart(4, '0')}`,
        stage: 1,
        stages: stages,
        riwayat: [{ stage: stages[0], timestamp: new Date().toISOString(), by: currentUser?.nama || 'System' }],
        foto_awal: s.fotoAwal || null,
        catatan: ''
      }]).select().single();
    });

    const res = await Promise.all(shoePromises);
    const newShoes = res.map(r => r.data);
    
    setTransactions([mapTransactionToFE(newTrx), ...transactions]);
    setShoes([...newShoes.map(mapShoeToFE), ...shoes]);
    return { ...mapTransactionToFE(newTrx), sepatu: newShoes.map(mapShoeToFE) };
  };

  const updateShoeStage = async (trxId, shoeId, newStageIndex, optionalFotoAkhir = null) => {
    const targetShoe = shoes.find(s => s.id === shoeId);
    if (!targetShoe) return;
    const stageName = targetShoe.stages[newStageIndex] || 'Selesai';
    const newRiwayat = [...targetShoe.riwayat, { stage: stageName, timestamp: new Date().toISOString(), by: currentUser?.nama || 'System' }];
    
    let updatePayload = { stage: newStageIndex + 1, riwayat: newRiwayat };
    if (optionalFotoAkhir) {
      updatePayload.foto_akhir = optionalFotoAkhir;
    }
    
    const { data, error } = await supabase.from('shoes').update(updatePayload).eq('id', shoeId).select().single();
    if (data && !error) {
      setShoes(shoes.map(s => s.id === shoeId ? mapShoeToFE(data) : s));
      alert('Status sepatu berhasil diupdate!');
    } else if (error) {
      alert('Gagal mengupdate status: ' + error.message);
    }
  };

  // Tracking Search
  const searchTracking = (query) => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    
    const mappedTransactions = transactions.map(t => ({
      ...t,
      sepatu: shoes.filter(s => s.trx_id === t.id)
    }));

    const byKode = mappedTransactions.filter(t => t.kode.toLowerCase().includes(q));
    if (byKode.length > 0) return byKode;
    const byTracking = mappedTransactions.filter(t => t.sepatu.some(s => s.tracking.toLowerCase().includes(q)));
    if (byTracking.length > 0) return byTracking;
    const byHP = mappedTransactions.filter(t => t.hp.replace(/-/g, '').includes(q.replace(/-/g, '')));
    if (byHP.length > 0) return byHP;
    return mappedTransactions.filter(t => t.pelanggan.toLowerCase().includes(q));
  };

  const getJoinedTransactions = useCallback(() => {
    return transactions.map(t => ({
      ...t,
      sepatu: shoes.filter(s => s.trx_id === t.id)
    }));
  }, [transactions, shoes]);

  // Services
  const addService = async (data) => {
    const dbData = {
      kategori: data.kategori, nama: data.nama, harga: data.harga, catatan: data.catatan, tampil_web: data.tampil_di_web
    };
    const { data: newS, error } = await supabase.from('services').insert([dbData]).select().single();
    if (newS && !error) {
      setServices([...services, mapServiceToFE(newS)]);
      alert('Layanan baru berhasil ditambahkan!');
    } else if (error) alert('Gagal menambah layanan: ' + error.message);
    return newS;
  };
  const updateService = async (id, data) => {
    const dbData = {
      kategori: data.kategori, nama: data.nama, harga: data.harga, catatan: data.catatan, tampil_web: data.tampil_di_web
    };
    const { data: upS, error } = await supabase.from('services').update(dbData).eq('id', id).select().single();
    if (upS && !error) {
      setServices(services.map(s => s.id === id ? mapServiceToFE(upS) : s));
      alert('Layanan berhasil diperbarui!');
    } else if (error) alert('Gagal memperbarui layanan: ' + error.message);
  };
  const deleteService = async (id) => {
    const { error } = await supabase.from('services').delete().eq('id', id);
    if (!error) {
      setServices(services.filter(s => s.id !== id));
      alert('Layanan berhasil dihapus!');
    } else alert('Gagal menghapus layanan: ' + error.message);
  };

  // Expenses
  const addExpense = async (data) => {
    const { data: newE, error } = await supabase.from('expenses').insert([data]).select().single();
    if (newE && !error) {
      setExpenses([newE, ...expenses]);
      alert('Pengeluaran berhasil dicatat!');
    } else if (error) alert('Gagal mencatat pengeluaran: ' + error.message);
    return newE;
  };
  const deleteExpense = async (id) => {
    const { error } = await supabase.from('expenses').delete().eq('id', id);
    if (!error) {
      setExpenses(expenses.filter(e => e.id !== id));
      alert('Pengeluaran berhasil dihapus!');
    } else alert('Gagal menghapus pengeluaran: ' + error.message);
  };

  // Toko
  const updateToko = async (data) => {
    const dbData = {
      nama_toko: data.nama || data.nama_toko,
      alamat: data.alamat,
      wa: data.noWA || data.wa,
      map_link: data.linkMaps || data.map_link,
      jam_buka: data.jamOperasional?.[0]?.buka || data.jam_buka,
      jam_tutup: data.jamOperasional?.[0]?.tutup || data.jam_tutup,
      instagram: data.instagram
    };
    const { data: upT, error } = await supabase.from('toko_settings').update(dbData).eq('id', toko?.id).select().single();
    if (error) {
      console.error('Update Toko Error:', error);
      alert('Gagal menyimpan pengaturan toko: ' + error.message);
    }
    if (upT) {
      setToko(mapTokoToFE(upT));
      alert('Pengaturan toko berhasil diperbarui di database!');
    }
  };

  // Feedback
  const addFeedback = async (data) => {
    const dbData = {
      nama: data.nama,
      no_struk: data.noStruk,
      rating: data.rating,
      komentar: data.komentar,
      status: data.status || 'Belum Ditinjau',
      tampil_web: data.tampilWeb || false
    };
    const { data: newF } = await supabase.from('feedbacks').insert([dbData]).select().single();
    if (newF) setFeedbacks([mapFeedbackToFE(newF), ...feedbacks]);
    return newF;
  };
  const updateFeedback = async (id, data) => {
    const dbData = {
      status: data.status,
      tampil_web: data.tampilWeb
    };
    const { data: upF, error } = await supabase.from('feedbacks').update(dbData).eq('id', id).select().single();
    if (upF && !error) {
      setFeedbacks(feedbacks.map(f => f.id === id ? mapFeedbackToFE(upF) : f));
      alert('Status feedback berhasil diperbarui!');
    } else if (error) alert('Gagal memperbarui feedback: ' + error.message);
  };

  // FAQ
  const addFAQ = async (data) => {
    const dbData = { pertanyaan: data.pertanyaan, jawaban: data.jawaban, tampil_web: data.tampilWeb };
    const { data: newF, error } = await supabase.from('faqs').insert([dbData]).select().single();
    if (newF && !error) {
      setFaq([...faq, mapFaqToFE(newF)]);
      alert('FAQ baru berhasil ditambahkan!');
    } else if (error) alert('Gagal menambah FAQ: ' + error.message);
    return newF;
  };
  const updateFAQ = async (id, data) => {
    const dbData = { pertanyaan: data.pertanyaan, jawaban: data.jawaban, tampil_web: data.tampilWeb };
    const { data: upF, error } = await supabase.from('faqs').update(dbData).eq('id', id).select().single();
    if (upF && !error) {
      setFaq(faq.map(f => f.id === id ? mapFaqToFE(upF) : f));
      alert('FAQ berhasil diperbarui!');
    } else if (error) alert('Gagal memperbarui FAQ: ' + error.message);
  };
  const deleteFAQ = async (id) => {
    const { error } = await supabase.from('faqs').delete().eq('id', id);
    if (!error) {
      setFaq(faq.filter(f => f.id !== id));
      alert('FAQ berhasil dihapus!');
    } else alert('Gagal menghapus FAQ: ' + error.message);
  };

  // Staff
  const addUser = async (data) => {
    const { data: newU, error } = await supabase.from('users').insert([data]).select().single();
    if (newU && !error) {
      setUsers([...users, newU]);
      alert('Staf/Kasir baru berhasil ditambahkan!');
    } else if (error) alert('Gagal menambah staf: ' + error.message);
    return newU;
  };
  const updateUser = async (id, data) => {
    const { data: upU, error } = await supabase.from('users').update(data).eq('id', id).select().single();
    if (upU && !error) {
      setUsers(users.map(u => u.id === id ? upU : u));
      if (currentUser?.id === id) setCurrentUser(upU);
      alert('Data profil berhasil diperbarui!');
    } else if (error) alert('Gagal memperbarui profil: ' + error.message);
  };

  const value = {
    users, services, transactions: getJoinedTransactions(), expenses, feedbacks, faq, toko,
    currentUser, theme, loading,
    login, logout, setTheme,
    addTransaction, updateShoeStage, searchTracking,
    generateTrxCode, generateTrackingCode,
    addExpense, deleteExpense,
    addService, updateService, deleteService,
    addUser, updateUser,
    addFeedback, updateFeedback,
    updateToko, updateFAQ, addFAQ, deleteFAQ,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
