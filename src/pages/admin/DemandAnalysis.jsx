import { useState, useEffect } from 'react';
import { colors, spacing, radius } from '../../constants/theme';
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
    <div style={{ padding: spacing.xxl, textAlign: 'center', color: colors.onSurfaceVariant }}>
      {[1,2,3].map(i => <div key={i} style={{ height: 20, background: '#e0e8e4', borderRadius: 8, marginBottom: 12, width: `${60 + i * 10}%`, animation: 'pulse 1.5s infinite' }} />)}
    </div>
  );
  if (!data) return <div style={{ padding: spacing.xxl, textAlign: 'center' }}>No data available</div>;

  const maxDay = Math.max(...(data.ordersPerDay || []).map(d => d.count), 1);
  const maxWard = Math.max(...(data.ordersPerWard || []).map(w => w.count), 1);

  return (
    <div className="fade-in">
      <div style={{ marginBottom: spacing.xl }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#0a6e46', margin: 0 }}>Demand Analysis</h1>
        <p style={{ fontSize: 15, color: '#5f6b64', marginTop: 4 }}>Real-time demand insights across Dar es Salaam</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: spacing.md, marginBottom: spacing.xl }}>
        {[
          { label: 'Total Orders', value: data.totalOrders, icon: '📦', color: '#0a6e46' },
          { label: 'Weekly Orders', value: data.ordersWeekly, icon: '📅', color: '#2d6a4f' },
          { label: 'Monthly Orders', value: data.ordersMonthly, icon: '📆', color: '#40916c' },
          { label: 'Top Area', value: data.mostOrderedArea, icon: '📍', color: '#e07c00' },
        ].map(c => (
          <div key={c.label} style={{ background: '#fff', borderRadius: 16, padding: spacing.lg, border: '1px solid #e0e8e4', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#5f6b64', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: spacing.sm }}>{c.label}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: c.color }}>{c.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.xl, marginBottom: spacing.xl }}>
        <div style={{ background: '#fff', borderRadius: 16, padding: spacing.lg, border: '1px solid #e0e8e4', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0a6e46', marginBottom: spacing.lg }}>📈 Orders Per Day (Last 7 Days)</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: spacing.sm, height: 160 }}>
            {(data.ordersPerDay || []).map((d, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#0a6e46' }}>{d.count}</span>
                <div style={{
                  width: '100%', maxWidth: 48, height: `${(d.count / maxDay) * 130}px`,
                  background: 'linear-gradient(180deg, #0a6e46, #52b788)',
                  borderRadius: '8px 8px 4px 4px', transition: 'height 0.5s',
                  minHeight: 4, boxShadow: '0 2px 4px rgba(10,110,70,0.2)',
                }} />
                <span style={{ fontSize: 10, color: '#5f6b64', transform: 'rotate(-45deg)', whiteSpace: 'nowrap' }}>
                  {d.date ? new Date(d.date).toLocaleDateString('en', { weekday: 'short' }) : ''}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: '#fff', borderRadius: 16, padding: spacing.lg, border: '1px solid #e0e8e4', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0a6e46', marginBottom: spacing.lg }}>🏆 Most Ordered Areas (Top 5 Wards)</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
            {(data.ordersPerWard || []).map((w, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
                <span style={{ width: 20, fontSize: 13, fontWeight: 700, color: '#5f6b64' }}>#{i + 1}</span>
                <span style={{ width: 100, fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>{w.ward}</span>
                <div style={{ flex: 1, height: 24, background: '#e8f5ee', borderRadius: 12, overflow: 'hidden' }}>
                  <div style={{ width: `${(w.count / maxWard) * 100}%`, height: '100%', background: 'linear-gradient(90deg, #0a6e46, #52b788)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 8, minWidth: 40 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>{w.count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.xl }}>
        <div style={{ background: '#fff', borderRadius: 16, padding: spacing.lg, border: '1px solid #e0e8e4', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0a6e46', marginBottom: spacing.lg }}>🌟 Most Ordered Product</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.lg, padding: spacing.lg, background: 'linear-gradient(135deg, #e8f5ee, #c8e6d9)', borderRadius: 12 }}>
            <span style={{ fontSize: 48 }}>🥚</span>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#0a6e46' }}>{data.mostOrderedProduct?.name || 'N/A'}</div>
              <div style={{ fontSize: 15, color: '#5f6b64' }}>{data.mostOrderedProduct?.quantity || 0} units sold</div>
            </div>
          </div>
        </div>

        <div style={{ background: '#fff', borderRadius: 16, padding: spacing.lg, border: '1px solid #e0e8e4', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0a6e46', marginBottom: spacing.lg }}>📊 Product Categories</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
            {(data.productCategories || []).map((c, i) => {
              const maxCat = Math.max(...(data.productCategories || []).map(x => x.total), 1);
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
                  <span style={{ width: 90, fontSize: 14, fontWeight: 600, color: '#1a1a1a', textTransform: 'capitalize' }}>{c.category}</span>
                  <div style={{ flex: 1, height: 20, background: '#e8f5ee', borderRadius: 10, overflow: 'hidden' }}>
                    <div style={{ width: `${(c.total / maxCat) * 100}%`, height: '100%', background: 'linear-gradient(90deg, #40916c, #52b788)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 8, minWidth: 30 }}>
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
