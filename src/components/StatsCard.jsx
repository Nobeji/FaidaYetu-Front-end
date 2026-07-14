export default function StatsCard({ label, value, sub, icon, error, tertiary, subIcon }) {
  const accent = error ? '#ff8a80' : tertiary ? '#b388ff' : '#4caf7d';
  return (
    <div style={{
      background: 'rgba(255,255,255,0.06)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 14,
      padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      backdropFilter: 'blur(8px)',
    }}>
      <div>
        <div style={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.45)', marginBottom: 4, letterSpacing: '0.02em' }}>{label}</div>
        <div style={{ fontSize: 28, fontWeight: 700, color: '#fff', lineHeight: 1.1 }}>{value}</div>
        {sub && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, color: accent, marginTop: 6 }}>
            {subIcon && <span>{subIcon}</span>} {sub}
          </div>
        )}
      </div>
      {icon && (
        <div style={{
          width: 48, height: 48, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: error ? 'rgba(211,47,47,0.15)' : tertiary ? 'rgba(123,97,255,0.15)' : 'rgba(10,110,70,0.2)',
          color: accent, fontSize: 22, flexShrink: 0,
        }}>{icon}</div>
      )}
    </div>
  );
}
