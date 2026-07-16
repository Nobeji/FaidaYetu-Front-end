import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { ShoppingCart } from 'lucide-react';

const statusColors = {
  new: { bg: '#f5f5f5', text: '#111' },
  processing: { bg: '#fff8f0', text: '#e07c00' },
  ready: { bg: '#111', text: '#fff' },
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

  if (loading) return <div style={{ padding: 48, textAlign: 'center', color: '#666' }}>Loading...</div>;

  return (
    <div className="fade-in">
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#111', margin: 0 }}><span style={{display:'inline-flex',verticalAlign:'middle',marginRight:8}}><ShoppingCart size={24} /></span> Orders</h1>
        <p style={{ fontSize: 15, color: '#666', marginTop: 4 }}>{orders.length} total orders</p>
      </div>
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #eaeaea', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8faf9' }}>
                {['Order ID', 'Customer', 'Supplier', 'Status', 'Payment', 'Amount', 'Address', 'Date'].map(h => (
                  <th key={h} style={{ padding: 12, fontSize: 12, fontWeight: 700, color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'left', borderBottom: '1px solid #eaeaea' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map(o => {
                const sc = statusColors[o.status] || { bg: '#f5f5f5', text: '#666' };
                return (
                  <tr key={o.id} style={{ borderBottom: '1px solid #fafafa' }}>
                    <td style={{ padding: 12, fontWeight: 700, color: '#111' }}>#{o.id}</td>
                    <td style={{ padding: 12, fontWeight: 600 }}>{o.customer}</td>
                    <td style={{ padding: 12, color: '#666' }}>{o.supplier}</td>
                    <td style={{ padding: 12 }}>
                      <span style={{ display: 'inline-flex', padding: '2px 12px', borderRadius: 20, background: sc.bg, color: sc.text, fontSize: 12, fontWeight: 700 }}>{o.status}</span>
                    </td>
                    <td style={{ padding: 12 }}>
                      {o.paid
                        ? <span style={{ color: '#2e7d32', fontWeight: 600, fontSize: 13 }}>Paid</span>
                        : <span style={{ color: '#d32f2f', fontWeight: 600, fontSize: 13 }}>Unpaid</span>
                      }
                    </td>
                    <td style={{ padding: 12, fontWeight: 700 }}>{Number(o.total).toLocaleString()} TZS</td>
                    <td style={{ padding: 12, fontSize: 13, color: '#666', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.address || '-'}</td>
                    <td style={{ padding: 12, fontSize: 13, color: '#666' }}>{o.createdAt ? new Date(o.createdAt).toLocaleDateString() : '-'}</td>
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
