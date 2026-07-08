import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { fmtRp } from '../../utils/helpers';
import { Search, Truck, ChevronDown, Plus, Star, MapPin, Phone, Clock, ArrowRight, Menu, X, Sparkles, CheckCircle2, ClipboardList, Droplets, Wind, PackageCheck, Sun, Moon } from 'lucide-react';
import TestimonialsSection from '../../components/ui/community-testimonial';
import { PixelTrail } from '../../components/ui/pixel-trail';
import { FloatingHeader } from '../../components/ui/floating-header';
import './LandingPage.css';

export default function LandingPage() {
  const { services, faq, feedbacks, toko, theme, setTheme } = useApp();
  const navigate = useNavigate();
  const trackRef = useRef(null);
  const servicesRef = useRef(null);
  const [trackInput, setTrackInput] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Fast Cleaning');
  const [isSvcHovered, setIsSvcHovered] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [feedbackForm, setFeedbackForm] = useState({ rating: 0, komentar: '', nama: '', noStruk: '' });
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { addFeedback } = useApp();

  const categories = [...new Set(services.filter(s => s.kategori !== 'Add-On' && s.tampil_di_web).map(s => s.kategori))];
  const addons = services.filter(s => s.kategori === 'Add-On' && s.tampil_di_web);
  const visibleFeedbacks = feedbacks.filter(f => f.tampilWeb).slice(0, 10);
  const visibleFaq = faq.filter(f => f.tampilWeb);

  // Transform feedbacks for the new component
  const tList = visibleFeedbacks.map((f, i) => ({
    id: f.id,
    quote: f.komentar,
    authorName: f.nama,
    authorTitle: `Rating: ${'★'.repeat(f.rating)}`,
    avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(f.nama)}&background=random`,
  }));

  const half = Math.ceil(tList.length / 2);
  let topRow = tList.slice(0, half);
  let bottomRow = tList.slice(half);

  // Pastikan minimal ada 8 item per baris agar tidak ada layar kosong (gap) di monitor ultrawide
  while (topRow.length > 0 && topRow.length < 8) {
    topRow = [...topRow, ...topRow];
  }
  while (bottomRow.length > 0 && bottomRow.length < 8) {
    bottomRow = [...bottomRow, ...bottomRow];
  }

  const testimonialsData = {
    eyebrow: "Kata Pelanggan",
    title: "Bukan Cuma Janji Bersih.",
    subtitle: "Lihat apa kata mereka yang sudah mempercayakan perawatan sepatunya kepada kami.",
    rows: [
      { id: "row1", speed: "45s", direction: "left", testimonials: topRow },
      { id: "row2", speed: "40s", direction: "right", testimonials: bottomRow },
    ],
  };



  const handleTrack = (e) => {
    e.preventDefault();
    if (trackInput.trim()) navigate(`/tracking?q=${encodeURIComponent(trackInput.trim())}`);
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (feedbackForm.rating === 0) return;
    addFeedback({
      nama: feedbackForm.nama || 'Anonim',
      rating: feedbackForm.rating,
      komentar: feedbackForm.komentar,
      tanggal: new Date().toISOString().split('T')[0],
      noStruk: feedbackForm.noStruk,
      verified: !!feedbackForm.noStruk,
    });
    setFeedbackSent(true);
    setFeedbackForm({ rating: 0, komentar: '', nama: '', noStruk: '' });
  };

  return (
    <div className="landing-page">
      <FloatingHeader 
        theme={theme} 
        setTheme={setTheme} 
        onTrackClick={() => trackRef.current?.focus()} 
      />

      {/* HERO */}
      <header className="hero hero-has-pixel">
        {/* Pixel Trail Background */}
        <div className="pixel-trail-bg">
          <PixelTrail
            pixelSize={120}
            fadeDuration={800}
            delay={0}
            pixelClassName="pixel-trail-item"
          />
        </div>

        <div className="container hero-grid relative-z10">
          <div className="pointer-events-auto">
            <h1>
              <span className="line-mask"><span className="hero-line" style={{ animationDelay: '0s' }}>Titip sepatu.</span></span><br />
              <span className="line-mask"><span className="hero-line" style={{ animationDelay: '0.1s' }}>Pantau sendiri.</span></span><br />
              <span className="line-mask"><em className="hero-line" style={{ animationDelay: '0.2s' }}>Ambil pas jadwalnya.</em></span>
            </h1>
            <p className="hero-sub">Serahkan sepatu kotor ke tim kami, dan tahu persis di tahap mana prosesnya berada tanpa perlu chat kasir buat nanya "udah sampai mana?".</p>
            <div className="hero-actions">
              <a href="#tracking-widget" className="btn btn-lg btn-primary"><Search size={17} /> Lacak Sepatu Saya</a>
              <a href="#layanan" className="btn btn-lg btn-ghost">Lihat Daftar Harga</a>
            </div>
          </div>

          <div id="tracking-widget" className="pointer-events-auto">
            <div className="tag-card">
              <div className="tag-hole" />
              <div className="tag-top">
                <div>
                  <div className="tag-kicker">Cek Status Sepatu</div>
                  <div className="tag-title">Kartu Lacak</div>
                </div>
                <div className="stamp">Real-time</div>
              </div>
              <form className="track-form" onSubmit={handleTrack}>
                <input ref={trackRef} type="text" placeholder="No. Struk atau Kode Tracking" value={trackInput} onChange={e => setTrackInput(e.target.value)} />
                <button type="submit" disabled={!trackInput.trim()}>Cek Status</button>
              </form>
              <div className="hint-row">
                Contoh: <button type="button" className="linklike" onClick={() => setTrackInput('TRX-0512')}>TRX-0512</button> (multi-sepatu), <button type="button" className="linklike" onClick={() => setTrackInput('RCS-1042')}>RCS-1042</button> (single)
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* DIVIDER MARQUEE */}
      <div className="marquee-divider">
        <div className="marquee-content">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="marquee-group" aria-hidden={i > 0}>
              <span>FAST CLEANING</span><span className="dot">✦</span>
              <span>DEEP CLEANING</span><span className="dot">✦</span>
              <span>UNYELLOWING</span><span className="dot">✦</span>
              <span>REPAINT</span><span className="dot">✦</span>
              <span>LEATHER CARE</span><span className="dot">✦</span>
            </div>
          ))}
        </div>
      </div>

      {/* PROSES */}
      <section id="proses" className="process-alt">
        <div className="container">
          <div className="section-head text-center-mobile">
            <span className="eyebrow">Alur Pengerjaan</span>
            <h2>Lima tahap transparan.</h2>
            <p>Pantau perjalanan sepatumu dari awal hingga siap diambil.</p>
          </div>
          <div className="process-track-premium">
            {[
              { title: 'Diterima', icon: ClipboardList, desc: 'Pengecekan awal' },
              { title: 'Pencucian', icon: Droplets, desc: 'Treatment khusus' },
              { title: 'Finishing', icon: Wind, desc: 'Pengeringan & perapian' },
              { title: 'Quality Control', icon: Search, desc: 'Inspeksi standar' },
              { title: 'Siap Diambil', icon: PackageCheck, desc: 'Notifikasi otomatis' }
            ].map((step, i) => {
              const Icon = step.icon;
              return (
                <div className={`p-card ${i < 2 ? 'active' : ''}`} key={i}>
                  <div className="p-card-icon-wrap">
                    <Icon size={28} className="p-card-icon" />
                    <div className="p-card-num">{i + 1}</div>
                  </div>
                  <div className="p-card-content">
                    <h3 className="p-name">{step.title}</h3>
                    <p className="p-desc">{step.desc}</p>
                  </div>
                  {i < 4 && <div className="p-connector" />}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* LAYANAN & HARGA */}
      <section id="layanan" className="services-section">
        <div className="container">
          <div className="section-head text-center-mobile">
            <span className="eyebrow"><Sparkles size={16} style={{ display: 'inline', marginBottom: '-3px', marginRight: '4px' }} /> Layanan & Harga</span>
            <h2>Pilih yang pas buat sepatumu.</h2>
            <p>Berbagai treatment spesifik dengan harga yang transparan sejak awal. Kualitas terbaik, tanpa biaya tersembunyi.</p>
          </div>

          <div className="svc-tabs-wrapper">
            <div className="svc-tabs">
              {categories.map(cat => (
                <button key={cat} className={`svc-tab ${activeTab === cat ? 'active' : ''}`} onClick={() => setActiveTab(cat)}>{cat}</button>
              ))}
            </div>
          </div>

          <div
            className={`svc-carousel ${(activeTab === 'Fast Cleaning' || activeTab === 'Deep Cleaning') ? 'is-animating' : ''}`}
            data-theme={activeTab === 'Deep Cleaning' ? 'deep' : 'default'}
          >
            <div className="svc-carousel-track">
              {/* Original Block */}
              <div className="svc-carousel-inner">
                {services.filter(s => s.kategori === activeTab && s.tampil_di_web).map(s => (
                  <div className="svc-card" key={s.id}>
                    <div className="svc-card-top">
                      <h3 className="svc-name">{s.nama}</h3>
                      <div className="svc-price-tag">{fmtRp(s.harga)}</div>
                    </div>
                    <p className="svc-note">{s.catatan || `Perawatan intensif dan maksimal untuk mengembalikan kondisi terbaik ${s.kategori.toLowerCase().includes('bag') || s.kategori.toLowerCase().includes('tas') ? 'tas' : 'sepatu'} kesayanganmu.`}</p>
                    <ul className="svc-features">
                      <li><CheckCircle2 size={15} className="feature-icon" /> Garansi kepuasan pelanggan</li>
                      <li><CheckCircle2 size={15} className="feature-icon" /> Material treatment premium</li>
                    </ul>
                  </div>
                ))}
              </div>

              {/* Duplicate Block for Seamless Loop */}
              {(activeTab === 'Fast Cleaning' || activeTab === 'Deep Cleaning') && (
                <div className="svc-carousel-inner" aria-hidden="true">
                  {services.filter(s => s.kategori === activeTab && s.tampil_di_web).map(s => (
                    <div className="svc-card" key={`${s.id}-dup`}>
                      <div className="svc-card-top">
                        <h3 className="svc-name">{s.nama}</h3>
                        <div className="svc-price-tag">{fmtRp(s.harga)}</div>
                      </div>
                      <p className="svc-note">{s.catatan || `Perawatan intensif dan maksimal untuk mengembalikan kondisi terbaik ${s.kategori.toLowerCase().includes('bag') || s.kategori.toLowerCase().includes('tas') ? 'tas' : 'sepatu'} kesayanganmu.`}</p>
                      <ul className="svc-features">
                        <li><CheckCircle2 size={15} className="feature-icon" /> Garansi kepuasan pelanggan</li>
                        <li><CheckCircle2 size={15} className="feature-icon" /> Material treatment premium</li>
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {addons.length > 0 && (
            <div className="addon-premium">
              <div className="addon-icon-wrap"><Sparkles size={24} /></div>
              <div className="addon-content">
                <strong>Ekstra Add-On (Opsional)</strong>
                <div className="addon-chips">
                  {addons.map((a, idx) => (
                    <span className="addon-chip" key={idx}>
                      {a.nama} <span className="addon-price">+{fmtRp(a.harga)}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="faq-section">
        <div className="container">
          <div className="section-head text-center-mobile">
            <span className="eyebrow">Pertanyaan Umum</span>
            <h2>Sebelum kamu tanya kasir.</h2>
            <p>Jawaban cepat untuk hal-hal yang paling sering ditanyakan pelanggan kami.</p>
          </div>
          <div className="faq-list-premium">
            {visibleFaq.map(item => (
              <div className={`faq-card ${openFaq === item.id ? 'open' : ''}`} key={item.id}>
                <button className="faq-q" onClick={() => setOpenFaq(openFaq === item.id ? null : item.id)}>
                  <span className="faq-q-text">{item.pertanyaan}</span>
                  <div className="faq-icon-wrap">
                    <Plus size={20} className="faq-icon" />
                  </div>
                </button>
                <div className="faq-a" style={{ maxHeight: openFaq === item.id ? 200 : 0 }}>
                  <div className="faq-a-inner">
                    <p>{item.jawaban}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONI BARU */}
      <div id="testimoni" className="w-full overflow-hidden flex justify-center pb-24">
        {tList.length > 0 && <TestimonialsSection data={testimonialsData} />}
      </div>

      {/* FEEDBACK */}
      <section id="feedback">
        <div className="container">
          <div className="feedback-wrap">
            <div className="section-head">
              <span className="eyebrow" style={{ color: '#8FD7B8' }}>Beri Feedback</span>
              <h2 style={{ color: '#fff' }}>Ceritakan pengalamanmu.</h2>
              <p style={{ color: '#B9C5BE' }}>Bisa diisi kapan saja, tanpa perlu login atau menunggu link dari kami. Masukan kamu ditinjau tim sebelum ditampilkan ke publik.</p>
            </div>
            <div>
              <form onSubmit={handleFeedbackSubmit}>
                <div className="f-field">
                  <label>Rating</label>
                  <div className="star-picker">
                    {[1, 2, 3, 4, 5].map(v => (
                      <button key={v} type="button" className={`star-btn ${feedbackForm.rating >= v ? 'on' : ''}`} onClick={() => setFeedbackForm(p => ({ ...p, rating: v }))}>
                        <Star size={28} fill={feedbackForm.rating >= v ? 'currentColor' : 'none'} />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="f-field">
                  <label>Komentar (opsional)</label>
                  <textarea rows="3" placeholder="Ceritakan pengalaman kamu..." value={feedbackForm.komentar} onChange={e => setFeedbackForm(p => ({ ...p, komentar: e.target.value }))} />
                </div>
                <div className="f-row">
                  <div className="f-field"><label>Nama Tampilan (opsional)</label><input type="text" placeholder="Anonim" value={feedbackForm.nama} onChange={e => setFeedbackForm(p => ({ ...p, nama: e.target.value }))} /></div>
                  <div className="f-field"><label>No. Struk / No. HP</label><input type="text" placeholder="Untuk menautkan ke transaksi" value={feedbackForm.noStruk} onChange={e => setFeedbackForm(p => ({ ...p, noStruk: e.target.value }))} /></div>
                </div>
                <button type="submit" className="btn-submit" disabled={feedbackForm.rating === 0}>Kirim Feedback</button>
                {feedbackSent && <div className="f-confirm show">Terima kasih! Feedback kamu akan ditinjau tim kami.</div>}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="kontak">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="brand">
                <span className="brand-name" style={{ fontSize: 17 }}>Rumah Cuci Sepatu</span>
              </div>
              <p>Titip sepatu, kami rawat sampai bersih — status pengerjaan bisa kamu pantau sendiri, kapan saja.</p>
              <a href={`https://wa.me/62${toko.noWA?.replace(/[^0-9]/g, '')}`} className="wa-btn" target="_blank" rel="noreferrer">
                <Phone size={16} /> Hubungi via WhatsApp
              </a>
            </div>
            <div className="footer-col">
              <h4>Navigasi</h4>
              <a href="#proses">Alur Pengerjaan</a>
              <a href="#layanan">Layanan & Harga</a>
              <a href="#faq">FAQ</a>
              <a href="#testimoni">Kata Pelanggan</a>
              <a href="#feedback">Beri Feedback</a>
            </div>
            <div className="footer-col">
              <h4>Lokasi Outlet</h4>
              <p>{toko.alamat}</p>
              <a href={toko.linkMaps} style={{ fontWeight: 600, color: 'var(--primary-dark)' }} target="_blank" rel="noreferrer">Buka di Google Maps →</a>
            </div>
            <div className="footer-col">
              <h4>Jam Operasional</h4>
              {toko.jamOperasional?.map((j, i) => (
                <div className="footer-hours" key={i}><span>{j.hari}</span><span>{j.buka}–{j.tutup}</span></div>
              ))}
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 Rumah Cuci Sepatu. Semua hak dilindungi.</span>
            <span>Dibuat untuk memudahkan kamu, bukan sekadar dipajang.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
