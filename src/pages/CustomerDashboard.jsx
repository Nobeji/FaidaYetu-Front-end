import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { colors } from '../constants/theme';
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

  const handleCancelOrder = async (id) => {
    try {
      await api.updateOrder(id, { status: 'cancelled' });
      const updated = await api.orders({ customer: id });
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
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111', margin: 0 }}>Find Poultry</h1>
            <p style={{ fontSize: 13, color: '#888', margin: '4px 0 0' }}>Discover fresh products near you</p>
          </div>
        </div>

        {activeOrder && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '10px 20px', background: '#f5f5f5', border: '1px solid #eaeaea',
            borderRadius: 10, marginBottom: 20, flexWrap: 'wrap', gap: 8,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>🚚</span>
              <span style={{ fontSize: 13, color: '#333' }}>Active Order: <strong>In transit</strong></span>
            </div>
            <button onClick={() => navigate('/customer/orders')} style={{
              fontSize: 12, fontWeight: 600, padding: '6px 16px',
              border: '1px solid #ddd', borderRadius: 20,
              background: '#fff', color: '#333', cursor: 'pointer',
            }}>Track Live</button>
          </div>
        )}

        <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#ccc', fontSize: 14 }}>🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search supplier..." style={{
              width: '100%', padding: '10px 14px 10px 38px', borderRadius: 10,
              border: '1px solid #e0e0e0', background: '#fff',
              fontSize: 14, color: '#333', boxSizing: 'border-box', outline: 'none',
            }} />
          </div>
          <select value={radiusFilter} onChange={e => setRadiusFilter(Number(e.target.value))} style={{
            padding: '10px 14px', borderRadius: 10, border: '1px solid #e0e0e0',
            background: '#fff', fontSize: 13, fontWeight: 500, color: '#333', outline: 'none',
          }}>
            <option value={10}>10 km</option>
            <option value={25}>25 km</option>
            <option value={50}>50 km</option>
            <option value={100}>100 km</option>
          </select>
        </div>

        <div style={{ marginBottom: 20, borderRadius: 10, overflow: 'hidden', border: '1px solid #eee' }}>
          <MapComponent
            height={340}
            userLocation={userLocation}
            suppliers={filtered}
            radiusKm={radiusFilter}
            driverLocation={driverLocation}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: '#111', margin: 0 }}>Recommended Near You</h3>
          <span onClick={() => navigate('/customer/marketplace')} style={{ fontSize: 12, fontWeight: 600, color: colors.primary, cursor: 'pointer' }}>View All →</span>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#888' }}>Loading suppliers...</div>
        ) : (
          <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 4 }}>
            {filtered.map(s => (
              <SupplierCard key={s.id} id={s.id} name={s.business_name} rating={s.rating} distance="Nearby" price="From supplier" img={s.image} />
            ))}
          </div>
        )}

        {orders.length > 0 && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, marginTop: 32 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#111', margin: 0 }}>Recent Orders</h3>
              <span onClick={() => navigate('/customer/orders')} style={{ fontSize: 12, fontWeight: 600, color: colors.primary, cursor: 'pointer' }}>View All →</span>
            </div>
            <div style={{ background: '#fff', border: '1px solid #eaeaea', borderRadius: 10, overflow: 'hidden' }}>
              {orders.slice(0, 5).map((o, i) => (
                <div key={o.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '14px 20px',
                  borderBottom: i < orders.slice(0, 5).length - 1 ? '1px solid #f0f0f0' : 'none',
                }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13, color: '#111' }}>{o.supplier_name || `Order #${o.id}`}</div>
                    <div style={{ fontSize: 12, color: '#888' }}>{Number(o.total).toLocaleString()} TZS • {o.status}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => navigate('/customer/orders')} style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid #e0e0e0', background: '#fff', cursor: 'pointer', fontWeight: 500, fontSize: 11, color: '#555' }}>Details</button>
                    {canCancel(o.status) && (
                      <button onClick={() => handleCancelOrder(o.id)} style={{ padding: '6px 12px', borderRadius: 8, background: '#fef2f2', color: '#d32f2f', border: 'none', cursor: 'pointer', fontWeight: 500, fontSize: 11 }}>Cancel</button>
                    )}
                    {o.status === 'in_transit' && (
                      <button onClick={() => navigate('/customer')} style={{ padding: '6px 12px', borderRadius: 8, background: colors.primary, color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 500, fontSize: 11 }}>Track</button>
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
