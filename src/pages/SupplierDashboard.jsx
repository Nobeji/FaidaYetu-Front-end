import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { colors, spacing, radius } from '../constants/theme';
import DashboardShell from '../components/DashboardShell';
import StatsCard from '../components/StatsCard';
import StatusBadge from '../components/StatusBadge';
import ProgressBar from '../components/ProgressBar';
import { api } from '../services/api';

const navItems = [
  { icon: '📊', label: 'Dashboard', nav: '/supplier' },
  { icon: '📦', label: 'Inventory', nav: '/supplier/inventory' },
  { icon: '🛒', label: 'Orders', nav: '/supplier/orders' },
  { icon: '📈', label: 'Analytics', nav: '/supplier/analytics' },
  { icon: '⚙️', label: 'Settings', nav: '/supplier/settings' },
  { icon: '❓', label: 'Support', nav: '/supplier/support' },
];

export default function SupplierDashboard() {
  const [data, setData] = useState({ stats: { orders: '0', revenue: '0 TZS', lowStock: '00' }, orders: [], inventory: [] });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const initials = (user.username || 'U').charAt(0).toUpperCase() + ((user.username || '').slice(-1) || '').toUpperCase();

  useEffect(() => {
    const sid = JSON.parse(localStorage.getItem('supplier') || '{}').id || 1;
    api.supplierDashboard(sid).then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <DashboardShell
      brand="FaidaYetu"
      brandSub="Poultry Logistics Hub"
      navItems={navItems}
      profile={
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, background: colors.surfaceContainerHigh, padding: `${spacing.sm}px ${spacing.md}px`, borderRadius: radius.xl }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: colors.primaryContainer, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.onPrimaryContainer, fontWeight: 700 }}>{initials}</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>{user.username || 'Supplier'}</div>
            <div style={{ fontSize: 12, color: colors.onSurfaceVariant }}>Supplier Portal</div>
          </div>
        </div>
      }
    >
      <div className="fade-in">
        <div style={{ marginBottom: spacing.lg }}>
          <h1 style={{ fontSize: 28, fontWeight: 600, color: colors.primary }}>Supplier Dashboard</h1>
          <p style={{ fontSize: 15, color: colors.onSurfaceVariant }}>Manage your poultry operations.</p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: spacing.xxl, color: colors.onSurfaceVariant }}>Loading data...</div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: spacing.lg, marginBottom: spacing.lg }}>
              <StatsCard label="Total Orders" value={data.stats.orders} sub="this month" subIcon="📈" icon="🛍️" />
              <StatsCard label="Revenue (TZS)" value={data.stats.revenue} sub="Estimated Earnings" subIcon="💰" icon="💳" tertiary />
              <StatsCard label="Low Stock Alerts" value={data.stats.lowStock} sub="Immediate Action Required" subIcon="⚠️" icon="📦" error />
            </div>

            <div style={{
              display: 'flex', alignItems: 'center', gap: spacing.md,
              padding: `${spacing.md}px ${spacing.lg}px`, background: colors.tertiaryContainer,
              border: `1px solid ${colors.tertiary}`, borderRadius: radius.xl, marginBottom: spacing.lg,
              flexWrap: 'wrap',
            }}>
              <span style={{ fontSize: 28 }}>🔔</span>
              <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: colors.onTertiaryContainer }}>{data.stats.lowStock} Pending Deliveries Require Confirmation</div>
              <div style={{ fontSize: 12, color: colors.onTertiaryContainer, opacity: 0.85 }}>Logistics partners are waiting for "Ready for Pickup" status update.</div>
              </div>
              <button onClick={() => navigate('/supplier/orders')} style={{ padding: '8px 16px', borderRadius: radius.md, background: colors.tertiaryFixed, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>Review Alerts</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: spacing.lg }}>
              <div style={{ background: colors.surfaceContainerLowest, border: `1px solid ${colors.outlineVariant}`, borderRadius: radius.xl, overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: spacing.lg, borderBottom: `1px solid ${colors.outlineVariant}` }}>
                  <h3 style={{ fontSize: 20, fontWeight: 600, color: colors.primary }}>Recent Orders</h3>
                  <span onClick={() => navigate('/supplier/orders')} style={{ fontSize: 14, color: colors.primary, cursor: 'pointer' }}>View All</span>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: 'rgba(193,236,212,0.3)' }}>
                        {['Order ID', 'Customer', 'Product', 'Status', 'Amount'].map(h => (
                          <th key={h} style={{ padding: spacing.md, fontSize: 13, fontWeight: 600, color: colors.onSurfaceVariant, borderBottom: `1px solid ${colors.outlineVariant}` }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data.orders.map(o => (
                        <tr key={o.id} onClick={() => navigate('/supplier/orders')} style={{ cursor: 'pointer' }}>
                          <td style={{ padding: spacing.md, fontWeight: 700, color: colors.primary }}>#{o.id}</td>
                          <td style={{ padding: spacing.md }}>{o.customer_name}</td>
                          <td style={{ padding: spacing.md }}>{o.items?.[0]?.product_name || 'Poultry Products'}</td>
                          <td style={{ padding: spacing.md }}><StatusBadge status={o.status} /></td>
                          <td style={{ padding: spacing.md, fontWeight: 700, textAlign: 'right' }}>{Number(o.total).toLocaleString()} TZS</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <div style={{ background: colors.surfaceContainerLowest, border: `1px solid ${colors.outlineVariant}`, borderRadius: radius.xl, padding: spacing.lg, marginBottom: spacing.lg }}>
                  <h3 style={{ fontSize: 20, fontWeight: 600, color: colors.primary, marginBottom: spacing.lg }}>Inventory Status</h3>
                  {data.inventory.map(i => <ProgressBar key={i.name} {...i} />)}
                  <button onClick={() => navigate('/supplier/inventory')} style={{
                    width: '100%', padding: '12px', borderRadius: radius.md,
                    border: `1px solid ${colors.primary}`, background: 'none', color: colors.primary,
                    cursor: 'pointer', fontWeight: 600, marginTop: spacing.sm,
                  }}>⏱ View Full History</button>
                </div>

                <div style={{ background: colors.primaryLight, padding: spacing.lg, borderRadius: radius.xl, border: `1px solid ${colors.primary}` }}>
                  <div style={{ fontSize: 36, marginBottom: spacing.md, color: colors.onPrimaryContainer }}>🏪</div>
                  <h4 style={{ fontSize: 20, fontWeight: 700, color: colors.onPrimaryContainer, marginBottom: spacing.sm }}>Expand Your Marketplace Presence</h4>
                  <p style={{ fontSize: 14, color: colors.onPrimaryContainer, opacity: 0.9, marginBottom: spacing.md }}>Reach 12 logistics zones. Add more products to increase visibility by 40%.</p>
                  <div onClick={() => navigate('/supplier/settings')} style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 700, color: colors.onPrimaryContainer, fontSize: 14, cursor: 'pointer' }}>
                    Get Started <span>→</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardShell>
  );
}
