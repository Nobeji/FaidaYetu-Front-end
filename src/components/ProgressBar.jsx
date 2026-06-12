import { colors, spacing, radius } from '../constants/theme';

export default function ProgressBar({ name, pct, barColor, low }) {
  return (
    <div style={{ marginBottom: spacing.lg }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: spacing.sm }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: colors.onSurface }}>{name}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: low ? colors.error : colors.primary }}>
          {pct}%{low ? ' - LOW STOCK' : ' Capacity'}
        </span>
      </div>
      <div style={{ width: '100%', height: 10, background: colors.surfaceVariant, borderRadius: radius.round, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: barColor, borderRadius: radius.round }} />
      </div>
    </div>
  );
}
