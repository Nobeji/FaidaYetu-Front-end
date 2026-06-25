import { colors } from '../constants/theme';

export default function StatsCard({ label, value, sub, icon, error, tertiary, subIcon }) {
  const accent = error ? colors.error : tertiary ? '#7b61ff' : colors.primary;
  return (
    <div style={{
      background: '#fff', border: '1px solid #eaeaea', borderRadius: 10,
      padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <div>
        <div style={{ fontSize: 12, fontWeight: 500, color: '#888', marginBottom: 4, letterSpacing: '0.02em' }}>{label}</div>
        <div style={{ fontSize: 30, fontWeight: 700, color: '#111', lineHeight: 1.1 }}>{value}</div>
        {sub && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, color: accent, marginTop: 6 }}>
            {subIcon && <span>{subIcon}</span>} {sub}
          </div>
        )}
      </div>
      {icon && (
        <div style={{
          width: 48, height: 48, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: error ? '#fef2f2' : tertiary ? '#f5f0ff' : '#eaf7f0',
          color: accent, fontSize: 24, flexShrink: 0,
        }}>{icon}</div>
      )}
    </div>
  );
}
