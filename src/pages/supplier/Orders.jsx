import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { colors, spacing, radius } from '../../constants/theme';
import DashboardShell from '../../components/DashboardShell';
import StatusBadge from '../../components/StatusBadge';
import { api } from '../../services/api';

const navItems = [
  { icon: '📊', label: 'Dashboard', nav: '/supplier' },
  { icon: '📦', label: 'Inventory', nav: '/supplier/inventory' },
  { icon: '🛒', label: 'Orders', nav: '/supplier/orders' },
  { icon: '📈', label: 'Analytics', nav: '/supplier/analytics' },
  { icon: '⚙️', label: 'Settings', nav: '/supplier/settings' },
  { icon: '❓', label: 'Support', nav: '/supplier/support' },
];

const modalOverlay = {
  position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex',
  alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16,
};
const modalBox = {
  background: '#fff', borderRadius: 16, padding: 24, width: '100%', maxWidth: 520,
  maxHeight: '90vh', overflow: 'auto',
};

export default function SupplierOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showAssign, setShowAssign] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [loadingDrivers, setLoadingDrivers] = useState(false);
  const supplierId = JSON.parse(localStorage.getItem('supplier') || '{}').id || 1;
  const navigate = useNavigate();

  useEffect(() => {
    api.orders({ supplier: supplierId }).then(o => { setOrders(o); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const filtered = filter === 'All' ? orders : orders.filter(o => o.status === filter.toLowerCase());

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await api.updateOrder(id, { status: newStatus });
      const updated = await api.orders({ supplier: supplierId });
      setOrders(updated);
      setSelectedOrder(null);
    } catch {
      alert('Failed to update order status.');
    }
  };

  const openAssign = async (order) => {
    setShowAssign(order);
    setLoadingDrivers(true);
    try {
      const profile = JSON.parse(localStorage.getItem('profile') || '{}');
      const lat = profile.lat;
      const lng = profile.lng;
      const params = { status: 'online', radius: 50 };
      if (lat != null) { params.lat = lat; params.lng = lng; }
      const data = await api.deliveryPersons(params);
      setDrivers(data);
    } catch {
      setDrivers([]);
    } finally {
      setLoadingDrivers(false);
    }
  };

  const handleAssign = async (orderId, driverId) => {
    try {
      await api.assignDelivery(orderId, { delivery_person_id: driverId });
      const updated = await api.orders({ supplier: supplierId });
      setOrders(updated);
      setShowAssign(null);
    } catch {
      alert('Failed to assign delivery.');
    }
  };

  return (
    <DashboardShell brand="FaidaYetu" brandSub="Poultry Logistics Hub" navItems={navItems}>
      <div className="fade-in">
        <div style={{ marginBottom: spacing.lg }}>
          <h1 style={{ fontSize: 28, fontWeight: 600, color: colors.primary }}>Orders</h1>
          <p style={{ fontSize: 15, color: colors.onSurfaceVariant }}>Manage incoming orders and fulfillment</p>
        </div>

        <div style={{ display: 'flex', gap: spacing.md, marginBottom: spacing.lg, flexWrap: 'wrap' }}>
          {['All', 'New', 'Processing', 'Ready', 'Delivered', 'Cancelled'].map(t => (
            <button key={t} onClick={() => setFilter(t)} style={{
              padding: '8px 20px', borderRadius: radius.round, border: 'none', cursor: 'pointer',
              background: t === filter ? colors.primary : colors.surfaceContainerHigh,
              color: t === filter ? colors.onPrimary : colors.onSurfaceVariant,
              fontWeight: 600, fontSize: 13,
            }}>{t}</button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: spacing.xxl, color: colors.onSurfaceVariant }}>Loading orders...</div>
        ) : (
          <div style={{ background: '#fff', borderRadius: radius.xl, border: `1px solid ${colors.outlineVariant}`, overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'rgba(193,236,212,0.3)' }}>
                    {['Order', 'Customer', 'Product', 'Amount', 'Status', 'Actions'].map(h => (
                      <th key={h} style={{ padding: spacing.md, fontSize: 13, fontWeight: 600, color: colors.onSurfaceVariant, borderBottom: `1px solid ${colors.outlineVariant}` }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(o => (
                    <tr key={o.id}>
                      <td style={{ padding: spacing.md, fontWeight: 700, color: colors.primary }}>#{o.id}</td>
                      <td style={{ padding: spacing.md }}>{o.customer_name}</td>
                      <td style={{ padding: spacing.md }}>{o.items?.[0]?.product_name || 'Poultry Products'}</td>
                      <td style={{ padding: spacing.md, fontWeight: 700 }}>{Number(o.total).toLocaleString()} TZS</td>
                      <td style={{ padding: spacing.md }}><StatusBadge status={o.status} /></td>
                      <td style={{ padding: spacing.md }}>
                        <button onClick={() => setSelectedOrder(o)} style={{ padding: '6px 14px', borderRadius: radius.md, background: colors.primary, color: colors.onPrimary, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 12, marginRight: 4 }}>View</button>
                        {o.status === 'ready' && (
                          <button onClick={() => openAssign(o)} style={{ padding: '6px 14px', borderRadius: radius.md, background: '#e67e22', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 12 }}>Assign</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* View Order Modal */}
      {selectedOrder && (
        <div style={modalOverlay} onClick={() => setSelectedOrder(null)}>
          <div style={modalBox} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: colors.primary }}>Order #{selectedOrder.id}</h3>
              <StatusBadge status={selectedOrder.status} />
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, color: colors.onSurfaceVariant, marginBottom: 8 }}>Date: {new Date(selectedOrder.created_at).toLocaleString()}</div>
              <div style={{ background: colors.surfaceContainerLow, borderRadius: 8, padding: 12 }}>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>Customer</div>
                <div style={{ fontSize: 14, color: colors.onSurfaceVariant }}>{selectedOrder.customer_name}</div>
                {selectedOrder.delivery_address && <div style={{ fontSize: 14, color: colors.onSurfaceVariant }}>📍 {selectedOrder.delivery_address}</div>}
              </div>
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

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {selectedOrder.status === 'new' && (
                <button onClick={() => handleStatusUpdate(selectedOrder.id, 'processing')} style={{ padding: '10px 20px', borderRadius: 8, background: colors.primary, color: colors.onPrimary, border: 'none', cursor: 'pointer', fontWeight: 700, flex: 1 }}>Accept & Process</button>
              )}
              {selectedOrder.status === 'processing' && (
                <button onClick={() => handleStatusUpdate(selectedOrder.id, 'ready')} style={{ padding: '10px 20px', borderRadius: 8, background: colors.primary, color: colors.onPrimary, border: 'none', cursor: 'pointer', fontWeight: 700, flex: 1 }}>Mark Ready</button>
              )}
              <button onClick={() => setSelectedOrder(null)} style={{ padding: '10px 20px', borderRadius: 8, background: 'none', border: `1px solid ${colors.outlineVariant}`, cursor: 'pointer', fontWeight: 600 }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Delivery Modal */}
      {showAssign && (
        <div style={modalOverlay} onClick={() => setShowAssign(null)}>
          <div style={modalBox} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: colors.primary }}>Assign Delivery — Order #{showAssign.id}</h3>
              <button onClick={() => setShowAssign(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: colors.onSurfaceVariant }}>✕</button>
            </div>
            <p style={{ fontSize: 14, color: colors.onSurfaceVariant, marginBottom: 16 }}>Available delivery personnel nearby:</p>

            {loadingDrivers ? (
              <div style={{ textAlign: 'center', padding: spacing.xl, color: colors.onSurfaceVariant }}>Loading nearby drivers...</div>
            ) : drivers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: spacing.xl, color: colors.onSurfaceVariant }}>No available drivers nearby. Try expanding the search radius or check back later.</div>
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
