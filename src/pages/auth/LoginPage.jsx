import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Eye, EyeOff, ChevronLeft } from 'lucide-react';
import './LoginPage.css';

const ROLE_HOME = { owner: '/app/dashboard', kasir: '/app/pos', teknisi: '/app/update-status' };

export default function LoginPage() {
  const { login, currentUser } = useApp();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [forgotNote, setForgotNote] = useState('');

  if (currentUser) {
    navigate(ROLE_HOME[currentUser.role] || '/app/dashboard', { replace: true });
    return null;
  }



  const handleSubmit = (e) => {
    e.preventDefault();
    const user = login(username, password);
    if (user) {
      navigate(ROLE_HOME[user.role] || '/app/dashboard', { replace: true });
    } else {
      setError('Username atau password salah, atau akun tidak aktif.');
    }
  };

  const showForgot = () => {
    setForgotNote('Silakan hubungi Administrator atau Owner toko untuk melakukan reset password akun Anda.');
  };

  return (
    <div className="login-view">
      <div className="login-brand">
        <div className="lb-top">
          <span className="brand-mark">
            <img src="/rcs.svg" alt="RCS Logo" style={{ width: 26, height: 26, filter: 'invert(1) brightness(2)' }} />
          </span>
          <span className="lb-brandname" style={{ fontSize: 22, letterSpacing: '0.04em' }}>RCSlaundry</span>
        </div>
        <div className="lb-mid">
          <h1>Manajemen Operasional<br/>Terpusat.</h1>
          <p>Selamat datang di sistem manajemen pintar RCSlaundry. Pantau operasional kasir, alur kerja workshop, hingga performa bisnis Anda dari satu portal yang aman dan terintegrasi.</p>
        </div>

      </div>

      <div className="login-form-wrap">
        <div className="login-form">
          <span className="eyebrow">Masuk ke Sistem</span>
          <h2>Selamat datang kembali</h2>
          <p>Masukkan username atau nomor HP yang terdaftar.</p>



          <form onSubmit={handleSubmit}>
            <div className="f-field">
              <label>Username / No. HP</label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
            </div>
            <div className="f-field pw-row">
              <label>Password</label>
              <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} />
              <button type="button" className="pw-toggle" onClick={() => setShowPw(!showPw)}>
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className="login-meta">
              <label className="chk"><input type="checkbox" defaultChecked /> Ingat saya</label>
              <button type="button" className="forgot-link" onClick={showForgot}>Lupa password?</button>
            </div>
            {forgotNote && <div className="login-note show">{forgotNote}</div>}
            {error && <div className="login-error">{error}</div>}
            <button type="submit" className="btn-login">Masuk</button>
            <Link to="/" className="login-back-link">
              <ChevronLeft size={16} />
              Kembali ke Beranda
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
