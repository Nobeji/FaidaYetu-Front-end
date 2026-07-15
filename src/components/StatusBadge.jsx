const statusColors = {
  New: { bg: 'rgba(255,255,255,0.08)', text: 'rgba(255,255,255,0.75)' },
  Paid: { bg: 'rgba(34,197,94,0.15)', text: '#4ade80' },
  Processing: { bg: 'rgba(251,191,36,0.15)', text: '#fbbf24' },
  Ready: { bg: 'linear-gradient(135deg, #1e40af, #2563eb)', text: '#fff' },
  Cancelled: { bg: 'rgba(239,68,68,0.12)', text: '#f87171' },
  Delivered: { bg: 'rgba(34,197,94,0.15)', text: '#4ade80' },
  Active: { bg: 'rgba(34,197,94,0.15)', text: '#4ade80' },
  Pending: { bg: 'rgba(251,191,36,0.12)', text: '#fbbf24' },
};

export default function StatusBadge({ status }) {
  const c = statusColors[status] || { bg: 'rgba(255,255,255,0.06)', text: 'rgba(255,255,255,0.45)' };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '3px 12px', borderRadius: 999,
      fontSize: 11, fontWeight: 600, letterSpacing: '0.01em',
      background: c.bg, color: c.text,
    }}>{status}</span>
  );
}
