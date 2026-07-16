import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, Navigation, Coins, Settings, HelpCircle, FileText, ClipboardList, TrendingUp, Package, MapPin, Inbox } from 'lucide-react';
import DashboardShell from '../components/DashboardShell';
import MapComponent from '../components/MapComponent';
import { api } from '../services/api';
import { useToast } from '../components/ToastContext';

const navItems = [
  { icon: Truck, label: 'Active Tasks', nav: '/delivery' },
  { icon: Navigation, label: 'Route History', nav: '/delivery/route-history' },
  { icon: Coins, label: 'Earnings', nav: '/delivery/earnings' },
  { icon: Settings, label: 'Settings', nav: '/delivery/settings' },
  { icon: HelpCircle, label: 'Support', nav: '/delivery/support' },
  { icon: FileText, label: 'TAM Survey', nav: '/delivery/tam-survey' },
  { icon: ClipboardList, label: 'SUS Survey', nav: '/delivery/sus-survey' },
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
  const [deliveryPerson, setDeliveryPerson] = useState(() => JSON.parse(localStorage.getItem('delivery_person') || '{}'));
  const dpId = deliveryPerson.id || 1;

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    api.profile().then(profileData => {
      localStorage.setItem('profile', JSON.stringify(profileData));
      if (profileData.delivery_person) { localStorage.setItem('delivery_person', JSON.stringify(profileData.delivery_person)); setDeliveryPerson(profileData.delivery_person); }
      const currentDpId = profileData.delivery_person?.id || 1;
      return Promise.all([api.deliveryDashboard(currentDpId), api.deliveries({ delivery_person: currentDpId })]).then(([dash, d]) => {
        setDashboardData(dash); setTasks(d); setProfile(profileData); setLoading(false);
      });
    }).catch(() => {
      Promise.all([api.deliveryDashboard(dpId), api.deliveries({ delivery_person: dpId }), api.profile()]).then(([dash, d, p]) => {
        setDashboardData(dash); setTasks(d); setProfile(p); setLoading(false);
      }).catch(() => setLoading(false));
    });
  }, []);

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(pos => {
      const loc = [pos.coords.latitude, pos.coords.longitude]; setUserLocation(loc);
      const active = dashboardData?.active_delivery;
      if (active?.delivery_id) { api.logLocation(active.delivery_id, { lat: loc[0], lng: loc[1] }).catch(() => {}); }
    }, () => {}, { enableHighAccuracy: true, timeout: 10000 });
    return () => navigator.geolocation.clearWatch(watchId);
  }, [dashboardData?.active_delivery?.delivery_id]);

  const handleComplete = async () => {
    const active = dashboardData?.active_delivery;
    if (!active?.delivery_status) return;
    try {
      const deliveries = await api.deliveries({ delivery_person: dpId });
      const activeDel = deliveries.find(d => d.status === 'in_transit' || d.status === 'assigned' || d.status === 'picked_up');
      if (activeDel) { await api.updateDelivery(activeDel.id, { status: 'completed' }); const dash = await api.deliveryDashboard(dpId); setDashboardData(dash); }
    } catch (e) { toast('Could not complete delivery.', 'error'); }
  };

  if (loading) return (
    <DashboardShell brand="FaidaYetu" brandSub="Delivery Portal" navItems={navItems}>
      <div style={{ textAlign: 'center', padding: 60, color: '#94a3b8' }}>Loading dashboard...</div>
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
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#f8fafc', padding: '8px 12px', borderRadius: 10, border: '1px solid #e2e8f0' }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #0a6e46, #10b981)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 13, boxShadow: '0 2px 6px rgba(10,110,70,0.2)' }}>{initials}</div>
        <div>
          <div style={{ fontWeight: 600, fontSize: 13, color: '#0f172a' }}>{name}</div>
          <div style={{ fontSize: 11, color: '#94a3b8' }}>ID: {dp.id || 'N/A'}-PD</div>
        </div>
      </div>
    }>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: isMobile ? 'stretch' : 'flex-start', marginBottom: 24, flexDirection: isMobile ? 'column' : 'row', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: isMobile ? 20 : 22, fontWeight: 700, color: '#0f172a', margin: 0 }}>Delivery Dashboard</h1>
            <p style={{ fontSize: 13, color: '#64748b', margin: '4px 0 0' }}>Optimized routes for regional poultry logistics.</p>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <div onClick={() => setDriverOnline(!driverOnline)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: '#fff', borderRadius: 20, border: '1px solid #e2e8f0', cursor: 'pointer' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: driverOnline ? '#22c55e' : '#d1d5db' }} />
              <span style={{ fontSize: 13, fontWeight: 500, color: '#475569' }}>{driverOnline ? 'Online' : 'Offline'}</span>
            </div>
            <button onClick={() => navigate('/delivery/route-history')} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px', borderRadius: 8, background: '#0a6e46', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
              <Truck size={14} /> Start Route
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr', gap: 20 }}>
          <div style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
            <MapComponent height={isMobile ? 260 : 400} userLocation={userLocation} deliveries={activeDelivery ? [activeDelivery] : []}
              routePoints={activeDelivery?.supplier_lat && activeDelivery?.supplier_lng && activeDelivery?.delivery_lat && activeDelivery?.delivery_lng ? [[activeDelivery.supplier_lat, activeDelivery.supplier_lng], [activeDelivery.delivery_lat, activeDelivery.delivery_lng]] : []}
              suppliers={[]} />
          </div>

          {activeDelivery ? (
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '20px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#64748b' }}>Active Delivery</span>
                <span style={{ padding: '3px 10px', background: '#dbeafe', color: '#1d4ed8', fontSize: 11, fontWeight: 600, borderRadius: 20 }}>In Progress</span>
              </div>
              <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                <MapPin size={16} color="#64748b" />
                <div>
                  <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Pickup</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{activeDelivery.supplier_name || 'Supplier'}</div>
                  <div style={{ fontSize: 12, color: '#94a3b8' }}>Order #{activeDelivery.id}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                <MapPin size={16} color="#64748b" />
                <div>
                  <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Drop-off</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{activeDelivery.customer_name || 'Customer'}</div>
                  <div style={{ fontSize: 12, color: '#94a3b8' }}>{activeDelivery.delivery_address || 'N/A'}</div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 'auto', paddingTop: 16, borderTop: '1px solid #f1f5f9' }}>
                <button onClick={() => toast('Contact supplier at support@faidayetu.co.tz', 'info')} style={{ padding: '10px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', color: '#475569', cursor: 'pointer', fontWeight: 600, fontSize: 12 }}>Contact</button>
                <button onClick={handleComplete} style={{ padding: '10px', borderRadius: 8, background: '#0a6e46', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 12 }}>Complete</button>
              </div>
            </div>
          ) : (
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
              <Inbox size={40} color="#94a3b8" />
              <div style={{ fontWeight: 700, fontSize: 16, color: '#0f172a' }}>No Active Deliveries</div>
              <p style={{ fontSize: 13, color: '#94a3b8', textAlign: 'center', margin: 0 }}>You're all caught up! Awaiting new task assignments.</p>
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 2fr', gap: 20, marginTop: 20 }}>
          <div onClick={() => navigate('/delivery/earnings')} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '20px', cursor: 'pointer' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: '#64748b' }}>Earnings Today</span>
              <TrendingUp size={16} color="#64748b" />
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontSize: 24, fontWeight: 700, color: '#0f172a' }}>{stats.earnings_today || '$0.00'}</span>
            </div>
          </div>

          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: '#64748b' }}>Task Queue</span>
              <span onClick={() => navigate('/delivery/route-history')} style={{ fontSize: 12, fontWeight: 600, color: '#0a6e46', cursor: 'pointer' }}>View All</span>
            </div>
            {tasks.slice(0, 3).map(t => (
              <div key={t.id} onClick={() => navigate('/delivery/route-history')} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px', borderRadius: 8, marginBottom: 6, cursor: 'pointer', background: '#f8fafc', border: '1px solid #f1f5f9' }}>
                <div style={{ width: 40, height: 40, borderRadius: 8, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e2e8f0', flexShrink: 0 }}><Package size={18} color="#64748b" /></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: '#0f172a' }}>Delivery #{t.id}</div>
                  <div style={{ fontSize: 12, color: '#94a3b8' }}>{t.status} • {t.distance_km || 'N/A'} km</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: '#0f172a' }}>${t.earnings || '0.00'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
