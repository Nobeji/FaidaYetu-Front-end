import { useState, useEffect } from 'react';
import { spacing } from '../../constants/theme';
import { api } from '../../services/api';

const statusColors = {
  new: { bg: '#e8f5ee', text: '#0a6e46' },
  processing: { bg: '#fff8f0', text: '#e07c00' },
  ready: { bg: '#0a6e46', text: '#fff' },
  in_transit: { bg: '#e3f2fd', text: '#1565c0' },
  delivered: { bg: '#e8f5e9', text: '#2e7d32' },
  cancelled: { bg: '#ffebee', text: '#c62828' },
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.adminList('orders').then(d => { setOrders(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: spacing.xxl, textAlign: 'center', color: '#5f6b64' }}>Loading...</div>;

  return (
    <div className="fade-in">
      <div style={{ marginBottom: spacing.xl }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#0a6e46', margin: 0 }}>🛒 Orders</h1>
        <p style={{ fontSize: 15, color: '#5f6b64', marginTop: 4 }}>{orders.length} total orders</p>
      </div>
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e0e8e4', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8faf9' }}>
                {['Order ID', 'Customer', 'Supplier', 'Status', 'Amount', 'Address', 'Date'].map(h => (
                  <th key={h} style={{ padding: spacing.md, fontSize: 12, fontWeight: 700, color: '#5f6b64', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'left', borderBottom: '1px solid #e0e8e4' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map(o => {
                const sc = statusColors[o.status] || { bg: '#f5f5f5', text: '#666' };
                return (
                  <tr key={o.id} style={{ borderBottom: '1px solid #f0f5f2' }}>
                    <td style={{ padding: spacing.md, fontWeight: 700, color: '#0a6e46' }}>#{o.id}</td>
                    <td style={{ padding: spacing.md, fontWeight: 600 }}>{o.customer}</td>
                    <td style={{ padding: spacing.md, color: '#5f6b64' }}>{o.supplier}</td>
                    <td style={{ padding: spacing.md }}>
                      <span style={{ display: 'inline-flex', padding: '2px 12px', borderRadius: 20, background: sc.bg, color: sc.text, fontSize: 12, fontWeight: 700 }}>{o.status}</span>
                    </td>
                    <td style={{ padding: spacing.md, fontWeight: 700 }}>{Number(o.total).toLocaleString()} TZS</td>
                    <td style={{ padding: spacing.md, fontSize: 13, color: '#5f6b64', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.address || '-'}</td>
                    <td style={{ padding: spacing.md, fontSize: 13, color: '#5f6b64' }}>{o.createdAt ? new Date(o.createdAt).toLocaleDateString() : '-'}</td>
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
