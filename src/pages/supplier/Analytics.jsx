import { useState, useEffect } from 'react';
import { LayoutDashboard, Package, ShoppingCart, Bell, TrendingUp, TrendingDown, Settings, HelpCircle } from 'lucide-react';
import DashboardShell from '../../components/DashboardShell';
import { api } from '../../services/api';
import { useLang } from '../../components/LanguageContext';

export default function SupplierAnalytics() {
  const { t } = useLang();
  const navItems = [
    { icon: LayoutDashboard, label: t('nav.dashboard'), nav: '/supplier' },
    { icon: Package, label: t('nav.inventory'), nav: '/supplier/inventory' },
    { icon: ShoppingCart, label: t('nav.orders'), nav: '/supplier/orders' },
    { icon: Bell, label: t('nav.notifications'), nav: '/supplier/notifications' },
    { icon: TrendingUp, label: t('nav.analytics'), nav: '/supplier/analytics' },
    { icon: TrendingDown, label: t('nav.statistics'), nav: '/supplier/statistics' },
    { icon: Settings, label: t('nav.settings'), nav: '/supplier/settings' },
    { icon: HelpCircle, label: t('nav.support'), nav: '/supplier/support' },
  ];
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
          <h1 style={{ fontSize: 28, fontWeight: 600, color: '#000' }}>{t('nav.analytics')}</h1>
          <p style={{ fontSize: 15, color: '#888' }}>Performance insights and trends</p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 48, color: '#888' }}>{t('common.loading')}</div>
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
