import { useState, useEffect } from 'react';
import { api } from '../../services/api';

export default function RouteOptimization() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.adminRoute().then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: 48, textAlign: 'center', color: '#666' }}>Loading...</div>;

  return (
    <div className="fade-in">
      <h1 style={{ fontSize: 28, fontWeight: 700, margin: '0 0 4px' }}>🗺️ Route Optimization</h1>
      <p style={{ fontSize: 15, color: '#666', marginBottom: 24 }}>Nearest-neighbor optimized delivery route for pending orders</p>
      {data?.message ? (
        <div style={{ textAlign: 'center', padding: 48, color: '#888', background: '#fff', borderRadius: 16, border: '1px solid #eaeaea' }}>{data.message}</div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
            <div style={{ background: '#fff', borderRadius: 12, padding: 16, border: '1px solid #eaeaea' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#888', textTransform: 'uppercase' }}>Stops</div>
              <div style={{ fontSize: 28, fontWeight: 800 }}>{data?.stop_count || 0}</div>
            </div>
            <div style={{ background: '#fff', borderRadius: 12, padding: 16, border: '1px solid #eaeaea' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#888', textTransform: 'uppercase' }}>Est. Distance</div>
              <div style={{ fontSize: 28, fontWeight: 800 }}>{data?.estimated_distance_km || 0} km</div>
            </div>
            <div style={{ background: '#fff', borderRadius: 12, padding: 16, border: '1px solid #eaeaea' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#888', textTransform: 'uppercase' }}>Starting Point</div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{data?.start ? `${data.start.lat.toFixed(4)}, ${data.start.lng.toFixed(4)}` : 'Dar es Salaam'}</div>
            </div>
          </div>
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #eaeaea', overflow: 'hidden' }}>
            <div style={{ padding: 16, fontWeight: 700, borderBottom: '1px solid #eaeaea' }}>Optimized Route Order</div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8faf9' }}>
                    {['Stop', 'Customer', 'Supplier', 'Address', 'Location'].map(h => (
                      <th key={h} style={{ padding: 12, fontSize: 12, fontWeight: 700, color: '#666', textTransform: 'uppercase', textAlign: 'left', borderBottom: '1px solid #eaeaea' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data?.route?.map((r, i) => (
                    <tr key={r.order_id} style={{ borderBottom: '1px solid #fafafa' }}>
                      <td style={{ padding: 12 }}><span style={{ background: '#000', color: '#fff', width: 24, height: 24, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>{i + 1}</span></td>
                      <td style={{ padding: 12, fontWeight: 600 }}>{r.customer}</td>
                      <td style={{ padding: 12 }}>{r.supplier}</td>
                      <td style={{ padding: 12, fontSize: 13, color: '#666' }}>{r.address || '-'}</td>
                      <td style={{ padding: 12, fontSize: 13, color: '#666' }}>{r.lat.toFixed(4)}, {r.lng.toFixed(4)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
