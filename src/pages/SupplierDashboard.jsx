import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Bell, TrendingUp, TrendingDown, Settings, HelpCircle, FileText, ClipboardList, TrendingUp as TrendingUpIcon, DollarSign, AlertTriangle, MapPin, Store } from 'lucide-react';
import DashboardShell from '../components/DashboardShell';
import StatsCard from '../components/StatsCard';
import StatusBadge from '../components/StatusBadge';
import ProgressBar from '../components/ProgressBar';
import MapComponent from '../components/MapComponent';
import LocationPicker from '../components/LocationPicker';
import { api } from '../services/api';
import Spinner from '../components/Spinner';
import { useLang } from '../components/LanguageContext';

export default function SupplierDashboard() {
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
    { icon: FileText, label: t('nav.tamSurvey'), nav: '/supplier/tam-survey' },
    { icon: ClipboardList, label: t('nav.susSurvey'), nav: '/supplier/sus-survey' },
  ];
  const [data, setData] = useState({ stats: { orders: '0', revenue: '0 TZS', lowStock: '00' }, orders: [], inventory: [] });
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const profile = JSON.parse(localStorage.getItem('profile') || '{}');
  const initials = (user.username || 'U').charAt(0).toUpperCase() + ((user.username || '').slice(-1) || '').toUpperCase();

  const [editLocation, setEditLocation] = useState(false);
  const [locationCoords, setLocationCoords] = useState({ lat: profile.lat || -6.7924, lng: profile.lng || 39.2083 });
  const [savingLocation, setSavingLocation] = useState(false);
  const [originalCoords, setOriginalCoords] = useState({ lat: profile.lat || -6.7924, lng: profile.lng || 39.2083 });

  useEffect(() => {
    const sid = JSON.parse(localStorage.getItem('supplier') || '{}').id || 1;
    const cacheKey = `supplier_dashboard_${sid}`;
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      try {
        const { data: d, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < 2 * 60 * 1000) {
          setData(d);
          setLoading(false);
        }
      } catch {}
    }
    api.supplierDashboard(sid).then(d => {
      setData(d);
      setLoading(false);
      sessionStorage.setItem(cacheKey, JSON.stringify({ data: d, timestamp: Date.now() }));
    }).catch(() => setLoading(false));
  }, []);

  const handleSaveLocation = async () => {
    setSavingLocation(true);
    try {
      await api.updateProfile({ lat: locationCoords.lat, lng: locationCoords.lng });
      const updated = await api.profile();
      localStorage.setItem('profile', JSON.stringify(updated));
      setEditLocation(false);
    } catch { alert('Failed to update location.'); }
    finally { setSavingLocation(false); }
  };

  return (
    <DashboardShell brand="FaidaYetu" brandSub="Poultry Logistics Hub" navItems={navItems} profile={
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#f8fafc', padding: '8px 12px', borderRadius: 10, border: '1px solid #e2e8f0' }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #0a6e46, #10b981)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 13, boxShadow: '0 2px 6px rgba(10,110,70,0.2)' }}>{initials}</div>
        <div>
          <div style={{ fontWeight: 600, fontSize: 13, color: '#0f172a' }}>{user.username || 'Supplier'}</div>
          <div style={{ fontSize: 11, color: '#94a3b8' }}>Supplier Portal</div>
        </div>
      </div>
    }>
      <div>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', margin: 0 }}>{t('dashboard.supplierDash')}</h1>
          <p style={{ fontSize: 13, color: '#64748b', margin: '4px 0 0' }}>{t('dashboard.manageOps')}</p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#94a3b8' }}>{t('common.loading')}</div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
              <StatsCard label={t('dashboard.totalOrders')} value={data.stats.orders} sub={t('dashboard.thisMonth')} iconComponent={ShoppingCart} />
              <StatsCard label="Revenue (TZS)" value={data.stats.revenue} sub={t('dashboard.estimatedEarnings')} iconComponent={DollarSign} tertiary />
              <StatsCard label={t('dashboard.lowStock')} value={data.stats.lowStock} sub={t('dashboard.immediateAction')} iconComponent={AlertTriangle} error />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px', background: '#fef9c3', border: '1px solid #fde68a', borderRadius: 10, marginBottom: 24, flexWrap: 'wrap' }}>
              <Bell size={20} color="#92400e" />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#92400e' }}>{data.stats.lowStock} Pending Deliveries Require Confirmation</div>
                <div style={{ fontSize: 12, color: '#a16207' }}>Logistics partners are waiting for "Ready for Pickup" status update.</div>
              </div>
              <button onClick={() => navigate('/supplier/orders')} style={{ padding: '8px 16px', borderRadius: 8, background: '#0a6e46', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 12, color: '#fff' }}>{t('dashboard.reviewAlerts')}</button>
            </div>

            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 16, marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}><MapPin size={14} /> {t('dashboard.businessLocation')}</h3>
                {!editLocation && (
                  <button onClick={() => { setOriginalCoords({ lat: profile.lat || -6.7924, lng: profile.lng || 39.2083 }); setLocationCoords({ lat: profile.lat || -6.7924, lng: profile.lng || 39.2083 }); setEditLocation(true); }} style={{ fontSize: 12, fontWeight: 600, color: '#0a6e46', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Update</button>
                )}
              </div>
              {editLocation ? (
                <>
                  <LocationPicker lat={locationCoords.lat} lng={locationCoords.lng} height={200} onChange={(lat, lng) => setLocationCoords({ lat, lng })} />
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <button onClick={() => { setEditLocation(false); setLocationCoords(originalCoords); }} style={{ flex: 1, padding: '8px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontWeight: 500, fontSize: 12, color: '#475569' }}>{t('common.cancel')}</button>
                    <button onClick={handleSaveLocation} disabled={savingLocation} style={{ flex: 1, padding: '8px', borderRadius: 8, background: '#0a6e46', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 12, opacity: savingLocation ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                      {savingLocation && <Spinner size={12} color="#fff" />}
                      {savingLocation ? 'Saving...' : 'Save Location'}
                    </button>
                  </div>
                </>
              ) : (
                <MapComponent height={200} userLocation={[locationCoords.lat, locationCoords.lng]} />
              )}
            </div>

            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 16, marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}><MapPin size={14} /> {t('dashboard.customerLocations')}</h3>
              </div>
              <MapComponent height={280} deliveries={data.orders.filter(o => o.delivery_lat && o.delivery_lng)} userLocation={[locationCoords.lat, locationCoords.lng]} />
              {data.orders.filter(o => o.delivery_lat && o.delivery_lng).length === 0 && (
                <div style={{ textAlign: 'center', padding: 20, color: '#94a3b8', fontSize: 13 }}>{t('dashboard.noDeliveryLocs')}</div>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr', gap: 20 }}>
              <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', margin: 0 }}>{t('dashboard.recentOrders')}</h3>
                  <span onClick={() => navigate('/supplier/orders')} style={{ fontSize: 12, color: '#0a6e46', cursor: 'pointer', fontWeight: 600 }}>{t('common.viewAll')}</span>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        {['Order ID', 'Customer', 'Product', 'Status', 'Amount'].map(h => (
                          <th key={h} style={{ padding: '10px 16px', fontSize: 11, fontWeight: 600, color: '#64748b', borderBottom: '1px solid #f1f5f9', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data.orders.map(o => (
                        <tr key={o.id} onClick={() => navigate('/supplier/orders')} style={{ cursor: 'pointer', borderBottom: '1px solid #f8fafc' }}>
                          <td style={{ padding: '10px 16px', fontWeight: 600, color: '#0f172a', fontSize: 13 }}>#{o.id}</td>
                          <td style={{ padding: '10px 16px', fontSize: 13, color: '#334155' }}>{o.customer_name}</td>
                          <td style={{ padding: '10px 16px', fontSize: 13, color: '#334155' }}>{o.items?.[0]?.product_name || '—'}</td>
                          <td style={{ padding: '10px 16px' }}><StatusBadge status={o.status} /></td>
                          <td style={{ padding: '10px 16px', fontWeight: 600, textAlign: 'right', fontSize: 13, color: '#0f172a' }}>{Number(o.total).toLocaleString()} TZS</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '20px', marginBottom: 20 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', margin: '0 0 16px' }}>{t('dashboard.inventoryStatus')}</h3>
                  {data.inventory.map(i => <ProgressBar key={i.name} {...i} />)}
                  <button onClick={() => navigate('/supplier/inventory')} style={{
                    width: '100%', padding: '10px', borderRadius: 8,
                    border: '1px solid #e2e8f0', background: '#fff', color: '#475569',
                    cursor: 'pointer', fontWeight: 500, fontSize: 12, marginTop: 4,
                  }}>View Inventory</button>
                </div>

                <div style={{ background: '#f0fdf4', padding: '20px', borderRadius: 12, border: '1px solid #bbf7d0' }}>
                  <div style={{ marginBottom: 8 }}><Store size={28} color="#0a6e46" /></div>
                  <h4 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>{t('dashboard.expandMarket')}</h4>
                  <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 12px' }}>{t('dashboard.addMoreProducts')}</p>
                  <div onClick={() => navigate('/supplier/settings')} style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600, color: '#0a6e46', fontSize: 13, cursor: 'pointer' }}>
                    {t('dashboard.getStarted')} <span>→</span>
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
