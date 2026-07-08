import { useApp } from '../../context/AppContext';
import { getDeadlineLabel } from '../../utils/helpers';
import { Calendar as CalendarIcon, Clock, AlertCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';

const DAYS = ['Min','Sen','Sel','Rab','Kam','Jum','Sab'];

export default function CalendarPage() {
  const { transactions } = useApp();
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const today = now.getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = now.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

  const allShoes = transactions.flatMap(t => t.sepatu.map(s => ({ ...s, pelanggan: t.pelanggan })));
  const activeShoes = allShoes.filter(s => s.stage < s.stages.length);

  const deadlinesByDay = {};
  activeShoes.forEach(s => {
    if (!s.estimasi) return;
    const d = new Date(s.estimasi);
    if (d.getMonth() === month && d.getFullYear() === year) {
      const day = d.getDate();
      if (!deadlinesByDay[day]) deadlinesByDay[day] = [];
      deadlinesByDay[day].push(s);
    }
  });

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push({ day: null, muted: true });
  for (let d = 1; d <= daysInMonth; d++) {
    const dl = deadlinesByDay[d] || [];
    let state = 'normal';
    if (dl.length > 0) {
      const hasLate = dl.some(s => getDeadlineLabel(s.estimasi) === 'Terlambat');
      const hasUrgent = dl.some(s => ['H-0', 'H-1'].includes(getDeadlineLabel(s.estimasi)));
      if (hasLate) state = 'late';
      else if (hasUrgent) state = 'urgent';
    }
    cells.push({ day: d, items: dl, state, isToday: d === today });
  }

  const urgentList = activeShoes.filter(s => {
    const dl = getDeadlineLabel(s.estimasi);
    return ['Terlambat', 'H-0', 'H-1', 'H-2'].includes(dl);
  }).sort((a, b) => {
    const p = dl => dl === 'Terlambat' ? 0 : dl === 'H-0' ? 1 : 2;
    return p(getDeadlineLabel(a.estimasi)) - p(getDeadlineLabel(b.estimasi));
  });

  return (
    <>
      <div className="page-head" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 14 }}>
        <div style={{ background: 'var(--primary-tint)', padding: 12, borderRadius: 12, color: 'var(--primary)' }}>
          <CalendarIcon size={24} />
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: 22 }}>Jadwal & Deadline</h1>
          <div className="sub" style={{ marginTop: 4 }}>Pantau estimasi selesai sepatu pelanggan — {monthName}</div>
        </div>
      </div>

      <div className="grid g2" style={{ gridTemplateColumns: '2fr 1fr', alignItems: 'start' }}>
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>{monthName}</h3>
            <div style={{ display: 'flex', gap: 12, fontSize: 12, fontWeight: 600, color: 'var(--ink-soft)' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: '#FCE8E8', border: '1px solid #E74C3C' }}></span> Terlambat</div>
               <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: '#FFF4E5', border: '1px solid #E67E22' }}></span> Hari Ini / Besok</div>
            </div>
          </div>
          <div className="cal-grid">
            {DAYS.map(d => <div key={d} className="cal-day-label">{d}</div>)}
            {cells.map((c, i) => (
              <div key={i} className={`cal-cell ${c.muted ? 'muted' : ''} ${c.isToday ? 'today' : ''}`}>
                <div className="cal-day-num">{c.day}</div>
                {c.items && c.items.length > 0 && (
                  <div className="cal-badges">
                    <div className={`cal-badge ${c.state}`}>
                      {c.items.length} antrean
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ padding: 24, position: 'sticky', top: 90 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <AlertCircle size={20} color="var(--danger)" />
            <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Perlu Perhatian</h3>
          </div>
          
          {urgentList.length === 0 ? (
            <div className="empty-state" style={{ padding: '30px 10px' }}>
              <CheckCircle2 size={32} style={{ color: 'var(--primary)', marginBottom: 12, margin: '0 auto' }} />
              <div style={{ fontWeight: 600 }}>Semua Aman!</div>
              <div style={{ fontSize: 13 }}>Tidak ada antrean yang mendekati deadline.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {urgentList.map(s => {
                const dl = getDeadlineLabel(s.estimasi);
                const isLate = dl === 'Terlambat';
                return (
                  <div key={s.id} style={{ display: 'flex', gap: 12, padding: 14, background: isLate ? '#FCE8E8' : '#FFF4E5', borderRadius: 10, border: `1px solid ${isLate ? '#FADBD8' : '#FDEBD0'}` }}>
                    <div style={{ color: isLate ? '#E74C3C' : '#E67E22', marginTop: 2 }}>
                      {isLate ? <AlertTriangle size={18} /> : <Clock size={18} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <div style={{ fontWeight: 700, fontSize: 14, color: isLate ? '#C0392B' : '#D35400' }}>{s.jenis}</div>
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#fff', background: isLate ? '#E74C3C' : '#E67E22', padding: '2px 6px', borderRadius: 4 }}>{dl}</span>
                      </div>
                      <div style={{ fontSize: 13, color: isLate ? '#922B21' : '#A04000', marginBottom: 2 }}>{s.pelanggan}</div>
                      <div className="mono" style={{ fontSize: 11, color: isLate ? '#E74C3C' : '#E67E22', opacity: 0.8 }}>Track: {s.tracking}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
