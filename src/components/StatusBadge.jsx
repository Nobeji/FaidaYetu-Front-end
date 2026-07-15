const statusColors = {
  New: { bg: '#f1f5f9', text: '#475569' },
  Paid: { bg: '#f0fdf4', text: '#15803d' },
  Processing: { bg: '#fef9c3', text: '#a16207' },
  Ready: { bg: '#dbeafe', text: '#1d4ed8' },
  Cancelled: { bg: '#fef2f2', text: '#dc2626' },
  Delivered: { bg: '#f0fdf4', text: '#15803d' },
  Active: { bg: '#f0fdf4', text: '#15803d' },
  Pending: { bg: '#fef9c3', text: '#a16207' },
};

export default function StatusBadge({ status }) {
  const c = statusColors[status] || { bg: '#f1f5f9', text: '#64748b' };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '3px 12px', borderRadius: 999,
      fontSize: 11, fontWeight: 600, letterSpacing: '0.01em',
      background: c.bg, color: c.text,
    }}>{status}</span>
  );
}
