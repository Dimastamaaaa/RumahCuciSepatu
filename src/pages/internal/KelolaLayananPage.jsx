import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { fmtRp } from '../../utils/helpers';
import Swal from 'sweetalert2';
import { Tags, Plus, X, Pencil, Trash2, Globe, EyeOff, LayoutList } from 'lucide-react';

const KATEGORI_OPTIONS = ['Fast Cleaning', 'Deep Cleaning', 'Special Treatment', 'Bag Cleaning', 'Add-On'];

export default function KelolaLayananPage() {
  const { services, addService, updateService, deleteService } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ kategori: 'Fast Cleaning', nama: '', harga: '', catatan: '', tampil_di_web: true });

  const openAdd = () => { setEditId(null); setForm({ kategori: 'Fast Cleaning', nama: '', harga: '', catatan: '', tampil_di_web: true }); setShowForm(true); };
  const openEdit = (s) => { setEditId(s.id); setForm({ kategori: s.kategori, nama: s.nama, harga: s.harga, catatan: s.catatan || '', tampil_di_web: s.tampil_di_web }); setShowForm(true); };

  const handleSave = () => {
    if (!form.nama || !form.harga) return Swal.fire('Error', 'Nama dan Harga wajib diisi.', 'error');
    if (editId) {
      updateService(editId, { ...form, harga: Number(form.harga) });
    } else {
      addService({ ...form, harga: Number(form.harga) });
    }
    setShowForm(false);
  };

  const handleDelete = (id, nama) => {
    Swal.fire({
      title: 'Hapus Layanan?',
      text: `Yakin ingin menghapus layanan "${nama}"? Tindakan ini tidak dapat dibatalkan.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteService(id);
      }
    });
  };

  // Group services by category
  const groupedServices = KATEGORI_OPTIONS.reduce((acc, cat) => {
    const catservices = services.filter(s => s.kategori === cat);
    if (catservices.length > 0) acc[cat] = catservices;
    return acc;
  }, {});

  // Add any missing categories
  const otherServices = services.filter(s => !KATEGORI_OPTIONS.includes(s.kategori));
  if (otherServices.length > 0) groupedServices['Lainnya'] = otherServices;

  return (
    <>
      <div className="page-head" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ background: 'var(--primary-tint)', padding: 12, borderRadius: 12, color: 'var(--primary)' }}>
            <Tags size={24} />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: 22 }}>Kelola Layanan & Harga</h1>
            <div className="sub" style={{ marginTop: 4 }}>Perubahan otomatis memperbarui harga di aplikasi dan web</div>
          </div>
        </div>
        <button className="btn btn-primary" style={{ padding: '0 20px', height: 44, borderRadius: 12 }} onClick={openAdd}>
          <Plus size={18} style={{ marginRight: 6 }} /> Tambah Layanan
        </button>
      </div>

      {Object.entries(groupedServices).map(([kategori, catServices]) => (
        <div key={kategori} style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: 'var(--primary-tint)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LayoutList size={18} />
            </div>
            <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>{kategori}</h2>
            <span style={{ padding: '4px 10px', background: 'var(--canvas-alt)', borderRadius: 12, fontSize: 12, fontWeight: 600, color: 'var(--ink-soft)' }}>
              {catServices.length} Layanan
            </span>
          </div>
          
          <div className="card" style={{ padding: 0, borderRadius: 20, overflow: 'hidden', border: '1px solid var(--line-soft)' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {catServices.map((s, index) => (
                <div key={s.id} className="hover-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: index === catServices.length - 1 ? 'none' : '1px solid var(--line-soft)', transition: 'background 0.2s', background: 'var(--card)' }}>
                  <div style={{ flex: 1, paddingRight: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                      <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--ink)' }}>{s.nama}</div>
                      {s.tampil_di_web ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700, color: '#0B6E4F', background: 'rgba(11, 110, 79, 0.1)', padding: '4px 8px', borderRadius: 6 }}>
                          <Globe size={12} /> Ditampilkan di Web
                        </span>
                      ) : (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700, color: 'var(--ink-faint)', background: 'var(--canvas-alt)', padding: '4px 8px', borderRadius: 6 }}>
                          <EyeOff size={12} /> Disembunyikan
                        </span>
                      )}
                    </div>
                    {s.catatan ? (
                      <div style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.5 }}>{s.catatan}</div>
                    ) : (
                      <div style={{ fontSize: 13, color: 'var(--ink-faint)', fontStyle: 'italic' }}>Tidak ada deskripsi</div>
                    )}
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
                    <div className="mono" style={{ fontSize: 18, fontWeight: 700, color: 'var(--ink)', minWidth: 100, textAlign: 'right' }}>
                      {fmtRp(s.harga)}
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="icon-btn" onClick={() => openEdit(s)} style={{ background: 'var(--canvas-alt)', color: 'var(--ink)', width: 38, height: 38, borderRadius: 10, borderColor: 'transparent' }} title="Edit Layanan">
                        <Pencil size={16} />
                      </button>
                      <button className="icon-btn" onClick={() => handleDelete(s.id, s.nama)} style={{ background: 'rgba(231, 76, 60, 0.1)', color: 'var(--danger)', width: 38, height: 38, borderRadius: 10, borderColor: 'transparent' }} title="Hapus Layanan">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      {/* Modal Popup Tambah/Edit */}
      {showForm && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }} onClick={() => setShowForm(false)}>
          <div className="card" onClick={e => e.stopPropagation()} style={{ width: '90%', maxWidth: 460, position: 'relative', padding: 32, borderRadius: 20, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div style={{ fontSize: 20, fontWeight: 700 }}>{editId ? 'Edit Layanan' : 'Tambah Layanan Baru'}</div>
              <button style={{ background: 'var(--canvas-alt)', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--ink)' }} onClick={() => setShowForm(false)}>
                <X size={16} />
              </button>
            </div>
            
            <div className="form-grid full" style={{ gap: 16 }}>
              <div className="field">
                <label style={{ fontSize: 13, fontWeight: 600 }}>Kategori Layanan</label>
                <select value={form.kategori} onChange={e => setForm(p => ({ ...p, kategori: e.target.value }))} style={{ height: 44, borderRadius: 10 }}>
                  {KATEGORI_OPTIONS.map(k => <option key={k} value={k}>{k}</option>)}
                  {!KATEGORI_OPTIONS.includes(form.kategori) && <option value={form.kategori}>{form.kategori}</option>}
                </select>
              </div>
              <div className="field">
                <label style={{ fontSize: 13, fontWeight: 600 }}>Nama Layanan</label>
                <input type="text" placeholder="mis. Deep Cleaning Canvas" value={form.nama} onChange={e => setForm(p => ({ ...p, nama: e.target.value }))} style={{ height: 44, borderRadius: 10 }} />
              </div>
              <div className="field">
                <label style={{ fontSize: 13, fontWeight: 600 }}>Harga (Rp)</label>
                <input type="number" placeholder="mis. 50000" value={form.harga} onChange={e => setForm(p => ({ ...p, harga: e.target.value }))} style={{ height: 44, borderRadius: 10 }} />
              </div>
              <div className="field">
                <label style={{ fontSize: 13, fontWeight: 600 }}>Catatan / Deskripsi Singkat</label>
                <input type="text" placeholder="mis. Khusus bahan kanvas" value={form.catatan} onChange={e => setForm(p => ({ ...p, catatan: e.target.value }))} style={{ height: 44, borderRadius: 10 }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'var(--canvas-alt)', borderRadius: 12, marginTop: 4 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>Tampilkan di Website</div>
                  <div style={{ fontSize: 12, color: 'var(--ink-soft)' }}>Pelanggan dapat melihat layanan ini di landing page</div>
                </div>
                <button type="button" className={`tswitch ${form.tampil_di_web ? 'on' : ''}`} onClick={() => setForm(p => ({ ...p, tampil_di_web: !p.tampil_di_web }))} />
              </div>
            </div>
            
            <button className="btn btn-primary" style={{ width: '100%', height: 48, marginTop: 24, fontSize: 15, justifyContent: 'center' }} onClick={handleSave}>
              {editId ? 'Simpan Perubahan' : 'Tambahkan Layanan'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
