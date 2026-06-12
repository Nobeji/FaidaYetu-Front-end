import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { colors, spacing, radius } from '../../constants/theme';
import DashboardShell from '../../components/DashboardShell';
import StatusBadge from '../../components/StatusBadge';
import { api } from '../../services/api';

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
  const navigate = useNavigate();

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
      alert('Failed to assign delivery.');
    }
  };

  return (
    <DashboardShell brand="FaidaYetu" brandSub="Customer Portal" navItems={navItems} profile="JB">
      <div className="fade-in">
        <div style={{ marginBottom: spacing.lg }}>
          <h1 style={{ fontSize: 28, fontWeight: 600, color: colors.primary }}>My Orders</h1>
          <p style={{ fontSize: 15, color: colors.onSurfaceVariant }}>Track and manage your purchases</p>
        </div>

        <div style={{ display: 'flex', gap: spacing.md, marginBottom: spacing.lg, flexWrap: 'wrap' }}>
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '8px 20px', borderRadius: radius.round, border: 'none', cursor: 'pointer',
              background: f === filter ? colors.primary : colors.surfaceContainerHigh,
              color: f === filter ? colors.onPrimary : colors.onSurfaceVariant,
              fontWeight: 600, fontSize: 13, textTransform: 'capitalize',
            }}>{f === 'new' ? 'New' : f === 'processing' ? 'Active' : f.charAt(0).toUpperCase() + f.slice(1)}</button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: spacing.xxl, color: colors.onSurfaceVariant }}>Loading orders...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: spacing.xxl, color: colors.onSurfaceVariant }}>No orders found.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
            {filtered.map(o => (
              <div key={o.id} style={{ display: 'flex', gap: spacing.md, background: '#fff', padding: spacing.md, borderRadius: radius.xl, border: `1px solid ${colors.outlineVariant}`, alignItems: 'center' }}>
                <img src="https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=200" alt="" style={{ width: 80, height: 80, borderRadius: radius.md, objectFit: 'cover', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 16, color: colors.onSurface }}>{o.supplier_name || 'Order'}</div>
                      <div style={{ fontSize: 13, color: colors.onSurfaceVariant }}>#{o.id} • {new Date(o.created_at).toLocaleDateString()}</div>
                    </div>
                    <StatusBadge status={o.status} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.sm }}>
                    <span style={{ fontWeight: 800, fontSize: 16, color: colors.primary }}>{Number(o.total).toLocaleString()} TZS</span>
                    <div style={{ display: 'flex', gap: spacing.sm }}>
                      <button onClick={() => setSelectedOrder(o)} style={{ padding: '6px 14px', borderRadius: radius.md, border: `1px solid ${colors.primary}`, background: 'none', color: colors.primary, cursor: 'pointer', fontWeight: 600, fontSize: 12 }}>Details</button>
                      {o.status === 'in_transit' && <button onClick={() => navigate('/customer')} style={{ padding: '6px 14px', borderRadius: radius.md, background: colors.primary, color: colors.onPrimary, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 12 }}>Track</button>}
                      {!o.delivery && ['new', 'processing'].includes(o.status) && (
                        <button onClick={() => openAssign(o)} style={{ padding: '6px 14px', borderRadius: radius.md, background: '#e67e22', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 12 }}>Assign Driver</button>
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
              <h3 style={{ fontSize: 20, fontWeight: 700, color: colors.primary }}>Order #{selectedOrder.id}</h3>
              <StatusBadge status={selectedOrder.status} />
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, color: colors.onSurfaceVariant, marginBottom: 4 }}>Supplier: <strong>{selectedOrder.supplier_name}</strong></div>
              <div style={{ fontSize: 13, color: colors.onSurfaceVariant, marginBottom: 4 }}>Date: {new Date(selectedOrder.created_at).toLocaleString()}</div>
              {selectedOrder.delivery_address && <div style={{ fontSize: 13, color: colors.onSurfaceVariant, marginBottom: 4 }}>📍 {selectedOrder.delivery_address}</div>}
              {selectedOrder.notes && <div style={{ fontSize: 13, color: colors.onSurfaceVariant }}>📝 {selectedOrder.notes}</div>}
            </div>

            <div style={{ marginBottom: 16 }}>
              <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>Items</h4>
              {(selectedOrder.items || []).map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: `1px solid ${colors.outlineVariant}` }}>
                  <span>{item.product_name} x{item.quantity}</span>
                  <span style={{ fontWeight: 600 }}>{Number(item.price).toLocaleString()} TZS</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontWeight: 700, fontSize: 16 }}>
                <span>Total</span>
                <span style={{ color: colors.primary }}>{Number(selectedOrder.total).toLocaleString()} TZS</span>
              </div>
            </div>

            <button onClick={() => setSelectedOrder(null)} style={{ width: '100%', padding: '12px', borderRadius: 8, background: colors.primary, color: colors.onPrimary, border: 'none', cursor: 'pointer', fontWeight: 700 }}>Close</button>
          </div>
        </div>
      )}

      {/* Assign Delivery Modal */}
      {showAssign && (
        <div style={modalOverlay} onClick={() => setShowAssign(null)}>
          <div style={modalBox} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: colors.primary }}>Assign Driver — Order #{showAssign.id}</h3>
              <button onClick={() => setShowAssign(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: colors.onSurfaceVariant }}>✕</button>
            </div>
            <p style={{ fontSize: 14, color: colors.onSurfaceVariant, marginBottom: 16 }}>Available delivery personnel nearby:</p>

            {loadingDrivers ? (
              <div style={{ textAlign: 'center', padding: spacing.xl, color: colors.onSurfaceVariant }}>Loading nearby drivers...</div>
            ) : drivers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: spacing.xl, color: colors.onSurfaceVariant }}>No available drivers nearby.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {drivers.map(d => (
                  <div key={d.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 12, borderRadius: 8, border: `1px solid ${colors.outlineVariant}`, background: colors.surfaceContainerLow }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{d.profile?.user?.username || `Driver #${d.id}`}</div>
                      <div style={{ fontSize: 12, color: colors.onSurfaceVariant }}>
                        {d.vehicle_type} • ⭐ {d.rating || 'N/A'} • {d.total_routes || 0} routes
                      </div>
                    </div>
                    <button onClick={() => handleAssign(showAssign.id, d.id)} style={{ padding: '8px 16px', borderRadius: 8, background: colors.primary, color: colors.onPrimary, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>Assign</button>
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
