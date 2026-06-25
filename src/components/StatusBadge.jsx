import { colors, radius } from '../constants/theme';

const statusColors = {
  New: { bg: '#eaf7f0', text: colors.primary },
  Processing: { bg: '#fff3e0', text: '#e65100' },
  Ready: { bg: colors.primary, text: '#fff' },
};

export default function StatusBadge({ status }) {
  const c = statusColors[status] || { bg: '#f5f5f5', text: '#666' };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '2px 10px', borderRadius: radius.round,
      fontSize: 11, fontWeight: 600, letterSpacing: '0.01em',
      background: c.bg, color: c.text,
    }}>
      {status}
    </span>
  );
}
