import { useState, useEffect, useRef } from 'react';
import { colors, spacing, radius } from '../../constants/theme';
import { api } from '../../services/api';

export default function HeatMap() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedWard, setSelectedWard] = useState(null);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    api.adminHeatMap().then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!data?.heatPoints || !canvasRef.current || !containerRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = containerRef.current.getBoundingClientRect();
    canvas.width = rect.width || 800;
    canvas.height = rect.height || 500;

    const pad = 40;
    const w = canvas.width - pad * 2;
    const h = canvas.height - pad * 2;
    const lats = data.heatPoints.map(p => p.lat);
    const lngs = data.heatPoints.map(p => p.lng);
    const minLat = Math.min(...lats) - 0.02;
    const maxLat = Math.max(...lats) + 0.02;
    const minLng = Math.min(...lngs) - 0.02;
    const maxLng = Math.max(...lngs) + 0.02;

    const toX = (lng) => pad + ((lng - minLng) / (maxLng - minLng)) * w;
    const toY = (lat) => pad + ((maxLat - lat) / (maxLat - minLat)) * h;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#f0f5f2';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#d0ddd5';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < 8; i++) {
      const x = pad + (w / 8) * i;
      ctx.beginPath(); ctx.moveTo(x, pad); ctx.lineTo(x, pad + h); ctx.stroke();
      const y = pad + (h / 8) * i;
      ctx.beginPath(); ctx.moveTo(pad, y); ctx.lineTo(pad + w, y); ctx.stroke();
    }

    data.heatPoints.forEach((p, i) => {
      const x = toX(p.lng);
      const y = toY(p.lat);
      const radius_px = 15 + p.intensity * 25;

      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius_px);
      gradient.addColorStop(0, `rgba(234, 87, 0, ${0.3 + p.intensity * 0.5})`);
      gradient.addColorStop(0.5, `rgba(234, 87, 0, ${0.1 + p.intensity * 0.3})`);
      gradient.addColorStop(1, 'rgba(234, 87, 0, 0)');
      ctx.beginPath();
      ctx.arc(x, y, radius_px, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fillStyle = p.count > 5 ? '#d62828' : p.count > 2 ? '#e07c00' : '#52b788';
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#1a1a1a';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(p.ward, x, y - 14);
    });

    ctx.fillStyle = '#0a6e46';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Dar es Salaam - Order Heat Map', canvas.width / 2, 16);
  }, [data]);

  if (loading) return (
    <div style={{ padding: spacing.xxl, textAlign: 'center', color: colors.onSurfaceVariant }}>
      {[1,2,3].map(i => <div key={i} style={{ height: 20, background: '#e0e8e4', borderRadius: 8, marginBottom: 12, width: `${60 + i * 10}%`, animation: 'pulse 1.5s infinite' }} />)}
    </div>
  );

  const sortedPoints = [...(data?.heatPoints || [])].sort((a, b) => b.count - a.count);
  const maxHeat = Math.max(...(data?.heatPoints || []).map(p => p.count), 1);

  return (
    <div className="fade-in">
      <div style={{ marginBottom: spacing.xl }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#0a6e46', margin: 0 }}>🔥 Heat Map</h1>
        <p style={{ fontSize: 15, color: '#5f6b64', marginTop: 4 }}>Geographic order concentration across Dar es Salaam</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: spacing.xl, marginBottom: spacing.xl }}>
        <div ref={containerRef} style={{ background: '#fff', borderRadius: 16, border: '1px solid #e0e8e4', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: spacing.md, height: 500, position: 'relative' }}>
          <canvas ref={canvasRef} style={{ width: '100%', height: '100%', borderRadius: 8 }} />
          <div style={{ position: 'absolute', bottom: 16, right: 16, display: 'flex', gap: spacing.sm, alignItems: 'center', background: 'rgba(255,255,255,0.9)', padding: '4px 12px', borderRadius: 8 }}>
            <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#52b788' }} />
            <span style={{ fontSize: 11, color: '#5f6b64' }}>Low</span>
            <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#e07c00' }} />
            <span style={{ fontSize: 11, color: '#5f6b64' }}>Medium</span>
            <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#d62828' }} />
            <span style={{ fontSize: 11, color: '#5f6b64' }}>High</span>
          </div>
        </div>

        <div style={{ background: '#fff', borderRadius: 16, padding: spacing.lg, border: '1px solid #e0e8e4', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0a6e46', marginBottom: spacing.md }}>📍 Order Concentration</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
            {sortedPoints.map((p, i) => (
              <div key={i}
                onMouseEnter={() => setSelectedWard(p.ward)}
                onMouseLeave={() => setSelectedWard(null)}
                style={{
                  display: 'flex', alignItems: 'center', gap: spacing.sm, padding: '6px 10px',
                  borderRadius: 8, cursor: 'pointer',
                  background: selectedWard === p.ward ? '#e8f5ee' : 'transparent',
                  transition: 'background 0.2s',
                }}
              >
                <span style={{
                  width: 10, height: 10, borderRadius: '50%', flexShrink: 0,
                  background: p.count > 5 ? '#d62828' : p.count > 2 ? '#e07c00' : '#52b788',
                }} />
                <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>{p.ward}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#0a6e46' }}>{p.count}</span>
                <div style={{ width: 40, height: 4, background: '#e8f5ee', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ width: `${(p.count / maxHeat) * 100}%`, height: '100%', background: p.count > 5 ? '#d62828' : p.count > 2 ? '#e07c00' : '#52b788', borderRadius: 2 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: 16, padding: spacing.lg, border: '1px solid #e0e8e4', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0a6e46', marginBottom: spacing.md }}>🌍 Dar es Salaam Coverage Zones</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: spacing.sm }}>
          {(data?.wards || []).map((w, i) => {
            const found = sortedPoints.find(p => p.ward === w.ward);
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: spacing.sm,
                padding: '8px 12px', borderRadius: 8,
                background: found ? (found.count > 5 ? '#fff5f5' : found.count > 2 ? '#fff8f0' : '#f0faf5') : '#f5f7f6',
              }}>
                <span style={{ fontSize: 16 }}>{found ? '📍' : '◯'}</span>
                <span style={{ fontSize: 13, fontWeight: found ? 600 : 400, color: '#1a1a1a' }}>{w.ward}</span>
                {found && <span style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 700, color: '#0a6e46' }}>{found.count}</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
