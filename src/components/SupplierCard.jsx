import { colors, spacing, radius } from '../constants/theme';

export default function SupplierCard({ name, rating, distance, price, img }) {
  return (
    <div style={{
      minWidth: 300, background: colors.surfaceContainerLow,
      border: `1px solid ${colors.outlineVariant}`,
      borderRadius: radius.xl, overflow: 'hidden',
      scrollSnapAlign: 'start', cursor: 'pointer', flexShrink: 0,
    }}>
      <div style={{ height: 100, position: 'relative' }}>
        <img src={img} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{
          position: 'absolute', top: spacing.sm, right: spacing.sm,
          background: colors.surfaceContainerLowest, padding: '2px 8px',
          borderRadius: radius.round, fontSize: 12, fontWeight: 700,
          color: colors.primary, display: 'flex', alignItems: 'center', gap: 2,
        }}>⭐ {rating}</div>
      </div>
      <div style={{ padding: spacing.md }}>
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: spacing.xs }}>{name}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: colors.onSurfaceVariant }}>📍 {distance} away</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: colors.primary }}>From {price}</span>
        </div>
      </div>
    </div>
  );
}
