import { useState, useEffect } from 'react';
import { colors, spacing, radius } from '../../constants/theme';
import { api } from '../../services/api';

export default function AdminReports() {
  const [dashboard, setDashboard] = useState(null);
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.adminDashboard(),
      api.adminPerformance(),
    ]).then(([d, p]) => { setDashboard(d); setPerformance(p); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ padding: spacing.xxl, textAlign: 'center', color: colors.onSurfaceVariant }}>
      {[1,2,3].map(i => <div key={i} style={{ height: 20, background: '#e0e8e4', borderRadius: 8, marginBottom: 12, width: `${60 + i * 10}%`, animation: 'pulse 1.5s infinite' }} />)}
    </div>
  );

  return (
    <div className="fade-in">
      <div style={{ marginBottom: spacing.xl }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#0a6e46', margin: 0 }}>📋 Reports</h1>
        <p style={{ fontSize: 15, color: '#5f6b64', marginTop: 4 }}>Platform-wide performance and operational reports</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: spacing.md, marginBottom: spacing.xl }}>
        {[
          { label: 'Total Users', value: dashboard?.totalUsers, icon: '👤' },
          { label: 'Suppliers', value: dashboard?.totalSuppliers, icon: '🏪' },
          { label: 'Customers', value: dashboard?.totalCustomers, icon: '👥' },
          { label: 'Orders Today', value: dashboard?.ordersToday, icon: '📦' },
          { label: 'Revenue Today', value: dashboard?.revenueToday, icon: '💰' },
          { label: 'Products', value: dashboard?.totalProducts, icon: '📦' },
          { label: 'Active Deliveries', value: dashboard?.activeDeliveries, icon: '🚚' },
          { label: 'Total Revenue', value: dashboard?.totalRevenue, icon: '💳' },
        ].map(c => (
          <div key={c.label} style={{ background: '#fff', borderRadius: 12, padding: spacing.md, border: '1px solid #e0e8e4', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#5f6b64', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{c.label}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#0a6e46' }}>{c.value || 0}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.xl, marginBottom: spacing.xl }}>
        <div style={{ background: '#fff', borderRadius: 16, padding: spacing.lg, border: '1px solid #e0e8e4', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0a6e46', marginBottom: spacing.lg }}>📉 Delivery Performance</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.md }}>
            {[
              { label: 'Avg Delivery Time', value: performance?.avgDeliveryTime },
              { label: 'Fastest Route', value: performance?.fastestRoute },
              { label: 'Efficiency', value: performance?.deliveryEfficiency },
              { label: 'Completion Rate', value: performance?.completionRate },
              { label: 'Total Routes', value: performance?.totalRoutes },
              { label: 'Cancelled', value: performance?.cancelledDeliveries },
            ].map(m => (
              <div key={m.label} style={{ padding: spacing.md, background: '#f8faf9', borderRadius: 10 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#5f6b64', textTransform: 'uppercase', marginBottom: 4 }}>{m.label}</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#0a6e46' }}>{m.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: '#fff', borderRadius: 16, padding: spacing.lg, border: '1px solid #e0e8e4', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0a6e46', marginBottom: spacing.lg }}>📊 Platform Overview</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
            {[
              { label: 'Supplier to Customer Ratio', value: dashboard?.totalSuppliers && dashboard?.totalCustomers ? `${((dashboard.totalSuppliers / Math.max(dashboard.totalCustomers, 1)) * 100).toFixed(1)}%` : 'N/A' },
              { label: 'Orders per Customer', value: dashboard?.totalOrders && dashboard?.totalCustomers ? (dashboard.totalOrders / dashboard.totalCustomers).toFixed(1) : '0' },
              { label: 'Revenue per Order', value: 'N/A' },
              { label: 'Platform Growth', value: '+12%' },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', padding: spacing.sm, borderBottom: '1px solid #e8f5ee' }}>
                <span style={{ fontSize: 14, color: '#5f6b64' }}>{s.label}</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#0a6e46' }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: 'linear-gradient(135deg, #0a6e46, #06402b)', borderRadius: 16, padding: spacing.xl, color: '#fff' }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 spacing.md 0' }}>📄 Generate Full Report</h3>
        <p style={{ fontSize: 14, opacity: 0.85, marginBottom: spacing.lg }}>Download a comprehensive PDF report with all platform analytics, charts, and predictions.</p>
        <button style={{ padding: '12px 32px', borderRadius: 12, background: '#fff', color: '#0a6e46', border: 'none', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
          📥 Download Report (PDF)
        </button>
      </div>
    </div>
  );
}
