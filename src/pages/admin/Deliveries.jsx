import { useState, useEffect } from 'react';
import { api } from '../../services/api';

const statusColors = {
  assigned: { bg: '#f5f5f5', text: '#111' },
  picked_up: { bg: '#fff8f0', text: '#e07c00' },
  in_transit: { bg: '#e3f2fd', text: '#1565c0' },
  completed: { bg: '#e8f5e9', text: '#2e7d32' },
  cancelled: { bg: '#ffebee', text: '#c62828' },
};

export default function AdminDeliveries() {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.adminList('deliveries').then(d => { setDeliveries(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: 48, textAlign: 'center', color: '#666' }}>Loading...</div>;

  return (
    <div className="fade-in">
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#111', margin: 0 }}>🚚 Deliveries</h1>
        <p style={{ fontSize: 15, color: '#666', marginTop: 4 }}>{deliveries.length} total deliveries</p>
      </div>
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #eaeaea', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8faf9' }}>
                {['ID', 'Driver', 'Status', 'Distance', 'Earnings', 'Started', 'Completed'].map(h => (
                  <th key={h} style={{ padding: 12, fontSize: 12, fontWeight: 700, color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'left', borderBottom: '1px solid #eaeaea' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {deliveries.map(d => {
                const sc = statusColors[d.status] || { bg: '#f5f5f5', text: '#666' };
                return (
                  <tr key={d.id} style={{ borderBottom: '1px solid #fafafa' }}>
                    <td style={{ padding: 12, fontWeight: 700, color: '#111' }}>#{d.id}</td>
                    <td style={{ padding: 12, fontWeight: 600 }}>{d.driver}</td>
                    <td style={{ padding: 12 }}>
                      <span style={{ display: 'inline-flex', padding: '2px 12px', borderRadius: 20, background: sc.bg, color: sc.text, fontSize: 12, fontWeight: 700 }}>{d.status}</span>
                    </td>
                    <td style={{ padding: 12 }}>{d.distance ? `${d.distance} km` : '-'}</td>
                    <td style={{ padding: 12, fontWeight: 700 }}>{d.earnings ? `${Number(d.earnings).toLocaleString()} TZS` : '-'}</td>
                    <td style={{ padding: 12, fontSize: 13, color: '#666' }}>{d.startedAt ? new Date(d.startedAt).toLocaleDateString() : '-'}</td>
                    <td style={{ padding: 12, fontSize: 13, color: '#666' }}>{d.completedAt ? new Date(d.completedAt).toLocaleDateString() : '-'}</td>
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
