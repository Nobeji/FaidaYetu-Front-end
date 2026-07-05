import { useState, useEffect } from 'react';
import { api } from '../../services/api';

export default function InventoryForecast() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.adminInventory().then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: 48, textAlign: 'center', color: '#666' }}>Loading...</div>;

  return (
    <div className="fade-in">
      <h1 style={{ fontSize: 28, fontWeight: 700, margin: '0 0 4px' }}>📦 Inventory Forecasting</h1>
      <p style={{ fontSize: 15, color: '#666', marginBottom: 24 }}>Reorder suggestions based on historical sales data</p>
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #eaeaea', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8faf9' }}>
                {['Product', 'Supplier', 'Stock', 'Daily Rate', 'Reorder Point', 'Safety Stock', 'Days Left', 'Status'].map(h => (
                  <th key={h} style={{ padding: 12, fontSize: 12, fontWeight: 700, color: '#666', textTransform: 'uppercase', textAlign: 'left', borderBottom: '1px solid #eaeaea' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data?.products?.map(p => (
                <tr key={p.product_id} style={{ borderBottom: '1px solid #fafafa', background: p.needs_reorder ? '#fff8f0' : 'transparent' }}>
                  <td style={{ padding: 12, fontWeight: 600 }}>{p.product_name}</td>
                  <td style={{ padding: 12, fontSize: 13, color: '#666' }}>{p.supplier}</td>
                  <td style={{ padding: 12, fontWeight: 700 }}>{p.current_stock}</td>
                  <td style={{ padding: 12 }}>{p.daily_sales_rate}/day</td>
                  <td style={{ padding: 12 }}>{p.reorder_point}</td>
                  <td style={{ padding: 12 }}>{p.safety_stock}</td>
                  <td style={{ padding: 12, fontWeight: 700, color: p.days_until_stockout < 7 ? '#d32f2f' : p.days_until_stockout < 14 ? '#e65100' : '#2e7d32' }}>
                    {p.days_until_stockout === 999 ? '∞' : `${p.days_until_stockout}d`}
                  </td>
                  <td style={{ padding: 12 }}>
                    {p.needs_reorder
                      ? <span style={{ background: '#ff9800', color: '#fff', padding: '2px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>Reorder</span>
                      : <span style={{ background: '#e8f5e9', color: '#2e7d32', padding: '2px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>OK</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
