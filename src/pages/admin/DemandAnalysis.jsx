import { useState, useEffect } from 'react';
import { api } from '../../services/api';

export default function DemandAnalysis() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState(null);

  useEffect(() => {
    Promise.all([
      api.adminDemandAnalysis(),
      api.adminDashboard(),
    ]).then(([d, o]) => { setData(d); setOverview(o); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ padding: 48, textAlign: 'center', color: '#888' }}>
      {[1,2,3].map(i => <div key={i} style={{ height: 20, background: '#eaeaea', borderRadius: 8, marginBottom: 12, width: `${60 + i * 10}%`, animation: 'pulse 1.5s infinite' }} />)}
    </div>
  );
  if (!data) return <div style={{ padding: 48, textAlign: 'center' }}>No data available</div>;

  const maxDay = Math.max(...(data.ordersPerDay || []).map(d => d.count), 1);
  const maxWard = Math.max(...(data.ordersPerWard || []).map(w => w.count), 1);

  return (
    <div className="fade-in">
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#111', margin: 0 }}>Demand Analysis</h1>
        <p style={{ fontSize: 15, color: '#666', marginTop: 4 }}>Real-time demand insights across Dar es Salaam</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12, marginBottom: 28 }}>
        {[
          { label: 'Total Orders', value: data.totalOrders, color: '#111' },
          { label: 'Weekly Orders', value: data.ordersWeekly, color: '#333' },
          { label: 'Monthly Orders', value: data.ordersMonthly, color: '#40916c' },
          { label: 'Top Area', value: data.mostOrderedArea, color: '#e07c00' },
        ].map(c => (
          <div key={c.label} style={{ background: '#fff', borderRadius: 16, padding: 20, border: '1px solid #eaeaea', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>{c.label}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: c.color }}>{c.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, marginBottom: 28 }}>
        <div style={{ background: '#fff', borderRadius: 16, padding: 20, border: '1px solid #eaeaea', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111', marginBottom: 20 }}>Orders Per Day (Last 7 Days)</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 160 }}>
            {(data.ordersPerDay || []).map((d, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#111' }}>{d.count}</span>
                <div style={{
                  width: '100%', maxWidth: 48, height: `${(d.count / maxDay) * 130}px`,
                  background: 'linear-gradient(180deg, #111, #555)',
                  borderRadius: '8px 8px 4px 4px', transition: 'height 0.5s',
                  minHeight: 4, boxShadow: '0 2px 4px rgba(10,110,70,0.2)',
                }} />
                <span style={{ fontSize: 10, color: '#666', transform: 'rotate(-45deg)', whiteSpace: 'nowrap' }}>
                  {d.date ? new Date(d.date).toLocaleDateString('en', { weekday: 'short' }) : ''}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: '#fff', borderRadius: 16, padding: 20, border: '1px solid #eaeaea', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111', marginBottom: 20 }}>Most Ordered Areas (Top 5 Wards)</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {(data.ordersPerWard || []).map((w, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ width: 20, fontSize: 13, fontWeight: 700, color: '#666' }}>#{i + 1}</span>
                <span style={{ width: 100, fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>{w.ward}</span>
                <div style={{ flex: 1, height: 24, background: '#f5f5f5', borderRadius: 12, overflow: 'hidden' }}>
                  <div style={{ width: `${(w.count / maxWard) * 100}%`, height: '100%', background: 'linear-gradient(90deg, #111, #555)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 8, minWidth: 40 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>{w.count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>
        <div style={{ background: '#fff', borderRadius: 16, padding: 20, border: '1px solid #eaeaea', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111', marginBottom: 20 }}>Most Ordered Product</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, padding: 20, background: 'linear-gradient(135deg, #f5f5f5, #eee)', borderRadius: 12 }}>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#111' }}>{data.mostOrderedProduct?.name || 'N/A'}</div>
              <div style={{ fontSize: 15, color: '#666' }}>{data.mostOrderedProduct?.quantity || 0} units sold</div>
            </div>
          </div>
        </div>

        <div style={{ background: '#fff', borderRadius: 16, padding: 20, border: '1px solid #eaeaea', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111', marginBottom: 20 }}>Product Categories</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {(data.productCategories || []).map((c, i) => {
              const maxCat = Math.max(...(data.productCategories || []).map(x => x.total), 1);
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ width: 90, fontSize: 14, fontWeight: 600, color: '#1a1a1a', textTransform: 'capitalize' }}>{c.category}</span>
                  <div style={{ flex: 1, height: 20, background: '#f5f5f5', borderRadius: 10, overflow: 'hidden' }}>
                    <div style={{ width: `${(c.total / maxCat) * 100}%`, height: '100%', background: 'linear-gradient(90deg, #40916c, #555)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 8, minWidth: 30 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: '#fff' }}>{c.total}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
