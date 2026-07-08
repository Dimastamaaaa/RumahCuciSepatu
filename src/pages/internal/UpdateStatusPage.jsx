import { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { getDeadlineLabel } from '../../utils/helpers';
import { Search, Camera, ArrowRight, X, Activity, CheckSquare, User } from 'lucide-react';

const QC_ITEMS = ['Sepatu sudah kering', 'Tidak ada residu deterjen/bau', 'Warna sesuai treatment', 'Tidak ada kerusakan baru'];

export default function UpdateStatusPage() {
  const { transactions, updateShoeStage, currentUser } = useApp();
  const [search, setSearch] = useState('');
  const [qcChecked, setQcChecked] = useState({});
  const [uploadedPhotos, setUploadedPhotos] = useState({});
  const [selectedShoe, setSelectedShoe] = useState(null);

  const filtered = useMemo(() => {
    const allShoes = transactions.flatMap(t => t.sepatu.map(s => ({ ...s, trxId: t.id, trxKode: t.kode, pelanggan: t.pelanggan, hp: t.hp })));
    const activeShoes = allShoes.filter(s => {
      const currentStageName = s.stages[s.stage - 1] || 'Selesai';
      return currentStageName !== 'Selesai';
    });

    return activeShoes.filter(s => {
      if (!search) return true;
      const q = search.toLowerCase();
      return s.tracking.toLowerCase().includes(q) || s.pelanggan.toLowerCase().includes(q) || s.jenis.toLowerCase().includes(q);
    }).sort((a, b) => {
      const dlA = getDeadlineLabel(a.estimasi);
      const dlB = getDeadlineLabel(b.estimasi);
      const priority = (dl) => dl === 'Terlambat' ? 0 : dl === 'H-0' ? 1 : dl === 'H-1' ? 2 : 10;
      return priority(dlA) - priority(dlB);
    });
  }, [transactions, search]);

  const handleUpdate = (shoe) => {
    const nextStageIdx = shoe.stage;
    const isQCStage = shoe.stages[nextStageIdx] === 'Siap Diambil';
    const checks = qcChecked[shoe.id] || {};
    if (isQCStage && QC_ITEMS.some(item => !checks[item])) {
      alert('Semua item QC Checklist harus dicentang sebelum bisa update ke "Siap Diambil".');
      return;
    }

    const fotoAkhir = uploadedPhotos[shoe.id] || null;
    updateShoeStage(shoe.trxId, shoe.id, nextStageIdx, fotoAkhir);
    
    if (isQCStage && shoe.hp) {
      let waNumber = shoe.hp.replace(/\D/g, '');
      if (waNumber.startsWith('0')) waNumber = '62' + waNumber.substring(1);
      
      const trackingUrl = `${window.location.origin}/tracking?q=${shoe.tracking}`;
      const text = `Halo Kak ${shoe.pelanggan},\n\nKabar gembira! Sepatu *${shoe.jenis}* (Kode: ${shoe.tracking}) sudah selesai diproses dan *Siap Diambil* di Rumah Cuci Sepatu.\n\nCek dokumentasi foto akhirnya di sini:\n${trackingUrl}\n\nTerima kasih! 🙏`;
      
      window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`, '_blank');
    }
    
    // Clear state
    const newQc = { ...qcChecked };
    delete newQc[shoe.id];
    setQcChecked(newQc);
    
    const newPhotos = { ...uploadedPhotos };
    delete newPhotos[shoe.id];
    setUploadedPhotos(newPhotos);
    
    setSelectedShoe(null); // close modal on update
  };

  const toggleQC = (shoeId, item) => {
    setQcChecked(prev => ({
      ...prev,
      [shoeId]: { ...(prev[shoeId] || {}), [item]: !(prev[shoeId]?.[item]) }
    }));
  };

  return (
    <>
      <div className="page-head" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 14 }}>
        <div style={{ background: 'var(--accent-tint)', padding: 12, borderRadius: 12, color: 'var(--accent)' }}>
          <Activity size={24} />
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: 22 }}>Update Status Sepatu</h1>
          <div className="sub" style={{ marginTop: 4 }}>Worklist harian — diurutkan berdasarkan deadline terdekat</div>
        </div>
      </div>

      <div className="card" style={{ padding: '16px 20px', marginBottom: 24, display: 'flex', gap: 16, alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-soft)' }} />
          <input 
            type="text" 
            placeholder="Cari kode tracking atau nama pelanggan..." 
            style={{ paddingLeft: 42, width: '100%', height: 44, borderRadius: 10, border: '1.5px solid var(--line)' }} 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
          />
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="empty-state" style={{ background: 'var(--card)', borderRadius: 16, padding: '60px 20px', border: '1px dashed var(--line-soft)' }}>
          <CheckSquare size={48} style={{ color: 'var(--primary)', marginBottom: 16, margin: '0 auto' }} />
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Tidak ada antrian kerja</h3>
          <p style={{ color: 'var(--ink-soft)' }}>Semua pesanan sudah selesai atau belum ada pesanan aktif masuk.</p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {Object.values(
          filtered.reduce((acc, shoe) => {
            if (!acc[shoe.trxId]) {
              acc[shoe.trxId] = {
                trxId: shoe.trxId,
                trxKode: shoe.trxKode,
                pelanggan: shoe.pelanggan,
                estimasi: shoe.estimasi,
                shoes: []
              };
            }
            acc[shoe.trxId].shoes.push(shoe);
            return acc;
          }, {})
        ).map(group => (
          <div key={group.trxId} className="card" style={{ padding: 24, borderRadius: 20, border: '1px solid var(--line-soft)', background: 'var(--canvas)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid var(--line-soft)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--primary-tint)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{group.pelanggan}</div>
                  <div className="mono" style={{ fontSize: 13, color: 'var(--ink-soft)', marginTop: 2 }}>Order: {group.trxKode}</div>
                </div>
              </div>
              <span className={`badge ${getDeadlineLabel(group.estimasi) === 'Terlambat' ? 'badge-danger' : getDeadlineLabel(group.estimasi) === 'H-0' ? 'badge-progress' : 'badge-neutral'}`} style={{ padding: '6px 12px', fontSize: 12 }}>
                Tenggat: {getDeadlineLabel(group.estimasi)}
              </span>
            </div>
            
            <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
              {group.shoes.map(shoe => {
                const currentStage = shoe.stages[shoe.stage - 1];
                const nextStage = shoe.stages[shoe.stage] || 'Selesai';

                return (
                  <div className="hover-card" key={shoe.id} onClick={() => setSelectedShoe(shoe)} style={{ cursor: 'pointer', padding: 20, background: 'var(--card)', borderRadius: 16, border: '1px solid var(--line-soft)', display: 'flex', flexDirection: 'column', gap: 16, transition: 'all 0.2s' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{shoe.jenis}</div>
                        <div style={{ fontSize: 13, color: 'var(--ink-soft)' }}>{shoe.treatment}</div>
                      </div>
                      <div className="mono" style={{ fontSize: 12, background: 'var(--canvas-alt)', padding: '4px 8px', borderRadius: 6, fontWeight: 700, color: 'var(--ink)' }}>{shoe.tracking}</div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 10, fontWeight: 600 }}>
                         <span>{currentStage}</span>
                         {nextStage && <span style={{ color: nextStage === 'Selesai' ? '#2ecc71' : 'var(--primary)' }}>Selanjutnya: {nextStage}</span>}
                      </div>
                      <div className="mini-stepper">
                        {shoe.stages.map((_, i) => (
                          <div key={i} className={`mini-stage ${i < shoe.stage - 1 ? 'done' : i === shoe.stage - 1 ? 'current' : ''}`} />
                        ))}
                        {nextStage === 'Selesai' && <div className="mini-stage" />} 
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Modal Popup Update */}
      {selectedShoe && (() => {
        const shoe = selectedShoe;
        const currentStage = shoe.stages[shoe.stage - 1];
        const nextStageIdx = shoe.stage;
        const nextStage = shoe.stages[nextStageIdx];
        const isQCStep = nextStage === 'Siap Diambil';
        const isSelesai = !nextStage || nextStage === 'Selesai';

        return (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }} onClick={() => setSelectedShoe(null)}>
            <div className="card" onClick={e => e.stopPropagation()} style={{ width: '90%', maxWidth: 500, position: 'relative', padding: 32, borderRadius: 20, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
              <button onClick={() => setSelectedShoe(null)} style={{ position: 'absolute', top: 24, right: 24, background: 'var(--canvas-alt)', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--ink)' }}>
                <X size={18} />
              </button>
              
              <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 24 }}>
                 <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--canvas-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink)' }}>
                   <Activity size={24} />
                 </div>
                 <div>
                   <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, marginBottom: 4 }}>{shoe.jenis}</h2>
                   <div style={{ fontSize: 14, color: 'var(--ink-soft)' }}>{shoe.pelanggan} — <strong className="mono" style={{ color: 'var(--ink)' }}>{shoe.tracking}</strong></div>
                 </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', background: 'var(--canvas-alt)', borderRadius: 12, padding: 4, marginBottom: 28 }}>
                 <div style={{ flex: 1, padding: '14px 16px', background: 'var(--card)', borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                   <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--ink-soft)', fontWeight: 700, marginBottom: 6 }}>Status Saat Ini</div>
                   <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)' }}>{currentStage}</div>
                 </div>
                 {nextStage && (
                   <>
                     <div style={{ padding: '0 16px', color: 'var(--ink-soft)' }}><ArrowRight size={20} /></div>
                     <div style={{ flex: 1, padding: '14px 16px' }}>
                       <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.04em', color: isSelesai ? '#2ecc71' : 'var(--primary)', fontWeight: 700, marginBottom: 6 }}>Selanjutnya</div>
                       <div style={{ fontSize: 15, fontWeight: 700, color: isSelesai ? '#2ecc71' : 'var(--ink)' }}>{nextStage}</div>
                     </div>
                   </>
                 )}
              </div>

              {isQCStep && (
                <div style={{ marginBottom: 28, background: 'rgba(230, 126, 34, 0.05)', border: '1px solid rgba(230, 126, 34, 0.2)', padding: 20, borderRadius: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, fontWeight: 700, color: '#D35400', marginBottom: 16 }}>
                    <CheckSquare size={18} /> Quality Control Checklist
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {QC_ITEMS.map(item => {
                      const checked = qcChecked[shoe.id]?.[item] || false;
                      return (
                        <label key={item} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: checked ? '#fff' : 'rgba(255,255,255,0.5)', borderRadius: 10, cursor: 'pointer', border: `1px solid ${checked ? '#E67E22' : 'transparent'}`, transition: 'all 0.2s', boxShadow: checked ? '0 2px 8px rgba(230, 126, 34, 0.1)' : 'none' }}>
                          <input type="checkbox" checked={checked} onChange={() => toggleQC(shoe.id, item)} style={{ width: 20, height: 20, accentColor: '#E67E22' }} />
                          <span style={{ fontSize: 14, fontWeight: checked ? 600 : 500, color: checked ? '#D35400' : 'var(--ink)' }}>{item}</span>
                        </label>
                      )
                    })}
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: 12 }}>
                {nextStage && (
                  <button className="btn btn-primary" style={{ flex: 2, height: 48, fontSize: 15, justifyContent: 'center', background: isSelesai ? '#2ecc71' : 'var(--primary)', borderColor: isSelesai ? '#2ecc71' : 'var(--primary)' }} onClick={() => handleUpdate(shoe)}>
                    {isSelesai ? 'Tandai Selesai' : `Update ke ${nextStage}`} {isSelesai ? <CheckSquare size={18} style={{ marginLeft: 6 }} /> : <ArrowRight size={18} style={{ marginLeft: 6 }} />}
                  </button>
                )}
                {(isQCStep || isSelesai) && (
                  <>
                    <input type="file" accept="image/*" capture="environment" id={`upload-akhir-${shoe.id}`} style={{ display: 'none' }} onChange={e => {
                      if (e.target.files && e.target.files[0]) {
                        const file = e.target.files[0];
                        const reader = new FileReader();
                        reader.onload = ev => {
                          setUploadedPhotos(p => ({ ...p, [shoe.id]: ev.target.result }));
                          alert('Foto Akhir berhasil diambil dan disiapkan untuk disimpan.');
                        };
                        reader.readAsDataURL(file);
                      }
                    }} />
                    <label htmlFor={`upload-akhir-${shoe.id}`} className="btn btn-outline" style={{ flex: 1, height: 48, justifyContent: 'center', cursor: 'pointer', display: 'flex', alignItems: 'center', borderStyle: uploadedPhotos[shoe.id] ? 'solid' : 'dashed', borderColor: uploadedPhotos[shoe.id] ? '#2ecc71' : 'var(--primary)', color: uploadedPhotos[shoe.id] ? '#2ecc71' : 'var(--primary)' }}>
                      {uploadedPhotos[shoe.id] ? <CheckSquare size={18} style={{ marginRight: 8 }} /> : <Camera size={18} style={{ marginRight: 8 }} />} 
                      {uploadedPhotos[shoe.id] ? 'Foto Siap' : 'Foto Akhir'}
                    </label>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })()}
    </>
  );
}
