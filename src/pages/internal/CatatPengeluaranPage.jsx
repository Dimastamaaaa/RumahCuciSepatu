import { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { fmtRp, fmtDate } from '../../utils/helpers';
import { Wallet, TrendingDown, Trash2, Plus, Calendar, Tag, FileText, CheckCircle2 } from 'lucide-react';

export default function CatatPengeluaranPage() {
  const { expenses, addExpense, deleteExpense } = useApp();
  const [form, setForm] = useState({ tanggal: new Date().toISOString().split('T')[0], kategori: '', jumlah: '', catatan: '' });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (!form.jumlah || !form.kategori) return;
    addExpense({ ...form, jumlah: Number(form.jumlah) });
    setForm({ tanggal: new Date().toISOString().split('T')[0], kategori: '', jumlah: '', catatan: '' });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const totalBulanIni = useMemo(() => {
    const now = new Date();
    const currMonth = now.getMonth();
    const currYear = now.getFullYear();
    return expenses.filter(e => {
      const d = new Date(e.tanggal);
      return d.getMonth() === currMonth && d.getFullYear() === currYear;
    }).reduce((acc, curr) => acc + curr.jumlah, 0);
  }, [expenses]);

  return (
    <>
      <div className="page-head" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 14 }}>
        <div style={{ background: 'rgba(231, 76, 60, 0.1)', padding: 12, borderRadius: 12, color: '#E74C3C' }}>
          <Wallet size={24} />
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: 22 }}>Catat Pengeluaran</h1>
          <div className="sub" style={{ marginTop: 4 }}>Kelola arus kas keluar untuk Laporan Profit</div>
        </div>
      </div>

      <div className="grid g2" style={{ gridTemplateColumns: '1fr 1.5fr', alignItems: 'start' }}>
        <div className="card" style={{ padding: 24, position: 'sticky', top: 90 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Plus size={18} /> Tambah Data
          </h3>
          <div className="form-grid full">
            <div className="field">
              <label>Tanggal</label>
              <div style={{ position: 'relative' }}>
                <input type="date" style={{ paddingLeft: 36 }} value={form.tanggal} onChange={e => setForm(p => ({ ...p, tanggal: e.target.value }))} />
                <Calendar size={16} style={{ position: 'absolute', left: 12, top: 11, color: 'var(--ink-soft)' }} />
              </div>
            </div>
            <div className="field">
              <label>Kategori (Teks Bebas)</label>
              <div style={{ position: 'relative' }}>
                <input type="text" placeholder="mis. Listrik, Gaji, dll" style={{ paddingLeft: 36 }} value={form.kategori} onChange={e => setForm(p => ({ ...p, kategori: e.target.value }))} />
                <Tag size={16} style={{ position: 'absolute', left: 12, top: 11, color: 'var(--ink-soft)' }} />
              </div>
            </div>
            <div className="field">
              <label>Jumlah (Rp)</label>
              <div style={{ position: 'relative' }}>
                <input type="number" placeholder="0" style={{ paddingLeft: 36 }} value={form.jumlah} onChange={e => setForm(p => ({ ...p, jumlah: e.target.value }))} />
                <span style={{ position: 'absolute', left: 12, top: 11, fontSize: 14, fontWeight: 600, color: 'var(--ink-soft)' }}>Rp</span>
              </div>
            </div>
            <div className="field">
              <label>Catatan Opsional</label>
              <div style={{ position: 'relative' }}>
                <textarea rows="2" placeholder="Keterangan tambahan..." style={{ paddingLeft: 36, paddingTop: 10 }} value={form.catatan} onChange={e => setForm(p => ({ ...p, catatan: e.target.value }))} />
                <FileText size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--ink-soft)' }} />
              </div>
            </div>
          </div>
          
          <button className="btn btn-primary" style={{ marginTop: 24, width: '100%', justifyContent: 'center' }} onClick={handleSave}>
            Simpan Pengeluaran
          </button>
          
          {saved && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 14, fontSize: 13, color: '#25D366', fontWeight: 600 }}>
              <CheckCircle2 size={16} /> Pengeluaran berhasil disimpan!
            </div>
          )}
        </div>

        <div>
          <div className="card" style={{ padding: 24, marginBottom: 20, background: 'linear-gradient(135deg, #2C3E50 0%, #1A252F 100%)', color: '#fff', border: 'none' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <div>
                 <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 4, fontWeight: 500, letterSpacing: '0.02em' }}>TOTAL PENGELUARAN (BULAN INI)</div>
                 <div className="mono" style={{ fontSize: 32, fontWeight: 700 }}>{fmtRp(totalBulanIni)}</div>
               </div>
               <div style={{ background: 'rgba(255,255,255,0.1)', padding: 16, borderRadius: '50%' }}>
                 <TrendingDown size={32} style={{ color: '#E74C3C' }} />
               </div>
             </div>
          </div>
          
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Riwayat Pengeluaran</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {expenses.length === 0 ? (
                <div className="empty-state" style={{ padding: '40px 20px' }}>
                  <TrendingDown size={32} style={{ color: 'var(--line)', marginBottom: 12, margin: '0 auto' }} />
                  <div style={{ fontWeight: 600 }}>Belum ada pengeluaran</div>
                  <div style={{ fontSize: 13, color: 'var(--ink-soft)' }}>Pengeluaran yang Anda catat akan muncul di sini.</div>
                </div>
              ) : (
                [...expenses].sort((a,b) => new Date(b.tanggal) - new Date(a.tanggal)).map(e => (
                  <div key={e.id} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: 16, border: '1px solid var(--line-soft)', borderRadius: 12, transition: 'all 0.2s' }}>
                    <div style={{ display: 'flex', gap: 14 }}>
                      <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'var(--canvas-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-soft)' }}>
                        <TrendingDown size={20} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 15, textTransform: 'capitalize' }}>{e.kategori}</div>
                        <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Calendar size={12} /> {fmtDate(e.tanggal)}
                        </div>
                        {e.catatan && (
                          <div style={{ fontSize: 13, color: 'var(--ink-soft)', marginTop: 8, padding: '6px 10px', background: 'var(--canvas-alt)', borderRadius: 6 }}>
                            {e.catatan}
                          </div>
                        )}
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                      <div className="mono" style={{ fontWeight: 700, fontSize: 15, color: '#E74C3C' }}>- {fmtRp(e.jumlah)}</div>
                      <button className="btn btn-text" style={{ padding: '6px 8px', color: 'var(--ink-soft)', fontSize: 12 }} onClick={() => deleteExpense(e.id)}>
                        <Trash2 size={14} /> Hapus
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
