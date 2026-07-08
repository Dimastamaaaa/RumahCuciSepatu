import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Swal from 'sweetalert2';
import { HelpCircle, Plus, X, Pencil, Trash2, Globe, EyeOff } from 'lucide-react';

export default function KelolaFAQPage() {
  const { faq, addFAQ, updateFAQ, deleteFAQ } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ pertanyaan: '', jawaban: '', tampilWeb: true });

  const openAdd = () => { setEditId(null); setForm({ pertanyaan: '', jawaban: '', tampilWeb: true }); setShowForm(true); };
  const openEdit = (f) => { setEditId(f.id); setForm({ pertanyaan: f.pertanyaan, jawaban: f.jawaban, tampilWeb: f.tampilWeb }); setShowForm(true); };

  const handleSave = () => {
    if (!form.pertanyaan || !form.jawaban) return Swal.fire('Error', 'Pertanyaan dan jawaban wajib diisi.', 'error');
    if (editId) {
      updateFAQ(editId, form);
    } else {
      addFAQ(form);
    }
    setShowForm(false);
  };

  const handleDelete = (id, tanya) => {
    Swal.fire({
      title: 'Hapus FAQ?',
      text: `Yakin ingin menghapus FAQ "${tanya}"? Tindakan ini tidak dapat dibatalkan.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteFAQ(id);
      }
    });
  };

  return (
    <>
      <div className="page-head" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ background: 'var(--primary-tint)', padding: 12, borderRadius: 12, color: 'var(--primary)' }}>
            <HelpCircle size={24} />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: 22 }}>Kelola FAQ</h1>
            <div className="sub" style={{ marginTop: 4 }}>Atur pertanyaan dan jawaban yang sering diajukan pelanggan di Landing Page</div>
          </div>
        </div>
        <button className="btn btn-primary" style={{ padding: '0 20px', height: 44, borderRadius: 12 }} onClick={openAdd}>
          <Plus size={18} style={{ marginRight: 6 }} /> Tambah FAQ
        </button>
      </div>

      <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {faq.length === 0 ? (
          <div className="card" style={{ padding: 40, textAlign: 'center', color: 'var(--ink-soft)' }}>
            Belum ada FAQ yang ditambahkan.
          </div>
        ) : (
          faq.map(f => (
            <div key={f.id} className="card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 20 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                    <h3 style={{ margin: 0, fontSize: 16 }}>{f.pertanyaan}</h3>
                    {f.tampilWeb ? (
                      <span className="badge" style={{ background: 'var(--primary-tint)', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Globe size={12} /> Publik
                      </span>
                    ) : (
                      <span className="badge" style={{ background: 'var(--line)', color: 'var(--ink-soft)', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <EyeOff size={12} /> Tersembunyi
                      </span>
                    )}
                  </div>
                  <p style={{ margin: 0, color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.6 }}>{f.jawaban}</p>
                </div>
                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  <button className="icon-btn" onClick={() => openEdit(f)} title="Edit FAQ">
                    <Pencil size={16} />
                  </button>
                  <button className="icon-btn" style={{ color: '#e74c3c' }} onClick={() => handleDelete(f.id, f.pertanyaan)} title="Hapus FAQ">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 500 }}>
            <div className="modal-header">
              <h2 style={{ margin: 0 }}>{editId ? 'Edit FAQ' : 'Tambah FAQ Baru'}</h2>
              <button className="icon-btn" onClick={() => setShowForm(false)}><X size={20} /></button>
            </div>
            <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="form-group">
                <label>Pertanyaan</label>
                <input 
                  type="text" 
                  className="input" 
                  value={form.pertanyaan} 
                  onChange={e => setForm({...form, pertanyaan: e.target.value})} 
                  placeholder="Contoh: Apakah bisa cuci sepatu putih yang menguning?"
                />
              </div>
              <div className="form-group">
                <label>Jawaban</label>
                <textarea 
                  className="input" 
                  style={{ minHeight: 120, resize: 'vertical' }}
                  value={form.jawaban} 
                  onChange={e => setForm({...form, jawaban: e.target.value})} 
                  placeholder="Tuliskan jawaban yang jelas dan informatif..."
                />
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', marginTop: 8 }}>
                <input 
                  type="checkbox" 
                  checked={form.tampilWeb} 
                  onChange={e => setForm({...form, tampilWeb: e.target.checked})} 
                  style={{ width: 18, height: 18, accentColor: 'var(--primary)' }}
                />
                <span style={{ fontWeight: 500 }}>Tampilkan di Landing Page</span>
              </label>
              <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                <button className="btn" style={{ background: 'var(--canvas-alt)' }} onClick={() => setShowForm(false)}>Batal</button>
                <button className="btn btn-primary" onClick={handleSave}>Simpan FAQ</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
