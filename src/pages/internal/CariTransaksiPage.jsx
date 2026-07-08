import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { fmtDate, getProgressSummary, getTrxStatus } from '../../utils/helpers';
import { ShoppingBag, Printer, Search, ArrowRight, User, Plus } from 'lucide-react';

export default function CariTransaksiPage() {
  const { transactions } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [filterStatus, setFilterStatus] = useState('Semua');

  useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null) setSearch(q);
  }, [searchParams]);

  const filtered = useMemo(() => {
    return transactions.filter(t => {
      const q = search.toLowerCase();
      const matchSearch = !q || t.kode.toLowerCase().includes(q) || t.pelanggan.toLowerCase().includes(q) || t.hp.replace(/-/g, '').includes(q.replace(/-/g, '')) || t.sepatu.some(s => s.tracking.toLowerCase().includes(q));
      const status = getTrxStatus(t);
      const matchFilter = filterStatus === 'Semua' || (filterStatus === 'Selesai' && status === 'done') || (filterStatus === 'Proses' && status === 'progress');
      return matchSearch && matchFilter;
    });
  }, [transactions, search, filterStatus]);

  return (
    <>
      <div className="page-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ background: 'var(--primary-tint)', padding: 12, borderRadius: 12, color: 'var(--primary)' }}>
            <Search size={24} />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: 22 }}>Cari Transaksi</h1>
            <div className="sub" style={{ marginTop: 4 }}>Temukan data pesanan pelanggan dengan cepat</div>
          </div>
        </div>
        <button className="btn btn-primary" style={{ padding: '10px 16px', marginTop: 4 }} onClick={() => navigate('/app/pos')}>
          <Plus size={18} /> Buat Transaksi Baru
        </button>
      </div>

      <div className="card" style={{ padding: 20, marginBottom: 24, display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1 1 300px' }}>
          <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-soft)' }} />
          <input 
            type="text" 
            placeholder="Ketik nama pelanggan, no HP, atau kode tracking..." 
            style={{ paddingLeft: 42, width: '100%', height: 44, borderRadius: 10, border: '1.5px solid var(--line)' }} 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
          />
        </div>
        
        <div className="filter-row" style={{ margin: 0 }}>
          {['Semua', 'Proses', 'Selesai'].map(s => (
            <button key={s} className={`chip ${filterStatus === s ? 'active' : ''}`} style={{ height: 42 }} onClick={() => setFilterStatus(s)}>{s}</button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state" style={{ background: 'var(--card)', borderRadius: 16, padding: '60px 20px', border: '1px dashed var(--line-soft)' }}>
          <Search size={48} style={{ color: 'var(--line)', marginBottom: 16, margin: '0 auto' }} />
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Transaksi tidak ditemukan</h3>
          <p style={{ color: 'var(--ink-soft)' }}>Coba gunakan kata kunci pencarian yang lain.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map(t => {
            const status = getTrxStatus(t);
            return (
              <div key={t.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px', background: 'var(--card)', border: '1px solid var(--line-soft)', borderRadius: 14, transition: 'all 0.2s', flexWrap: 'wrap', gap: 16 }} className="hover-card">
                <div style={{ display: 'flex', gap: 16, alignItems: 'center', flex: '1 1 300px' }}>
                   <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--canvas-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-soft)' }}>
                     <User size={24} />
                   </div>
                   <div>
                     <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                       <span className="mono" style={{ fontWeight: 700, fontSize: 15, color: 'var(--ink)' }}>{t.kode}</span>
                       {t.metode === 'jemput-antar' && <span style={{ fontSize: 12 }} title="Jemput Antar">🛵</span>}
                       <span className={`badge ${status === 'done' ? 'badge-done' : 'badge-progress'}`} style={{ fontSize: 10, padding: '3px 8px' }}>{getProgressSummary(t.sepatu)}</span>
                     </div>
                     <div style={{ fontWeight: 600, fontSize: 15 }}>{t.pelanggan} <span style={{ color: 'var(--ink-soft)', fontWeight: 500, fontSize: 14 }}>({t.hp})</span></div>
                     <div style={{ fontSize: 13, color: 'var(--ink-soft)', marginTop: 4 }}>
                       {t.sepatu.length} pasang sepatu • Masuk: {fmtDate(t.tanggal)}
                     </div>
                   </div>
                </div>
                
                <div style={{ display: 'flex', gap: 10 }}>
                   <button className="btn btn-outline" style={{ height: 42, padding: '0 16px' }} onClick={() => navigate(`/app/struk/${t.id}`)}>
                     <Printer size={16} /> <span className="hide-mobile">Struk</span>
                   </button>
                   <button className="btn btn-primary" style={{ height: 42, padding: '0 20px' }} onClick={() => navigate(`/app/detail-transaksi/${t.id}`)}>
                     Detail <ArrowRight size={16} />
                   </button>
                </div>
                
                {/* Rincian Sepatu (Pisahkan item multi-sepatu) */}
                <div style={{ width: '100%', marginTop: 8, borderTop: '1px dashed var(--line-soft)', paddingTop: 16 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-soft)', textTransform: 'uppercase', marginBottom: 10, letterSpacing: '0.04em' }}>Rincian Sepatu</div>
                  <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                    {t.sepatu.map(s => {
                      const isSelesai = s.stage > s.stages.length;
                      return (
                        <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'var(--canvas)', borderRadius: 10, border: '1px solid var(--line-soft)' }}>
                          <div>
                            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)' }}>{s.jenis}</div>
                            <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 2 }}>{s.treatment} <span className="mono" style={{ marginLeft: 6, padding: '2px 6px', background: 'var(--line-soft)', borderRadius: 4, color: 'var(--ink)' }}>{s.tracking}</span></div>
                          </div>
                          <span className={`badge ${isSelesai ? 'badge-done' : 'badge-progress'}`} style={{ fontSize: 11, padding: '4px 8px' }}>
                            {isSelesai ? 'Selesai' : s.stages[s.stage - 1]}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
