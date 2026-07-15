export default function StatsCard({ label, value, sub, icon, error, tertiary, subIcon }) {
  const accent = error ? '#dc2626' : tertiary ? '#7c3aed' : '#0a6e46';
  return (
    <div style={{
      background: '#fff', border: '1px solid #e2e8f0',
      borderRadius: 14, padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    }}>
      <div>
        <div style={{ fontSize: 12, fontWeight: 500, color: '#94a3b8', marginBottom: 4, letterSpacing: '0.02em' }}>{label}</div>
        <div style={{ fontSize: 28, fontWeight: 700, color: '#0f172a', lineHeight: 1.1 }}>{value}</div>
        {sub && <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, color: accent, marginTop: 6 }}>{subIcon && <span>{subIcon}</span>} {sub}</div>}
      </div>
      {icon && (
        <div style={{
          width: 48, height: 48, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: error ? '#fef2f2' : tertiary ? '#f5f3ff' : '#f0fdf4',
          color: accent, fontSize: 22, flexShrink: 0,
        }}>{icon}</div>
      )}
    </div>
  );
}
