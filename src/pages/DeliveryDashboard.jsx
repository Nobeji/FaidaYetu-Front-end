import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardShell from '../components/DashboardShell';
import MapComponent from '../components/MapComponent';
import { api } from '../services/api';
import { useToast } from '../components/ToastContext';

const navItems = [
  { icon: '🚚', label: 'Active Tasks', nav: '/delivery' },
  { icon: '🛣️', label: 'Route History', nav: '/delivery/route-history' },
  { icon: '💰', label: 'Earnings', nav: '/delivery/earnings' },
  { icon: '⚙️', label: 'Settings', nav: '/delivery/settings' },
  { icon: '❓', label: 'Support', nav: '/delivery/support' },
];

export default function DeliveryDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [profile, setProfile] = useState(null);
  const [userLocation, setUserLocation] = useState([-6.7924, 39.2083]);
  const [loading, setLoading] = useState(true);
  const [driverOnline, setDriverOnline] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const deliveryPersonId = JSON.parse(localStorage.getItem('delivery_person') || '{}').id || 1;

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    Promise.all([
      api.deliveryDashboard(deliveryPersonId),
      api.deliveries({ delivery_person: deliveryPersonId }),
      api.profile(),
    ]).then(([dash, d, p]) => {
      setDashboardData(dash);
      setTasks(d);
      setProfile(p);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(pos => {
      const loc = [pos.coords.latitude, pos.coords.longitude];
      setUserLocation(loc);
      const active = dashboardData?.active_delivery;
      if (active?.delivery_id) {
        api.logLocation(active.delivery_id, { lat: loc[0], lng: loc[1] }).catch(() => {});
      }
    }, () => {}, { enableHighAccuracy: true, timeout: 10000 });
    return () => navigator.geolocation.clearWatch(watchId);
  }, [dashboardData?.active_delivery?.delivery_id]);

  const handleComplete = async () => {
    const active = dashboardData?.active_delivery;
    if (!active?.delivery_status) return;
    try {
      const deliveries = await api.deliveries({ delivery_person: deliveryPersonId });
      const activeDel = deliveries.find(d => d.status === 'in_transit' || d.status === 'assigned' || d.status === 'picked_up');
      if (activeDel) {
        await api.updateDelivery(activeDel.id, { status: 'completed' });
        const dash = await api.deliveryDashboard(1);
        setDashboardData(dash);
      }
    } catch (e) {
      toast('Could not complete delivery.', 'error');
    }
  };

  if (loading) return (
    <DashboardShell brand="FaidaYetu" brandSub="Delivery Portal" navItems={navItems}>
      <div style={{ textAlign: 'center', padding: 60, color: '#888' }}>Loading dashboard...</div>
    </DashboardShell>
  );

  const stats = dashboardData?.stats || {};
  const activeDelivery = dashboardData?.active_delivery;
  const dp = profile?.delivery_person || dashboardData?.delivery_person || {};
  const u = profile?.user || {};
  const name = `${u.first_name || ''} ${u.last_name || ''}`.trim() || u.username || 'Driver';
  const initials = (name.match(/\b\w/g) || ['D']).join('').slice(0, 2).toUpperCase();

  return (
    <DashboardShell brand="FaidaYetu" brandSub="Delivery Portal" navItems={navItems} profile={
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#f9f9f9', padding: '8px 12px', borderRadius: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 700, fontSize: 13 }}>{initials}</div>
        <div>
          <div style={{ fontWeight: 600, fontSize: 13 }}>{name}</div>
          <div style={{ fontSize: 11, color: '#888' }}>ID: {dp.id || 'N/A'}-PD</div>
        </div>
      </div>
    }>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: isMobile ? 'stretch' : 'flex-start', marginBottom: 24, flexDirection: isMobile ? 'column' : 'row', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: isMobile ? 20 : 22, fontWeight: 700, color: '#111', margin: 0 }}>Delivery Dashboard</h1>
            <p style={{ fontSize: 13, color: '#888', margin: '4px 0 0' }}>Optimized routes for regional poultry logistics.</p>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <div onClick={() => setDriverOnline(!driverOnline)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: '#fff', borderRadius: 20, border: '1px solid #e0e0e0', cursor: 'pointer' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: driverOnline ? '#111' : '#ccc' }} />
              <span style={{ fontSize: 13, fontWeight: 500, color: '#555' }}>{driverOnline ? 'Online' : 'Offline'}</span>
            </div>
            <button onClick={() => navigate('/delivery/route-history')} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '10px 20px', borderRadius: 8, background: '#000', color: '#fff',
              border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13,
            }}>
              ▶ Start Route
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr', gap: 20 }}>
          <div style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid #eee' }}>
            <MapComponent
              height={isMobile ? 260 : 400}
              userLocation={userLocation}
              deliveries={activeDelivery ? [activeDelivery] : []}
              routePoints={
                activeDelivery?.supplier_lat && activeDelivery?.supplier_lng && activeDelivery?.delivery_lat && activeDelivery?.delivery_lng
                  ? [[activeDelivery.supplier_lat, activeDelivery.supplier_lng], [activeDelivery.delivery_lat, activeDelivery.delivery_lng]]
                  : []
              }
              suppliers={[]}
            />
          </div>

          {activeDelivery ? (
            <div style={{ background: '#fff', border: '1px solid #eaeaea', borderRadius: 10, padding: '20px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#888' }}>Active Delivery</span>
                <span style={{ padding: '3px 10px', background: '#f0f0f0', color: '#000', fontSize: 11, fontWeight: 600, borderRadius: 20 }}>In Progress</span>
              </div>
              <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                <span style={{ fontSize: 16, color: '#888' }}>📍</span>
                <div>
                  <div style={{ fontSize: 11, color: '#888', textTransform: 'uppercase', fontWeight: 600 }}>Pickup</div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{activeDelivery.supplier_name || 'Supplier'}</div>
                  <div style={{ fontSize: 12, color: '#888' }}>Order #{activeDelivery.id}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                <span style={{ fontSize: 16, color: '#000' }}>📍</span>
                <div>
                  <div style={{ fontSize: 11, color: '#888', textTransform: 'uppercase', fontWeight: 600 }}>Drop-off</div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{activeDelivery.customer_name || 'Customer'}</div>
                  <div style={{ fontSize: 12, color: '#888' }}>{activeDelivery.delivery_address || 'N/A'}</div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 'auto', paddingTop: 16, borderTop: '1px solid #f0f0f0' }}>
                <button onClick={() => toast('Contact supplier at support@faidayetu.co.tz', 'info')} style={{ padding: '10px', borderRadius: 8, border: '1px solid #e0e0e0', background: '#fff', color: '#555', cursor: 'pointer', fontWeight: 600, fontSize: 12 }}>Contact</button>
                <button onClick={handleComplete} style={{ padding: '10px', borderRadius: 8, background: '#000', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 12 }}>Complete</button>
              </div>
            </div>
          ) : (
            <div style={{ background: '#fff', border: '1px solid #eaeaea', borderRadius: 10, padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
              <span style={{ fontSize: 40 }}>📭</span>
              <div style={{ fontWeight: 700, fontSize: 16, color: '#111' }}>No Active Deliveries</div>
              <p style={{ fontSize: 13, color: '#888', textAlign: 'center', margin: 0 }}>You're all caught up! Awaiting new task assignments.</p>
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 2fr', gap: 20, marginTop: 20 }}>
          <div onClick={() => navigate('/delivery/earnings')} style={{ background: '#fff', border: '1px solid #eaeaea', borderRadius: 10, padding: '20px', cursor: 'pointer' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: '#888' }}>Earnings Today</span>
              <span style={{ color: '#000', fontSize: 16 }}>📈</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontSize: 24, fontWeight: 700, color: '#111' }}>{stats.earnings_today || '$0.00'}</span>
            </div>
          </div>

          <div style={{ background: '#fff', border: '1px solid #eaeaea', borderRadius: 10, padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: '#888' }}>Task Queue</span>
              <span onClick={() => navigate('/delivery/route-history')} style={{ fontSize: 12, fontWeight: 600, color: '#000', cursor: 'pointer' }}>View All</span>
            </div>
            {tasks.slice(0, 3).map(t => (
              <div key={t.id} onClick={() => navigate('/delivery/route-history')} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px', borderRadius: 8, marginBottom: 6, cursor: 'pointer',
                background: '#fafafa',
              }}>
                <div style={{ width: 40, height: 40, borderRadius: 8, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, border: '1px solid #eee', flexShrink: 0 }}>📦</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>Delivery #{t.id}</div>
                  <div style={{ fontSize: 12, color: '#888' }}>{t.status} • {t.distance_km || 'N/A'} km</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: '#111' }}>${t.earnings || '0.00'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
