import { useState, useEffect } from 'react';
import { api } from '../../services/api';

export default function AdminSuppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.adminSuppliers().then(d => { setSuppliers(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: 48, textAlign: 'center', color: '#666' }}>Loading...</div>;

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#111', margin: 0 }}>🏪 Suppliers</h1>
          <p style={{ fontSize: 15, color: '#666', marginTop: 4 }}>{suppliers.length} registered suppliers</p>
        </div>
      </div>
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #eaeaea', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8faf9' }}>
                {['ID', 'Name', 'Email', 'Products', 'Orders', 'Rating', 'Joined'].map(h => (
                  <th key={h} style={{ padding: 12, fontSize: 12, fontWeight: 700, color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'left', borderBottom: '1px solid #eaeaea' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {suppliers.map(s => (
                <tr key={s.id} style={{ borderBottom: '1px solid #fafafa' }}>
                  <td style={{ padding: 12, fontWeight: 700, color: '#111' }}>#{s.id}</td>
                  <td style={{ padding: 12, fontWeight: 600 }}>{s.name}</td>
                  <td style={{ padding: 12, color: '#666' }}>{s.email || '-'}</td>
                  <td style={{ padding: 12 }}>{s.products}</td>
                  <td style={{ padding: 12 }}>{s.orders}</td>
                  <td style={{ padding: 12 }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 10px', borderRadius: 20, background: s.rating >= 4 ? '#f5f5f5' : s.rating >= 3 ? '#fff8f0' : '#fff5f5', color: s.rating >= 4 ? '#111' : s.rating >= 3 ? '#e07c00' : '#ba1a1a', fontSize: 12, fontWeight: 700 }}>
                      ⭐ {s.rating}
                    </span>
                  </td>
                  <td style={{ padding: 12, fontSize: 13, color: '#666' }}>{s.createdAt ? new Date(s.createdAt).toLocaleDateString() : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
