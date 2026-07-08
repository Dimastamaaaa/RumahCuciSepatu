import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { fmtDate } from '../../utils/helpers';
import { ChevronLeft, Search, Check, Phone } from 'lucide-react';
import './TrackingPage.css';

export default function TrackingPage() {
  const { searchTracking, toko, loading } = useApp();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    // Jangan lakukan pencarian jika data dari Supabase masih dimuat
    if (loading) return;
    
    const q = searchParams.get('q');
    if (q) { 
      setQuery(q); 
      doSearch(q); 
    }
  }, [searchParams, loading]);

  const doSearch = (q) => {
    const res = searchTracking(q);
    setResults(res);
    setSearched(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) doSearch(query.trim());
  };

  return (
    <div className="tracking-page">
      <div className="tr-header">
        <div className="container">
          <Link to="/" className="link-back"><ChevronLeft size={14} /> Kembali ke Beranda</Link>
          <div style={{ marginTop: 14 }}>
            <span className="eyebrow">Hasil Tracking</span>
            <h2 style={{ fontSize: 'clamp(26px,4vw,36px)', marginTop: 10 }}>Status Pesananmu</h2>
          </div>
          <form className="tr-search" onSubmit={handleSubmit}>
            <input type="text" placeholder="No. Struk atau Kode Tracking" value={query} onChange={e => setQuery(e.target.value)} />
            <button type="submit">Cek Status</button>
          </form>
        </div>
      </div>
      <div className="tr-body">
        <div className="container">
          {searched && results.length === 0 && (
            <div className="notfound">
              <Search size={44} />
              <h3>Data Tidak Ditemukan</h3>
              <p>Periksa kembali No. Struk/No. HP kamu - pastikan tidak ada salah ketik.</p>
              <a href={`https://wa.me/${(toko?.noWA || '').replace(/\D/g, '').replace(/^0/, '62')}`} className="wa-btn" style={{ justifyContent: 'center' }}><Phone size={16} /> Hubungi via WA</a>
            </div>
          )}
          {results.map(trx => (
            <div key={trx.id}>
              <div className="tr-summary-bar">
                <span className="mono">Kode Transaksi: {trx.kode}</span>
                <span className="mono">{trx.sepatu.length} sepatu dalam kunjungan ini</span>
              </div>
              <div className="shoe-cards">
                {trx.sepatu.map(shoe => {
                  const currentIdx = shoe.stage - 1;
                  const isReady = shoe.stages[currentIdx] === 'Selesai';
                  return (
                    <div className="shoe-tag" key={shoe.id}>
                      <div className="shoe-tag-head">
                        <div>
                          <div className="shoe-title">{shoe.jenis} - {shoe.treatment}</div>
                          <div className="shoe-meta">Kode Tracking: <span className="mono">{shoe.tracking}</span></div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 18 }}>
                          <div className="est-box">
                            <div className="est-label">Estimasi Selesai</div>
                            <div className="est-val">{fmtDate(shoe.estimasi)}</div>
                          </div>
                          <div className={`status-ribbon ${isReady ? 'ready' : ''}`}>
                            {shoe.stages[currentIdx] || 'Selesai'}
                          </div>
                        </div>
                      </div>
                      <div className="stage-track">
                        {shoe.stages.map((label, i) => {
                          let cls = 'stage';
                          if (i < currentIdx) cls += ' done';
                          else if (i === currentIdx) cls += ' current';
                          return (
                            <div className={cls} key={i}>
                              <div className="stage-row">
                                <div className="stage-line-l" />
                                <div className="stage-node">{i < currentIdx && <Check size={14} />}</div>
                                <div className="stage-line-r" />
                              </div>
                              <div className="stage-label">{label}</div>
                            </div>
                          );
                        })}
                      </div>
                      
                      <div style={{ display: 'flex', gap: 16, marginTop: 24, padding: '24px 0', borderTop: '1px dashed var(--line-soft)', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', width: 140, alignItems: 'center' }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink)', marginBottom: 8, textAlign: 'center' }}>📷 Foto Awal</span>
                          {shoe.fotoAwal ? (
                            <div style={{ width: 140, height: 105, borderRadius: 10, overflow: 'hidden', border: '1px solid var(--line)', background: '#fff' }}>
                              <img src={shoe.fotoAwal} alt="Kondisi Awal" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                          ) : (
                            <div style={{ width: 140, height: 105, borderRadius: 10, border: '1.5px dashed var(--line-soft)', background: 'var(--canvas-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-soft)', fontSize: 11, textAlign: 'center', padding: 8 }}>Tidak ada foto awal</div>
                          )}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', width: 140, alignItems: 'center' }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink)', marginBottom: 8, textAlign: 'center' }}>✨ Foto Akhir</span>
                          {shoe.fotoAkhir ? (
                            <div style={{ width: 140, height: 105, borderRadius: 10, overflow: 'hidden', border: '1px solid var(--line)', background: '#fff' }}>
                              <img src={shoe.fotoAkhir} alt="Kondisi Akhir" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                          ) : (
                            <div style={{ width: 140, height: 105, borderRadius: 10, border: '1.5px dashed var(--line-soft)', background: 'var(--canvas-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-soft)', fontSize: 11, textAlign: 'center', padding: 8 }}>
                              {isReady ? 'Tidak ada foto' : 'Tahap pengerjaan'}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="tag-note">Estimasi dapat berubah menyesuaikan antrian workshop. Notifikasi WA otomatis terkirim setiap kali tahap berpindah.</div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <footer id="kontak">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="brand">
                <span className="brand-name" style={{ fontSize: 17 }}>Rumah Cuci Sepatu</span>
              </div>
              <p>Titip sepatu, kami rawat sampai bersih — status pengerjaan bisa kamu pantau sendiri, kapan saja.</p>
              <a href={`https://wa.me/62${toko.noWA?.replace(/[^0-9]/g, '')}`} className="wa-btn" target="_blank" rel="noreferrer">
                <Phone size={16} /> Hubungi via WhatsApp
              </a>
            </div>
            <div className="footer-col">
              <h4>Navigasi</h4>
              <a href="/#proses">Alur Pengerjaan</a>
              <a href="/#layanan">Layanan & Harga</a>
              <a href="/#faq">FAQ</a>
              <a href="/#testimoni">Kata Pelanggan</a>
              <a href="/#feedback">Beri Feedback</a>
            </div>
            <div className="footer-col">
              <h4>Lokasi Outlet</h4>
              <p>{toko.alamat}</p>
              <a href={toko.linkMaps} style={{ fontWeight: 600, color: 'var(--primary-dark)' }} target="_blank" rel="noreferrer">Buka di Google Maps →</a>
            </div>
            <div className="footer-col">
              <h4>Jam Operasional</h4>
              {toko.jamOperasional?.map((j, i) => (
                <div className="footer-hours" key={i}><span>{j.hari}</span><span>{j.buka}–{j.tutup}</span></div>
              ))}
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 Rumah Cuci Sepatu. Semua hak dilindungi.</span>
            <span>Dibuat untuk memudahkan kamu, bukan sekadar dipajang.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
