import { useApp } from '../../context/AppContext';
import { fmtRp, fmtDate } from '../../utils/helpers';
import { BarChart3, TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownLeft, FileSpreadsheet } from 'lucide-react';

export default function LaporanProfitPage() {
  const { transactions, expenses } = useApp();

  const totalPendapatan = transactions.reduce((sum, t) => sum + t.sepatu.reduce((s2, sh) => s2 + sh.harga, 0) + t.biayaJemputAntar, 0);
  const totalPengeluaran = expenses.reduce((sum, e) => sum + e.jumlah, 0);
  const profit = totalPendapatan - totalPengeluaran;

  const rows = [
    ...transactions.map(t => ({
      tanggal: t.tanggal,
      jenis: 'Pendapatan',
      keterangan: `${t.kode} — ${t.pelanggan}`,
      jumlah: t.sepatu.reduce((s, sh) => s + sh.harga, 0) + t.biayaJemputAntar,
    })),
    ...expenses.map(e => ({
      tanggal: e.tanggal,
      jenis: 'Pengeluaran',
      keterangan: `${e.kategori} — ${e.catatan || ''}`,
      jumlah: -e.jumlah,
    })),
  ].sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));

  const handleExportExcel = () => {
    const header = ['Tanggal', 'Jenis', 'Keterangan', 'Jumlah (Rp)'].join(',');
    const csvRows = rows.map(r => {
      const safeKeterangan = `"${(r.keterangan || '').replace(/"/g, '""')}"`;
      return [r.tanggal, r.jenis, safeKeterangan, r.jumlah].join(',');
    });
    
    const csvString = [header, ...csvRows].join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Laporan_Keuangan_RCS_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className="page-head" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap', marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ background: 'var(--primary-tint)', padding: 12, borderRadius: 12, color: 'var(--primary)' }}>
            <BarChart3 size={24} />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: 22 }}>Laporan Keuangan</h1>
            <div className="sub" style={{ marginTop: 4 }}>Ringkasan profit dan rincian transaksi</div>
          </div>
        </div>
        <button onClick={handleExportExcel} className="btn btn-outline" style={{ height: 44, borderRadius: 12, padding: '0 20px', background: 'var(--card)' }}>
          <FileSpreadsheet size={18} style={{ marginRight: 8, color: 'var(--primary)' }} /> Export Excel
        </button>
      </div>

      <div className="grid g3" style={{ marginBottom: 32 }}>
        <div className="card" style={{ padding: 24, borderRadius: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(46, 204, 113, 0.15)', color: '#2ecc71', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TrendingUp size={28} />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-soft)', marginBottom: 4 }}>Total Pendapatan</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--ink)' }}>{fmtRp(totalPendapatan)}</div>
          </div>
        </div>
        
        <div className="card" style={{ padding: 24, borderRadius: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(231, 76, 60, 0.15)', color: '#e74c3c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TrendingDown size={28} />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-soft)', marginBottom: 4 }}>Total Pengeluaran</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--ink)' }}>{fmtRp(totalPengeluaran)}</div>
          </div>
        </div>
        
        <div className="card" style={{ padding: 24, borderRadius: 20, display: 'flex', alignItems: 'center', gap: 16, background: 'var(--primary)', color: 'white', border: 'none' }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(255,255,255,0.2)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Wallet size={28} />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.8)', marginBottom: 4 }}>Profit Bersih</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: 'white' }}>{fmtRp(profit)}</div>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 0, borderRadius: 20, overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--line)', background: 'var(--canvas-alt)' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Riwayat Transaksi</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {rows.map((r, i) => {
            const isIncome = r.jenis === 'Pendapatan';
            return (
              <div key={i} className="hover-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid var(--line)', transition: 'background 0.2s', background: 'var(--card)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: isIncome ? 'rgba(46, 204, 113, 0.12)' : 'rgba(231, 76, 60, 0.12)', color: isIncome ? '#2ecc71' : '#e74c3c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {isIncome ? <ArrowUpRight size={22} /> : <ArrowDownLeft size={22} />}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--ink)' }}>{r.keterangan}</div>
                    <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 2 }}>{fmtDate(r.tanggal)}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="mono" style={{ fontSize: 16, fontWeight: 700, color: isIncome ? '#2ecc71' : 'var(--ink)' }}>
                    {isIncome ? '+' : '-'}{fmtRp(Math.abs(r.jumlah))}
                  </div>
                  <span style={{ display: 'inline-block', padding: '2px 8px', background: 'var(--canvas-alt)', borderRadius: 6, fontSize: 11, fontWeight: 600, color: 'var(--ink-soft)', marginTop: 4 }}>
                    {r.jenis}
                  </span>
                </div>
              </div>
            )
          })}
          {rows.length === 0 && (
            <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--ink-soft)' }}>
              Belum ada riwayat transaksi keuangan.
            </div>
          )}
        </div>
      </div>
    </>
  );
}
