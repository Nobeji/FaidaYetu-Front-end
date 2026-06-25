import { useState, useEffect } from 'react';
import { colors, spacing, radius } from '../../constants/theme';
import { api } from '../../services/api';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.adminCustomers().then(d => { setCustomers(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: spacing.xxl, textAlign: 'center', color: '#5f6b64' }}>Loading...</div>;

  return (
    <div className="fade-in">
      <div style={{ marginBottom: spacing.xl }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#0a6e46', margin: 0 }}>👥 Customers</h1>
        <p style={{ fontSize: 15, color: '#5f6b64', marginTop: 4 }}>{customers.length} registered customers</p>
      </div>
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e0e8e4', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8faf9' }}>
                {['ID', 'Username', 'Email', 'Phone', 'Orders', 'Joined'].map(h => (
                  <th key={h} style={{ padding: spacing.md, fontSize: 12, fontWeight: 700, color: '#5f6b64', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'left', borderBottom: '1px solid #e0e8e4' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {customers.map(c => (
                <tr key={c.id} style={{ borderBottom: '1px solid #f0f5f2' }}>
                  <td style={{ padding: spacing.md, fontWeight: 700, color: '#0a6e46' }}>#{c.id}</td>
                  <td style={{ padding: spacing.md, fontWeight: 600 }}>{c.username}</td>
                  <td style={{ padding: spacing.md, color: '#5f6b64' }}>{c.email || '-'}</td>
                  <td style={{ padding: spacing.md }}>{c.phone || '-'}</td>
                  <td style={{ padding: spacing.md }}>{c.orders}</td>
                  <td style={{ padding: spacing.md, fontSize: 13, color: '#5f6b64' }}>{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
