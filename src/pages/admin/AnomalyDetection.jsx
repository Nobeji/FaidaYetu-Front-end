import { useState, useEffect } from 'react';
import { api } from '../../services/api';

export default function AnomalyDetection() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.adminAnomaly().then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: 48, textAlign: 'center', color: '#666' }}>Loading...</div>;

  return (
    <div className="fade-in">
      <h1 style={{ fontSize: 28, fontWeight: 700, margin: '0 0 4px' }}>🕵️ Anomaly Detection</h1>
      <p style={{ fontSize: 15, color: '#666', marginBottom: 24 }}>Unusual orders flagged via Z-score analysis</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        <div style={{ background: '#fff', borderRadius: 12, padding: 16, border: '1px solid #eaeaea' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#888', textTransform: 'uppercase' }}>Total Orders Analyzed</div>
          <div style={{ fontSize: 28, fontWeight: 800 }}>{data?.total_orders || 0}</div>
        </div>
        <div style={{ background: '#fff', borderRadius: 12, padding: 16, border: '1px solid #eaeaea' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#888', textTransform: 'uppercase' }}>Anomalies Found</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: data?.anomaly_count > 0 ? '#d32f2f' : '#2e7d32' }}>{data?.anomaly_count || 0}</div>
        </div>
        <div style={{ background: '#fff', borderRadius: 12, padding: 16, border: '1px solid #eaeaea' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#888', textTransform: 'uppercase' }}>Avg Order Amount</div>
          <div style={{ fontSize: 28, fontWeight: 800 }}>{(data?.mean || 0).toLocaleString()} TZS</div>
        </div>
      </div>
      {data?.anomalies?.length > 0 ? (
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #eaeaea', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8faf9' }}>
                  {['Order', 'Customer', 'Supplier', 'Amount (TZS)', 'Z-Score', 'Date'].map(h => (
                    <th key={h} style={{ padding: 12, fontSize: 12, fontWeight: 700, color: '#666', textTransform: 'uppercase', textAlign: 'left', borderBottom: '1px solid #eaeaea' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.anomalies.map(a => (
                  <tr key={a.order_id} style={{ borderBottom: '1px solid #fafafa' }}>
                    <td style={{ padding: 12, fontWeight: 700 }}>#{a.order_id}</td>
                    <td style={{ padding: 12 }}>{a.customer}</td>
                    <td style={{ padding: 12 }}>{a.supplier}</td>
                    <td style={{ padding: 12, fontWeight: 700, color: '#d32f2f' }}>{a.amount.toLocaleString()}</td>
                    <td style={{ padding: 12 }}><span style={{ background: Math.abs(a.z_score) > 3 ? '#ffebee' : '#fff8f0', padding: '2px 10px', borderRadius: 12, fontWeight: 700 }}>{a.z_score}</span></td>
                    <td style={{ padding: 12, fontSize: 13, color: '#666' }}>{new Date(a.date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: 48, color: '#888', background: '#fff', borderRadius: 16, border: '1px solid #eaeaea' }}>No anomalies detected</div>
      )}
    </div>
  );
}
