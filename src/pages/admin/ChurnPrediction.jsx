import { useState, useEffect } from 'react';
import { api } from '../../services/api';

const RISK_COLORS = { 'High Risk': '#d32f2f', 'Medium Risk': '#e65100', 'Low Risk': '#2e7d32' };

export default function ChurnPrediction() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.adminChurn().then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: 48, textAlign: 'center', color: '#666' }}>Loading...</div>;

  return (
    <div className="fade-in">
      <h1 style={{ fontSize: 28, fontWeight: 700, margin: '0 0 4px' }}>⚠️ Churn Prediction</h1>
      <p style={{ fontSize: 15, color: '#666', marginBottom: 24 }}>Customers at risk of leaving the platform</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {Object.entries(data?.summary || {}).map(([risk, count]) => (
          <div key={risk} style={{ background: RISK_COLORS[risk] || '#333', borderRadius: 12, padding: 16, color: '#fff' }}>
            <div style={{ fontSize: 28, fontWeight: 800 }}>{count}</div>
            <div style={{ fontSize: 14, fontWeight: 600, opacity: 0.9 }}>{risk}</div>
          </div>
        ))}
      </div>
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #eaeaea', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8faf9' }}>
                {['Customer', 'Days Since Last Order', 'Total Orders', 'Recent (30d)', 'Churn Score', 'Risk Level'].map(h => (
                  <th key={h} style={{ padding: 12, fontSize: 12, fontWeight: 700, color: '#666', textTransform: 'uppercase', textAlign: 'left', borderBottom: '1px solid #eaeaea' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data?.customers?.filter(c => c.risk_level !== 'Low Risk').map(c => (
                <tr key={c.customer_id} style={{ borderBottom: '1px solid #fafafa' }}>
                  <td style={{ padding: 12, fontWeight: 600 }}>{c.name}</td>
                  <td style={{ padding: 12 }}>{c.days_since_last_order}d</td>
                  <td style={{ padding: 12 }}>{c.total_orders}</td>
                  <td style={{ padding: 12 }}>{c.recent_30d_orders}</td>
                  <td style={{ padding: 12 }}>{(c.churn_score * 100).toFixed(0)}%</td>
                  <td style={{ padding: 12 }}>
                    <span style={{ display: 'inline-flex', padding: '2px 12px', borderRadius: 20, background: RISK_COLORS[c.risk_level] || '#333', color: '#fff', fontSize: 12, fontWeight: 700 }}>{c.risk_level}</span>
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
