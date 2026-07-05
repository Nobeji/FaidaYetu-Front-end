import { useState, useEffect } from 'react';
import DashboardShell from '../../components/DashboardShell';
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

export default function SupplierAnalytics() {
  const [data, setData] = useState({ stats: { orders: '0', revenue: '0 TZS' } });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sid = JSON.parse(localStorage.getItem('supplier') || '{}').id || 1;
    api.supplierDashboard(sid).then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <DashboardShell brand="FaidaYetu" brandSub="Poultry Logistics Hub" navItems={navItems}>
      <div className="fade-in">
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: 28, fontWeight: 600, color: '#000' }}>Analytics</h1>
          <p style={{ fontSize: 15, color: '#888' }}>Performance insights and trends</p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 48, color: '#888' }}>Loading analytics...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12, marginBottom: 20 }}>
            <div style={{ background: '#fff', borderRadius: 12, border: `1px solid ${'#eee'}`, padding: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', color: '#888', letterSpacing: '0.05em', marginBottom: 8 }}>Total Revenue</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: '#111' }}>{data.stats.revenue}</div>
            </div>
            <div style={{ background: '#fff', borderRadius: 12, border: `1px solid ${'#eee'}`, padding: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', color: '#888', letterSpacing: '0.05em', marginBottom: 8 }}>Orders Fulfilled</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: '#111' }}>{data.stats.orders}</div>
            </div>
            <div style={{ background: '#fff', borderRadius: 12, border: `1px solid ${'#eee'}`, padding: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', color: '#888', letterSpacing: '0.05em', marginBottom: 8 }}>Avg Order Value</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: '#111' }}>
                {data.stats.revenue && data.stats.orders && data.stats.orders !== '0'
                  ? `${(parseFloat(data.stats.revenue.replace(/[^0-9.]/g, '')) / parseInt(data.stats.orders)).toLocaleString()} TZS`
                  : 'N/A'}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
