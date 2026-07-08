import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { AppProvider } from './context/AppContext';
import LandingPage from './pages/public/LandingPage';
import TrackingPage from './pages/public/TrackingPage';
import LoginPage from './pages/auth/LoginPage';
import AppShell from './components/layout/AppShell';
import DashboardPage from './pages/internal/DashboardPage';
import POSPage from './pages/internal/POSPage';
import CariTransaksiPage from './pages/internal/CariTransaksiPage';
import DetailTransaksiPage from './pages/internal/DetailTransaksiPage';
import UpdateStatusPage from './pages/internal/UpdateStatusPage';
import StrukPage from './pages/internal/StrukPage';
import CalendarPage from './pages/internal/CalendarPage';
import KelolaLayananPage from './pages/internal/KelolaLayananPage';
import SettingStaffPage from './pages/internal/SettingStaffPage';
import PengaturanTokoPage from './pages/internal/PengaturanTokoPage';
import KelolaFAQPage from './pages/internal/KelolaFAQPage';
import CatatPengeluaranPage from './pages/internal/CatatPengeluaranPage';
import LaporanProfitPage from './pages/internal/LaporanProfitPage';
import FeedbackCSATPage from './pages/internal/FeedbackCSATPage';
import AkunSayaPage from './pages/internal/AkunSayaPage';

// Override global alert dengan toast modern
window.alert = (msg) => {
  toast(msg, {
    duration: 4000,
    style: {
      borderRadius: '12px',
      background: '#1a1f1c',
      color: '#fff',
      padding: '14px 20px',
      boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
      fontSize: '14px',
      fontWeight: '500',
      border: '1px solid rgba(255,255,255,0.08)'
    }
  });
};

export default function App() {
  return (
    <AppProvider>
      <Toaster position="top-center" reverseOrder={false} />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/tracking" element={<TrackingPage />} />
          
          {/* Auth Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes inside AppShell */}
          <Route path="/app" element={<AppShell />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="pos" element={<POSPage />} />
            <Route path="cari-transaksi" element={<CariTransaksiPage />} />
            <Route path="detail-transaksi/:id" element={<DetailTransaksiPage />} />
            <Route path="update-status" element={<UpdateStatusPage />} />
            <Route path="struk/:id" element={<StrukPage />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="kelola-layanan" element={<KelolaLayananPage />} />
            <Route path="setting-staff" element={<SettingStaffPage />} />
            <Route path="pengaturan-toko" element={<PengaturanTokoPage />} />
            <Route path="kelola-faq" element={<KelolaFAQPage />} />
            <Route path="catat-pengeluaran" element={<CatatPengeluaranPage />} />
            <Route path="laporan-profit" element={<LaporanProfitPage />} />
            <Route path="feedback-csat" element={<FeedbackCSATPage />} />
            <Route path="akun-saya" element={<AkunSayaPage />} />
          </Route>
          
          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
