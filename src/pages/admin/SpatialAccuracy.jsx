import { useState, useEffect } from 'react';
import { api } from '../../services/api';

export default function SpatialAccuracy() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.adminSpatialAccuracy().then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: 48, textAlign: 'center', color: '#666' }}>Loading spatial accuracy data...</div>;
  if (data?.error) return <div style={{ padding: 48, textAlign: 'center', color: '#888' }}>{data.error}</div>;

  const summary = data?.summary || {};

  return (
    <div className="fade-in">
      <h1 style={{ fontSize: 28, fontWeight: 700, margin: '0 0 4px' }}>Spatial Accuracy Metric</h1>
      <p style={{ fontSize: 15, color: '#666', marginBottom: 24 }}>GPS delivery tracking precision and radius error analysis</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Deliveries with GPS', value: summary.total_deliveries_with_gps || 0, color: '#1976d2' },
          { label: 'Avg Radius Error', value: `${summary.avg_radius_error_meters || 0}m`, color: (summary.avg_radius_error_meters || 0) <= 100 ? '#2e7d32' : '#e65100' },
          { label: 'Min Error', value: `${summary.min_radius_error_meters || 0}m`, color: '#1976d2' },
          { label: 'Max Error', value: `${summary.max_radius_error_meters || 0}m`, color: '#d32f2f' },
          { label: 'Within 50m', value: summary.within_50m || 0, color: '#2e7d32' },
          { label: 'Within 100m', value: summary.within_100m || 0, color: '#388e3c' },
          { label: 'Accuracy Rate', value: summary.accuracy_rate_100m || '0%', color: '#7b1fa2' },
        ].map((item, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: 12, padding: 16, border: '1px solid #eaeaea' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#888', textTransform: 'uppercase' }}>{item.label}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: item.color }}>{item.value}</div>
          </div>
        ))}
      </div>

      {summary.total_deliveries_with_gps > 0 && (
        <div style={{ background: '#f5f5f5', borderRadius: 8, padding: 16, marginBottom: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 8 }}>Radius Error Distribution</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {[
              { label: '< 25m', count: (data.results || []).filter(r => r.radius_error_meters <= 25).length, color: '#2e7d32' },
              { label: '25-50m', count: (data.results || []).filter(r => r.radius_error_meters > 25 && r.radius_error_meters <= 50).length, color: '#388e3c' },
              { label: '50-100m', count: (data.results || []).filter(r => r.radius_error_meters > 50 && r.radius_error_meters <= 100).length, color: '#e65100' },
              { label: '> 100m', count: (data.results || []).filter(r => r.radius_error_meters > 100).length, color: '#d32f2f' },
            ].map(b => {
              const total = data.results?.length || 1;
              const pct = Math.round(b.count / total * 100);
              return (
                <div key={b.label} style={{ flex: 1, background: '#fff', borderRadius: 6, padding: 12, textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>{b.label}</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: b.color }}>{b.count}</div>
                  <div style={{ fontSize: 11, color: '#666' }}>{pct}%</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #eaeaea', overflow: 'hidden' }}>
        <div style={{ padding: 16, fontWeight: 700, borderBottom: '1px solid #eaeaea' }}>Delivery GPS Tracking Results</div>
        <div style={{ overflowX: 'auto', padding: 16 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8faf9' }}>
                {['Delivery ID', 'Driver', 'Target', 'Actual', 'Error (m)', 'GPS Points', 'Date'].map(h => (
                  <th key={h} style={{ padding: 10, fontSize: 12, fontWeight: 700, color: '#666', textTransform: 'uppercase', textAlign: 'left', borderBottom: '1px solid #eaeaea' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(data?.results || []).slice(0, 50).map((r, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #fafafa' }}>
                  <td style={{ padding: 10, fontWeight: 600 }}>#{r.delivery_id}</td>
                  <td style={{ padding: 10 }}>{r.driver}</td>
                  <td style={{ padding: 10, fontSize: 12 }}>{r.target_lat?.toFixed(5)}, {r.target_lng?.toFixed(5)}</td>
                  <td style={{ padding: 10, fontSize: 12 }}>{r.actual_lat?.toFixed(5)}, {r.actual_lng?.toFixed(5)}</td>
                  <td style={{ padding: 10, fontWeight: 700, color: r.radius_error_meters <= 50 ? '#2e7d32' : r.radius_error_meters <= 100 ? '#e65100' : '#d32f2f' }}>{r.radius_error_meters}m</td>
                  <td style={{ padding: 10 }}>{r.gps_points}</td>
                  <td style={{ padding: 10, fontSize: 12, color: '#888' }}>{new Date(r.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!data?.results || data.results.length === 0) && (
            <div style={{ textAlign: 'center', padding: 32, color: '#888' }}>No GPS tracking data available yet</div>
          )}
        </div>
      </div>
    </div>
  );
}
