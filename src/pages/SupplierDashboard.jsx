import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardShell from '../components/DashboardShell';
import StatsCard from '../components/StatsCard';
import StatusBadge from '../components/StatusBadge';
import ProgressBar from '../components/ProgressBar';
import MapComponent from '../components/MapComponent';
import LocationPicker from '../components/LocationPicker';
import { api } from '../services/api';
import Spinner from '../components/Spinner';

const navItems = [
  { icon: '📊', label: 'Dashboard', nav: '/supplier' },
  { icon: '📦', label: 'Inventory', nav: '/supplier/inventory' },
  { icon: '🛒', label: 'Orders', nav: '/supplier/orders' },
  { icon: '🔔', label: 'Notifications', nav: '/supplier/notifications' },
  { icon: '📈', label: 'Analytics', nav: '/supplier/analytics' },
  { icon: '📉', label: 'Statistics', nav: '/supplier/statistics' },
  { icon: '⚙️', label: 'Settings', nav: '/supplier/settings' },
  { icon: '❓', label: 'Support', nav: '/supplier/support' },
  { icon: '📝', label: 'TAM Survey', nav: '/supplier/tam-survey' },
  { icon: '📋', label: 'SUS Survey', nav: '/supplier/sus-survey' },
];

const GLASS = 'rgba(255,255,255,0.05)';
const GLASS_BORDER = '1px solid rgba(255,255,255,0.08)';

export default function SupplierDashboard() {
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
      await api.updateProfile({
        lat: locationCoords.lat,
        lng: locationCoords.lng,
      });
      const updated = await api.profile();
      localStorage.setItem('profile', JSON.stringify(updated));
      setEditLocation(false);
    } catch { alert('Failed to update location.'); }
    finally { setSavingLocation(false); }
  };

  return (
    <DashboardShell brand="FaidaYetu" brandSub="Poultry Logistics Hub" navItems={navItems} profile={
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.06)', padding: '8px 12px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #1e40af, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 13, boxShadow: '0 2px 8px rgba(30,64,175,0.3)' }}>{initials}</div>
        <div>
          <div style={{ fontWeight: 600, fontSize: 13, color: '#fff' }}>{user.username || 'Supplier'}</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>Supplier Portal</div>
        </div>
      </div>
    }>
      <div>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#fff', margin: 0 }}>Supplier Dashboard</h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', margin: '4px 0 0' }}>Manage your poultry operations.</p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: 'rgba(255,255,255,0.5)' }}>Loading data...</div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
              <StatsCard label="Total Orders" value={data.stats.orders} sub="this month" subIcon="📈" icon="🛍️" />
              <StatsCard label="Revenue (TZS)" value={data.stats.revenue} sub="Estimated Earnings" subIcon="💰" icon="💳" tertiary />
              <StatsCard label="Low Stock Alerts" value={data.stats.lowStock} sub="Immediate Action Required" subIcon="⚠️" icon="📦" error />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, marginBottom: 24, flexWrap: 'wrap', backdropFilter: 'blur(12px)' }}>
              <span style={{ fontSize: 20 }}>🔔</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{data.stats.lowStock} Pending Deliveries Require Confirmation</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Logistics partners are waiting for "Ready for Pickup" status update.</div>
              </div>
              <button onClick={() => navigate('/supplier/orders')} style={{ padding: '8px 16px', borderRadius: 8, background: 'linear-gradient(135deg, #1e40af, #2563eb)', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 12, color: '#fff', boxShadow: '0 2px 8px rgba(30,64,175,0.3)' }}>Review Alerts</button>
            </div>

            <div style={{ background: GLASS, border: GLASS_BORDER, borderRadius: 10, padding: 16, marginBottom: 20, backdropFilter: 'blur(12px)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: '#fff', margin: 0 }}>📍 Your Business Location</h3>
                {!editLocation && (
                  <button onClick={() => { setOriginalCoords({ lat: profile.lat || -6.7924, lng: profile.lng || 39.2083 }); setLocationCoords({ lat: profile.lat || -6.7924, lng: profile.lng || 39.2083 }); setEditLocation(true); }} style={{ fontSize: 12, fontWeight: 600, color: '#60a5fa', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Update</button>
                )}
              </div>
              {editLocation ? (
                <>
                  <LocationPicker
                    lat={locationCoords.lat}
                    lng={locationCoords.lng}
                    height={200}
                    onChange={(lat, lng) => setLocationCoords({ lat, lng })}
                  />
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <button onClick={() => { setEditLocation(false); setLocationCoords(originalCoords); }} style={{ flex: 1, padding: '8px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', cursor: 'pointer', fontWeight: 500, fontSize: 12, color: '#fff' }}>Cancel</button>
                    <button onClick={handleSaveLocation} disabled={savingLocation} style={{ flex: 1, padding: '8px', borderRadius: 8, background: 'linear-gradient(135deg, #1e40af, #2563eb)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 12, opacity: savingLocation ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, boxShadow: '0 2px 8px rgba(30,64,175,0.3)' }}>
                      {savingLocation && <Spinner size={12} color="#fff" />}
                      {savingLocation ? 'Saving...' : 'Save Location'}
                    </button>
                  </div>
                </>
              ) : (
                <MapComponent
                  height={200}
                  userLocation={[locationCoords.lat, locationCoords.lng]}
                />
              )}
            </div>
            <div style={{ background: GLASS, border: GLASS_BORDER, borderRadius: 10, padding: 16, marginBottom: 20, backdropFilter: 'blur(12px)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: '#fff', margin: 0 }}>📍 Customer Delivery Locations</h3>
              </div>
              <MapComponent
                height={280}
                deliveries={data.orders.filter(o => o.delivery_lat && o.delivery_lng)}
                userLocation={[locationCoords.lat, locationCoords.lng]}
              />
              {data.orders.filter(o => o.delivery_lat && o.delivery_lng).length === 0 && (
                <div style={{ textAlign: 'center', padding: 20, color: 'rgba(255,255,255,0.45)', fontSize: 13 }}>No delivery locations yet.</div>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr', gap: 20 }}>
              <div style={{ background: GLASS, border: GLASS_BORDER, borderRadius: 10, overflow: 'hidden', backdropFilter: 'blur(12px)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: '#fff', margin: 0 }}>Recent Orders</h3>
                  <span onClick={() => navigate('/supplier/orders')} style={{ fontSize: 12, color: '#60a5fa', cursor: 'pointer', fontWeight: 600 }}>View All</span>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        {['Order ID', 'Customer', 'Product', 'Status', 'Amount'].map(h => (
                          <th key={h} style={{ padding: '10px 16px', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.45)', borderBottom: '1px solid rgba(255,255,255,0.06)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data.orders.map(o => (
                        <tr key={o.id} onClick={() => navigate('/supplier/orders')} style={{ cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                          <td style={{ padding: '10px 16px', fontWeight: 600, color: '#fff', fontSize: 13 }}>#{o.id}</td>
                          <td style={{ padding: '10px 16px', fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>{o.customer_name}</td>
                          <td style={{ padding: '10px 16px', fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>{o.items?.[0]?.product_name || '—'}</td>
                          <td style={{ padding: '10px 16px' }}><StatusBadge status={o.status} /></td>
                          <td style={{ padding: '10px 16px', fontWeight: 600, textAlign: 'right', fontSize: 13, color: '#fff' }}>{Number(o.total).toLocaleString()} TZS</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <div style={{ background: GLASS, border: GLASS_BORDER, borderRadius: 10, padding: '20px', marginBottom: 20, backdropFilter: 'blur(12px)' }}>
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: '#fff', margin: '0 0 16px' }}>Inventory Status</h3>
                  {data.inventory.map(i => <ProgressBar key={i.name} {...i} />)}
                  <button onClick={() => navigate('/supplier/inventory')} style={{
                    width: '100%', padding: '10px', borderRadius: 8,
                    border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.05)', color: '#fff',
                    cursor: 'pointer', fontWeight: 500, fontSize: 12, marginTop: 4,
                  }}>View Inventory</button>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>🏪</div>
                  <h4 style={{ fontSize: 15, fontWeight: 700, color: '#fff', margin: '0 0 4px' }}>Expand Your Marketplace Presence</h4>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', margin: '0 0 12px' }}>Add more products to reach more customers across Dar es Salaam.</p>
                  <div onClick={() => navigate('/supplier/settings')} style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600, color: '#60a5fa', fontSize: 13, cursor: 'pointer' }}>
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
