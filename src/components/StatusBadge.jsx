const statusColors = {
  New: { bg: '#f0f0f0', text: '#000' },
  Paid: { bg: '#e8f5e9', text: '#2e7d32' },
  Processing: { bg: '#fff3e0', text: '#e65100' },
  Ready: { bg: '#000', text: '#fff' },
};

export default function StatusBadge({ status }) {
  const c = statusColors[status] || { bg: '#f5f5f5', text: '#666' };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '2px 10px', borderRadius: 999,
      fontSize: 11, fontWeight: 600, letterSpacing: '0.01em',
      background: c.bg, color: c.text,
    }}>
      {status}
    </span>
  );
}
