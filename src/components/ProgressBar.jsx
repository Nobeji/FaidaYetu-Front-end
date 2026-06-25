import { colors } from '../constants/theme';

export default function ProgressBar({ name, pct, barColor, low }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>{name}</span>
        <span style={{ fontSize: 12, fontWeight: 600, color: low ? colors.error : colors.primary }}>
          {pct}%{low ? ' - LOW' : ''}
        </span>
      </div>
      <div style={{ width: '100%', height: 8, background: '#f0f0f0', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: barColor || colors.primary, borderRadius: 4, transition: 'width 0.3s' }} />
      </div>
    </div>
  );
}
