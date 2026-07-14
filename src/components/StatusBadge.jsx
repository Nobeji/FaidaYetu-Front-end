const statusColors = {
  New: { bg: 'rgba(255,255,255,0.1)', text: 'rgba(255,255,255,0.8)' },
  Paid: { bg: 'rgba(76,175,125,0.2)', text: '#4caf7d' },
  Processing: { bg: 'rgba(255,183,77,0.2)', text: '#ffb74d' },
  Ready: { bg: 'linear-gradient(135deg, #0a6e46, #2d8a5e)', text: '#fff' },
  Cancelled: { bg: 'rgba(211,47,47,0.15)', text: '#ff8a80' },
  Delivered: { bg: 'rgba(76,175,125,0.2)', text: '#4caf7d' },
  Active: { bg: 'rgba(76,175,125,0.2)', text: '#4caf7d' },
  Pending: { bg: 'rgba(255,183,77,0.15)', text: '#ffb74d' },
};

export default function StatusBadge({ status }) {
  const c = statusColors[status] || { bg: 'rgba(255,255,255,0.08)', text: 'rgba(255,255,255,0.5)' };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '3px 12px', borderRadius: 999,
      fontSize: 11, fontWeight: 600, letterSpacing: '0.01em',
      background: c.bg, color: c.text,
    }}>
      {status}
    </span>
  );
}
