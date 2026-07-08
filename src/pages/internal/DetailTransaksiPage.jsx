import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { fmtRp, fmtDate, fmtDateTime } from '../../utils/helpers';
import { Printer, Footprints, ArrowLeft, CheckSquare } from 'lucide-react';

export default function DetailTransaksiPage() {
  const { id } = useParams();
  const { transactions, currentUser, updateShoeStage } = useApp();
  const navigate = useNavigate();
  const trx = transactions.find(t => t.id === id);
  const isTeknisi = currentUser?.role === 'teknisi';

  if (!trx) return <div className="empty-state"><h3>Transaksi tidak ditemukan</h3></div>;

  const totalSepatu = trx.sepatu.reduce((s, sh) => s + sh.harga, 0);

  return (
    <>
      <div className="page-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="icon-btn" onClick={() => navigate(-1)} style={{ background: 'var(--canvas)', border: '1px solid var(--line)', width: 40, height: 40 }}>
            <ArrowLeft size={18} />
          </button>
          <div><h1 style={{ margin: 0 }}>Detail Transaksi</h1><div className="sub mono" style={{ marginTop: 2 }}>{trx.kode} — {trx.pelanggan}</div></div>
        </div>
        {isTeknisi
          ? <span className="badge badge-neutral">Mode Baca Saja</span>
          : <button className="btn btn-outline" onClick={() => navigate(`/app/struk/${trx.id}`)}><Printer size={16} /> Cetak Ulang Struk</button>}
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="form-grid">
          <div><div className="kpi-label">Pelanggan</div><div style={{ fontWeight: 600 }}>{trx.pelanggan}</div><div style={{ fontSize: '12.5px', color: 'var(--ink-soft)' }}>{trx.hp}</div></div>
          <div><div className="kpi-label">Metode</div><div style={{ fontWeight: 600 }}>{trx.metode === 'jemput-antar' ? '🛵 Jemput-Antar' : 'Datang ke Outlet'}</div></div>
          <div><div className="kpi-label">Status Pembayaran</div><div style={{ fontWeight: 600 }}>{trx.statusBayar}</div></div>
          <div><div className="kpi-label">Total Tagihan</div><div style={{ fontWeight: 600 }}>{fmtRp(totalSepatu + trx.biayaJemputAntar)}</div></div>
        </div>
      </div>

      <div className="card-title" style={{ marginBottom: 14 }}>Sepatu dalam Kunjungan Ini</div>
      {trx.sepatu.map(shoe => {
        const isSelesai = shoe.stage > shoe.stages.length;
        const currentStageLabel = isSelesai ? 'Selesai' : (shoe.stages[shoe.stage - 1] || 'Selesai');
        
        return (
          <div className="card" key={shoe.id} style={{ marginBottom: 20, overflow: 'hidden', padding: 0 }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--line-soft)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: 'var(--ink)', marginBottom: 4 }}>{shoe.jenis}</h3>
                <div style={{ fontSize: 14, color: 'var(--ink-soft)' }}>{shoe.treatment}</div>
                <div className="mono" style={{ fontSize: 13, color: 'var(--ink)', marginTop: 12, background: 'var(--canvas-alt)', padding: '4px 10px', borderRadius: 6, display: 'inline-block', fontWeight: 600 }}>{shoe.tracking}</div>
                {shoe.addons?.length > 0 && <div style={{ fontSize: 13, color: 'var(--primary)', marginTop: 8, fontWeight: 600 }}>+ {shoe.addons.join(', ')}</div>}
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className={`badge ${isSelesai ? 'badge-done' : 'badge-progress'}`} style={{ fontSize: 13, padding: '6px 12px', marginBottom: 12, display: 'inline-block' }}>
                  {currentStageLabel}
                </span>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)' }}>{fmtRp(shoe.harga)}</div>
              </div>
            </div>
            
            <div className="grid g2" style={{ padding: '24px', gap: 32, alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 20 }}>Riwayat Pengerjaan</div>
                {shoe.riwayat && shoe.riwayat.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {shoe.riwayat.map((r, i) => {
                      const isLast = i === shoe.riwayat.length - 1;
                      return (
                        <div key={i} style={{ display: 'flex', gap: 16, position: 'relative', zIndex: 1, paddingBottom: isLast ? 0 : 24 }}>
                          {!isLast && <div style={{ position: 'absolute', top: 20, bottom: 0, left: 7, width: 2, background: 'var(--line-soft)', zIndex: 0 }} />}
                          <div style={{ width: 16, height: 16, borderRadius: '50%', background: isLast && isSelesai ? '#2ecc71' : isLast ? 'var(--primary)' : 'var(--line)', border: '3px solid var(--card)', marginTop: 4, flexShrink: 0, position: 'relative', zIndex: 1 }} />
                          <div>
                            <div style={{ fontWeight: isLast ? 700 : 600, fontSize: 15, color: isLast && isSelesai ? '#2ecc71' : isLast ? 'var(--ink)' : 'var(--ink-soft)' }}>{r.stage}</div>
                            <div style={{ fontSize: 13, color: 'var(--ink-soft)', marginTop: 4 }}>{fmtDateTime(r.timestamp)} • oleh {r.by}</div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div style={{ fontSize: 13, color: 'var(--ink-soft)' }}>Belum ada riwayat</div>
                )}
              </div>
              
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 20 }}>Dokumentasi Kondisi</div>
                <div style={{ display: 'flex', gap: 16 }}>
                  {/* Foto Awal */}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', marginBottom: 10 }}>Kondisi Awal (Penerimaan)</div>
                    {shoe.fotoAwal ? (
                      <div style={{ width: '100%', aspectRatio: '1/1', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--line)', background: 'var(--canvas-alt)' }}>
                        <img src={shoe.fotoAwal} alt="Kondisi Awal" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    ) : (
                      <div style={{ width: '100%', aspectRatio: '1/1', borderRadius: 12, border: '1px dashed var(--line)', background: 'var(--canvas-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-soft)', fontSize: 12, textAlign: 'center', padding: 16 }}>
                        Tidak ada foto
                      </div>
                    )}
                  </div>
                  
                  {/* Foto Akhir */}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', marginBottom: 10 }}>Kondisi Akhir (Selesai/QC)</div>
                    {shoe.fotoAkhir ? (
                      <div style={{ width: '100%', aspectRatio: '1/1', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--line)', background: 'var(--canvas-alt)' }}>
                        <img src={shoe.fotoAkhir} alt="Kondisi Akhir" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    ) : (
                      <div style={{ width: '100%', aspectRatio: '1/1', borderRadius: 12, border: '1px dashed var(--line)', background: 'var(--canvas-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-soft)', fontSize: 12, textAlign: 'center', padding: 16 }}>
                        {isSelesai ? 'Tidak ada foto' : 'Tahap akhir belum selesai'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {!isTeknisi && !isSelesai && (
              <div style={{ padding: '16px 24px', background: 'var(--canvas-alt)', borderTop: '1px solid var(--line-soft)', display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                {shoe.stages[shoe.stage - 1] === 'Siap Diambil' && (
                  <button className="btn btn-outline" onClick={() => updateShoeStage(trx.id, shoe.id, shoe.stage)} style={{ padding: '0 20px', height: 42, color: '#2ecc71', borderColor: '#2ecc71' }}>
                    <CheckSquare size={16} style={{ marginRight: 8 }} /> Tandai Selesai (Diambil)
                  </button>
                )}
                <button className="btn btn-primary" onClick={() => navigate('/app/update-status')} style={{ padding: '0 20px', height: 42 }}>
                  <Footprints size={16} style={{ marginRight: 8 }} /> Update di Worklist
                </button>
              </div>
            )}
          </div>
        )
      })}
    </>
  );
}
