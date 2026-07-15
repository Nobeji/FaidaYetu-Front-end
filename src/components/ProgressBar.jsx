export default function ProgressBar({ name, pct, barColor, low }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.75)' }}>{name}</span>
        <span style={{ fontSize: 12, fontWeight: 600, color: low ? '#f87171' : 'rgba(255,255,255,0.55)' }}>{pct}%{low ? ' - LOW' : ''}</span>
      </div>
      <div style={{ width: '100%', height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: barColor || 'linear-gradient(90deg, #1e40af, #06b6d4)', borderRadius: 4, transition: 'width 0.3s' }} />
      </div>
    </div>
  );
}
