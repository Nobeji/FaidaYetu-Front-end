import { useState, useEffect } from 'react';
import { colors, spacing, radius } from '../../constants/theme';
import { api } from '../../services/api';

export default function AdminSuppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.adminSuppliers().then(d => { setSuppliers(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: spacing.xxl, textAlign: 'center', color: '#5f6b64' }}>Loading...</div>;

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xl }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#0a6e46', margin: 0 }}>🏪 Suppliers</h1>
          <p style={{ fontSize: 15, color: '#5f6b64', marginTop: 4 }}>{suppliers.length} registered suppliers</p>
        </div>
      </div>
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e0e8e4', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8faf9' }}>
                {['ID', 'Name', 'Email', 'Products', 'Orders', 'Rating', 'Joined'].map(h => (
                  <th key={h} style={{ padding: spacing.md, fontSize: 12, fontWeight: 700, color: '#5f6b64', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'left', borderBottom: '1px solid #e0e8e4' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {suppliers.map(s => (
                <tr key={s.id} style={{ borderBottom: '1px solid #f0f5f2' }}>
                  <td style={{ padding: spacing.md, fontWeight: 700, color: '#0a6e46' }}>#{s.id}</td>
                  <td style={{ padding: spacing.md, fontWeight: 600 }}>{s.name}</td>
                  <td style={{ padding: spacing.md, color: '#5f6b64' }}>{s.email || '-'}</td>
                  <td style={{ padding: spacing.md }}>{s.products}</td>
                  <td style={{ padding: spacing.md }}>{s.orders}</td>
                  <td style={{ padding: spacing.md }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 10px', borderRadius: 20, background: s.rating >= 4 ? '#e8f5ee' : s.rating >= 3 ? '#fff8f0' : '#fff5f5', color: s.rating >= 4 ? '#0a6e46' : s.rating >= 3 ? '#e07c00' : '#ba1a1a', fontSize: 12, fontWeight: 700 }}>
                      ⭐ {s.rating}
                    </span>
                  </td>
                  <td style={{ padding: spacing.md, fontSize: 13, color: '#5f6b64' }}>{s.createdAt ? new Date(s.createdAt).toLocaleDateString() : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
