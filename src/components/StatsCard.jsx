import { colors, spacing, radius } from '../constants/theme';

export default function StatsCard({ label, value, sub, icon, error, tertiary, subIcon }) {
  const valueStyle = error ? { color: colors.error } : tertiary ? { color: colors.tertiary } : { color: colors.primary };
  const cardStyle = error
    ? { backgroundColor: colors.errorContainer, borderColor: colors.error }
    : { backgroundColor: colors.surfaceContainerLowest, borderColor: colors.outlineVariant };
  const iconBg = error ? 'errorBg' : tertiary ? 'tertiaryBg' : 'primaryBg';

  const iconStyles = {
    primaryBg: { background: colors.primaryFixed, color: colors.primary },
    tertiaryBg: { background: colors.tertiaryFixed, color: colors.tertiary },
    errorBg: { background: colors.white, color: colors.error },
  };

  return (
    <div style={{ ...styles.card, ...cardStyle }}>
      <div>
        <div style={styles.label}>{label}</div>
        <div style={{ ...styles.value, ...valueStyle }}>{value}</div>
        {sub && (
          <div style={{ ...styles.sub, color: error ? colors.error : tertiary ? colors.tertiary : colors.primary }}>
            {subIcon && <span>{subIcon}</span>} {sub}
          </div>
        )}
      </div>
      <div style={{ ...styles.iconWrap, ...iconStyles[iconBg] }}>{icon}</div>
    </div>
  );
}

const styles = {
  card: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    borderRadius: radius.xl,
    border: '1px solid',
    transition: 'box-shadow 0.2s',
  },
  label: {
    fontSize: 13,
    fontWeight: 500,
    color: colors.onSurfaceVariant,
    marginBottom: spacing.xs,
  },
  value: {
    fontSize: 34,
    fontWeight: 700,
    lineHeight: 1.1,
  },
  sub: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    fontSize: 12,
    fontWeight: 700,
    marginTop: spacing.xs,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 28,
  },
};
