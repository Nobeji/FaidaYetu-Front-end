import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Lightbulb } from 'lucide-react';

export default function TrendInsights() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.adminTrends().then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: 48, textAlign: 'center', color: '#666' }}>Loading...</div>;

  return (
    <div className="fade-in">
      <h1 style={{ fontSize: 28, fontWeight: 700, margin: '0 0 4px' }}><span style={{display:'inline-flex',verticalAlign:'middle',marginRight:8}}><Lightbulb size={24} /></span> Trend Insights</h1>
      <p style={{ fontSize: 15, color: '#666', marginBottom: 24 }}>Automated intelligence from platform data</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {data?.insights?.map((insight, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: 16, padding: 20, border: '1px solid #eaeaea', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>{insight.icon}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{insight.title}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#111', marginBottom: 4 }}>{insight.value}</div>
            <div style={{ fontSize: 14, color: '#666' }}>{insight.detail}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
