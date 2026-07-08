export function fmtRp(n) {
  return 'Rp' + Number(n).toLocaleString('id-ID');
}

export function fmtDate(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function fmtDateTime(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function getDeadlineLabel(estimasi) {
  if (!estimasi) return '';
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const est = new Date(estimasi);
  est.setHours(0, 0, 0, 0);
  const diff = Math.ceil((est - now) / (1000 * 60 * 60 * 24));
  if (diff < 0) return 'Terlambat';
  if (diff === 0) return 'H-0';
  return `H-${diff}`;
}

export function getProgressSummary(sepatu) {
  if (!sepatu || sepatu.length === 0) return '-';
  const done = sepatu.filter(s => {
    const currentStage = s.stages[s.stage - 1] || 'Selesai';
    return currentStage === 'Selesai';
  }).length;
  
  if (done === sepatu.length) return 'Selesai';
  if (done === 0) {
    const stages = sepatu[0]?.stages || [];
    const currentStage = stages[sepatu[0]?.stage - 1] || 'Selesai';
    return currentStage;
  }
  return `${done}/${sepatu.length} Selesai`;
}

export function getTrxStatus(trx) {
  const allDone = trx.sepatu.every(s => {
    const currentStage = s.stages[s.stage - 1] || 'Selesai';
    return currentStage === 'Selesai';
  });
  if (allDone) return 'done';
  return 'progress';
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}
