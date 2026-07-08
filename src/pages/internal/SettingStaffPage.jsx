import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Users, Plus, X, Pencil, Key, Shield, Monitor, Wrench, User } from 'lucide-react';

const ROLE_LABEL = { owner: 'Owner', kasir: 'Kasir', teknisi: 'Teknisi' };
const ROLE_ICON = { owner: Shield, kasir: Monitor, teknisi: Wrench };
const ROLE_COLOR = { owner: '#3498db', kasir: '#2ecc71', teknisi: '#e67e22' };

export default function SettingStaffPage() {
  const { users, addUser, updateUser } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ nama: '', username: '', password: '', role: 'kasir', status: true });

  const openAdd = () => { setEditId(null); setForm({ nama: '', username: '', password: '', role: 'kasir', status: true }); setShowForm(true); };
  const openEdit = (u) => { setEditId(u.id); setForm({ nama: u.nama, username: u.username, password: '', role: u.role, status: u.status }); setShowForm(true); };

  const handleSave = () => {
    if (!form.nama || !form.username) return;
    if (editId) {
      const data = { nama: form.nama, username: form.username, role: form.role, status: form.status };
      if (form.password) data.password = form.password;
      updateUser(editId, data);
    } else {
      if (!form.password) return alert('Password wajib diisi untuk akun baru.');
      addUser(form);
    }
    setShowForm(false);
  };

  const resetPassword = (u) => {
    const newPw = prompt(`Reset password untuk ${u.nama}? Masukkan password baru:`);
    if (newPw) updateUser(u.id, { password: newPw });
  };

  return (
    <>
      <div className="page-head" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap', marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ background: 'var(--primary-tint)', padding: 12, borderRadius: 12, color: 'var(--primary)' }}>
            <Users size={24} />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: 22 }}>Setting Kasir/Staff</h1>
            <div className="sub" style={{ marginTop: 4 }}>Kelola hak akses dan akun tim kerja</div>
          </div>
        </div>
        <button className="btn btn-primary" style={{ padding: '0 20px', height: 44, borderRadius: 12 }} onClick={openAdd}>
          <Plus size={18} style={{ marginRight: 6 }} /> Tambah Staff
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
        {users.map(u => {
          const Icon = ROLE_ICON[u.role] || User;
          const rColor = ROLE_COLOR[u.role] || 'var(--ink)';
          return (
            <div key={u.id} className="hover-card" style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 16, padding: 20, display: 'flex', flexDirection: 'column', gap: 16, transition: 'all 0.2s', opacity: u.status ? 1 : 0.65 }}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                <div style={{ width: 50, height: 50, borderRadius: '50%', background: `color-mix(in srgb, ${rColor} 12%, transparent)`, color: rColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={24} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--ink)' }}>{u.nama}</div>
                  <div className="mono" style={{ fontSize: 13, color: 'var(--ink-soft)', marginTop: 2 }}>{u.username}</div>
                </div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--canvas-alt)', padding: '12px 16px', borderRadius: 12 }}>
                <span className={`badge ${u.role === 'owner' ? 'badge-info' : u.role === 'kasir' ? 'badge-progress' : 'badge-done'}`}>{ROLE_LABEL[u.role]}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                   <span style={{ fontSize: 12, fontWeight: 600, color: u.status ? 'var(--ink)' : 'var(--ink-soft)' }}>{u.status ? 'Aktif' : 'Nonaktif'}</span>
                   <button className={`tswitch ${u.status ? 'on' : ''}`} onClick={() => updateUser(u.id, { status: !u.status })} style={{ margin: 0 }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 'auto' }}>
                <button className="btn btn-outline" onClick={() => openEdit(u)} style={{ flex: 1, justifyContent: 'center', height: 42, background: 'var(--card)' }}><Pencil size={15} style={{ marginRight: 6 }} /> Edit Profile</button>
                <button className="btn btn-outline" onClick={() => resetPassword(u)} style={{ flex: 1, justifyContent: 'center', height: 42, background: 'var(--card)' }}><Key size={15} style={{ marginRight: 6 }} /> Password</button>
              </div>
            </div>
          )
        })}
      </div>

      {showForm && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }} onClick={() => setShowForm(false)}>
          <div className="card" onClick={e => e.stopPropagation()} style={{ width: '90%', maxWidth: 460, position: 'relative', padding: 32, borderRadius: 20, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div style={{ fontSize: 20, fontWeight: 700 }}>{editId ? 'Edit Staff' : 'Tambah Staff Baru'}</div>
              <button style={{ background: 'var(--canvas-alt)', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--ink)' }} onClick={() => setShowForm(false)}>
                <X size={16} />
              </button>
            </div>
            
            <div className="form-grid full" style={{ gap: 16 }}>
              <div className="field">
                <label style={{ fontSize: 13, fontWeight: 600 }}>Nama Lengkap</label>
                <input type="text" value={form.nama} onChange={e => setForm(p => ({ ...p, nama: e.target.value }))} style={{ height: 44, borderRadius: 10 }} />
              </div>
              <div className="field">
                <label style={{ fontSize: 13, fontWeight: 600 }}>Username / No. HP</label>
                <input type="text" value={form.username} onChange={e => setForm(p => ({ ...p, username: e.target.value }))} style={{ height: 44, borderRadius: 10 }} />
              </div>
              <div className="field">
                <label style={{ fontSize: 13, fontWeight: 600 }}>Password {editId && <span style={{ color: 'var(--ink-soft)', fontWeight: 400 }}>(kosongkan jika tidak diubah)</span>}</label>
                <input type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} style={{ height: 44, borderRadius: 10 }} />
              </div>
              <div className="field">
                <label style={{ fontSize: 13, fontWeight: 600 }}>Peran (Role)</label>
                <select value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} style={{ height: 44, borderRadius: 10 }}>
                  <option value="kasir">Kasir</option>
                  <option value="teknisi">Teknisi</option>
                  <option value="owner">Owner</option>
                </select>
              </div>
            </div>
            
            <button className="btn btn-primary" style={{ width: '100%', height: 48, marginTop: 24, fontSize: 15, justifyContent: 'center' }} onClick={handleSave}>
              {editId ? 'Simpan Perubahan' : 'Tambahkan Staff'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
