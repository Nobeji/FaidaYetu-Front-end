import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Ruler } from 'lucide-react';

export default function ModelEvaluation() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.adminModelEval().then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: 48, textAlign: 'center', color: '#666' }}>Loading...</div>;
  if (data?.error) return <div style={{ padding: 48, textAlign: 'center', color: '#888', background: '#fff', borderRadius: 16, border: '1px solid #eaeaea' }}>{data.error}</div>;

  return (
    <div className="fade-in">
      <h1 style={{ fontSize: 28, fontWeight: 700, margin: '0 0 4px' }}><span style={{display:'inline-flex',verticalAlign:'middle',marginRight:8}}><Ruler size={24} /></span> Model Evaluation</h1>
      <p style={{ fontSize: 15, color: '#666', marginBottom: 24 }}>Prophet forecast accuracy metrics against actuals</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12, marginBottom: 24 }}>
        <div style={{ background: '#fff', borderRadius: 12, padding: 16, border: '1px solid #eaeaea' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#888', textTransform: 'uppercase' }}>Accuracy</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: (data?.accuracy || 0) > 80 ? '#2e7d32' : '#e65100' }}>{data?.accuracy || 0}%</div>
        </div>
        <div style={{ background: '#fff', borderRadius: 12, padding: 16, border: '1px solid #eaeaea' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#888', textTransform: 'uppercase' }}>MAE</div>
          <div style={{ fontSize: 32, fontWeight: 800 }}>{data?.mae || 0}</div>
        </div>
        <div style={{ background: '#fff', borderRadius: 12, padding: 16, border: '1px solid #eaeaea' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#888', textTransform: 'uppercase' }}>MAPE</div>
          <div style={{ fontSize: 32, fontWeight: 800 }}>{data?.mape || 0}%</div>
        </div>
        <div style={{ background: '#fff', borderRadius: 12, padding: 16, border: '1px solid #eaeaea' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#888', textTransform: 'uppercase' }}>RMSE</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: (data?.rmse || 0) > 5 ? '#e65100' : '#1976d2' }}>{data?.rmse || 0}</div>
        </div>
        <div style={{ background: '#fff', borderRadius: 12, padding: 16, border: '1px solid #eaeaea' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#888', textTransform: 'uppercase' }}>Data Points</div>
          <div style={{ fontSize: 32, fontWeight: 800 }}>{data?.data_points || 0}</div>
        </div>
      </div>
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #eaeaea', overflow: 'hidden' }}>
        <div style={{ padding: 16, fontWeight: 700, borderBottom: '1px solid #eaeaea' }}>Prediction vs Actual (Last 14 days)</div>
        <div style={{ overflowX: 'auto', padding: 16 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8faf9' }}>
                {['Date', 'Actual Orders', 'Predicted', 'Error', 'Accuracy'].map(h => (
                  <th key={h} style={{ padding: 10, fontSize: 12, fontWeight: 700, color: '#666', textTransform: 'uppercase', textAlign: 'left', borderBottom: '1px solid #eaeaea' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data?.comparison?.map(c => {
                const error = c.predicted != null ? Math.abs(c.actual - c.predicted) : '-';
                const acc = c.predicted != null && c.actual > 0 ? (100 - Math.abs(c.actual - c.predicted) / c.actual * 100).toFixed(1) : '-';
                return (
                  <tr key={c.date} style={{ borderBottom: '1px solid #fafafa' }}>
                    <td style={{ padding: 10, fontWeight: 600 }}>{c.date}</td>
                    <td style={{ padding: 10 }}>{c.actual}</td>
                    <td style={{ padding: 10 }}>{c.predicted ?? '-'}</td>
                    <td style={{ padding: 10, color: error !== '-' && error > 2 ? '#d32f2f' : '#2e7d32' }}>{error !== '-' ? error.toFixed(1) : '-'}</td>
                    <td style={{ padding: 10 }}>{acc !== '-' ? `${acc}%` : '-'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
