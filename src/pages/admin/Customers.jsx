import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Users } from 'lucide-react';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.adminCustomers().then(d => { setCustomers(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: 48, textAlign: 'center', color: '#666' }}>Loading...</div>;

  return (
    <div className="fade-in">
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#111', margin: 0 }}><span style={{display:'inline-flex',verticalAlign:'middle',marginRight:8}}><Users size={24} /></span> Customers</h1>
        <p style={{ fontSize: 15, color: '#666', marginTop: 4 }}>{customers.length} registered customers</p>
      </div>
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #eaeaea', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8faf9' }}>
                {['ID', 'Username', 'Email', 'Phone', 'Orders', 'Joined'].map(h => (
                  <th key={h} style={{ padding: 12, fontSize: 12, fontWeight: 700, color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'left', borderBottom: '1px solid #eaeaea' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {customers.map(c => (
                <tr key={c.id} style={{ borderBottom: '1px solid #fafafa' }}>
                  <td style={{ padding: 12, fontWeight: 700, color: '#111' }}>#{c.id}</td>
                  <td style={{ padding: 12, fontWeight: 600 }}>{c.username}</td>
                  <td style={{ padding: 12, color: '#666' }}>{c.email || '-'}</td>
                  <td style={{ padding: 12 }}>{c.phone || '-'}</td>
                  <td style={{ padding: 12 }}>{c.orders}</td>
                  <td style={{ padding: 12, fontSize: 13, color: '#666' }}>{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
