import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardShell from '../components/DashboardShell';
import SupplierCard from '../components/SupplierCard';
import MapComponent from '../components/MapComponent';
import { api } from '../services/api';
import { useToast } from '../components/ToastContext';

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
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userName = user.username || 'Customer';
  const initials = userName.charAt(0).toUpperCase();
  const navigate = useNavigate();
  const toast = useToast();

  const [showPayModal, setShowPayModal] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paying, setPaying] = useState(false);

  const handlePay = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      toast('Enter a valid phone number (e.g. 0712345678)', 'error');
      return;
    }
    setPaying(true);
    try {
      const result = await api.initiatePayment({ order_id: showPayModal.id, phone: phoneNumber });
      if (result.success) {
        toast(result.message || 'Payment push sent! Check your phone.', 'success');
        setShowPayModal(null);
        const cid = JSON.parse(localStorage.getItem('customer') || '{}').id || 1;
        const updated = await api.orders({ customer: cid });
        setOrders(updated);
      } else {
        toast(result.error || 'Payment failed', 'error');
      }
    } catch {
      toast('Payment failed. Try again.', 'error');
    } finally {
      setPaying(false);
    }
  };

  const handleCancelOrder = async (id) => {
    try {
      await api.updateOrder(id, { status: 'cancelled' });
      const updated = await api.orders({ customer: id });
      setOrders(updated);
    } catch {
      toast('Failed to cancel order.', 'error');
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
    <DashboardShell brand="FaidaYetu" brandSub="Customer Portal" navItems={navItems} profile={
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#f9f9f9', padding: '8px 12px', borderRadius: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 700, fontSize: 13 }}>{initials}</div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 13 }}>{userName}</div>
            <div style={{ fontSize: 11, color: '#888' }}>Customer Portal</div>
          </div>
        </div>
      }>
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
          <span onClick={() => navigate('/customer/marketplace')} style={{ fontSize: 12, fontWeight: 600, color: '#000', cursor: 'pointer' }}>View All →</span>
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
              <span onClick={() => navigate('/customer/orders')} style={{ fontSize: 12, fontWeight: 600, color: '#000', cursor: 'pointer' }}>View All →</span>
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
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <button onClick={() => navigate('/customer/orders')} style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid #e0e0e0', background: '#fff', cursor: 'pointer', fontWeight: 500, fontSize: 11, color: '#555' }}>Details</button>
                    {o.status === 'new' && !o.paid && (
                      <button onClick={() => { setShowPayModal(o); setPhoneNumber(''); }} style={{ padding: '6px 12px', borderRadius: 8, background: '#0a6e46', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 11 }}>Pay Now</button>
                    )}
                    {o.paid && <span style={{ padding: '6px 12px', borderRadius: 8, background: '#e8f5e9', color: '#2e7d32', fontWeight: 600, fontSize: 11 }}>✓ Paid</span>}
                    {canCancel(o.status) && (
                      <button onClick={() => handleCancelOrder(o.id)} style={{ padding: '6px 12px', borderRadius: 8, background: '#fef2f2', color: '#d32f2f', border: 'none', cursor: 'pointer', fontWeight: 500, fontSize: 11 }}>Cancel</button>
                    )}
                    {o.status === 'in_transit' && (
                      <button onClick={() => navigate('/customer')} style={{ padding: '6px 12px', borderRadius: 8, background: '#000', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 500, fontSize: 11 }}>Track</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {showPayModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }} onClick={() => !paying && setShowPayModal(null)}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 24, width: '100%', maxWidth: 440 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: '#000', margin: 0 }}>Pay for Order #{showPayModal.id}</h3>
              <button onClick={() => !paying && setShowPayModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#888' }}>✕</button>
            </div>
            <p style={{ fontSize: 14, color: '#666', marginBottom: 16 }}>
              Amount: <strong>{Number(showPayModal.total).toLocaleString()} TZS</strong><br />
              Enter your mobile money number to receive a payment push (M-Pesa, Tigo Pesa, Airtel Money).
            </p>
            <input type="tel" placeholder="e.g. 0712345678" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} disabled={paying}
              style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: '1px solid #ddd', fontSize: 16, boxSizing: 'border-box', marginBottom: 16 }} />
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setShowPayModal(null)} disabled={paying} style={{ flex: 1, padding: '12px', borderRadius: 8, border: '1px solid #ddd', background: '#fff', color: '#666', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
              <button onClick={handlePay} disabled={paying} style={{ flex: 1, padding: '12px', borderRadius: 8, background: '#0a6e46', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700, opacity: paying ? 0.7 : 1 }}>
                {paying ? 'Sending...' : `Pay ${Number(showPayModal.total).toLocaleString()} TZS`}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
