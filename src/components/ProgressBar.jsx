export default function ProgressBar({ name, pct, barColor, low }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>{name}</span>
        <span style={{ fontSize: 12, fontWeight: 600, color: low ? '#ff8a80' : 'rgba(255,255,255,0.6)' }}>
          {pct}%{low ? ' - LOW' : ''}
        </span>
      </div>
      <div style={{ width: '100%', height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: barColor || 'linear-gradient(90deg, #0a6e46, #4caf7d)', borderRadius: 4, transition: 'width 0.3s' }} />
      </div>
    </div>
  );
}
