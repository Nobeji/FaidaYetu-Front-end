import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import DashboardShell from '../../components/DashboardShell';
import StatusBadge from '../../components/StatusBadge';
import { api } from '../../services/api';
import { useToast } from '../../components/ToastContext';

const navItems = [
  { icon: '📊', label: 'Dashboard', nav: '/supplier' },
  { icon: '📦', label: 'Inventory', nav: '/supplier/inventory' },
  { icon: '🛒', label: 'Orders', nav: '/supplier/orders' },
  { icon: '📈', label: 'Analytics', nav: '/supplier/analytics' },
  { icon: '📉', label: 'Statistics', nav: '/supplier/statistics' },
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
  const toast = useToast();

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
      toast('Failed to update order status.', 'error');
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
    } catch (e) {
      toast(e.message || 'Failed to assign delivery.', 'error');
    }
  };

  return (
    <DashboardShell brand="FaidaYetu" brandSub="Poultry Logistics Hub" navItems={navItems}>
      <div className="fade-in">
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: 28, fontWeight: 600, color: '#000' }}>Orders</h1>
          <p style={{ fontSize: 15, color: '#888' }}>Manage incoming orders and fulfillment</p>
        </div>

        <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
          {['All', 'New', 'Paid', 'Processing', 'Ready', 'Delivered', 'Cancelled'].map(t => (
            <button key={t} onClick={() => setFilter(t)} style={{
              padding: '8px 20px', borderRadius: 999, border: 'none', cursor: 'pointer',
              background: t === filter ? '#000' : '#f5f5f5',
              color: t === filter ? '#fff' : '#888',
              fontWeight: 600, fontSize: 13,
            }}>{t}</button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 48, color: '#888' }}>Loading orders...</div>
        ) : (
          <div style={{ background: '#fff', borderRadius: 12, border: `1px solid ${'#eee'}`, overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'rgba(193,236,212,0.3)' }}>
                    {['Order', 'Customer', 'Product', 'Amount', 'Payment', 'Status', 'Actions'].map(h => (
                      <th key={h} style={{ padding: 12, fontSize: 13, fontWeight: 600, color: '#888', borderBottom: `1px solid ${'#eee'}` }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(o => (
                    <tr key={o.id}>
                      <td style={{ padding: 12, fontWeight: 700, color: '#000' }}>#{o.id}</td>
                      <td style={{ padding: 12 }}>{o.customer_name}</td>
                      <td style={{ padding: 12 }}>{o.items?.[0]?.product_name || '—'}</td>
                      <td style={{ padding: 12, fontWeight: 700 }}>{Number(o.total).toLocaleString()} TZS</td>
                      <td style={{ padding: 12 }}>
                        {o.paid
                          ? <span style={{ color: '#2e7d32', fontWeight: 600, fontSize: 13 }}>✓ Paid</span>
                          : <span style={{ color: '#d32f2f', fontWeight: 600, fontSize: 13 }}>Unpaid</span>
                        }
                      </td>
                      <td style={{ padding: 12 }}><StatusBadge status={o.status} /></td>
                      <td style={{ padding: 12 }}>
                        <button onClick={() => setSelectedOrder(o)} style={{ padding: '6px 14px', borderRadius: 8, background: '#000', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 12, marginRight: 4 }}>View</button>
                        {o.status === 'ready' && (
                          <button onClick={() => openAssign(o)} style={{ padding: '6px 14px', borderRadius: 8, background: '#e67e22', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 12 }}>Assign</button>
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
              <h3 style={{ fontSize: 20, fontWeight: 700, color: '#000' }}>Order #{selectedOrder.id}</h3>
              <StatusBadge status={selectedOrder.status} />
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>Date: {new Date(selectedOrder.created_at).toLocaleString()}</div>
              <div style={{ background: '#fafafa', borderRadius: 8, padding: 12 }}>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>Customer</div>
                <div style={{ fontSize: 14, color: '#888' }}>{selectedOrder.customer_name}</div>
                {selectedOrder.delivery_address && <div style={{ fontSize: 14, color: '#888' }}>📍 {selectedOrder.delivery_address}</div>}
              </div>
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

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {selectedOrder.status === 'ready' && (
                <button onClick={() => { setSelectedOrder(null); openAssign(selectedOrder); }} style={{ padding: '10px 20px', borderRadius: 8, background: '#e67e22', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700, flex: 1 }}>Assign Driver</button>
              )}
              {['new', 'ready'].includes(selectedOrder.status) && (
                <button onClick={() => handleStatusUpdate(selectedOrder.id, 'cancelled')} style={{ padding: '10px 20px', borderRadius: 8, background: '#fef2f2', color: '#d32f2f', border: '1px solid #fecaca', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
              )}
              <button onClick={() => setSelectedOrder(null)} style={{ padding: '10px 20px', borderRadius: 8, background: 'none', border: `1px solid ${'#eee'}`, cursor: 'pointer', fontWeight: 600 }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Delivery Modal */}
      {showAssign && (
        <div style={modalOverlay} onClick={() => setShowAssign(null)}>
          <div style={modalBox} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: '#000' }}>Assign Delivery — Order #{showAssign.id}</h3>
              <button onClick={() => setShowAssign(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#888' }}>✕</button>
            </div>
            <p style={{ fontSize: 14, color: '#888', marginBottom: 16 }}>Available delivery personnel nearby:</p>

            {loadingDrivers ? (
              <div style={{ textAlign: 'center', padding: 28, color: '#888' }}>Loading nearby drivers...</div>
            ) : drivers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 28, color: '#888' }}>No available drivers nearby. Try expanding the search radius or check back later.</div>
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
