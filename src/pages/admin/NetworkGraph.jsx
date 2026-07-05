import { useState, useEffect } from 'react';
import { api } from '../../services/api';

export default function NetworkGraph() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.adminNetwork().then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: 48, textAlign: 'center', color: '#666' }}>Loading...</div>;

  const suppliers = data?.nodes?.filter(n => n.type === 'supplier') || [];
  const customers = data?.nodes?.filter(n => n.type === 'customer') || [];

  return (
    <div className="fade-in">
      <h1 style={{ fontSize: 28, fontWeight: 700, margin: '0 0 4px' }}>🔗 Network Graph</h1>
      <p style={{ fontSize: 15, color: '#666', marginBottom: 24 }}>Supplier-customer relationship network</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
        <div style={{ background: '#fff', borderRadius: 12, padding: 16, border: '1px solid #eaeaea' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#888', textTransform: 'uppercase' }}>Suppliers</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#0a6e46' }}>{suppliers.length}</div>
        </div>
        <div style={{ background: '#fff', borderRadius: 12, padding: 16, border: '1px solid #eaeaea' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#888', textTransform: 'uppercase' }}>Customers</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#1565c0' }}>{customers.length}</div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #eaeaea', overflow: 'hidden' }}>
          <div style={{ padding: 16, fontWeight: 700, borderBottom: '1px solid #eaeaea' }}>Suppliers</div>
          <div style={{ padding: 12 }}>
            {suppliers.map(s => (
              <div key={s.id} style={{ padding: 10, borderBottom: '1px solid #f5f5f5', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 600 }}>{s.label}</span>
                <span style={{ color: '#888', fontSize: 13 }}>{s.order_count} orders | {Number(s.revenue || 0).toLocaleString()} TZS</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #eaeaea', overflow: 'hidden' }}>
          <div style={{ padding: 16, fontWeight: 700, borderBottom: '1px solid #eaeaea' }}>Customers</div>
          <div style={{ padding: 12 }}>
            {customers.map(s => (
              <div key={s.id} style={{ padding: 10, borderBottom: '1px solid #f5f5f5', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 600 }}>{s.label}</span>
                <span style={{ color: '#888', fontSize: 13 }}>{s.order_count} orders</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {data?.edges?.length > 0 && (
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #eaeaea', overflow: 'hidden', marginTop: 16 }}>
          <div style={{ padding: 16, fontWeight: 700, borderBottom: '1px solid #eaeaea' }}>Transaction Edges ({data.edges.length})</div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8faf9' }}>
                  {['Customer', 'Supplier', 'Value', 'Status'].map(h => (
                    <th key={h} style={{ padding: 12, fontSize: 12, fontWeight: 700, color: '#666', textTransform: 'uppercase', textAlign: 'left', borderBottom: '1px solid #eaeaea' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.edges.slice(0, 30).map((e, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #fafafa' }}>
                    <td style={{ padding: 12 }}>{e.source.replace('customer_', '#')}</td>
                    <td style={{ padding: 12 }}>{e.target.replace('supplier_', '#')}</td>
                    <td style={{ padding: 12, fontWeight: 700 }}>{e.value.toLocaleString()} TZS</td>
                    <td style={{ padding: 12 }}><span style={{ textTransform: 'capitalize', fontSize: 13 }}>{e.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
