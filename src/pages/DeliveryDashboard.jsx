import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { colors, spacing, radius } from '../constants/theme';
import DashboardShell from '../components/DashboardShell';
import MapComponent from '../components/MapComponent';
import { api } from '../services/api';

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
  const navigate = useNavigate();
  const deliveryPersonId = JSON.parse(localStorage.getItem('delivery_person') || '{}').id || 1;

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

  // Watch position and send to backend
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
      alert('Could not complete delivery.');
    }
  };

  if (loading) return (
    <DashboardShell brand="FaidaYetu" brandSub="Delivery Portal" navItems={navItems}>
      <div style={{ textAlign: 'center', padding: spacing.xxl, color: colors.onSurfaceVariant }}>Loading dashboard...</div>
    </DashboardShell>
  );

  const stats = dashboardData?.stats || {};
  const activeDelivery = dashboardData?.active_delivery;
  const dp = profile?.delivery_person || dashboardData?.delivery_person || {};
  const u = profile?.user || {};
  const name = `${u.first_name || ''} ${u.last_name || ''}`.trim() || u.username || 'Driver';
  const initials = (name.match(/\b\w/g) || ['D']).join('').slice(0, 2).toUpperCase();

  return (
    <DashboardShell
      brand="FaidaYetu"
      brandSub="Delivery Portal"
      navItems={navItems}
      profile={
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, background: colors.surfaceContainerHigh, padding: `${spacing.sm}px ${spacing.md}px`, borderRadius: radius.xl }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: colors.primaryContainer, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.onPrimaryContainer, fontWeight: 700 }}>{initials}</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>{name}</div>
            <div style={{ fontSize: 12, color: colors.onSurfaceVariant }}>ID: {dp.id || 'N/A'}-PD</div>
          </div>
        </div>
      }
    >
      <div className="fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.lg, flexWrap: 'wrap', gap: spacing.md }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 600, color: colors.onSurface }}>Delivery Dashboard</h1>
            <p style={{ fontSize: 15, color: colors.onSurfaceVariant }}>Optimized routes for regional poultry logistics.</p>
          </div>
          <div style={{ display: 'flex', gap: spacing.md, alignItems: 'center', flexWrap: 'wrap' }}>
            <div onClick={() => setDriverOnline(!driverOnline)} style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, padding: '8px 16px', background: colors.surfaceContainerHigh, borderRadius: radius.round, border: `1px solid ${colors.outlineVariant}`, cursor: 'pointer' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: driverOnline ? colors.primary : colors.error }} />
              <span style={{ fontSize: 14, fontWeight: 700 }}>{driverOnline ? 'Driver Online' : 'Offline'}</span>
            </div>
            <button onClick={() => navigate('/delivery/route-history')} style={{
              display: 'flex', alignItems: 'center', gap: spacing.sm,
              padding: '12px 24px', borderRadius: radius.round, background: colors.primary, color: colors.onPrimary,
              border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 14,
            }}>
              ▶ Start Route
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: spacing.lg }}>
          <MapComponent
            height={400}
            userLocation={userLocation}
            deliveries={activeDelivery ? [activeDelivery] : []}
            routePoints={
              activeDelivery?.supplier_lat && activeDelivery?.supplier_lng && activeDelivery?.delivery_lat && activeDelivery?.delivery_lng
                ? [[activeDelivery.supplier_lat, activeDelivery.supplier_lng], [activeDelivery.delivery_lat, activeDelivery.delivery_lng]]
                : []
            }
            suppliers={[]}
          />

          {activeDelivery ? (
            <div style={{ background: 'rgba(255,255,255,0.7)', border: `1px solid ${colors.outlineVariant}`, borderRadius: radius.xl, padding: spacing.lg, borderTop: `4px solid ${colors.primary}`, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg }}>
                <span style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: colors.primary }}>Active Delivery</span>
                <span style={{ padding: '4px 12px', background: colors.primary, color: colors.onPrimary, fontSize: 12, fontWeight: 600, borderRadius: radius.round }}>In Progress</span>
              </div>
              <div style={{ display: 'flex', gap: spacing.md, marginBottom: spacing.md }}>
                <span style={{ fontSize: 20, color: colors.tertiary }}>📍</span>
                <div>
                  <div style={{ fontSize: 12, color: colors.onSurfaceVariant, textTransform: 'uppercase', fontWeight: 600 }}>Pickup (Supplier)</div>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>{activeDelivery.supplier_name || 'Supplier'}</div>
                  <div style={{ fontSize: 13, color: colors.onSurfaceVariant }}>Order #{activeDelivery.id}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: spacing.md, marginBottom: spacing.md }}>
                <span style={{ fontSize: 20, color: colors.primary }}>📍</span>
                <div>
                  <div style={{ fontSize: 12, color: colors.onSurfaceVariant, textTransform: 'uppercase', fontWeight: 600 }}>Drop-off (Customer)</div>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>{activeDelivery.customer_name || 'Customer'}</div>
                  <div style={{ fontSize: 13, color: colors.onSurfaceVariant }}>{activeDelivery.delivery_address || 'N/A'}</div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.md, marginTop: 'auto', paddingTop: spacing.lg, borderTop: `1px solid ${colors.outlineVariant}` }}>
                <button onClick={() => alert('Calling +255 716 789 012...')} style={{ padding: '12px', borderRadius: radius.md, border: `1px solid ${colors.primary}`, background: 'none', color: colors.primary, cursor: 'pointer', fontWeight: 700 }}>Contact</button>
                <button onClick={handleComplete} style={{ padding: '12px', borderRadius: radius.md, background: colors.primary, color: colors.onPrimary, border: 'none', cursor: 'pointer', fontWeight: 700 }}>Complete</button>
              </div>
            </div>
          ) : (
            <div style={{ background: 'rgba(255,255,255,0.7)', border: `1px solid ${colors.outlineVariant}`, borderRadius: radius.xl, padding: spacing.lg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: spacing.md }}>
              <span style={{ fontSize: 48 }}>📭</span>
              <div style={{ fontWeight: 700, fontSize: 18, color: colors.onSurface }}>No Active Deliveries</div>
              <p style={{ fontSize: 14, color: colors.onSurfaceVariant, textAlign: 'center' }}>You're all caught up! Awaiting new task assignments.</p>
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: spacing.lg, marginTop: spacing.lg }}>
          <div onClick={() => navigate('/delivery/earnings')} style={{ background: 'rgba(255,255,255,0.7)', border: `1px solid ${colors.outlineVariant}`, borderRadius: radius.xl, padding: spacing.lg, cursor: 'pointer' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm }}>
              <span style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', color: colors.onSurfaceVariant }}>Earnings Today</span>
              <span style={{ color: colors.primary }}>📈</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: spacing.sm, marginBottom: spacing.lg }}>
              <span style={{ fontSize: 28, fontWeight: 600 }}>{stats.earnings_today || '$0.00'}</span>
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.7)', border: `1px solid ${colors.outlineVariant}`, borderRadius: radius.xl, padding: spacing.lg }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md }}>
              <span style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', color: colors.onSurfaceVariant }}>Task Queue</span>
              <span onClick={() => navigate('/delivery/route-history')} style={{ fontSize: 14, fontWeight: 700, color: colors.primary, cursor: 'pointer' }}>View All</span>
            </div>
            {tasks.slice(0, 3).map(t => (
              <div key={t.id} onClick={() => navigate('/delivery/route-history')} style={{
                display: 'flex', alignItems: 'center', gap: spacing.md,
                padding: spacing.md, background: colors.surfaceContainerLow,
                borderRadius: radius.xl, marginBottom: spacing.sm, cursor: 'pointer',
              }}>
                <div style={{ width: 48, height: 48, borderRadius: radius.md, background: colors.white, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, border: `1px solid ${colors.outlineVariant}`, flexShrink: 0 }}>📦</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>Delivery #{t.id}</div>
                  <div style={{ fontSize: 13, color: colors.onSurfaceVariant }}>Status: {t.status} • {t.distance_km || 'N/A'} km</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>${t.earnings || '0.00'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
