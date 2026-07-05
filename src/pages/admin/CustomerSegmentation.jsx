import { useState, useEffect } from 'react';
import { api } from '../../services/api';

const SEGMENT_COLORS = { VIP: '#1b5e20', Loyal: '#2e7d32', Active: '#43a047', 'At Risk': '#e65100', Dormant: '#757575', Lost: '#b71c1c' };

export default function CustomerSegmentation() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.adminRFM().then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: 48, textAlign: 'center', color: '#666' }}>Loading...</div>;

  return (
    <div className="fade-in">
      <h1 style={{ fontSize: 28, fontWeight: 700, margin: '0 0 4px' }}>📊 Customer Segmentation</h1>
      <p style={{ fontSize: 15, color: '#666', marginBottom: 24 }}>RFM analysis — Recency, Frequency, Monetary value</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12, marginBottom: 24 }}>
        {Object.entries(data?.summary || {}).map(([seg, count]) => (
          <div key={seg} style={{ background: SEGMENT_COLORS[seg] || '#333', borderRadius: 12, padding: 16, color: '#fff' }}>
            <div style={{ fontSize: 24, fontWeight: 800 }}>{count}</div>
            <div style={{ fontSize: 13, fontWeight: 600, opacity: 0.9 }}>{seg}</div>
          </div>
        ))}
      </div>
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #eaeaea', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8faf9' }}>
                {['Customer', 'Recency (days)', 'Frequency', 'Monetary (TZS)', 'Segment'].map(h => (
                  <th key={h} style={{ padding: 12, fontSize: 12, fontWeight: 700, color: '#666', textTransform: 'uppercase', textAlign: 'left', borderBottom: '1px solid #eaeaea' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data?.segments?.map(s => (
                <tr key={s.customer_id} style={{ borderBottom: '1px solid #fafafa' }}>
                  <td style={{ padding: 12, fontWeight: 600 }}>{s.name}</td>
                  <td style={{ padding: 12 }}>{s.recency_days}d</td>
                  <td style={{ padding: 12 }}>{s.frequency}</td>
                  <td style={{ padding: 12 }}>{s.monetary.toLocaleString()}</td>
                  <td style={{ padding: 12 }}>
                    <span style={{ display: 'inline-flex', padding: '2px 12px', borderRadius: 20, background: SEGMENT_COLORS[s.segment] || '#333', color: '#fff', fontSize: 12, fontWeight: 700 }}>{s.segment}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
