import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserCircle, User, Lock, CheckCircle2, MonitorSmartphone, Moon, Sun } from 'lucide-react';

export default function AkunSayaPage() {
  const { currentUser, updateUser, theme, setTheme } = useApp();
  const [form, setForm] = useState({ nama: currentUser?.nama || '', password: '', confirm: '' });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (form.password && form.password !== form.confirm) {
      return alert('Konfirmasi password tidak cocok.');
    }
    const data = { nama: form.nama };
    if (form.password) data.password = form.password;
    updateUser(currentUser.id, data);
    setForm(p => ({ ...p, password: '', confirm: '' }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <>
      <div className="page-head" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 14, marginBottom: 28 }}>
        <div style={{ background: 'var(--primary-tint)', padding: 12, borderRadius: 12, color: 'var(--primary)' }}>
          <UserCircle size={24} />
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: 22 }}>Akun Saya</h1>
          <div className="sub" style={{ marginTop: 4 }}>Kelola profil dan preferensi tampilan sistem Anda</div>
        </div>
      </div>
      
      <div className="grid g2" style={{ gridTemplateColumns: '1.2fr 0.8fr', alignItems: 'start', gap: 24 }}>
        <div className="card" style={{ padding: 28, borderRadius: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 24, borderBottom: '1px dashed var(--line)', paddingBottom: 20 }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--primary-tint)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <UserCircle size={36} strokeWidth={1.5} />
            </div>
            <div>
               <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 4px 0', color: 'var(--ink)' }}>{currentUser?.nama || 'Pengguna'}</h2>
               <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className={`badge ${currentUser?.role === 'owner' ? 'badge-info' : 'badge-progress'}`} style={{ textTransform: 'capitalize' }}>{currentUser?.role || 'Staff'}</span>
                  <span className="mono" style={{ fontSize: 13, color: 'var(--ink-soft)' }}>{currentUser?.username || '-'}</span>
               </div>
            </div>
          </div>
          
          <div className="form-grid full" style={{ gap: 20 }}>
            <div className="field">
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>Nama Tampilan</label>
              <div style={{ position: 'relative' }}>
                <input type="text" value={form.nama} onChange={e => setForm(p => ({ ...p, nama: e.target.value }))} style={{ height: 46, borderRadius: 10, paddingLeft: 42, width: '100%' }} />
                <User size={18} style={{ position: 'absolute', left: 14, top: 14, color: 'var(--ink-soft)' }} />
              </div>
            </div>
            
            <div className="field">
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>Ubah Password</label>
              <div style={{ position: 'relative' }}>
                <input type="password" placeholder="Biarkan kosong jika tidak ingin mengubah sandi" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} style={{ height: 46, borderRadius: 10, paddingLeft: 42, width: '100%' }} />
                <Lock size={18} style={{ position: 'absolute', left: 14, top: 14, color: 'var(--ink-soft)' }} />
              </div>
            </div>
            
            {form.password && (
              <div className="field" style={{ animation: 'fadeIn 0.2s ease-out' }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>Konfirmasi Password Baru</label>
                <div style={{ position: 'relative' }}>
                  <input type="password" placeholder="Ketik ulang password baru Anda" value={form.confirm} onChange={e => setForm(p => ({ ...p, confirm: e.target.value }))} style={{ height: 46, borderRadius: 10, paddingLeft: 42, width: '100%', borderColor: form.confirm && form.password !== form.confirm ? 'var(--danger)' : '' }} />
                  <Lock size={18} style={{ position: 'absolute', left: 14, top: 14, color: 'var(--ink-soft)' }} />
                </div>
                {form.confirm && form.password !== form.confirm && <div style={{ fontSize: 11, color: 'var(--danger)', marginTop: 6 }}>Ketik ulang password dengan benar</div>}
              </div>
            )}
          </div>
          
          <button className={`btn ${saved ? 'btn-outline' : 'btn-primary'}`} style={{ width: '100%', height: 48, marginTop: 28, fontSize: 15, justifyContent: 'center', transition: 'all 0.3s' }} onClick={handleSave} disabled={saved}>
            {saved ? <><CheckCircle2 size={18} style={{ color: 'var(--primary)', marginRight: 6 }} /> Profil Diperbarui</> : 'Simpan Perubahan'}
          </button>
        </div>

        <div className="card" style={{ padding: 28, borderRadius: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
             <MonitorSmartphone size={20} style={{ color: 'var(--primary)' }} />
             <h2 style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>Tema Tampilan</h2>
          </div>
          <p style={{ fontSize: 13, color: 'var(--ink-soft)', margin: '0 0 24px 0', lineHeight: 1.5 }}>
             Preferensi tema warna disimpan khusus untuk akun Anda dan langsung diterapkan ke semua layar.
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button type="button" onClick={() => setTheme('light')} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px', borderRadius: 12, border: `2px solid ${theme === 'light' ? 'var(--primary)' : 'var(--line)'}`, background: theme === 'light' ? 'var(--primary-tint)' : 'var(--canvas-alt)', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', width: '100%' }}>
              <Sun size={24} style={{ color: theme === 'light' ? 'var(--primary)' : 'var(--ink-soft)' }} />
              <div>
                 <div style={{ fontWeight: 700, fontSize: 15, color: theme === 'light' ? 'var(--primary)' : 'var(--ink)' }}>Terang (Light Mode)</div>
                 <div style={{ fontSize: 12, color: theme === 'light' ? 'var(--primary)' : 'var(--ink-soft)', marginTop: 2 }}>Tampilan bersih dan jelas</div>
              </div>
            </button>
            
            <button type="button" onClick={() => setTheme('dark')} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px', borderRadius: 12, border: `2px solid ${theme === 'dark' ? 'var(--primary)' : 'var(--line)'}`, background: theme === 'dark' ? 'var(--primary-tint)' : 'var(--canvas-alt)', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', width: '100%' }}>
              <Moon size={24} style={{ color: theme === 'dark' ? 'var(--primary)' : 'var(--ink-soft)' }} />
              <div>
                 <div style={{ fontWeight: 700, fontSize: 15, color: theme === 'dark' ? 'var(--primary)' : 'var(--ink)' }}>Gelap (Dark Mode)</div>
                 <div style={{ fontSize: 12, color: theme === 'dark' ? 'var(--primary)' : 'var(--ink-soft)', marginTop: 2 }}>Nyaman di mata saat malam hari</div>
              </div>
            </button>
            
            <button type="button" onClick={() => setTheme('system')} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px', borderRadius: 12, border: `2px solid ${theme === 'system' ? 'var(--primary)' : 'var(--line)'}`, background: theme === 'system' ? 'var(--primary-tint)' : 'var(--canvas-alt)', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', width: '100%' }}>
              <MonitorSmartphone size={24} style={{ color: theme === 'system' ? 'var(--primary)' : 'var(--ink-soft)' }} />
              <div>
                 <div style={{ fontWeight: 700, fontSize: 15, color: theme === 'system' ? 'var(--primary)' : 'var(--ink)' }}>Ikuti Sistem</div>
                 <div style={{ fontSize: 12, color: theme === 'system' ? 'var(--primary)' : 'var(--ink-soft)', marginTop: 2 }}>Otomatis mengikuti preferensi OS</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
