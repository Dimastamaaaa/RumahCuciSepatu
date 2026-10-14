import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { 
  SEED_USERS, 
  SEED_SERVICES, 
  SEED_TRANSACTIONS, 
  SEED_EXPENSES, 
  SEED_FEEDBACKS, 
  SEED_FAQ, 
  SEED_TOKO,
  STAGES_STANDARD, 
  STAGES_JEMPUT_ANTAR 
} from '../data/seedData';

const AppContext = createContext(null);

// ==========================================
// MAPPERS: Supabase snake_case <-> React camelCase
// ==========================================

const mapServiceToFE = (db) => ({
  ...db,
  tampil_di_web: db.tampil_web !== undefined ? db.tampil_web : (db.tampil_di_web !== undefined ? db.tampil_di_web : true)
});

const mapTransactionToFE = (db) => ({
  ...db,
  alamatJemput: db.alamat_jemput !== undefined ? db.alamat_jemput : db.alamatJemput,
  alamatAntar: db.alamat_antar !== undefined ? db.alamat_antar : db.alamatAntar,
  jadwalJemput: db.jadwal_jemput !== undefined ? db.jadwal_jemput : db.jadwalJemput,
  statusBayar: db.status_bayar !== undefined ? db.status_bayar : db.statusBayar,
  metodeBayar: db.metode_bayar !== undefined ? db.metode_bayar : db.metodeBayar,
  biayaJemputAntar: db.biaya_jemput_antar !== undefined ? db.biaya_jemput_antar : (db.biayaJemputAntar || 0),
  createdBy: db.created_by !== undefined ? db.created_by : db.createdBy
});

const mapShoeToFE = (db) => ({
  ...db,
  estimasi: db.estimasi,
  fotoAwal: db.foto_awal || db.fotoAwal || null,
  fotoAkhir: db.foto_akhir || db.fotoAkhir || null
});

const mapFeedbackToFE = (db) => ({
  ...db,
  noStruk: db.no_struk !== undefined ? db.no_struk : (db.noStruk || ''),
  tampilWeb: db.tampil_web !== undefined ? db.tampil_web : (db.tampilWeb !== undefined ? db.tampilWeb : true)
});

const mapFaqToFE = (db) => ({
  ...db,
  tampilWeb: db.tampil_web !== undefined ? db.tampil_web : (db.tampilWeb !== undefined ? db.tampilWeb : true)
});

const mapTokoToFE = (db) => {
  if (!db) return SEED_TOKO;
  return {
    ...db,
    nama: db.nama_toko || db.nama || SEED_TOKO.nama,
    noWA: db.wa || db.noWA || SEED_TOKO.noWA,
    linkMaps: db.map_link || db.linkMaps || SEED_TOKO.linkMaps,
    jamOperasional: db.jamOperasional || [
      { hari: 'Setiap Hari', buka: db.jam_buka || '09:00', tutup: db.jam_tutup || '21:00' }
    ]
  };
};

const SEED_SHOES = SEED_TRANSACTIONS.flatMap(t =>
  (t.sepatu || []).map(s => ({
    ...s,
    trx_id: t.id,
    fotoAwal: s.fotoAwal || null,
    fotoAkhir: s.fotoAkhir || null
  }))
);

const loadStorage = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    const parsed = JSON.parse(item);
    if (Array.isArray(fallback) && Array.isArray(parsed) && parsed.length === 0) {
      return fallback;
    }
    return parsed;
  } catch {
    return fallback;
  }
};

const saveStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Error saving ${key} to localStorage:`, err);
  }
};

export function AppProvider({ children }) {
  const [users, setUsers] = useState(() => loadStorage('rcs_users', SEED_USERS));
  const [services, setServices] = useState(() => loadStorage('rcs_services', SEED_SERVICES));
  const [transactions, setTransactions] = useState(() => loadStorage('rcs_transactions', SEED_TRANSACTIONS));
  const [shoes, setShoes] = useState(() => loadStorage('rcs_shoes', SEED_SHOES));
  const [expenses, setExpenses] = useState(() => loadStorage('rcs_expenses', SEED_EXPENSES));
  const [feedbacks, setFeedbacks] = useState(() => loadStorage('rcs_feedbacks', SEED_FEEDBACKS));
  const [faq, setFaq] = useState(() => loadStorage('rcs_faq', SEED_FAQ));
  const [toko, setToko] = useState(() => loadStorage('rcs_toko', SEED_TOKO));
  
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem('rcs_currentUser');
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });
  
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem('rcs_theme') || 'system';
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => { localStorage.setItem('rcs_theme', theme); }, [theme]);
  useEffect(() => { localStorage.setItem('rcs_currentUser', JSON.stringify(currentUser)); }, [currentUser]);

  useEffect(() => { saveStorage('rcs_users', users); }, [users]);
  useEffect(() => { saveStorage('rcs_services', services); }, [services]);
  useEffect(() => { saveStorage('rcs_transactions', transactions); }, [transactions]);
  useEffect(() => { saveStorage('rcs_shoes', shoes); }, [shoes]);
  useEffect(() => { saveStorage('rcs_expenses', expenses); }, [expenses]);
  useEffect(() => { saveStorage('rcs_feedbacks', feedbacks); }, [feedbacks]);
  useEffect(() => { saveStorage('rcs_faq', faq); }, [faq]);
  useEffect(() => { saveStorage('rcs_toko', toko); }, [toko]);

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

  // Initial Fetch from Supabase (with fallback to seed data)
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [u, s, t, sh, e, f, fq, tk] = await Promise.allSettled([
          supabase.from('users').select('*').order('created_at', { ascending: true }),
          supabase.from('services').select('*').order('created_at', { ascending: true }),
          supabase.from('transactions').select('*').order('created_at', { ascending: false }),
          supabase.from('shoes').select('*').order('created_at', { ascending: true }),
          supabase.from('expenses').select('*').order('created_at', { ascending: false }),
          supabase.from('feedbacks').select('*').order('created_at', { ascending: false }),
          supabase.from('faqs').select('*').order('created_at', { ascending: true }),
          supabase.from('toko_settings').select('*').limit(1).single()
        ]);
        
        if (u.status === 'fulfilled' && u.value?.data && u.value.data.length > 0) setUsers(u.value.data);
        if (s.status === 'fulfilled' && s.value?.data && s.value.data.length > 0) setServices(s.value.data.map(mapServiceToFE));
        if (t.status === 'fulfilled' && t.value?.data && t.value.data.length > 0) setTransactions(t.value.data.map(mapTransactionToFE));
        if (sh.status === 'fulfilled' && sh.value?.data && sh.value.data.length > 0) setShoes(sh.value.data.map(mapShoeToFE));
        if (e.status === 'fulfilled' && e.value?.data && e.value.data.length > 0) setExpenses(e.value.data);
        if (f.status === 'fulfilled' && f.value?.data && f.value.data.length > 0) setFeedbacks(f.value.data.map(mapFeedbackToFE));
        if (fq.status === 'fulfilled' && fq.value?.data && fq.value.data.length > 0) setFaq(fq.value.data.map(mapFaqToFE));
        if (tk.status === 'fulfilled' && tk.value?.data && tk.value.data.id) setToko(mapTokoToFE(tk.value.data));
      } catch (err) {
        console.warn('Supabase offline or unreachable, using local seed data:', err);
      }
    };
    fetchAll();
  }, []);

  // Auth
  const login = async (username, password) => {
    try {
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
    } catch (e) {
      console.warn('Supabase login error, checking local users:', e);
    }
    const localUser = users.find(u => u.username === username && u.password === password && u.status);
    if (localUser) {
      setCurrentUser(localUser);
      return localUser;
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
    const newTrxId = 'trx_' + Date.now();
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

    let savedTrx = { id: newTrxId, ...trxData };
    try {
      const { data: newTrx, error } = await supabase.from('transactions').insert([trxData]).select().single();
      if (!error && newTrx) savedTrx = newTrx;
    } catch (err) {
      console.warn('Supabase offline, saving transaction locally:', err);
    }

    const stages = data.metode === 'jemput-antar' ? STAGES_JEMPUT_ANTAR : STAGES_STANDARD;
    const trackBase = generateTrackingCode();
    const baseNum = parseInt(trackBase.replace('RCS-', ''), 10) || 1;

    const newShoes = data.sepatu.map((s, i) => {
      const trackingCode = `RCS-${(baseNum + i).toString().padStart(4, '0')}`;
      return {
        id: 'shoe_' + Date.now() + '_' + i,
        trx_id: savedTrx.id,
        jenis: s.jenis,
        treatment: s.treatment,
        harga: s.harga || 0,
        estimasi: s.estimasi || new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
        addons: s.addons || [],
        tracking: trackingCode,
        stage: 1,
        stages: stages,
        riwayat: [{ stage: stages[0], timestamp: new Date().toISOString(), by: currentUser?.nama || 'System' }],
        fotoAwal: s.fotoAwal || null,
        fotoAkhir: null,
        catatan: ''
      };
    });

    try {
      const shoeDbPayload = newShoes.map(s => ({
        trx_id: savedTrx.id,
        jenis: s.jenis,
        treatment: s.treatment,
        harga: s.harga,
        estimasi: s.estimasi,
        addons: s.addons,
        tracking: s.tracking,
        stage: s.stage,
        stages: s.stages,
        riwayat: s.riwayat,
        foto_awal: s.fotoAwal,
        catatan: s.catatan
      }));
      await supabase.from('shoes').insert(shoeDbPayload);
    } catch (err) {
      console.warn('Supabase offline, saving shoes locally:', err);
    }

    const feTrx = mapTransactionToFE(savedTrx);
    setTransactions(prev => [feTrx, ...prev]);
    setShoes(prev => [...newShoes, ...prev]);
    return { ...feTrx, sepatu: newShoes };
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
    
    try {
      await supabase.from('shoes').update(updatePayload).eq('id', shoeId);
    } catch (err) {
      console.warn('Supabase offline, updating stage locally:', err);
    }

    setShoes(prev => prev.map(s => s.id === shoeId ? {
      ...s,
      stage: newStageIndex + 1,
      riwayat: newRiwayat,
      ...(optionalFotoAkhir ? { fotoAkhir: optionalFotoAkhir } : {})
    } : s));
    alert('Status sepatu berhasil diupdate!');
  };

  // Tracking Search
  const searchTracking = (query) => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    
    const mappedTransactions = transactions.map(t => ({
      ...t,
      sepatu: (t.sepatu && t.sepatu.length > 0) ? t.sepatu : shoes.filter(s => s.trx_id === t.id)
    }));

    const byKode = mappedTransactions.filter(t => t.kode?.toLowerCase().includes(q));
    if (byKode.length > 0) return byKode;
    const byTracking = mappedTransactions.filter(t => (t.sepatu || []).some(s => s.tracking?.toLowerCase().includes(q)));
    if (byTracking.length > 0) return byTracking;
    const byHP = mappedTransactions.filter(t => t.hp && t.hp.replace(/-/g, '').includes(q.replace(/-/g, '')));
    if (byHP.length > 0) return byHP;
    return mappedTransactions.filter(t => t.pelanggan?.toLowerCase().includes(q));
  };

  const getJoinedTransactions = useCallback(() => {
    return transactions.map(t => ({
      ...t,
      sepatu: (t.sepatu && t.sepatu.length > 0) ? t.sepatu : shoes.filter(s => s.trx_id === t.id)
    }));
  }, [transactions, shoes]);

  // Services
  const addService = async (data) => {
    const newId = 's_' + Date.now();
    const newS = { id: newId, ...data, tampil_di_web: data.tampil_di_web !== undefined ? data.tampil_di_web : true };
    try {
      const dbData = {
        kategori: data.kategori, nama: data.nama, harga: data.harga, catatan: data.catatan, tampil_web: data.tampil_di_web
      };
      const { data: dbRes, error } = await supabase.from('services').insert([dbData]).select().single();
      if (!error && dbRes) {
        setServices(prev => [...prev, mapServiceToFE(dbRes)]);
        alert('Layanan baru berhasil ditambahkan!');
        return mapServiceToFE(dbRes);
      }
    } catch (e) {
      console.warn('Supabase offline, saving service locally:', e);
    }
    setServices(prev => [...prev, newS]);
    alert('Layanan baru berhasil ditambahkan!');
    return newS;
  };

  const updateService = async (id, data) => {
    try {
      const dbData = {
        kategori: data.kategori, nama: data.nama, harga: data.harga, catatan: data.catatan, tampil_web: data.tampil_di_web
      };
      await supabase.from('services').update(dbData).eq('id', id);
    } catch (e) {
      console.warn('Supabase offline, updating service locally:', e);
    }
    setServices(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
    alert('Layanan berhasil diperbarui!');
  };

  const deleteService = async (id) => {
    try {
      await supabase.from('services').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase offline, deleting service locally:', e);
    }
    setServices(prev => prev.filter(s => s.id !== id));
    alert('Layanan berhasil dihapus!');
  };

  // Expenses
  const addExpense = async (data) => {
    const newId = 'e_' + Date.now();
    const newE = { id: newId, ...data };
    try {
      const { data: dbRes, error } = await supabase.from('expenses').insert([data]).select().single();
      if (!error && dbRes) {
        setExpenses(prev => [dbRes, ...prev]);
        alert('Pengeluaran berhasil dicatat!');
        return dbRes;
      }
    } catch (e) {
      console.warn('Supabase offline, saving expense locally:', e);
    }
    setExpenses(prev => [newE, ...prev]);
    alert('Pengeluaran berhasil dicatat!');
    return newE;
  };

  const deleteExpense = async (id) => {
    try {
      await supabase.from('expenses').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase offline, deleting expense locally:', e);
    }
    setExpenses(prev => prev.filter(e => e.id !== id));
    alert('Pengeluaran berhasil dihapus!');
  };

  // Toko
  const updateToko = async (data) => {
    const updated = {
      ...toko,
      ...data,
      nama: data.nama || data.nama_toko || toko.nama,
      noWA: data.noWA || data.wa || toko.noWA,
      linkMaps: data.linkMaps || data.map_link || toko.linkMaps,
      jamOperasional: data.jamOperasional || toko.jamOperasional
    };
    try {
      const dbData = {
        nama_toko: updated.nama,
        alamat: updated.alamat,
        wa: updated.noWA,
        map_link: updated.linkMaps,
        jam_buka: updated.jamOperasional?.[0]?.buka,
        jam_tutup: updated.jamOperasional?.[0]?.tutup,
        instagram: updated.instagram
      };
      await supabase.from('toko_settings').update(dbData).eq('id', toko?.id);
    } catch (e) {
      console.warn('Supabase offline, saving toko locally:', e);
    }
    setToko(updated);
    alert('Pengaturan toko berhasil diperbarui!');
  };

  // Feedback
  const addFeedback = async (data) => {
    const newId = 'f_' + Date.now();
    const newF = {
      id: newId,
      nama: data.nama || 'Anonim',
      noStruk: data.noStruk || '',
      rating: data.rating,
      komentar: data.komentar || '',
      status: data.status || 'Belum Ditinjau',
      tampilWeb: data.tampilWeb || false,
      tanggal: new Date().toISOString().split('T')[0]
    };
    try {
      const dbData = {
        nama: newF.nama,
        no_struk: newF.noStruk,
        rating: newF.rating,
        komentar: newF.komentar,
        status: newF.status,
        tampil_web: newF.tampilWeb
      };
      const { data: dbRes } = await supabase.from('feedbacks').insert([dbData]).select().single();
      if (dbRes) {
        setFeedbacks(prev => [mapFeedbackToFE(dbRes), ...prev]);
        return mapFeedbackToFE(dbRes);
      }
    } catch (e) {
      console.warn('Supabase offline, saving feedback locally:', e);
    }
    setFeedbacks(prev => [newF, ...prev]);
    return newF;
  };

  const updateFeedback = async (id, data) => {
    try {
      const dbData = {
        status: data.status,
        tampil_web: data.tampilWeb
      };
      await supabase.from('feedbacks').update(dbData).eq('id', id);
    } catch (e) {
      console.warn('Supabase offline, updating feedback locally:', e);
    }
    setFeedbacks(prev => prev.map(f => f.id === id ? { ...f, ...data } : f));
    alert('Status feedback berhasil diperbarui!');
  };

  // FAQ
  const addFAQ = async (data) => {
    const newId = 'faq_' + Date.now();
    const newF = { id: newId, pertanyaan: data.pertanyaan, jawaban: data.jawaban, tampilWeb: data.tampilWeb !== undefined ? data.tampilWeb : true };
    try {
      const dbData = { pertanyaan: data.pertanyaan, jawaban: data.jawaban, tampil_web: data.tampilWeb };
      const { data: dbRes, error } = await supabase.from('faqs').insert([dbData]).select().single();
      if (!error && dbRes) {
        setFaq(prev => [...prev, mapFaqToFE(dbRes)]);
        alert('FAQ baru berhasil ditambahkan!');
        return mapFaqToFE(dbRes);
      }
    } catch (e) {
      console.warn('Supabase offline, saving FAQ locally:', e);
    }
    setFaq(prev => [...prev, newF]);
    alert('FAQ baru berhasil ditambahkan!');
    return newF;
  };

  const updateFAQ = async (id, data) => {
    try {
      const dbData = { pertanyaan: data.pertanyaan, jawaban: data.jawaban, tampil_web: data.tampilWeb };
      await supabase.from('faqs').update(dbData).eq('id', id);
    } catch (e) {
      console.warn('Supabase offline, updating FAQ locally:', e);
    }
    setFaq(prev => prev.map(f => f.id === id ? { ...f, ...data } : f));
    alert('FAQ berhasil diperbarui!');
  };

  const deleteFAQ = async (id) => {
    try {
      await supabase.from('faqs').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase offline, deleting FAQ locally:', e);
    }
    setFaq(prev => prev.filter(f => f.id !== id));
    alert('FAQ berhasil dihapus!');
  };

  // Staff
  const addUser = async (data) => {
    const newId = 'u_' + Date.now();
    const newU = { id: newId, ...data };
    try {
      const { data: dbRes, error } = await supabase.from('users').insert([data]).select().single();
      if (!error && dbRes) {
        setUsers(prev => [...prev, dbRes]);
        alert('Staf/Kasir baru berhasil ditambahkan!');
        return dbRes;
      }
    } catch (e) {
      console.warn('Supabase offline, adding user locally:', e);
    }
    setUsers(prev => [...prev, newU]);
    alert('Staf/Kasir baru berhasil ditambahkan!');
    return newU;
  };

  const updateUser = async (id, data) => {
    try {
      await supabase.from('users').update(data).eq('id', id);
    } catch (e) {
      console.warn('Supabase offline, updating user locally:', e);
    }
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...data } : u));
    if (currentUser?.id === id) {
      setCurrentUser(prev => ({ ...prev, ...data }));
    }
    alert('Data profil berhasil diperbarui!');
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
