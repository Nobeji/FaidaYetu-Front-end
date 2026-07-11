import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardShell from '../components/DashboardShell';
import StatsCard from '../components/StatsCard';
import StatusBadge from '../components/StatusBadge';
import ProgressBar from '../components/ProgressBar';
import MapComponent from '../components/MapComponent';
import LocationPicker from '../components/LocationPicker';
import { api } from '../services/api';

const navItems = [
  { icon: '📊', label: 'Dashboard', nav: '/supplier' },
  { icon: '📦', label: 'Inventory', nav: '/supplier/inventory' },
  { icon: '🛒', label: 'Orders', nav: '/supplier/orders' },
  { icon: '📈', label: 'Analytics', nav: '/supplier/analytics' },
  { icon: '📉', label: 'Statistics', nav: '/supplier/statistics' },
  { icon: '⚙️', label: 'Settings', nav: '/supplier/settings' },
  { icon: '❓', label: 'Support', nav: '/supplier/support' },
];

export default function SupplierDashboard() {
  const [data, setData] = useState({ stats: { orders: '0', revenue: '0 TZS', lowStock: '00' }, orders: [], inventory: [] });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const bellRef = useRef(null);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const profile = JSON.parse(localStorage.getItem('profile') || '{}');
  const supplier = JSON.parse(localStorage.getItem('supplier') || '{}');
  const supplierId = supplier.id || 1;
  const initials = (user.username || 'U').charAt(0).toUpperCase() + ((user.username || '').slice(-1) || '').toUpperCase();

  const [editLocation, setEditLocation] = useState(false);
  const [locationCoords, setLocationCoords] = useState({ lat: -6.7924, lng: 39.2083 });
  const [savingLocation, setSavingLocation] = useState(false);
  const [originalCoords, setOriginalCoords] = useState({ lat: -6.7924, lng: 39.2083 });

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  const fetchNotifications = () => {
    api.notifications(supplierId).then(d => {
      setNotifications(d.notifications || []);
      setUnreadCount(d.unread_count || 0);
    }).catch(() => {});
  };

  useEffect(() => {
    api.supplierDashboard(supplierId).then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false));
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) setShowNotifications(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleMarkRead = async (notificationId) => {
    await api.markNotificationsRead(supplierId, notificationId);
    fetchNotifications();
  };

  const handleMarkAllRead = async () => {
    await api.markNotificationsRead(supplierId, null);
    fetchNotifications();
  };

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
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#f9f9f9', padding: '8px 12px', borderRadius: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 700, fontSize: 13 }}>{initials}</div>
        <div>
          <div style={{ fontWeight: 600, fontSize: 13 }}>{user.username || 'Supplier'}</div>
          <div style={{ fontSize: 11, color: '#888' }}>Supplier Portal</div>
        </div>
      </div>
    }>
      <div>
        <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111', margin: 0 }}>Supplier Dashboard</h1>
            <p style={{ fontSize: 13, color: '#888', margin: '4px 0 0' }}>Manage your poultry operations.</p>
          </div>
          <div ref={bellRef} style={{ position: 'relative' }}>
            <button onClick={() => setShowNotifications(v => !v)} style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', padding: 8, fontSize: 22, lineHeight: 1 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={unreadCount > 0 ? '#000' : '#888'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              {unreadCount > 0 && (
                <span style={{ position: 'absolute', top: 2, right: 2, minWidth: 18, height: 18, borderRadius: 9, background: '#d32f2f', color: '#fff', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>{unreadCount}</span>
              )}
            </button>
            {showNotifications && (
              <div style={{ position: 'absolute', top: '100%', right: 0, width: 360, maxHeight: 400, background: '#fff', border: '1px solid #eaeaea', borderRadius: 10, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', overflow: 'hidden', zIndex: 50 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid #f0f0f0' }}>
                  <span style={{ fontWeight: 600, fontSize: 14, color: '#111' }}>Notifications</span>
                  {unreadCount > 0 && (
                    <button onClick={handleMarkAllRead} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, color: '#0a6e46', padding: 0 }}>Mark all as read</button>
                  )}
                </div>
                <div style={{ overflowY: 'auto', maxHeight: 340 }}>
                  {notifications.length === 0 ? (
                    <div style={{ padding: 32, textAlign: 'center', color: '#888', fontSize: 13 }}>No notifications yet.</div>
                  ) : (
                    notifications.map(n => (
                      <div key={n.id} onClick={() => { if (!n.read) handleMarkRead(n.id); }} style={{ padding: '12px 16px', borderBottom: '1px solid #f5f5f5', cursor: n.read ? 'default' : 'pointer', background: n.read ? '#fff' : '#f9f9ff', transition: 'background 0.15s' }}>
                        <div style={{ fontSize: 13, fontWeight: n.read ? 400 : 600, color: '#111', marginBottom: 2 }}>{n.title}</div>
                        <div style={{ fontSize: 12, color: '#888' }}>{n.message}</div>
                        <div style={{ fontSize: 11, color: '#aaa', marginTop: 4 }}>{new Date(n.created_at).toLocaleString('sw-TZ', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#888' }}>Loading data...</div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
              <StatsCard label="Total Orders" value={data.stats.orders} sub="this month" subIcon="📈" icon="🛍️" />
              <StatsCard label="Revenue (TZS)" value={data.stats.revenue} sub="Estimated Earnings" subIcon="💰" icon="💳" tertiary />
              <StatsCard label="Low Stock Alerts" value={data.stats.lowStock} sub="Immediate Action Required" subIcon="⚠️" icon="📦" error />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px', background: '#fafafa', border: '1px solid #eee', borderRadius: 10, marginBottom: 24, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 20 }}>🔔</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>{data.stats.lowStock} Pending Deliveries Require Confirmation</div>
                <div style={{ fontSize: 12, color: '#888' }}>Logistics partners are waiting for "Ready for Pickup" status update.</div>
              </div>
              <button onClick={() => navigate('/supplier/orders')} style={{ padding: '8px 16px', borderRadius: 8, background: '#000', border: 'none', cursor: 'pointer', fontWeight: 500, fontSize: 12, color: '#fff' }}>Review Alerts</button>
            </div>

            <div style={{ background: '#fff', border: '1px solid #eaeaea', borderRadius: 10, padding: 16, marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: '#111', margin: 0 }}>📍 Your Business Location</h3>
                {!editLocation && (
                  <button onClick={() => { setOriginalCoords({ lat: profile.lat || -6.7924, lng: profile.lng || 39.2083 }); setLocationCoords({ lat: profile.lat || -6.7924, lng: profile.lng || 39.2083 }); setEditLocation(true); }} style={{ fontSize: 12, fontWeight: 600, color: '#0a6e46', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Update</button>
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
                    <button onClick={() => { setEditLocation(false); setLocationCoords(originalCoords); }} style={{ flex: 1, padding: '8px', borderRadius: 8, border: '1px solid #ddd', background: '#fff', cursor: 'pointer', fontWeight: 500, fontSize: 12 }}>Cancel</button>
                    <button onClick={handleSaveLocation} disabled={savingLocation} style={{ flex: 1, padding: '8px', borderRadius: 8, background: '#0a6e46', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 12, opacity: savingLocation ? 0.7 : 1 }}>
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
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
              <div style={{ background: '#fff', border: '1px solid #eaeaea', borderRadius: 10, overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #f0f0f0' }}>
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: '#111', margin: 0 }}>Recent Orders</h3>
                  <span onClick={() => navigate('/supplier/orders')} style={{ fontSize: 12, color: '#000', cursor: 'pointer', fontWeight: 600 }}>View All</span>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        {['Order ID', 'Customer', 'Product', 'Status', 'Amount'].map(h => (
                          <th key={h} style={{ padding: '10px 16px', fontSize: 11, fontWeight: 600, color: '#888', borderBottom: '1px solid #f0f0f0', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data.orders.map(o => (
                        <tr key={o.id} onClick={() => navigate('/supplier/orders')} style={{ cursor: 'pointer', borderBottom: '1px solid #f5f5f5' }}>
                          <td style={{ padding: '10px 16px', fontWeight: 600, color: '#000', fontSize: 13 }}>#{o.id}</td>
                          <td style={{ padding: '10px 16px', fontSize: 13 }}>{o.customer_name}</td>
                          <td style={{ padding: '10px 16px', fontSize: 13 }}>{o.items?.[0]?.product_name || '—'}</td>
                          <td style={{ padding: '10px 16px' }}><StatusBadge status={o.status} /></td>
                          <td style={{ padding: '10px 16px', fontWeight: 600, textAlign: 'right', fontSize: 13 }}>{Number(o.total).toLocaleString()} TZS</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <div style={{ background: '#fff', border: '1px solid #eaeaea', borderRadius: 10, padding: '20px', marginBottom: 20 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: '#111', margin: '0 0 16px' }}>Inventory Status</h3>
                  {data.inventory.map(i => <ProgressBar key={i.name} {...i} />)}
                  <button onClick={() => navigate('/supplier/inventory')} style={{
                    width: '100%', padding: '10px', borderRadius: 8,
                    border: '1px solid #e0e0e0', background: '#fff', color: '#555',
                    cursor: 'pointer', fontWeight: 500, fontSize: 12, marginTop: 4,
                  }}>View Inventory</button>
                </div>

                <div style={{ background: '#fafafa', padding: '20px', borderRadius: 10, border: '1px solid #eee' }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>🏪</div>
                  <h4 style={{ fontSize: 15, fontWeight: 700, color: '#111', margin: '0 0 4px' }}>Expand Your Marketplace Presence</h4>
                  <p style={{ fontSize: 12, color: '#888', margin: '0 0 12px' }}>Add more products to reach more customers across Dar es Salaam.</p>
                  <div onClick={() => navigate('/supplier/settings')} style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600, color: '#000', fontSize: 13, cursor: 'pointer' }}>
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
