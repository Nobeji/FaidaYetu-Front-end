import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardShell from '../../components/DashboardShell';
import StatusBadge from '../../components/StatusBadge';
import { api } from '../../services/api';
import { useToast } from '../../components/ToastContext';

const navItems = [
  { icon: '🏠', label: 'Explore', nav: '/customer' },
  { icon: '🛒', label: 'Marketplace', nav: '/customer/marketplace' },
  { icon: '📋', label: 'My Orders', nav: '/customer/orders' },
  { icon: '👤', label: 'Profile', nav: '/customer/profile' },
];

const filters = ['All', 'new', 'processing', 'delivered', 'cancelled'];

const modalOverlay = {
  position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex',
  alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16,
};
const modalBox = {
  background: '#fff', borderRadius: 16, padding: 24, width: '100%', maxWidth: 480,
  maxHeight: '90vh', overflow: 'auto',
};

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showAssign, setShowAssign] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [loadingDrivers, setLoadingDrivers] = useState(false);
  const [showPayModal, setShowPayModal] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paying, setPaying] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userName = user.username || 'Customer';
  const initials = userName.charAt(0).toUpperCase();
  const navigate = useNavigate();
  const toast = useToast();

  const customerId = JSON.parse(localStorage.getItem('customer') || '{}').id || 1;

  useEffect(() => {
    api.orders({ customer: customerId }).then(o => { setOrders(o); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const filtered = filter === 'All' ? orders : orders.filter(o => o.status === filter);

  const openAssign = async (order) => {
    setShowAssign(order);
    setLoadingDrivers(true);
    try {
      const profile = JSON.parse(localStorage.getItem('profile') || '{}');
      const params = { status: 'online', radius: 50 };
      if (profile.lat != null) { params.lat = profile.lat; params.lng = profile.lng; }
      setDrivers(await api.deliveryPersons(params));
    } catch {
      setDrivers([]);
    } finally {
      setLoadingDrivers(false);
    }
  };

  const handleAssign = async (orderId, driverId) => {
    try {
      await api.assignDelivery(orderId, { delivery_person_id: driverId });
      const updated = await api.orders({ customer: customerId });
      setOrders(updated);
      setShowAssign(null);
    } catch {
      toast('Failed to assign delivery.', 'error');
    }
  };

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
        const updated = await api.orders({ customer: customerId });
        setOrders(updated);
      } else {
        toast(result.error || 'Payment failed', 'error');
      }
    } catch (e) {
      toast('Payment failed. Try again.', 'error');
    } finally {
      setPaying(false);
    }
  };

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
      <div className="fade-in">
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: 28, fontWeight: 600, color: '#000' }}>My Orders</h1>
          <p style={{ fontSize: 15, color: '#888' }}>Track and manage your purchases</p>
        </div>

        <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '8px 20px', borderRadius: 999, border: 'none', cursor: 'pointer',
              background: f === filter ? '#000' : '#f5f5f5',
              color: f === filter ? '#fff' : '#888',
              fontWeight: 600, fontSize: 13, textTransform: 'capitalize',
            }}>{f === 'new' ? 'New' : f === 'processing' ? 'Active' : f.charAt(0).toUpperCase() + f.slice(1)}</button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 48, color: '#888' }}>Loading orders...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 48, color: '#888' }}>No orders found.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.map(o => (
              <div key={o.id} style={{ display: 'flex', gap: 12, background: '#fff', padding: 12, borderRadius: 12, border: `1px solid ${'#eee'}`, alignItems: 'center' }}>
                <div style={{ width: 80, height: 80, borderRadius: 8, background: '#f0f0f0', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>📦</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 16, color: '#111' }}>{o.supplier_name || 'Order'}</div>
                      <div style={{ fontSize: 13, color: '#888' }}>#{o.id} • {new Date(o.created_at).toLocaleDateString()}</div>
                    </div>
                    <StatusBadge status={o.status} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                    <span style={{ fontWeight: 800, fontSize: 16, color: '#000' }}>{Number(o.total).toLocaleString()} TZS</span>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <button onClick={() => setSelectedOrder(o)} style={{ padding: '6px 14px', borderRadius: 8, border: `1px solid ${'#000'}`, background: 'none', color: '#000', cursor: 'pointer', fontWeight: 600, fontSize: 12 }}>Details</button>
                      {o.status === 'new' && !o.paid && (
                        <button onClick={() => { setShowPayModal(o); setPhoneNumber(''); }} style={{ padding: '6px 14px', borderRadius: 8, background: '#0a6e46', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 12 }}>Pay Now</button>
                      )}
                      {o.paid && (
                        <span style={{ padding: '6px 14px', borderRadius: 8, background: '#e8f5e9', color: '#2e7d32', fontWeight: 600, fontSize: 12 }}>✓ Paid</span>
                      )}
                      {o.status === 'in_transit' && <button onClick={() => navigate('/customer')} style={{ padding: '6px 14px', borderRadius: 8, background: '#000', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 12 }}>Track</button>}
                      {!o.delivery && ['new', 'processing'].includes(o.status) && o.paid && (
                        <button onClick={() => openAssign(o)} style={{ padding: '6px 14px', borderRadius: 8, background: '#e67e22', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 12 }}>Assign Driver</button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div style={modalOverlay} onClick={() => setSelectedOrder(null)}>
          <div style={modalBox} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: '#000' }}>Order #{selectedOrder.id}</h3>
              <StatusBadge status={selectedOrder.status} />
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, color: '#888', marginBottom: 4 }}>Supplier: <strong>{selectedOrder.supplier_name}</strong></div>
              <div style={{ fontSize: 13, color: '#888', marginBottom: 4 }}>Date: {new Date(selectedOrder.created_at).toLocaleString()}</div>
              {selectedOrder.delivery_address && <div style={{ fontSize: 13, color: '#888', marginBottom: 4 }}>📍 {selectedOrder.delivery_address}</div>}
              {selectedOrder.notes && <div style={{ fontSize: 13, color: '#888' }}>📝 {selectedOrder.notes}</div>}
            </div>

            <div style={{ marginBottom: 16 }}>
              <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>Items</h4>
              {(selectedOrder.items || []).map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: `1px solid ${'#eee'}` }}>
                  <span>{item.product_name} x{item.quantity}</span>
                  <span style={{ fontWeight: 600 }}>{Number(item.price).toLocaleString()} TZS</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontWeight: 700, fontSize: 16 }}>
                <span>Total</span>
                <span style={{ color: '#000' }}>{Number(selectedOrder.total).toLocaleString()} TZS</span>
              </div>
            </div>

            <button onClick={() => setSelectedOrder(null)} style={{ width: '100%', padding: '12px', borderRadius: 8, background: '#000', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700 }}>Close</button>
          </div>
        </div>
      )}

      {/* Assign Delivery Modal */}
      {/* Payment Modal */}
      {showPayModal && (
        <div style={modalOverlay} onClick={() => !paying && setShowPayModal(null)}>
          <div style={modalBox} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: '#000' }}>Pay for Order #{showPayModal.id}</h3>
              <button onClick={() => !paying && setShowPayModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#888' }}>✕</button>
            </div>
            <p style={{ fontSize: 14, color: '#666', marginBottom: 16 }}>
              Amount: <strong style={{ color: '#000' }}>{Number(showPayModal.total).toLocaleString()} TZS</strong>
              <br />
              Enter your mobile money phone number to receive a payment push (M-Pesa, Tigo Pesa, Airtel Money).
            </p>
            <input
              type="tel"
              placeholder="e.g. 0712345678"
              value={phoneNumber}
              onChange={e => setPhoneNumber(e.target.value)}
              disabled={paying}
              style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: '1px solid #ddd', fontSize: 16, boxSizing: 'border-box', marginBottom: 16 }}
            />
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setShowPayModal(null)} disabled={paying} style={{ flex: 1, padding: '12px', borderRadius: 8, border: '1px solid #ddd', background: '#fff', color: '#666', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
              <button onClick={handlePay} disabled={paying} style={{ flex: 1, padding: '12px', borderRadius: 8, background: '#0a6e46', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700, opacity: paying ? 0.7 : 1 }}>
                {paying ? 'Sending...' : `Pay ${Number(showPayModal.total).toLocaleString()} TZS`}
              </button>
            </div>
          </div>
        </div>
      )}

      {showAssign && (
        <div style={modalOverlay} onClick={() => setShowAssign(null)}>
          <div style={modalBox} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: '#000' }}>Assign Driver — Order #{showAssign.id}</h3>
              <button onClick={() => setShowAssign(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#888' }}>✕</button>
            </div>
            <p style={{ fontSize: 14, color: '#888', marginBottom: 16 }}>Available delivery personnel nearby:</p>

            {loadingDrivers ? (
              <div style={{ textAlign: 'center', padding: 28, color: '#888' }}>Loading nearby drivers...</div>
            ) : drivers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 28, color: '#888' }}>No available drivers nearby.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {drivers.map(d => (
                  <div key={d.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 12, borderRadius: 8, border: `1px solid ${'#eee'}`, background: '#fafafa' }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{d.profile?.user?.username || `Driver #${d.id}`}</div>
                      <div style={{ fontSize: 12, color: '#888' }}>
                        {d.vehicle_type} • ⭐ {d.rating || 'N/A'} • {d.total_routes || 0} routes
                      </div>
                    </div>
                    <button onClick={() => handleAssign(showAssign.id, d.id)} style={{ padding: '8px 16px', borderRadius: 8, background: '#000', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>Assign</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
