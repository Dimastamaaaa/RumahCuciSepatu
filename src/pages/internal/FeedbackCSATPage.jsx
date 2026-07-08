import { useApp } from '../../context/AppContext';
import { fmtDate } from '../../utils/helpers';
import { MessageSquareHeart, Star, ShieldCheck, Globe, EyeOff, User } from 'lucide-react';

export default function FeedbackCSATPage() {
  const { feedbacks, updateFeedback } = useApp();
  const avg = feedbacks.length > 0 ? (feedbacks.reduce((s, f) => s + f.rating, 0) / feedbacks.length).toFixed(1) : '0.0';

  return (
    <>
      <div className="page-head" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap', marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ background: 'var(--primary-tint)', padding: 12, borderRadius: 12, color: 'var(--primary)' }}>
            <MessageSquareHeart size={24} />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: 22 }}>Feedback & CSAT</h1>
            <div className="sub" style={{ marginTop: 4 }}>Pilih ulasan terbaik untuk ditampilkan di Landing Page</div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 32, padding: 24, borderRadius: 20, display: 'flex', alignItems: 'center', gap: 24, background: 'var(--card)' }}>
         <div style={{ textAlign: 'center', paddingRight: 28, borderRight: '1px solid var(--line)' }}>
            <div style={{ fontSize: 48, fontWeight: 800, color: 'var(--ink)', lineHeight: 1 }}>{avg}</div>
            <div style={{ display: 'flex', color: '#f1c40f', justifyContent: 'center', margin: '8px 0', gap: 2 }}>
               <Star size={16} fill="#f1c40f" />
               <Star size={16} fill="#f1c40f" />
               <Star size={16} fill="#f1c40f" />
               <Star size={16} fill="#f1c40f" />
               <Star size={16} fill={parseFloat(avg) >= 4.5 ? '#f1c40f' : 'none'} color={parseFloat(avg) >= 4.5 ? '#f1c40f' : 'var(--line-soft)'} />
            </div>
            <div style={{ fontSize: 13, color: 'var(--ink-soft)' }}>Dari {feedbacks.length} ulasan</div>
         </div>
         <div style={{ flex: 1 }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: 17 }}>Apa kata pelanggan tentang layanan Anda?</h3>
            <p style={{ margin: 0, fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.6 }}>
               Ulasan yang ditandai dengan ikon centang (<ShieldCheck size={14} style={{ display: 'inline', color: '#2ecc71', verticalAlign: 'middle' }} />) adalah ulasan <b>Terverifikasi</b>. Pelanggan tersebut benar-benar melakukan transaksi dan mengisi kuesioner dari link WhatsApp otomatis.
            </p>
         </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
        {feedbacks.map(f => (
          <div key={f.id} className="hover-card" style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column', gap: 16, transition: 'all 0.2s' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                   <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'var(--canvas-alt)', color: 'var(--ink-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <User size={20} />
                   </div>
                   <div>
                      <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: 6 }}>
                         {f.nama} {f.verified && <ShieldCheck size={15} style={{ color: '#2ecc71' }} title="Terverifikasi" />}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--ink-faint)', marginTop: 2 }}>{fmtDate(f.tanggal)}</div>
                   </div>
                </div>
                <div style={{ display: 'flex', color: '#f1c40f', gap: 2 }}>
                   {[1,2,3,4,5].map(s => <Star key={s} size={14} fill={s <= f.rating ? '#f1c40f' : 'none'} color={s <= f.rating ? '#f1c40f' : 'var(--line-soft)'} />)}
                </div>
             </div>
             
             <div style={{ margin: 0, fontSize: 14, color: 'var(--ink)', lineHeight: 1.6, flex: 1, fontStyle: 'italic', background: 'var(--canvas-alt)', padding: 16, borderRadius: 12 }}>
                "{f.komentar}"
             </div>
             
             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 16, borderTop: '1px dashed var(--line)' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {f.tampilWeb ? (
                      <><Globe size={16} style={{ color: 'var(--primary)' }} /> <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--primary)' }}>Tampil di Web</span></>
                    ) : (
                      <><EyeOff size={16} style={{ color: 'var(--ink-faint)' }} /> <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-soft)' }}>Disembunyikan</span></>
                    )}
                 </div>
                 <button className={`tswitch ${f.tampilWeb ? 'on' : ''}`} onClick={() => updateFeedback(f.id, { tampilWeb: !f.tampilWeb })} style={{ margin: 0 }} />
             </div>
          </div>
        ))}
      </div>
      
      {feedbacks.length === 0 && (
        <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--ink-soft)' }}>
          Belum ada ulasan dari pelanggan.
        </div>
      )}
    </>
  );
}
