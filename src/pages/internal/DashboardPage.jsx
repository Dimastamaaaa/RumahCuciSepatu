import { useApp } from '../../context/AppContext';
import { fmtRp, getDeadlineLabel } from '../../utils/helpers';
import { LayoutDashboard, Wallet, TrendingUp, Package, Star, AlertCircle, Clock, User, Download } from 'lucide-react';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

export default function DashboardPage() {
  const { transactions, expenses, feedbacks, users } = useApp();

  const activeOrders = transactions.filter(t => t.sepatu.some(s => s.stage < s.stages.length));
  const allShoes = transactions.flatMap(t => t.sepatu);
  const urgentShoes = allShoes.filter(s => {
    const dl = getDeadlineLabel(s.estimasi);
    return dl === 'Terlambat' || dl === 'H-0' || dl === 'H-1';
  }).filter(s => s.stage < s.stages.length);

  // Filter current month
  const currentMonthTransactions = transactions.filter(t => {
    const d = new Date(t.tanggal);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  
  const currentMonthExpenses = expenses.filter(e => {
    const d = new Date(e.tanggal);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const totalRevenue = currentMonthTransactions.reduce((sum, t) => sum + t.sepatu.reduce((s2, sh) => s2 + sh.harga, 0) + t.biayaJemputAntar, 0);
  const totalExpenses = currentMonthExpenses.reduce((sum, e) => sum + e.jumlah, 0);
  const profit = totalRevenue - totalExpenses;
  const avgRating = feedbacks.length > 0 ? (feedbacks.reduce((s, f) => s + f.rating, 0) / feedbacks.length).toFixed(1) : '0.0';

  // Bar Chart (6 Months)
  const getMonths = () => {
    const res = [];
    for(let i=5; i>=0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      res.push(d);
    }
    return res;
  };
  const months = getMonths();
  const monthLabels = months.map(d => d.toLocaleString('id-ID', { month: 'short' }));
  
  const revByMonth = months.map(m => {
    return transactions.filter(t => {
      const d = new Date(t.tanggal);
      return d.getMonth() === m.getMonth() && d.getFullYear() === m.getFullYear();
    }).reduce((sum, t) => sum + t.sepatu.reduce((s2, sh) => s2 + sh.harga, 0) + t.biayaJemputAntar, 0);
  });
  
  const expByMonth = months.map(m => {
    return expenses.filter(e => {
      const d = new Date(e.tanggal);
      return d.getMonth() === m.getMonth() && d.getFullYear() === m.getFullYear();
    }).reduce((sum, e) => sum + e.jumlah, 0);
  });

  const revenueData = {
    labels: monthLabels,
    datasets: [
      { label: 'Pendapatan', data: revByMonth.map(v => (v / 1000000).toFixed(2)), backgroundColor: '#0B6E4F', hoverBackgroundColor: '#129D72', borderRadius: 6, barPercentage: 0.65 },
      { label: 'Pengeluaran', data: expByMonth.map(v => (v / 1000000).toFixed(2)), backgroundColor: '#E8531D', hoverBackgroundColor: '#F97344', borderRadius: 6, barPercentage: 0.65 },
    ],
  };

  // Profit per Treatment (Doughnut)
  const allCurrentShoes = currentMonthTransactions.flatMap(t => t.sepatu);
  const treatmentCounts = {};
  allCurrentShoes.forEach(s => {
    const label = s.treatment || 'Lainnya';
    treatmentCounts[label] = (treatmentCounts[label] || 0) + 1;
  });
  const sortedTreatments = Object.entries(treatmentCounts).sort((a,b) => b[1] - a[1]).slice(0, 4);
  const profitLabels = sortedTreatments.length > 0 ? sortedTreatments.map(s => s[0]) : ['Belum ada data'];
  const profitDataValues = sortedTreatments.length > 0 ? sortedTreatments.map(s => s[1]) : [1];
  const profitColors = ['#0B6E4F', '#4FA982', '#E8531D', '#C7D0C6'];

  const profitData = {
    labels: profitLabels,
    datasets: [{ data: profitDataValues, backgroundColor: profitColors.slice(0, profitLabels.length), hoverOffset: 10, borderWidth: 0 }],
  };

  // Performa Kasir
  const kasirCounts = {};
  currentMonthTransactions.forEach(t => {
    const kId = t.createdBy;
    if (kId) {
       kasirCounts[kId] = (kasirCounts[kId] || 0) + 1;
    }
  });

  const performaKasir = Object.entries(kasirCounts).map(([kId, count]) => {
     const user = users.find(u => u.id === kId);
     return { n: user ? user.nama : 'Unknown', v: count };
  }).sort((a, b) => b.v - a.v).slice(0, 5);

  const handleExport = () => {
    const header = ['Tanggal', 'Jenis', 'Keterangan', 'Jumlah (Rp)'].join(',');
    const exportRows = [
      ...currentMonthTransactions.map(t => ({
        tanggal: t.tanggal,
        jenis: 'Pendapatan',
        keterangan: `${t.kode} - ${t.pelanggan}`,
        jumlah: t.sepatu.reduce((s, sh) => s + sh.harga, 0) + t.biayaJemputAntar,
      })),
      ...currentMonthExpenses.map(e => ({
        tanggal: e.tanggal,
        jenis: 'Pengeluaran',
        keterangan: `${e.kategori} - ${e.catatan || ''}`,
        jumlah: -e.jumlah,
      }))
    ].sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));

    const csvRows = exportRows.map(r => {
      const safeKeterangan = `"${(r.keterangan || '').replace(/"/g, '""')}"`;
      return [r.tanggal, r.jenis, safeKeterangan, r.jumlah].join(',');
    });

    const csvString = [header, ...csvRows].join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const monthName = new Date().toLocaleString('id-ID', { month: 'long', year: 'numeric' });
    link.setAttribute('download', `Laporan_Bulanan_RCS_${monthName.replace(/\s/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className="page-head" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ background: 'var(--primary-tint)', padding: 12, borderRadius: 12, color: 'var(--primary)' }}>
            <LayoutDashboard size={24} />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: 22 }}>Dashboard</h1>
            <div className="sub" style={{ marginTop: 4 }}>Ringkasan performa outlet hari ini, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
          </div>
        </div>
        <button onClick={handleExport} className="btn btn-outline" style={{ height: 44, borderRadius: 12, padding: '0 20px', background: 'var(--card)' }}>
          <Download size={18} style={{ marginRight: 8, color: 'var(--primary)' }} /> Export Laporan
        </button>
      </div>

      <div className="grid g4" style={{ marginBottom: 24, gap: 16 }}>
        {/* Omzet */}
        <div className="hover-card" style={{ background: 'var(--card)', borderRadius: 20, padding: 24, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
           <div style={{ position: 'absolute', right: -16, top: -16, color: 'rgba(46, 204, 113, 0.08)' }}><Wallet size={120} /></div>
           <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, position: 'relative' }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(46, 204, 113, 0.15)', color: '#2ecc71', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Wallet size={18} /></div>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-soft)' }}>Omzet Bulan Ini</span>
           </div>
           <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--ink)', position: 'relative' }}>{fmtRp(totalRevenue)}</div>
        </div>
        
        {/* Profit */}
        <div className="hover-card" style={{ background: 'var(--primary)', color: 'white', borderRadius: 20, padding: 24, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
           <div style={{ position: 'absolute', right: -16, top: -16, color: 'rgba(255,255,255, 0.1)' }}><TrendingUp size={120} /></div>
           <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, position: 'relative' }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255, 255, 255, 0.2)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><TrendingUp size={18} /></div>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>Profit Bersih</span>
           </div>
           <div style={{ fontSize: 24, fontWeight: 800, position: 'relative', color: 'white' }}>{fmtRp(profit)}</div>
        </div>

        {/* Order Aktif */}
        <div className="hover-card" style={{ background: 'var(--card)', borderRadius: 20, padding: 24, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
           <div style={{ position: 'absolute', right: -16, top: -16, color: 'rgba(52, 152, 219, 0.08)' }}><Package size={120} /></div>
           <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, position: 'relative' }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(52, 152, 219, 0.15)', color: '#3498db', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Package size={18} /></div>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-soft)' }}>Total Order Aktif</span>
           </div>
           <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--ink)', position: 'relative' }}>{activeOrders.length} <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink-soft)' }}>pasang</span></div>
           <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10, fontSize: 12, color: urgentShoes.length > 0 ? '#e74c3c' : 'var(--ink-soft)', fontWeight: 600, position: 'relative' }}>
              {urgentShoes.length > 0 ? <><AlertCircle size={14} /> {urgentShoes.length} mendekati deadline</> : <><Clock size={14} /> Aman terkendali</>}
           </div>
        </div>

        {/* CSAT */}
        <div className="hover-card" style={{ background: 'var(--card)', borderRadius: 20, padding: 24, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
           <div style={{ position: 'absolute', right: -16, top: -16, color: 'rgba(241, 196, 15, 0.08)' }}><Star size={120} /></div>
           <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, position: 'relative' }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(241, 196, 15, 0.15)', color: '#f39c12', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Star size={18} /></div>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-soft)' }}>Kepuasan (CSAT)</span>
           </div>
           <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--ink)', display: 'flex', alignItems: 'baseline', gap: 4, position: 'relative' }}>
             {avgRating} <span style={{ fontSize: 14, color: 'var(--ink-soft)' }}>/5.0</span>
           </div>
        </div>
      </div>

      <div className="grid g2" style={{ marginBottom: 24, gap: 16 }}>
        <div className="card" style={{ padding: 28, borderRadius: 20 }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 6px 0' }}>Pendapatan vs Pengeluaran</h2>
          <div style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 24 }}>Statistik 6 bulan terakhir</div>
          <div style={{ height: 260 }}>
            <Bar 
              data={revenueData} 
              options={{ 
                maintainAspectRatio: false,
                animation: { duration: 1500, easing: 'easeOutQuart' },
                interaction: { mode: 'index', intersect: false },
                plugins: { 
                  legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 12, family: 'Inter' } } },
                  tooltip: { backgroundColor: '#122019', padding: 12, cornerRadius: 8, titleFont: { size: 14, family: 'Inter' }, bodyFont: { size: 13, family: 'Inter' }, bodySpacing: 6, boxPadding: 4 }
                }, 
                scales: { 
                  y: { ticks: { callback: v => `Rp${v}jt`, font: { family: 'Inter' } }, grid: { color: 'var(--line-soft)', drawBorder: false }, border: { display: false } }, 
                  x: { ticks: { font: { family: 'Inter' } }, grid: { display: false }, border: { display: false } } 
                } 
              }} 
            />
          </div>
        </div>
        <div className="card" style={{ padding: 28, borderRadius: 20 }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 6px 0' }}>Layanan Terpopuler</h2>
          <div style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 24 }}>Kontribusi layanan bulan ini</div>
          <div style={{ height: 260, display: 'flex', justifyContent: 'center' }}>
            <Doughnut 
              data={profitData} 
              options={{ 
                maintainAspectRatio: false, 
                animation: { animateScale: true, animateRotate: true, duration: 1500, easing: 'easeOutQuart' },
                plugins: { 
                  legend: { position: 'right', labels: { boxWidth: 12, font: { size: 12, family: 'Inter' }, padding: 20 } },
                  tooltip: { backgroundColor: '#122019', padding: 12, cornerRadius: 8, bodyFont: { size: 13, family: 'Inter' } }
                }, 
                cutout: '72%' 
              }} 
            />
          </div>
        </div>
      </div>

      <div className="grid g2" style={{ gap: 16 }}>
        <div className="card" style={{ padding: 0, borderRadius: 20, overflow: 'hidden' }}>
          <div style={{ padding: '24px 28px', borderBottom: '1px solid var(--line)', background: 'var(--canvas-alt)' }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>Antrean Mendesak</h2>
            <div style={{ fontSize: 13, color: 'var(--ink-soft)', marginTop: 6 }}>Berdasarkan sisa waktu pengerjaan</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {urgentShoes.length === 0 && <div style={{ padding: 40, textAlign: 'center', color: 'var(--ink-soft)', fontSize: 13 }}>Tidak ada antrean mendesak.</div>}
            {urgentShoes.slice(0, 5).map(s => {
              const dl = getDeadlineLabel(s.estimasi);
              const badgeClass = dl === 'Terlambat' ? 'badge-danger' : dl === 'H-0' ? 'badge-progress' : 'badge-neutral';
              return (
                <div key={s.id} className="hover-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 28px', borderBottom: '1px solid var(--line-soft)', transition: 'background 0.2s', background: 'var(--card)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                     <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--canvas-alt)', color: 'var(--ink-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Clock size={20} /></div>
                     <div>
                        <div style={{ fontWeight: 700, fontSize: 15 }}>{s.jenis} — {s.treatment}</div>
                        <div className="mono" style={{ fontSize: 13, color: 'var(--ink-faint)', marginTop: 2 }}>{s.tracking}</div>
                     </div>
                  </div>
                  <span className={`badge ${badgeClass}`}>{dl}</span>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="card" style={{ padding: 28, borderRadius: 20 }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 6px 0' }}>Performa Kasir</h2>
          <div style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 28 }}>Jumlah transaksi yang diinput bulan ini</div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {performaKasir.length === 0 && <div style={{ textAlign: 'center', color: 'var(--ink-soft)', fontSize: 13, marginTop: 20 }}>Belum ada transaksi bulan ini.</div>}
            {performaKasir.map((s, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--primary-tint)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><User size={16} /></div>
                      <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)' }}>{s.n}</span>
                   </div>
                   <span className="mono" style={{ fontSize: 14, color: 'var(--ink-soft)', fontWeight: 600 }}>{s.v} trx</span>
                </div>
                <div style={{ height: 10, background: 'var(--canvas-alt)', borderRadius: 5, overflow: 'hidden' }}>
                   <div style={{ height: '100%', width: `${Math.min((s.v / 50) * 100, 100)}%`, background: 'var(--primary)', borderRadius: 5, transition: 'width 1s ease-out' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
