import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { fmtRp, fmtDate } from '../../utils/helpers';
import { Printer, MessageCircle, Loader2, ArrowLeft } from 'lucide-react';
import { useRef, useState } from 'react';

export default function StrukPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { transactions, toko } = useApp();
  const trx = transactions.find(t => t.id === id);
  const receiptRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!trx) return <div className="empty-state"><h3>Transaksi tidak ditemukan</h3></div>;

  const totalSepatu = trx.sepatu.reduce((s, sh) => s + sh.harga, 0);
  const totalTagihan = totalSepatu + trx.biayaJemputAntar;

  const handleSendWA = async () => {
    if (!receiptRef.current) return;
    setIsGenerating(true);
    
    const hpRaw = trx.hp.replace(/[^0-9]/g, '');
    const waNumber = hpRaw.startsWith('0') ? '62' + hpRaw.slice(1) : hpRaw;
    const textMsg = `Halo ${trx.pelanggan}, ini struk transaksi Anda.\nKode Transaksi: ${trx.kode}\nTotal: ${fmtRp(totalTagihan)}\n\nPantau statusnya di sini:\n${window.location.origin}/tracking?q=${trx.kode}`;
    const waUrl = `https://api.whatsapp.com/send?phone=${waNumber}&text=${encodeURIComponent(textMsg)}`;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    let waWindow = null;
    if (!isMobile) {
      waWindow = window.open(waUrl, '_blank');
      if (!waWindow) {
        window.location.href = waUrl;
      }
    }

    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2, // Kualitas lebih tinggi
        backgroundColor: '#ffffff'
      });
      
      canvas.toBlob(async (blob) => {
        if (!blob) {
          setIsGenerating(false);
          return;
        }
        
        const file = new File([blob], `struk-${trx.kode}.png`, { type: 'image/png' });

        // 1. Coba Web Share API (Mobile / Safari)
        if (isMobile && navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
              title: 'Struk Transaksi',
              text: textMsg
            });
            setIsGenerating(false);
            return;
          } catch (e) {
            console.log('Share dibatalkan', e);
          }
        }

        // 2. Fallback: Copy to Clipboard (Desktop)
        try {
          await navigator.clipboard.write([new window.ClipboardItem({ 'image/png': blob })]);
          setTimeout(() => alert('Gambar struk telah disalin!\n\nTeks dan Link pelacakan sudah otomatis disiapkan di WhatsApp yang terbuka.\nSilakan tekan "Paste" (Ctrl+V) di WA untuk melampirkan gambar ini!'), 100);
        } catch (e) {
          // 3. Fallback: Download file
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `struk-${trx.kode}.png`;
          a.click();
          URL.revokeObjectURL(url);
          setTimeout(() => alert('Gambar struk didownload!\n\nTeks dan Link pelacakan sudah otomatis disiapkan di WhatsApp yang terbuka.\nSilakan "Drag & Drop" file struk tadi ke WA!'), 100);
        }

        setIsGenerating(false);
      }, 'image/png');
    } catch (err) {
      console.error(err);
      alert('Gagal membuat gambar struk.');
      setIsGenerating(false);
    }
  };

  return (
    <>
      <style>
        {`
          @media print {
            body * { visibility: hidden; }
            .receipt-preview, .receipt-preview * { visibility: visible; }
            .receipt-preview { 
              position: absolute; 
              left: 0; 
              top: 0; 
              margin: 0 !important; 
              padding: 0 !important; 
              width: 80mm; 
              border: none !important;
              box-shadow: none !important;
              color: #000;
              background: #fff;
            }
            .receipt-preview hr { border-top: 1px dashed #000 !important; }
            @page { margin: 0; }
          }
        `}
      </style>
      <div className="page-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="icon-btn" onClick={() => navigate(-1)} style={{ background: 'var(--canvas)', border: '1px solid var(--line)', width: 40, height: 40 }}>
            <ArrowLeft size={18} />
          </button>
          <div><h1 style={{ margin: 0 }}>Struk</h1><div className="sub mono" style={{ marginTop: 2 }}>{trx.kode}</div></div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-outline" style={{ borderColor: '#25D366', color: '#25D366' }} onClick={handleSendWA} disabled={isGenerating}>
            {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <MessageCircle size={16} />} 
            {isGenerating ? 'Memproses...' : 'Kirim ke WA (PNG)'}
          </button>
          <button className="btn btn-outline" onClick={() => window.print()}>
            <Printer size={16} /> Cetak Struk
          </button>
        </div>
      </div>
      <div ref={receiptRef} className="receipt-preview" style={{ margin: '0 auto', maxWidth: 300, padding: 20 }}>
        <div style={{ textAlign: 'center', marginBottom: 12 }}>
          <div style={{ fontWeight: 700, fontSize: 14 }}>{toko.nama}</div>
          <div style={{ fontSize: 11, color: 'var(--ink-soft)' }}>{toko.alamat}</div>
          <div style={{ fontSize: 11, color: 'var(--ink-soft)' }}>WA: {toko.noWA}</div>
        </div>
        <hr />
        <div className="receipt-row"><span>No. Transaksi</span><span>{trx.kode}</span></div>
        <div className="receipt-row"><span>Tanggal</span><span>{fmtDate(trx.tanggal)}</span></div>
        <div className="receipt-row"><span>Pelanggan</span><span>{trx.pelanggan}</span></div>
        <div className="receipt-row"><span>No. HP</span><span>{trx.hp}</span></div>
        <div className="receipt-row"><span>Metode</span><span>{trx.metode === 'jemput-antar' ? 'Jemput-Antar' : 'Outlet'}</span></div>
        <hr />
        {trx.sepatu.map((s, i) => (
          <div key={s.id} style={{ marginBottom: 8 }}>
            <div style={{ fontWeight: 600 }}>#{i + 1} {s.jenis}</div>
            <div className="receipt-row"><span>{s.treatment}</span><span>{fmtRp(s.harga)}</span></div>
            {s.addons?.length > 0 && <div style={{ fontSize: 11, color: 'var(--ink-soft)' }}>+ {s.addons.join(', ')}</div>}
            <div style={{ fontSize: 11, color: 'var(--ink-soft)' }}>Tracking: {s.tracking} | Est: {fmtDate(s.estimasi)}</div>
          </div>
        ))}
        {trx.biayaJemputAntar > 0 && (
          <div className="receipt-row"><span>Biaya Jemput-Antar</span><span>{fmtRp(trx.biayaJemputAntar)}</span></div>
        )}
        <hr />
        <div className="receipt-row" style={{ fontWeight: 700, fontSize: 14 }}><span>TOTAL</span><span>{fmtRp(totalTagihan)}</span></div>
        <div className="receipt-row"><span>Pembayaran</span><span>{trx.statusBayar} ({trx.metodeBayar})</span></div>
        <hr />
        <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--ink-soft)', marginTop: 8 }}>Terima kasih telah mempercayakan sepatu Anda kepada kami.</div>
      </div>
    </>
  );
}
