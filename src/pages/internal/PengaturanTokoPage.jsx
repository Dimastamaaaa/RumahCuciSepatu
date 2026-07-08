import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Store, Building, MapPin, Phone, Map, Image as ImageIcon, Upload, CheckCircle2, Clock } from 'lucide-react';

export default function PengaturanTokoPage() {
  const { toko, updateToko } = useApp();
  const [form, setForm] = useState({ ...toko });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (toko && toko.id) {
      setForm(toko);
    }
  }, [toko]);

  const handleSave = () => {
    updateToko(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const updateJam = (idx, field, value) => {
    const jam = [...form.jamOperasional];
    jam[idx] = { ...jam[idx], [field]: value };
    setForm(prev => ({ ...prev, jamOperasional: jam }));
  };

  return (
    <>
      <div className="page-head" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 14, marginBottom: 28 }}>
        <div style={{ background: 'var(--primary-tint)', padding: 12, borderRadius: 12, color: 'var(--primary)' }}>
          <Store size={24} />
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: 22 }}>Pengaturan Toko</h1>
          <div className="sub" style={{ marginTop: 4 }}>Informasi ini otomatis tampil di web Landing Page & Struk Pelanggan</div>
        </div>
      </div>
      
      <div className="grid g2" style={{ gridTemplateColumns: '1fr 1fr', alignItems: 'start', gap: 24 }}>
        <div className="card" style={{ padding: 28, borderRadius: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, borderBottom: '1px dashed var(--line)', paddingBottom: 16 }}>
            <Building size={20} style={{ color: 'var(--primary)' }} />
            <h2 style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>Profil Usaha</h2>
          </div>
          
          <div className="form-grid full" style={{ gap: 20 }}>
            <div className="field">
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>Nama Usaha</label>
              <div style={{ position: 'relative' }}>
                <input type="text" value={form.nama} onChange={e => setForm(p => ({ ...p, nama: e.target.value }))} style={{ height: 46, borderRadius: 10, paddingLeft: 42, width: '100%' }} />
                <Store size={18} style={{ position: 'absolute', left: 14, top: 14, color: 'var(--ink-soft)' }} />
              </div>
            </div>
            
            <div className="field">
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>Alamat Outlet</label>
              <div style={{ position: 'relative' }}>
                <input type="text" value={form.alamat} onChange={e => setForm(p => ({ ...p, alamat: e.target.value }))} style={{ height: 46, borderRadius: 10, paddingLeft: 42, width: '100%' }} />
                <MapPin size={18} style={{ position: 'absolute', left: 14, top: 14, color: 'var(--ink-soft)' }} />
              </div>
            </div>
            
            <div className="field">
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>No. WhatsApp Admin</label>
              <div style={{ position: 'relative' }}>
                <input type="text" value={form.noWA} onChange={e => setForm(p => ({ ...p, noWA: e.target.value }))} style={{ height: 46, borderRadius: 10, paddingLeft: 42, width: '100%' }} />
                <Phone size={18} style={{ position: 'absolute', left: 14, top: 14, color: 'var(--ink-soft)' }} />
              </div>
            </div>
            
            <div className="field">
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>Link Google Maps</label>
              <div style={{ position: 'relative' }}>
                <input type="text" value={form.linkMaps} onChange={e => setForm(p => ({ ...p, linkMaps: e.target.value }))} style={{ height: 46, borderRadius: 10, paddingLeft: 42, width: '100%' }} />
                <Map size={18} style={{ position: 'absolute', left: 14, top: 14, color: 'var(--ink-soft)' }} />
              </div>
            </div>
          </div>
          
          <button className={`btn ${saved ? 'btn-outline' : 'btn-primary'}`} style={{ width: '100%', height: 48, marginTop: 28, fontSize: 15, justifyContent: 'center', transition: 'all 0.3s' }} onClick={handleSave} disabled={saved}>
            {saved ? <><CheckCircle2 size={18} style={{ color: 'var(--primary)', marginRight: 6 }} /> Perubahan Tersimpan</> : 'Simpan Perubahan Profil'}
          </button>
        </div>

        <div>
          <div className="card" style={{ padding: 28, borderRadius: 16, marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, borderBottom: '1px dashed var(--line)', paddingBottom: 16 }}>
              <Clock size={20} style={{ color: 'var(--primary)' }} />
              <h2 style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>Jam Operasional</h2>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {form.jamOperasional?.map((j, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--canvas-alt)', borderRadius: 10, border: '1px solid var(--line-soft)' }}>
                  <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)', textTransform: 'uppercase', width: 80 }}>{j.hari}</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div className="field" style={{ margin: 0 }}>
                      <input value={j.buka} onChange={e => updateJam(i, 'buka', e.target.value)} style={{ width: 80, height: 38, textAlign: 'center', borderRadius: 8 }} placeholder="09:00" />
                    </div>
                    <span style={{ color: 'var(--ink-soft)' }}>—</span>
                    <div className="field" style={{ margin: 0 }}>
                      <input value={j.tutup} onChange={e => updateJam(i, 'tutup', e.target.value)} style={{ width: 80, height: 38, textAlign: 'center', borderRadius: 8 }} placeholder="21:00" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: 28, borderRadius: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, borderBottom: '1px dashed var(--line)', paddingBottom: 16 }}>
              <ImageIcon size={20} style={{ color: 'var(--primary)' }} />
              <h2 style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>Logo & Foto Outlet</h2>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ height: 120, border: '2px dashed var(--line)', borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-soft)', background: 'var(--canvas-alt)', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.borderColor='var(--primary)'} onMouseOut={e => e.currentTarget.style.borderColor='var(--line)'}>
                <ImageIcon size={28} style={{ marginBottom: 8, color: 'var(--ink-faint)' }} />
                <span style={{ fontSize: 12, fontWeight: 600 }}>Upload Logo</span>
              </div>
              <div style={{ height: 120, border: '2px dashed var(--line)', borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-soft)', background: 'var(--canvas-alt)', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.borderColor='var(--primary)'} onMouseOut={e => e.currentTarget.style.borderColor='var(--line)'}>
                <Upload size={28} style={{ marginBottom: 8, color: 'var(--ink-faint)' }} />
                <span style={{ fontSize: 12, fontWeight: 600 }}>Upload Foto</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
