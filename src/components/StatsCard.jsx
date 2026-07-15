export default function StatsCard({ label, value, sub, icon, error, tertiary, subIcon }) {
  const accent = error ? '#f87171' : tertiary ? '#a78bfa' : '#60a5fa';
  return (
    <div style={{
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 14, padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <div>
        <div style={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.4)', marginBottom: 4, letterSpacing: '0.02em' }}>{label}</div>
        <div style={{ fontSize: 28, fontWeight: 700, color: '#fff', lineHeight: 1.1 }}>{value}</div>
        {sub && <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, color: accent, marginTop: 6 }}>{subIcon && <span>{subIcon}</span>} {sub}</div>}
      </div>
      {icon && (
        <div style={{
          width: 48, height: 48, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: error ? 'rgba(239,68,68,0.12)' : tertiary ? 'rgba(167,139,250,0.12)' : 'rgba(30,64,175,0.15)',
          color: accent, fontSize: 22, flexShrink: 0,
        }}>{icon}</div>
      )}
    </div>
  );
}
