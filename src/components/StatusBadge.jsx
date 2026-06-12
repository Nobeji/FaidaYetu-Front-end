import { colors, radius } from '../constants/theme';

const statusColors = {
  New: { bg: colors.primaryFixed, text: colors.onPrimaryFixed },
  Processing: { bg: colors.tertiaryContainer, text: colors.onTertiaryContainer },
  Ready: { bg: colors.primary, text: colors.onPrimary },
};

export default function StatusBadge({ status }) {
  const c = statusColors[status] || { bg: colors.surfaceVariant, text: colors.onSurfaceVariant };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '2px 12px', borderRadius: radius.round,
      fontSize: 12, fontWeight: 600,
      background: c.bg, color: c.text,
    }}>
      {status}
    </span>
  );
}
