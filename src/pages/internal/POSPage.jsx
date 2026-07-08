import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { fmtRp, fmtDate } from '../../utils/helpers';
import { PAYMENT_STATUS, PAYMENT_METHODS } from '../../data/seedData';
import { ShoppingBag, Plus, Trash2, MessageCircle, Loader2, CheckCircle2, User, MapPin, Calendar, CreditCard, Wallet, Truck, Camera, ChevronDown, Check } from 'lucide-react';

function CustomSelect({ value, onChange, options, placeholder }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOpt = options.find(o => o.value === value);

  return (
    <div ref={ref} style={{ position: 'relative', width: '100%' }}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          height: 44, borderRadius: 10, border: isOpen ? '1.5px solid var(--primary)' : '1.5px solid var(--line)', 
          background: isOpen ? 'var(--card)' : 'var(--canvas-alt)', padding: '0 14px', 
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer',
          color: selectedOpt ? 'var(--ink)' : 'var(--ink-soft)', fontSize: 13.8, transition: 'all 0.2s'
        }}
      >
        <span style={{ fontWeight: selectedOpt ? 600 : 400 }}>{selectedOpt ? selectedOpt.name : placeholder}</span>
        <ChevronDown size={16} style={{ color: 'var(--ink-soft)', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </div>
      
      {isOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }} onClick={() => setIsOpen(false)}>
          <div className="card" onClick={e => e.stopPropagation()} style={{ width: '90%', maxWidth: 420, maxHeight: '80vh', display: 'flex', flexDirection: 'column', position: 'relative', padding: 0, borderRadius: 20, boxShadow: '0 20px 40px rgba(0,0,0,0.2)', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--line)', background: 'var(--canvas-alt)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)' }}>Pilih Treatment</div>
            </div>
            <div style={{ overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
              {options.map((opt, i) => {
                if (opt.isGroup) {
                  return <div key={'g'+i} style={{ padding: '16px 12px 6px', fontSize: 12, fontWeight: 800, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{opt.label}</div>
                }
                const isSelected = value === opt.value;
                return (
                  <div 
                    key={opt.value} 
                    onClick={() => { onChange(opt.value); setIsOpen(false); }}
                    style={{ padding: '14px 16px', borderRadius: 12, background: isSelected ? 'var(--primary-tint)' : 'var(--card)', border: isSelected ? '1.5px solid var(--primary)' : '1px solid var(--line-soft)', color: isSelected ? 'var(--primary-dark)' : 'var(--ink)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.15s' }}
                    onMouseEnter={e => { if(!isSelected) { e.currentTarget.style.background = 'var(--canvas-alt)'; e.currentTarget.style.borderColor = 'var(--line)'; } }}
                    onMouseLeave={e => { if(!isSelected) { e.currentTarget.style.background = 'var(--card)'; e.currentTarget.style.borderColor = 'var(--line-soft)'; } }}
                  >
                    <div>
                       <div style={{ fontWeight: isSelected ? 800 : 600, fontSize: 15 }}>{opt.name}</div>
                       {opt.desc && <div style={{ fontSize: 13, color: isSelected ? 'var(--primary)' : 'var(--ink-soft)', marginTop: 4 }}>{opt.desc}</div>}
                    </div>
                    {isSelected && <Check size={20} style={{ color: 'var(--primary)' }} />}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function POSPage() {
  const { services, addTransaction, toko } = useApp();
  const navigate = useNavigate();
  const [pelanggan, setPelanggan] = useState('');
  const [hp, setHp] = useState('');
  const [metode, setMetode] = useState('outlet');
  const [alamatJemput, setAlamatJemput] = useState('');
  const [jadwalJemput, setJadwalJemput] = useState('');
  const [statusBayar, setStatusBayar] = useState('Lunas');
  const [metodeBayar, setMetodeBayar] = useState('Cash');
  const [shoes, setShoes] = useState([{ jenis: '', treatment: '', addons: [], estimasi: '' }]);
  const [saved, setSaved] = useState(null);
  const receiptRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const treatments = services.filter(s => s.kategori !== 'Add-On');
  const addons = services.filter(s => s.kategori === 'Add-On');

  const addShoe = () => setShoes(prev => [...prev, { jenis: '', treatment: '', addons: [], estimasi: '' }]);
  const removeShoe = (idx) => { if (shoes.length > 1) setShoes(prev => prev.filter((_, i) => i !== idx)); };
  const updateShoe = (idx, field, value) => setShoes(prev => prev.map((s, i) => i === idx ? { ...s, [field]: value } : s));

  const toggleAddon = (shoeIdx, addonId) => {
    setShoes(prev => prev.map((s, i) => {
      if (i !== shoeIdx) return s;
      const has = s.addons.includes(addonId);
      return { ...s, addons: has ? s.addons.filter(a => a !== addonId) : [...s.addons, addonId] };
    }));
  };

  const getShoePrice = (shoe) => {
    const treatment = treatments.find(t => t.id === shoe.treatment);
    const addonPrices = shoe.addons.reduce((sum, id) => {
      const addon = addons.find(a => a.id === id);
      return sum + (addon?.harga || 0);
    }, 0);
    return (treatment?.harga || 0) + addonPrices;
  };

  const subtotal = shoes.reduce((sum, s) => sum + getShoePrice(s), 0);
  const biayaJA = metode === 'jemput-antar' ? 15000 : 0;
  const total = subtotal + biayaJA;

  const handleSave = async () => {
    if (!pelanggan.trim() || !hp.trim()) return alert('Nama dan No. HP wajib diisi.');
    if (shoes.some(s => !s.treatment)) return alert('Pilih treatment untuk semua sepatu.');

    const sepatuData = shoes.map(s => {
      const treatment = treatments.find(t => t.id === s.treatment);
      const addonNames = s.addons.map(id => addons.find(a => a.id === id)?.nama || '').filter(Boolean);
      return {
        jenis: s.jenis,
        treatment: treatment?.nama || '',
        addons: addonNames,
        harga: getShoePrice(s),
        estimasi: s.estimasi || new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
        fotoAwal: s.fotoAwal || null,
      };
    });

    const trx = await addTransaction({
      pelanggan: pelanggan.trim(),
      hp: hp.trim(),
      metode,
      alamatJemput,
      jadwalJemput,
      statusBayar,
      metodeBayar,
      sepatu: sepatuData,
    });

    setSaved(trx);
  };

  if (saved) {
    return (
      <>
        <div className="page-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button className="icon-btn" onClick={() => window.location.reload()} style={{ background: 'var(--canvas)', border: '1px solid var(--line)', width: 40, height: 40 }} title="Kembali & Buat Transaksi Baru">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
            </button>
            <div>
              <h1 style={{ margin: 0 }}>Transaksi Tersimpan</h1>
              <div className="sub mono" style={{ marginTop: 2 }}>{saved.kode}</div>
            </div>
          </div>
        </div>
        
        <div className="card" style={{ maxWidth: 560, margin: '20px auto', padding: '40px 32px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 64, height: 64, borderRadius: '50%', background: 'rgba(37, 211, 102, 0.1)', color: '#25D366', marginBottom: 20 }}>
            <CheckCircle2 size={36} />
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Transaksi Berhasil Dibuat!</h2>
          <p style={{ color: 'var(--ink-soft)', marginBottom: 32 }}>Struk telah diterbitkan dengan kode <strong className="mono" style={{ color: 'var(--ink)' }}>{saved.kode}</strong>.</p>
          
          <div style={{ textAlign: 'left', background: 'var(--canvas-alt)', padding: 24, borderRadius: 12, marginBottom: 32 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 12, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600, marginBottom: 4 }}>Pelanggan</div>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{saved.pelanggan}</div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600, marginBottom: 4 }}>Jumlah Sepatu</div>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{saved.sepatu.length} pasang</div>
              </div>
            </div>
            <div style={{ borderTop: '1px solid var(--line-soft)', paddingTop: 16 }}>
              <div style={{ fontSize: 12, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600, marginBottom: 12 }}>Rincian Sepatu</div>
              {saved.sepatu.map(s => (
                <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 14 }}>
                  <div><span style={{ fontWeight: 600 }}>{s.jenis}</span> <span style={{ color: 'var(--ink-soft)' }}>({s.treatment})</span></div>
                  <span className="mono" style={{ color: 'var(--ink-soft)' }}>{s.tracking}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-outline" style={{ borderColor: '#25D366', color: '#25D366', flex: 1, minWidth: 200, justifyContent: 'center' }} disabled={isGenerating} onClick={async () => {
              if (!receiptRef.current) return;
              setIsGenerating(true);

              const hpRaw = saved.hp.replace(/[^0-9]/g, '');
              const waNumber = hpRaw.startsWith('0') ? '62' + hpRaw.slice(1) : hpRaw;
              const textMsg = `Halo ${saved.pelanggan}, ini struk transaksi Anda.\nKode Transaksi: ${saved.kode}\nPantau statusnya di sini:\n${window.location.origin}/tracking?q=${saved.kode}`;
              const waUrl = `https://api.whatsapp.com/send?phone=${waNumber}&text=${encodeURIComponent(textMsg)}`;
              const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
              
              let waWindow = null;
              if (!isMobile) {
                waWindow = window.open(waUrl, '_blank');
                if (!waWindow) window.location.href = waUrl;
              }

              try {
                const html2canvas = (await import('html2canvas')).default;
                const canvas = await html2canvas(receiptRef.current, { scale: 2, backgroundColor: '#ffffff' });
                
                canvas.toBlob(async (blob) => {
                  if (!blob) { setIsGenerating(false); return; }
                  const file = new File([blob], `struk-${saved.kode}.png`, { type: 'image/png' });

                  if (isMobile && navigator.canShare && navigator.canShare({ files: [file] })) {
                    try { await navigator.share({ files: [file], title: 'Struk Transaksi', text: textMsg }); setIsGenerating(false); return; } catch (e) { console.log(e); }
                  }
                  
                  try {
                    await navigator.clipboard.write([new window.ClipboardItem({ 'image/png': blob })]);
                    setTimeout(() => alert('Gambar struk disalin ke Clipboard.\n\nTeks disiapkan di WhatsApp, silakan "Paste" (Ctrl+V) di chat WA untuk melampirkan gambar!'), 100);
                  } catch (e) {
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a'); a.href = url; a.download = `struk-${saved.kode}.png`; a.click(); URL.revokeObjectURL(url);
                    setTimeout(() => alert('File struk terdownload otomatis.\n\nTeks disiapkan di WhatsApp, silakan lampirkan gambar tersebut ke chat WA!'), 100);
                  }
                  setIsGenerating(false);
                }, 'image/png');
              } catch (err) {
                console.error(err); alert('Gagal membuat gambar struk.'); setIsGenerating(false);
              }
            }}>
              {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <MessageCircle size={18} />} 
              {isGenerating ? 'Memproses...' : 'Kirim ke WA (PNG)'}
            </button>
            <button className="btn btn-primary" style={{ flex: 1, minWidth: 200, justifyContent: 'center' }} onClick={() => navigate(`/app/struk/${saved.id}`)}>
              Lihat Struk
            </button>
          </div>
          
          <button className="btn btn-outline" style={{ border: 'none', background: 'none', color: 'var(--ink-soft)', marginTop: 24, fontSize: 14 }} onClick={() => { setSaved(null); setPelanggan(''); setHp(''); setShoes([{ jenis: '', treatment: '', addons: [], estimasi: '' }]); }}>
            Buka Transaksi Baru Lagi
          </button>
        </div>

        {/* Hidden Receipt for HTML2Canvas */}
        <div style={{ position: 'absolute', top: -9999, left: -9999, pointerEvents: 'none' }}>
          <div ref={receiptRef} className="receipt-preview" style={{ width: 300, padding: 20, background: '#fff', color: '#000', fontFamily: '"IBM Plex Mono", monospace', fontSize: '12.5px' }}>
            <div style={{ textAlign: 'center', marginBottom: 12 }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{toko?.nama}</div>
              <div style={{ fontSize: 11, color: '#666' }}>{toko?.alamat}</div>
              <div style={{ fontSize: 11, color: '#666' }}>WA: {toko?.noWA}</div>
            </div>
            <hr style={{ borderTop: '1px dashed #000' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>No. Transaksi</span><span>{saved.kode}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Tanggal</span><span>{fmtDate(saved.tanggal)}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Pelanggan</span><span>{saved.pelanggan}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>No. HP</span><span>{saved.hp}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Metode</span><span>{saved.metode === 'jemput-antar' ? 'Jemput-Antar' : 'Outlet'}</span></div>
            <hr style={{ borderTop: '1px dashed #000', margin: '10px 0' }} />
            {saved.sepatu.map((s, i) => (
              <div key={s.id} style={{ marginBottom: 8 }}>
                <div style={{ fontWeight: 600 }}>#{i + 1} {s.jenis}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>{s.treatment}</span><span>{fmtRp(s.harga)}</span></div>
                {s.addons?.length > 0 && <div style={{ fontSize: 11, color: '#666' }}>+ {s.addons.join(', ')}</div>}
                <div style={{ fontSize: 11, color: '#666' }}>Tracking: {s.tracking}</div>
              </div>
            ))}
            <hr style={{ borderTop: '1px dashed #000', margin: '10px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 14 }}><span>TOTAL</span><span>{fmtRp(saved.sepatu.reduce((acc, s) => acc + s.harga, 0) + (saved.metode === 'jemput-antar' ? 15000 : 0))}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Pembayaran</span><span>{saved.statusBayar} ({saved.metodeBayar})</span></div>
            <hr style={{ borderTop: '1px dashed #000', margin: '10px 0' }} />
            <div style={{ textAlign: 'center', fontSize: 11, color: '#666', marginTop: 8 }}>Terima kasih telah mempercayakan sepatu Anda kepada kami.</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="page-head" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 14 }}>
        <div style={{ background: 'var(--primary-tint)', padding: 12, borderRadius: 12, color: 'var(--primary)' }}>
          <ShoppingBag size={24} />
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: 22 }}>Transaksi Baru</h1>
          <div className="sub" style={{ marginTop: 4 }}>Input data kunjungan dan layanan sepatu pelanggan</div>
        </div>
      </div>
      
      <div className="grid g2" style={{ gridTemplateColumns: '1.6fr 1fr', alignItems: 'start' }}>
        <div>
          <div className="card" style={{ marginBottom: 20, padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8, color: 'var(--ink)' }}>
              <User size={18} style={{ color: 'var(--primary)' }} /> Data Pelanggan
            </h3>
            <div className="form-grid">
              <div className="field">
                <label>Nama Pelanggan</label>
                <input type="text" placeholder="mis. Dhea Ramadhani" value={pelanggan} onChange={e => setPelanggan(e.target.value)} />
              </div>
              <div className="field">
                <label>No. HP / WhatsApp</label>
                <input type="text" placeholder="0812-xxxx-xxxx" value={hp} onChange={e => setHp(e.target.value)} />
              </div>
            </div>
            
            <div className="field" style={{ marginTop: 18 }}>
              <label>Metode Penyerahan</label>
              <div className="filter-row" style={{ margin: 0 }}>
                <button type="button" className={`chip ${metode === 'outlet' ? 'active' : ''}`} style={{ flex: 1, padding: 12, fontSize: 14 }} onClick={() => setMetode('outlet')}>Datang ke Outlet</button>
                <button type="button" className={`chip ${metode === 'jemput-antar' ? 'active' : ''}`} style={{ flex: 1, padding: 12, fontSize: 14 }} onClick={() => setMetode('jemput-antar')}>Jemput-Antar</button>
              </div>
            </div>
            
            {metode === 'jemput-antar' && (
              <div className="form-grid" style={{ marginTop: 18, padding: 16, background: 'var(--canvas-alt)', borderRadius: 12, border: '1px solid var(--line-soft)' }}>
                <div className="field">
                  <label><MapPin size={14} style={{ display: 'inline', verticalAlign: '-2px' }} /> Alamat Jemput</label>
                  <input type="text" placeholder="Alamat lengkap" value={alamatJemput} onChange={e => setAlamatJemput(e.target.value)} />
                </div>
                <div className="field">
                  <label><Calendar size={14} style={{ display: 'inline', verticalAlign: '-2px' }} /> Jadwal Jemput</label>
                  <input type="text" placeholder="mis. Hari ini, 15.00" value={jadwalJemput} onChange={e => setJadwalJemput(e.target.value)} />
                </div>
              </div>
            )}
          </div>

          {shoes.map((shoe, idx) => (
            <div className="card" key={idx} style={{ marginBottom: 16, padding: 24, border: '1px solid var(--primary-tint)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingBottom: 16, borderBottom: '1px dashed var(--line-soft)' }}>
                <h4 style={{ margin: 0, fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>{idx + 1}</div>
                  Sepatu Ke-{idx + 1}
                </h4>
                {shoes.length > 1 && (
                  <button type="button" className="btn btn-text" style={{ color: 'var(--danger)', padding: '6px 12px' }} onClick={() => removeShoe(idx)}>
                    <Trash2 size={16} /> Hapus
                  </button>
                )}
              </div>
              
              <div className="form-grid">
                <div className="field">
                  <label>Jenis & Nama Sepatu</label>
                  <input type="text" placeholder="mis. Nike Air Force 1" value={shoe.jenis} onChange={e => updateShoe(idx, 'jenis', e.target.value)} />
                </div>
                <div className="field">
                  <label>Treatment</label>
                  <CustomSelect 
                    value={shoe.treatment} 
                    onChange={val => updateShoe(idx, 'treatment', val)} 
                    options={(() => {
                      const opts = [];
                      const groups = treatments.reduce((acc, t) => {
                        if (!acc[t.kategori]) acc[t.kategori] = [];
                        acc[t.kategori].push(t);
                        return acc;
                      }, {});
                      Object.entries(groups).forEach(([kat, trts]) => {
                        opts.push({ isGroup: true, label: kat });
                        trts.forEach(t => opts.push({ value: t.id, label: `${t.kategori}: ${t.nama} — ${fmtRp(t.harga)}`, name: t.nama, desc: fmtRp(t.harga) }));
                      });
                      return opts;
                    })()}
                    placeholder="Pilih treatment..." 
                  />
                </div>
              </div>
              
              <div style={{ marginTop: 16 }}>
                <input type="file" accept="image/*" capture="environment" id={`upload-awal-${idx}`} style={{ display: 'none' }} onChange={e => {
                  if (e.target.files && e.target.files[0]) {
                    const file = e.target.files[0];
                    const reader = new FileReader();
                    reader.onload = ev => {
                      updateShoe(idx, 'fotoAwal', ev.target.result);
                    };
                    reader.readAsDataURL(file);
                  }
                }} />
                <label htmlFor={`upload-awal-${idx}`} className="btn btn-outline" style={{ height: 44, width: '100%', justifyContent: 'center', borderStyle: shoe.fotoAwal ? 'solid' : 'dashed', borderWidth: 1.5, color: shoe.fotoAwal ? '#2ecc71' : 'var(--ink-soft)', borderColor: shoe.fotoAwal ? '#2ecc71' : 'var(--line)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  {shoe.fotoAwal ? <CheckCircle2 size={16} /> : <Camera size={16} />} 
                  <span style={{ marginLeft: 8 }}>{shoe.fotoAwal ? 'Foto Awal Disimpan' : 'Upload Foto Kondisi Awal (Opsional)'}</span>
                </label>
              </div>
              
              <div style={{ marginTop: 20, padding: 16, background: 'var(--canvas-alt)', borderRadius: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Layanan Tambahan (Add-On)</label>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 }}>
                      {addons.map(a => (
                        <button key={a.id} type="button" className={`chip ${shoe.addons.includes(a.id) ? 'active' : ''}`} onClick={() => toggleAddon(idx, a.id)} style={{ fontSize: 13, padding: '8px 12px' }}>
                          {a.nama} <span style={{ opacity: 0.7, marginLeft: 4 }}>+{fmtRp(a.harga)}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="field" style={{ width: 160, marginLeft: 24 }}>
                    <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Estimasi Selesai</label>
                    <input type="date" value={shoe.estimasi} onChange={e => updateShoe(idx, 'estimasi', e.target.value)} style={{ marginTop: 6 }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          <button type="button" className="btn btn-outline" style={{ width: '100%', padding: 16, borderStyle: 'dashed', borderWidth: 2 }} onClick={addShoe}>
            <Plus size={18} /> Tambah Sepatu Lagi
          </button>
        </div>

        <div style={{ position: 'sticky', top: 90 }}>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '24px 24px 16px', background: 'var(--canvas-alt)' }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Wallet size={18} style={{ color: 'var(--primary)' }} /> Ringkasan Tagihan
              </h3>
            </div>
            
            <div style={{ padding: 24 }}>
              {shoes.map((shoe, idx) => {
                const treatment = treatments.find(t => t.id === shoe.treatment);
                return (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid var(--line-soft)' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>Sepatu #{idx + 1}</div>
                      <div style={{ fontSize: 13, color: 'var(--ink-soft)', marginTop: 2 }}>{treatment?.nama || 'Belum dipilih treatment'}</div>
                      {shoe.addons.length > 0 && (
                        <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 4 }}>+ {shoe.addons.length} Add-on</div>
                      )}
                    </div>
                    <div className="mono" style={{ fontWeight: 600 }}>{fmtRp(getShoePrice(shoe))}</div>
                  </div>
                );
              })}
              
              {metode === 'jemput-antar' && (
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 16, borderBottom: '1px solid var(--line-soft)', marginBottom: 16 }}>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>Biaya Jemput-Antar</span>
                  <span className="mono" style={{ fontWeight: 600 }}>{fmtRp(biayaJA)}</span>
                </div>
              )}
              
              <div style={{ background: 'var(--card)', border: '1px solid var(--primary)', borderRadius: 12, padding: 16, marginTop: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>Total Pembayaran</div>
                <div className="mono" style={{ fontSize: 26, fontWeight: 700 }}>{fmtRp(total)}</div>
              </div>

              <div className="form-grid" style={{ marginTop: 24, gap: 12 }}>
                <div className="field">
                  <label style={{ fontSize: 12 }}>Status Bayar</label>
                  <select value={statusBayar} onChange={e => setStatusBayar(e.target.value)}>
                    {PAYMENT_STATUS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label style={{ fontSize: 12 }}>Metode</label>
                  <select value={metodeBayar} onChange={e => setMetodeBayar(e.target.value)}>
                    {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>
              
              <button className="btn btn-primary" style={{ width: '100%', height: 48, marginTop: 24, fontSize: 15, justifyContent: 'center' }} onClick={handleSave}>
                Simpan & Buat Struk
              </button>
              <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--ink-soft)', marginTop: 12 }}>
                Struk termal & online otomatis dibuat.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
