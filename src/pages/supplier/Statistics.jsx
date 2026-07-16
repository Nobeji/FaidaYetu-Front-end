import { useState, useEffect } from 'react';
import { LayoutDashboard, Package, ShoppingCart, Bell, TrendingUp, TrendingDown, Settings, HelpCircle, DollarSign, Zap } from 'lucide-react';

import DashboardShell from '../../components/DashboardShell';
import StatsCard from '../../components/StatsCard';
import StatusBadge from '../../components/StatusBadge';
import ProgressBar from '../../components/ProgressBar';
import { api } from '../../services/api';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', nav: '/supplier' },
  { icon: Package, label: 'Inventory', nav: '/supplier/inventory' },
  { icon: ShoppingCart, label: 'Orders', nav: '/supplier/orders' },
  { icon: Bell, label: 'Notifications', nav: '/supplier/notifications' },
  { icon: TrendingUp, label: 'Analytics', nav: '/supplier/analytics' },
  { icon: TrendingDown, label: 'Statistics', nav: '/supplier/statistics' },
  { icon: Settings, label: 'Settings', nav: '/supplier/settings' },
  { icon: HelpCircle, label: 'Support', nav: '/supplier/support' },
];

const STATUS_LABELS = {
  new: 'New', processing: 'Processing', ready: 'Ready',
  in_transit: 'In Transit', delivered: 'Delivered', cancelled: 'Cancelled',
};

export default function SupplierStatistics() {
  const [data, setData] = useState({ stats: { orders: '0', revenue: '0 TZS', lowStock: '00', growth: '--' }, orders: [], inventory: [] });
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
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: 28, fontWeight: 600, color: '#000' }}>Statistics</h1>
          <p style={{ fontSize: 15, color: '#888' }}>Detailed performance metrics for your business</p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 48, color: '#888' }}>Loading statistics...</div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12, marginBottom: 28 }}>
              <StatsCard label="Total Revenue" value={data.stats.revenue} sub="All time earnings" iconComponent={DollarSign} tertiary />
              <StatsCard label="Total Orders" value={data.stats.orders} sub="All orders placed" iconComponent={ShoppingCart} />
              <StatsCard label="Avg Order Value" value={`${avgOrderValue} TZS`} sub="Per transaction" iconComponent={TrendingUp} />
              <StatsCard label="Growth Rate" value={data.stats.growth} sub="Period over period" iconComponent={Zap} />
              <StatsCard label="Low Stock Items" value={data.stats.lowStock} sub="Needs attention" iconComponent={Package} error />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }}>
              <div style={{ background: '#fff', border: `1px solid ${'#eee'}`, borderRadius: 12, padding: 20 }}>
                <h3 style={{ fontSize: 18, fontWeight: 600, color: '#000', marginBottom: 12 }}>Order Status Breakdown</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {Object.entries(STATUS_LABELS).map(([key, label]) => {
                    const count = statusCounts[key] || 0;
                    const pct = totalOrders > 0 ? (count / totalOrders * 100).toFixed(1) : '0.0';
                    return (
                      <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: `${8}px ${12}px`, background: '#fafafa', borderRadius: 8 }}>
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
                          <StatusBadge status={key} />
                          <span style={{ fontSize: 14, fontWeight: 500, color: '#111' }}>{label}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ width: 120, height: 6, background: '#eee', borderRadius: 3, overflow: 'hidden' }}>
                            <div style={{ width: `${pct}%`, height: '100%', background: '#000', borderRadius: 3, transition: 'width 0.5s' }} />
                          </div>
                          <span style={{ fontSize: 14, fontWeight: 700, color: '#111', minWidth: 40, textAlign: 'right' }}>{count}</span>
                          <span style={{ fontSize: 12, color: '#888', minWidth: 40, textAlign: 'right' }}>{pct}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={{ background: '#fff', border: `1px solid ${'#eee'}`, borderRadius: 12, padding: 20 }}>
                <h3 style={{ fontSize: 18, fontWeight: 600, color: '#000', marginBottom: 12 }}>Revenue Summary</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 12, background: '#fafafa', borderRadius: 8 }}>
                    <span style={{ fontSize: 14, color: '#888' }}>Gross Revenue</span>
                    <span style={{ fontSize: 18, fontWeight: 800, color: '#000' }}>{data.stats.revenue}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 12, background: '#fafafa', borderRadius: 8 }}>
                    <span style={{ fontSize: 14, color: '#888' }}>Total Transactions</span>
                    <span style={{ fontSize: 18, fontWeight: 800, color: '#000' }}>{data.stats.orders}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 12, background: '#fafafa', borderRadius: 8 }}>
                    <span style={{ fontSize: 14, color: '#888' }}>Average Order Value</span>
                    <span style={{ fontSize: 18, fontWeight: 800, color: '#000' }}>{avgOrderValue} TZS</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 12, background: '#fafafa', borderRadius: 8 }}>
                    <span style={{ fontSize: 14, color: '#888' }}>Growth</span>
                    <span style={{ fontSize: 18, fontWeight: 800, color: '#7b61ff' }}>{data.stats.growth}</span>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ background: '#fff', border: `1px solid ${'#eee'}`, borderRadius: 12, overflow: 'hidden', marginBottom: 28 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottom: `1px solid ${'#eee'}` }}>
                <h3 style={{ fontSize: 18, fontWeight: 600, color: '#000' }}>Recent Orders</h3>
                <span style={{ fontSize: 14, color: '#000', cursor: 'pointer' }}>View All</span>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'rgba(193,236,212,0.3)' }}>
                      {['Order ID', 'Customer', 'Status', 'Amount', 'Date'].map(h => (
                        <th key={h} style={{ padding: 12, fontSize: 13, fontWeight: 600, color: '#888', borderBottom: `1px solid ${'#eee'}` }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.orders.map(o => (
                      <tr key={o.id} style={{ cursor: 'pointer' }}>
                        <td style={{ padding: 12, fontWeight: 700, color: '#000' }}>#{o.id}</td>
                        <td style={{ padding: 12 }}>{o.customer_name}</td>
                        <td style={{ padding: 12 }}><StatusBadge status={o.status} /></td>
                        <td style={{ padding: 12, fontWeight: 700 }}>{Number(o.total).toLocaleString()} TZS</td>
                        <td style={{ padding: 12, color: '#888', fontSize: 13 }}>{o.created_at ? new Date(o.created_at).toLocaleDateString() : '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div style={{ background: '#fff', border: `1px solid ${'#eee'}`, borderRadius: 12, padding: 20 }}>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: '#000', marginBottom: 20 }}>Inventory Health</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12 }}>
                {data.inventory.map(i => <ProgressBar key={i.name} {...i} />)}
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardShell>
  );
}
