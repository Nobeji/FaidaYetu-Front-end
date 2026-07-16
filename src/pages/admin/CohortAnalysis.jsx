import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Users } from 'lucide-react';

export default function CohortAnalysis() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.adminCohort().then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: 48, textAlign: 'center', color: '#666' }}>Loading...</div>;

  const months = data?.months || [];

  return (
    <div className="fade-in">
      <h1 style={{ fontSize: 28, fontWeight: 700, margin: '0 0 4px' }}><span style={{display:'inline-flex',verticalAlign:'middle',marginRight:8}}><Users size={24} /></span> Cohort Analysis</h1>
      <p style={{ fontSize: 15, color: '#666', marginBottom: 24 }}>Customer retention by signup month</p>
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #eaeaea', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#f8faf9' }}>
                <th style={{ padding: 10, fontSize: 12, fontWeight: 700, color: '#666', textTransform: 'uppercase', textAlign: 'left', borderBottom: '1px solid #eaeaea', position: 'sticky', left: 0, background: '#f8faf9' }}>Cohort</th>
                <th style={{ padding: 10, fontSize: 12, fontWeight: 700, color: '#666', textTransform: 'uppercase', textAlign: 'center', borderBottom: '1px solid #eaeaea' }}>Size</th>
                {months.map((m, i) => (
                  <th key={m} style={{ padding: 10, fontSize: 11, fontWeight: 700, color: '#666', textTransform: 'uppercase', textAlign: 'center', borderBottom: '1px solid #eaeaea' }}>
                    {i === 0 ? 'Mo 0' : `Mo ${i}`}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data?.cohorts?.map(row => (
                <tr key={row.cohort} style={{ borderBottom: '1px solid #fafafa' }}>
                  <td style={{ padding: 10, fontWeight: 700, position: 'sticky', left: 0, background: '#fff' }}>{row.cohort}</td>
                  <td style={{ padding: 10, textAlign: 'center', fontWeight: 600 }}>{row.size}</td>
                  {months.map(m => {
                    const val = row[m];
                    const intensity = Math.min(val / 100, 1);
                    return (
                      <td key={m} style={{
                        padding: 10, textAlign: 'center', fontWeight: val > 0 ? 700 : 400,
                        background: val > 0 ? `rgba(10, 110, 70, ${intensity * 0.7 + 0.15})` : '#fafafa',
                        color: intensity > 0.5 ? '#fff' : '#555',
                      }}>{val > 0 ? `${val}%` : '-'}</td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
