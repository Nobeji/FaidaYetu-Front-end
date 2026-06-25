import { useState, useEffect } from 'react';
import { colors, spacing, radius } from '../../constants/theme';
import DashboardShell from '../../components/DashboardShell';
import StatsCard from '../../components/StatsCard';
import StatusBadge from '../../components/StatusBadge';
import ProgressBar from '../../components/ProgressBar';
import { api } from '../../services/api';

const navItems = [
  { icon: '📊', label: 'Dashboard', nav: '/supplier' },
  { icon: '📦', label: 'Inventory', nav: '/supplier/inventory' },
  { icon: '🛒', label: 'Orders', nav: '/supplier/orders' },
  { icon: '📈', label: 'Analytics', nav: '/supplier/analytics' },
  { icon: '📉', label: 'Statistics', nav: '/supplier/statistics' },
  { icon: '⚙️', label: 'Settings', nav: '/supplier/settings' },
  { icon: '❓', label: 'Support', nav: '/supplier/support' },
];

const STATUS_LABELS = {
  new: 'New', processing: 'Processing', ready: 'Ready',
  in_transit: 'In Transit', delivered: 'Delivered', cancelled: 'Cancelled',
};

export default function SupplierStatistics() {
  const [data, setData] = useState({ stats: { orders: '0', revenue: '0 TZS', lowStock: '00', growth: '+0%' }, orders: [], inventory: [] });
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sid = JSON.parse(localStorage.getItem('supplier') || '{}').id || 1;
    Promise.all([
      api.supplierDashboard(sid),
      api.orders({ supplier: sid }).catch(() => []),
    ]).then(([d, orders]) => {
      setData(d);
      setAllOrders(orders);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const statusCounts = {};
  for (const o of allOrders) {
    statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
  }
  const totalOrders = allOrders.length || parseInt(data.stats.orders) || 0;
  const avgOrderValue = totalOrders > 0
    ? Math.round(parseFloat(data.stats.revenue.replace(/[^0-9.]/g, '')) / totalOrders).toLocaleString()
    : 'N/A';

  return (
    <DashboardShell brand="FaidaYetu" brandSub="Poultry Logistics Hub" navItems={navItems}>
      <div className="fade-in">
        <div style={{ marginBottom: spacing.lg }}>
          <h1 style={{ fontSize: 28, fontWeight: 600, color: colors.primary }}>Statistics</h1>
          <p style={{ fontSize: 15, color: colors.onSurfaceVariant }}>Detailed performance metrics for your business</p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: spacing.xxl, color: colors.onSurfaceVariant }}>Loading statistics...</div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: spacing.md, marginBottom: spacing.xl }}>
              <StatsCard label="Total Revenue" value={data.stats.revenue} sub="All time earnings" subIcon="💰" icon="💳" tertiary />
              <StatsCard label="Total Orders" value={data.stats.orders} sub="All orders placed" subIcon="📦" icon="🛍️" />
              <StatsCard label="Avg Order Value" value={`${avgOrderValue} TZS`} sub="Per transaction" subIcon="📊" icon="📈" />
              <StatsCard label="Growth Rate" value={data.stats.growth} sub="Period over period" subIcon="📉" icon="🚀" />
              <StatsCard label="Low Stock Items" value={data.stats.lowStock} sub="Needs attention" subIcon="⚠️" icon="📦" error />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.lg, marginBottom: spacing.xl }}>
              <div style={{ background: colors.surfaceContainerLowest, border: `1px solid ${colors.outlineVariant}`, borderRadius: radius.xl, padding: spacing.lg }}>
                <h3 style={{ fontSize: 18, fontWeight: 600, color: colors.primary, marginBottom: spacing.md }}>Order Status Breakdown</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                  {Object.entries(STATUS_LABELS).map(([key, label]) => {
                    const count = statusCounts[key] || 0;
                    const pct = totalOrders > 0 ? (count / totalOrders * 100).toFixed(1) : '0.0';
                    return (
                      <div key={key} style={{ display: 'flex', alignItems: 'center', gap: spacing.md, padding: `${spacing.sm}px ${spacing.md}px`, background: colors.surfaceContainer, borderRadius: radius.md }}>
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                          <StatusBadge status={key} />
                          <span style={{ fontSize: 14, fontWeight: 500, color: colors.onSurface }}>{label}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
                          <div style={{ width: 120, height: 6, background: colors.outlineVariant, borderRadius: 3, overflow: 'hidden' }}>
                            <div style={{ width: `${pct}%`, height: '100%', background: colors.primary, borderRadius: 3, transition: 'width 0.5s' }} />
                          </div>
                          <span style={{ fontSize: 14, fontWeight: 700, color: colors.onSurface, minWidth: 40, textAlign: 'right' }}>{count}</span>
                          <span style={{ fontSize: 12, color: colors.onSurfaceVariant, minWidth: 40, textAlign: 'right' }}>{pct}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={{ background: colors.surfaceContainerLowest, border: `1px solid ${colors.outlineVariant}`, borderRadius: radius.xl, padding: spacing.lg }}>
                <h3 style={{ fontSize: 18, fontWeight: 600, color: colors.primary, marginBottom: spacing.md }}>Revenue Summary</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: spacing.md, background: colors.surfaceContainer, borderRadius: radius.md }}>
                    <span style={{ fontSize: 14, color: colors.onSurfaceVariant }}>Gross Revenue</span>
                    <span style={{ fontSize: 18, fontWeight: 800, color: colors.primary }}>{data.stats.revenue}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: spacing.md, background: colors.surfaceContainer, borderRadius: radius.md }}>
                    <span style={{ fontSize: 14, color: colors.onSurfaceVariant }}>Total Transactions</span>
                    <span style={{ fontSize: 18, fontWeight: 800, color: colors.primary }}>{data.stats.orders}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: spacing.md, background: colors.surfaceContainer, borderRadius: radius.md }}>
                    <span style={{ fontSize: 14, color: colors.onSurfaceVariant }}>Average Order Value</span>
                    <span style={{ fontSize: 18, fontWeight: 800, color: colors.primary }}>{avgOrderValue} TZS</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: spacing.md, background: colors.surfaceContainer, borderRadius: radius.md }}>
                    <span style={{ fontSize: 14, color: colors.onSurfaceVariant }}>Growth</span>
                    <span style={{ fontSize: 18, fontWeight: 800, color: colors.tertiary }}>{data.stats.growth}</span>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ background: colors.surfaceContainerLowest, border: `1px solid ${colors.outlineVariant}`, borderRadius: radius.xl, overflow: 'hidden', marginBottom: spacing.xl }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: spacing.lg, borderBottom: `1px solid ${colors.outlineVariant}` }}>
                <h3 style={{ fontSize: 18, fontWeight: 600, color: colors.primary }}>Recent Orders</h3>
                <span style={{ fontSize: 14, color: colors.primary, cursor: 'pointer' }}>View All</span>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'rgba(193,236,212,0.3)' }}>
                      {['Order ID', 'Customer', 'Status', 'Amount', 'Date'].map(h => (
                        <th key={h} style={{ padding: spacing.md, fontSize: 13, fontWeight: 600, color: colors.onSurfaceVariant, borderBottom: `1px solid ${colors.outlineVariant}` }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.orders.map(o => (
                      <tr key={o.id} style={{ cursor: 'pointer' }}>
                        <td style={{ padding: spacing.md, fontWeight: 700, color: colors.primary }}>#{o.id}</td>
                        <td style={{ padding: spacing.md }}>{o.customer_name}</td>
                        <td style={{ padding: spacing.md }}><StatusBadge status={o.status} /></td>
                        <td style={{ padding: spacing.md, fontWeight: 700 }}>{Number(o.total).toLocaleString()} TZS</td>
                        <td style={{ padding: spacing.md, color: colors.onSurfaceVariant, fontSize: 13 }}>{o.created_at ? new Date(o.created_at).toLocaleDateString() : '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div style={{ background: colors.surfaceContainerLowest, border: `1px solid ${colors.outlineVariant}`, borderRadius: radius.xl, padding: spacing.lg }}>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: colors.primary, marginBottom: spacing.lg }}>Inventory Health</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: spacing.md }}>
                {data.inventory.map(i => <ProgressBar key={i.name} {...i} />)}
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardShell>
  );
}
