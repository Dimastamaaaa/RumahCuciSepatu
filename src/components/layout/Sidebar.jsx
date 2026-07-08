import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard, ShoppingBag, Search, Footprints, FileText,
  Calendar, List, Users, Store, DollarSign, BarChart3, Star, User, LogOut, Menu, HelpCircle
} from 'lucide-react';
import './Sidebar.css';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/app/dashboard', group: '', roles: ['owner'] },
  
  { id: 'pos', label: 'Transaksi Baru', icon: ShoppingBag, path: '/app/pos', group: 'Operasional', roles: ['owner', 'kasir'] },
  { id: 'cari-transaksi', label: 'Cari Transaksi', icon: Search, path: '/app/cari-transaksi', group: 'Operasional', roles: ['owner', 'kasir'] },
  { id: 'update-status', label: 'Update Status Sepatu', icon: Footprints, path: '/app/update-status', group: 'Operasional', roles: ['owner', 'kasir', 'teknisi'] },
  { id: 'calendar', label: 'Calendar Deadline', icon: Calendar, path: '/app/calendar', group: 'Operasional', roles: ['owner', 'kasir'] },
  
  { id: 'catat-pengeluaran', label: 'Catat Pengeluaran', icon: DollarSign, path: '/app/catat-pengeluaran', group: 'Keuangan & Laporan', roles: ['owner'] },
  { id: 'laporan-profit', label: 'Laporan Profit', icon: BarChart3, path: '/app/laporan-profit', group: 'Keuangan & Laporan', roles: ['owner'] },
  { id: 'feedback-csat', label: 'Feedback & CSAT', icon: Star, path: '/app/feedback-csat', group: 'Keuangan & Laporan', roles: ['owner'] },
  
  { id: 'kelola-layanan', label: 'Kelola Layanan & Harga', icon: List, path: '/app/kelola-layanan', group: 'Pengaturan', roles: ['owner'] },
  { id: 'kelola-faq', label: 'Kelola FAQ', icon: HelpCircle, path: '/app/kelola-faq', group: 'Pengaturan', roles: ['owner'] },
  { id: 'setting-staff', label: 'Setting Kasir/Staff', icon: Users, path: '/app/setting-staff', group: 'Pengaturan', roles: ['owner'] },
  { id: 'pengaturan-toko', label: 'Pengaturan Toko', icon: Store, path: '/app/pengaturan-toko', group: 'Pengaturan', roles: ['owner'] },
  { id: 'akun-saya', label: 'Akun Saya', icon: User, path: '/app/akun-saya', group: 'Pengaturan', roles: ['owner', 'kasir', 'teknisi'] },
];

const ROLE_LABEL = { owner: 'Owner', kasir: 'Kasir', teknisi: 'Teknisi' };

export default function Sidebar({ isOpen, onClose }) {
  const { currentUser, logout } = useApp();
  const navigate = useNavigate();
  const role = (currentUser?.role || 'kasir').toLowerCase();

  const items = NAV_ITEMS.filter(n => n.roles.includes(role));

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  let lastGroup = '__init__';

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sb-brand">
          <span className="brand-mark">
            <svg viewBox="0 0 24 24" fill="none"><path d="M3 15c1.5-3 3-4 5-4 1.5 0 2 1 3.5 1s2-1 3.5-1c2 0 3.5 1 5 4v3H3v-3z" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round"/></svg>
          </span>
          <span>Rumah Cuci Sepatu</span>
        </div>

        <nav className="sb-nav">
          {items.map(item => {
            const Icon = item.icon;
            let groupLabel = null;
            if (item.group !== lastGroup && item.group !== '') {
              groupLabel = <div className="sb-group-label">{item.group}</div>;
            } else if (item.group === '' && lastGroup !== '' && lastGroup !== '__init__') {
              groupLabel = <div style={{ height: 10 }} />;
            }
            lastGroup = item.group;
            return (
              <div key={item.id}>
                {groupLabel}
                <NavLink
                  to={item.path}
                  className={({ isActive }) => `sb-item ${isActive ? 'active' : ''}`}
                  onClick={onClose}
                >
                  <Icon size={17} />
                  <span>{item.label}</span>
                </NavLink>
              </div>
            );
          })}
        </nav>

        <div className="sb-footer">
          <div className="sb-role-badge">Masuk sebagai {ROLE_LABEL[role]}</div>
          <button className="sb-logout" onClick={handleLogout}>
            <LogOut size={17} />
            <span>Keluar</span>
          </button>
        </div>
      </aside>
    </>
  );
}
