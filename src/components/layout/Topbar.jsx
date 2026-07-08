import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Search, Moon, Sun, Bell, Menu, Clock, MessageSquare, X } from 'lucide-react';
import { getDeadlineLabel } from '../../utils/helpers';
import './Topbar.css';

const ROLE_LABEL = { owner: 'Owner', kasir: 'Kasir', teknisi: 'Teknisi' };

export default function Topbar({ onToggleSidebar }) {
  const { currentUser, theme, setTheme, transactions, feedbacks } = useApp();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [showNotif, setShowNotif] = useState(false);
  const notifRef = useRef(null);
  
  const role = currentUser?.role || 'kasir';
  const initial = currentUser?.nama?.charAt(0).toUpperCase() || 'U';

  // Kalkulasi Notifikasi
  const allShoes = transactions.flatMap(t => t.sepatu);
  const urgentShoes = allShoes.filter(s => {
    const dl = getDeadlineLabel(s.estimasi);
    return (dl === 'Terlambat' || dl === 'H-0') && s.stage < s.stages.length;
  });
  const newFeedbacks = feedbacks.filter(f => f.status === 'Belum Ditinjau');
  
  const notifCount = urgentShoes.length + newFeedbacks.length;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotif(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDark = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      if (query.trim()) {
        navigate(`/app/cari-transaksi?q=${encodeURIComponent(query.trim())}`);
        setQuery(''); // Kosongkan input setelah pencarian
      } else {
        navigate('/app/cari-transaksi');
      }
    }
  };

  return (
    <div className="topbar">
      <button className="icon-btn mobile-nav-btn" onClick={onToggleSidebar}>
        <Menu size={18} />
      </button>
      <div className="tb-search">
        <Search size={16} className="tb-search-icon" />
        <input 
          type="text" 
          placeholder="Ketik & tekan Enter untuk mencari..." 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleSearch}
        />
      </div>
      <div className="tb-actions">
        <button className="icon-btn" onClick={toggleDark} title={theme === 'dark' ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}>
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>
        <div style={{ position: 'relative' }} ref={notifRef}>
          <button className="icon-btn" onClick={() => setShowNotif(!showNotif)} title="Notifikasi" style={{ position: 'relative' }}>
            <Bell size={17} />
            {notifCount > 0 && (
              <span style={{ position: 'absolute', top: 6, right: 6, width: 8, height: 8, background: '#e74c3c', borderRadius: '50%', border: '2px solid var(--canvas)' }} />
            )}
          </button>
          
          {showNotif && (
            <div style={{ position: 'absolute', top: 'calc(100% + 10px)', right: 0, width: 320, background: 'var(--card)', borderRadius: 16, boxShadow: '0 10px 40px rgba(0,0,0,0.15)', border: '1px solid var(--line)', zIndex: 99, overflow: 'hidden', animation: 'slideDown 0.2s ease-out' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>Notifikasi ({notifCount})</h3>
                <button onClick={() => setShowNotif(false)} style={{ background: 'none', border: 'none', color: 'var(--ink-soft)', cursor: 'pointer' }}><X size={16} /></button>
              </div>
              
              <div style={{ maxHeight: 340, overflowY: 'auto' }}>
                {notifCount === 0 ? (
                  <div style={{ padding: 40, textAlign: 'center', color: 'var(--ink-soft)', fontSize: 13 }}>Tidak ada notifikasi baru.</div>
                ) : (
                  <>
                    {urgentShoes.map(s => (
                      <div key={s.id} onClick={() => { setShowNotif(false); navigate('/app/calendar'); }} style={{ padding: '16px 20px', borderBottom: '1px solid var(--line-soft)', display: 'flex', gap: 12, cursor: 'pointer', transition: 'background 0.2s', ':hover': { background: 'var(--canvas-alt)' } }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(231, 76, 60, 0.1)', color: '#e74c3c', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Clock size={16} /></div>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>Sepatu Mendekati Deadline!</div>
                          <div style={{ fontSize: 13, color: 'var(--ink-soft)', marginTop: 4 }}>{s.jenis} ({s.tracking}) berstatus <b>{getDeadlineLabel(s.estimasi)}</b>.</div>
                        </div>
                      </div>
                    ))}
                    {newFeedbacks.map(f => (
                      <div key={f.id} onClick={() => { setShowNotif(false); navigate('/app/feedback-csat'); }} style={{ padding: '16px 20px', borderBottom: '1px solid var(--line-soft)', display: 'flex', gap: 12, cursor: 'pointer', transition: 'background 0.2s' }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(241, 196, 15, 0.1)', color: '#f39c12', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><MessageSquare size={16} /></div>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>Ulasan Pelanggan Baru</div>
                          <div style={{ fontSize: 13, color: 'var(--ink-soft)', marginTop: 4 }}>Pelanggan <b>{f.nama}</b> memberi {f.rating} bintang.</div>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="tb-user" onClick={() => navigate('/app/akun-saya')} style={{ cursor: 'pointer' }} title="Pengaturan Akun">
          <div className="tb-avatar">{initial}</div>
          <div>
            <div className="tb-user-name">{currentUser?.nama || 'User'}</div>
            <div className="tb-user-role">{ROLE_LABEL[role]}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
