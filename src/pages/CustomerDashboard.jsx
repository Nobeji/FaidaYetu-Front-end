import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { colors, spacing, radius } from '../constants/theme';
import DashboardShell from '../components/DashboardShell';
import SupplierCard from '../components/SupplierCard';
import MapComponent from '../components/MapComponent';
import { api } from '../services/api';

const navItems = [
  { icon: '🏠', label: 'Explore', nav: '/customer' },
  { icon: '🛒', label: 'Marketplace', nav: '/customer/marketplace' },
  { icon: '📋', label: 'My Orders', nav: '/customer/orders' },
  { icon: '👤', label: 'Profile', nav: '/customer/profile' },
];

const defaultLocation = [-6.7924, 39.2083];

export default function CustomerDashboard() {
  const [suppliers, setSuppliers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(defaultLocation);
  const [search, setSearch] = useState('');
  const [radiusFilter, setRadiusFilter] = useState(50);
  const [driverLocation, setDriverLocation] = useState(null);
  const navigate = useNavigate();

  const customerId = JSON.parse(localStorage.getItem('customer') || '{}').id || 1;

  const handleCancelOrder = async (id) => {
    try {
      await api.updateOrder(id, { status: 'cancelled' });
      const updated = await api.orders({ customer: customerId });
      setOrders(updated);
    } catch {
      alert('Failed to cancel order.');
    }
  };

  const canCancel = (status) => ['new', 'processing'].includes(status);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      pos => setUserLocation([pos.coords.latitude, pos.coords.longitude]),
      () => {}
    );
  }, []);

  useEffect(() => {
    const cid = JSON.parse(localStorage.getItem('customer') || '{}').id || 1;
    Promise.all([
      api.suppliers({ lat: userLocation[0], lng: userLocation[1], radius: radiusFilter }),
      api.orders({ customer: cid }),
    ]).then(([s, o]) => {
      setSuppliers(s);
      setOrders(o);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [userLocation, radiusFilter]);

  const activeOrder = orders.find(o => ['in_transit', 'assigned', 'picked_up'].includes(o.status));

  // Poll driver location for active order
  useEffect(() => {
    if (!activeOrder?.delivery_id) { setDriverLocation(null); return; }
    const poll = () => {
      api.latestLocation(activeOrder.delivery_id).then(loc => {
        if (loc?.lat != null && loc?.lng != null) setDriverLocation([loc.lat, loc.lng]);
      }).catch(() => {});
    };
    poll();
    const id = setInterval(poll, 5000);
    return () => clearInterval(id);
  }, [activeOrder?.delivery_id]);

  const filtered = search
    ? suppliers.filter(s => s.business_name?.toLowerCase().includes(search.toLowerCase()))
    : suppliers;

  return (
    <DashboardShell brand="FaidaYetu" brandSub="Customer Portal" navItems={navItems} profile="JB">
      <div className="fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.lg }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 600, color: colors.primary }}>Find Poultry</h1>
            <p style={{ fontSize: 15, color: colors.onSurfaceVariant }}>Discover fresh products near you</p>
          </div>
        </div>

        {activeOrder && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '8px 16px', background: colors.primary, color: colors.onPrimary,
            borderRadius: radius.xl, marginBottom: spacing.lg, flexWrap: 'wrap', gap: spacing.sm,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
              <span>🚚</span>
              <span style={{ fontSize: 13 }}>Active Order: <strong>In transit</strong></span>
            </div>
            <button onClick={() => navigate('/customer/orders')} style={{
              fontSize: 12, fontWeight: 600, padding: '4px 16px',
              border: '1px solid rgba(255,255,255,0.3)', borderRadius: radius.round,
              background: 'none', color: colors.onPrimary, cursor: 'pointer',
            }}>Track Live</button>
          </div>
        )}

        <div style={{ display: 'flex', gap: spacing.md, marginBottom: spacing.md }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: colors.outline }}>🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search supplier..." style={{
              width: '100%', padding: '12px 16px 12px 44px', borderRadius: radius.xl,
              border: `1px solid ${colors.outlineVariant}`, background: colors.surface,
              fontSize: 15, color: colors.onSurface, boxSizing: 'border-box',
            }} />
          </div>
          <select value={radiusFilter} onChange={e => setRadiusFilter(Number(e.target.value))} style={{
            padding: '12px 16px', borderRadius: radius.xl, border: `1px solid ${colors.outlineVariant}`,
            background: colors.surface, fontSize: 14, fontWeight: 600, color: colors.onSurface,
          }}>
            <option value={10}>10 km</option>
            <option value={25}>25 km</option>
            <option value={50}>50 km</option>
            <option value={100}>100 km</option>
          </select>
        </div>

        <div style={{ marginBottom: spacing.lg }}>
          <MapComponent
            height={360}
            userLocation={userLocation}
            suppliers={filtered}
            radiusKm={radiusFilter}
            driverLocation={driverLocation}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md }}>
          <h3 style={{ fontSize: 20, fontWeight: 600, color: colors.primary }}>Recommended Near You</h3>
          <span onClick={() => navigate('/customer/marketplace')} style={{ fontSize: 14, fontWeight: 700, color: colors.primary, cursor: 'pointer' }}>View All →</span>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: spacing.xl, color: colors.onSurfaceVariant }}>Loading suppliers...</div>
        ) : (
          <div style={{ display: 'flex', gap: spacing.md, overflowX: 'auto', paddingBottom: spacing.sm }}>
            {filtered.map(s => (
              <SupplierCard key={s.id} id={s.id} name={s.business_name} rating={s.rating} distance="Nearby" price="From supplier" img={s.image} />
            ))}
          </div>
        )}

        {orders.length > 0 && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md, marginTop: spacing.xl }}>
              <h3 style={{ fontSize: 20, fontWeight: 600, color: colors.primary }}>Recent Orders</h3>
              <span onClick={() => navigate('/customer/orders')} style={{ fontSize: 14, fontWeight: 700, color: colors.primary, cursor: 'pointer' }}>View All →</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
              {orders.slice(0, 5).map(o => (
                <div key={o.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: spacing.md, background: '#fff', borderRadius: radius.xl, border: `1px solid ${colors.outlineVariant}` }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: colors.onSurface }}>{o.supplier_name || `Order #${o.id}`}</div>
                    <div style={{ fontSize: 12, color: colors.onSurfaceVariant }}>{Number(o.total).toLocaleString()} TZS • {o.status}</div>
                  </div>
                  <div style={{ display: 'flex', gap: spacing.sm }}>
                    <button onClick={() => navigate('/customer/orders')} style={{ padding: '6px 12px', borderRadius: radius.md, border: `1px solid ${colors.outlineVariant}`, background: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 11 }}>Details</button>
                    {canCancel(o.status) && (
                      <button onClick={() => handleCancelOrder(o.id)} style={{ padding: '6px 12px', borderRadius: radius.md, background: colors.errorContainer, color: colors.error, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 11 }}>Cancel</button>
                    )}
                    {o.status === 'in_transit' && (
                      <button onClick={() => navigate('/customer')} style={{ padding: '6px 12px', borderRadius: radius.md, background: colors.primary, color: colors.onPrimary, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 11 }}>Track</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </DashboardShell>
  );
}
