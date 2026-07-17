import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Bell, TrendingUp, TrendingDown, Settings, HelpCircle, MapPin, Zap } from 'lucide-react';

import DashboardShell from '../../components/DashboardShell';
import StatusBadge from '../../components/StatusBadge';
import { api } from '../../services/api';
import { useToast } from '../../components/ToastContext';
import Spinner from '../../components/Spinner';
import { useLang } from '../../components/LanguageContext';

const modalOverlay = {
  position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex',
  alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16,
};
const modalBox = {
  background: '#fff', borderRadius: 16, padding: 24, width: '100%', maxWidth: 520,
  maxHeight: '90vh', overflow: 'auto',
};

export default function SupplierOrders() {
  const { t } = useLang();
  const navItems = [
    { icon: LayoutDashboard, label: t('nav.dashboard'), nav: '/supplier' },
    { icon: Package, label: t('nav.inventory'), nav: '/supplier/inventory' },
    { icon: ShoppingCart, label: t('nav.orders'), nav: '/supplier/orders' },
    { icon: Bell, label: t('nav.notifications'), nav: '/supplier/notifications' },
    { icon: TrendingUp, label: t('nav.analytics'), nav: '/supplier/analytics' },
    { icon: TrendingDown, label: t('nav.statistics'), nav: '/supplier/statistics' },
    { icon: Settings, label: t('nav.settings'), nav: '/supplier/settings' },
    { icon: HelpCircle, label: t('nav.support'), nav: '/supplier/support' },
  ];
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
  const [confirmingPayments, setConfirmingPayments] = useState({});
  const [assigningDrivers, setAssigningDrivers] = useState({});

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

  const handleAutoAssign = async (order) => {
    setAssigningDrivers(p => ({ ...p, [order.id]: true }));
    try {
      await api.autoAssignDelivery(order.id);
      toast('Driver auto-assigned! They have been notified.', 'success');
      const updated = await api.orders({ supplier: supplierId });
      setOrders(updated);
      setSelectedOrder(null);
    } catch (e) {
      const msg = e?.response?.data?.error || e?.message || 'Auto-assign failed.';
      toast(msg, 'error');
    } finally {
      setAssigningDrivers(p => ({ ...p, [order.id]: false }));
    }
  };

  const handleConfirmPayment = async (orderId) => {
    setConfirmingPayments(prev => ({ ...prev, [orderId]: true }));
    try {
      await api.manualConfirmPayment(orderId);
      const updated = await api.orders({ supplier: supplierId });
      setOrders(updated);
      setSelectedOrder(null);
      toast('Payment confirmed! Order is now Ready.', 'success');
    } catch (e) {
      toast(e.message || 'Failed to confirm payment.', 'error');
    } finally {
      setConfirmingPayments(prev => ({ ...prev, [orderId]: false }));
    }
  };

  const handleAssign = async (orderId, driverId) => {
    setAssigningDrivers(prev => ({ ...prev, [driverId]: true }));
    try {
      await api.assignDelivery(orderId, { delivery_person_id: driverId });
      const updated = await api.orders({ supplier: supplierId });
      setOrders(updated);
      setShowAssign(null);
    } catch (e) {
      toast(e.message || 'Failed to assign delivery.', 'error');
    } finally {
      setAssigningDrivers(prev => ({ ...prev, [driverId]: false }));
    }
  };

  return (
    <DashboardShell brand="FaidaYetu" brandSub="Poultry Logistics Hub" navItems={navItems}>
      <div className="fade-in">
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: 28, fontWeight: 600, color: '#000' }}>{t('nav.orders')}</h1>
          <p style={{ fontSize: 15, color: '#888' }}>Manage incoming orders and fulfillment</p>
        </div>

        <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
          {['All', 'New', 'Paid', 'Processing', 'Ready', 'Delivered', 'Cancelled'].map(filterKey => (
            <button key={filterKey} onClick={() => setFilter(filterKey)} style={{
              padding: '8px 20px', borderRadius: 999, border: 'none', cursor: 'pointer',
              background: filterKey === filter ? '#000' : '#f5f5f5',
              color: filterKey === filter ? '#fff' : '#888',
              fontWeight: 600, fontSize: 13,
            }}>{filterKey}</button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 48, color: '#888' }}>{t('common.loading')}</div>
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
                          ? <span style={{ color: '#2e7d32', fontWeight: 600, fontSize: 13 }}>✓ {t('common.paid')}</span>
                          : <span style={{ color: '#d32f2f', fontWeight: 600, fontSize: 13 }}>Unpaid</span>
                        }
                      </td>
                      <td style={{ padding: 12 }}><StatusBadge status={o.status} /></td>
                      <td style={{ padding: 12 }}>
                        <button onClick={() => setSelectedOrder(o)} style={{ padding: '6px 14px', borderRadius: 8, background: '#000', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 12, marginRight: 4 }}>{t('common.details')}</button>
                        {!o.paid && o.status !== 'cancelled' && o.status !== 'delivered' && (
                          <button onClick={() => handleConfirmPayment(o.id)} disabled={confirmingPayments[o.id]} style={{ padding: '6px 14px', borderRadius: 8, background: '#0a6e46', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 12, marginRight: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                            {confirmingPayments[o.id] && <Spinner size={10} color="#fff" />}
                            {t('common.payNow')}
                          </button>
                        )}
                        {o.status === 'ready' && (
                          <button onClick={() => handleAutoAssign(o)} disabled={assigningDrivers[o.id]} style={{ padding: '6px 14px', borderRadius: 8, background: '#e67e22', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                            {assigningDrivers[o.id] && <Spinner size={10} color="#fff" />}
                            <Zap size={12} /> {t('common.autoAssign') || 'Auto-Assign'}
                          </button>
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
                  {selectedOrder.delivery_address && <div style={{ fontSize: 14, color: '#888', display: 'flex', alignItems: 'center', gap: 6 }}><MapPin size={14} /> {selectedOrder.delivery_address}</div>}
                  {selectedOrder.delivery_area && <div style={{ fontSize: 13, color: '#888', marginTop: 4 }}>Area: {selectedOrder.delivery_area}</div>}
                  {selectedOrder.delivery_street && <div style={{ fontSize: 13, color: '#888' }}>Street: {selectedOrder.delivery_street}</div>}
                  {selectedOrder.delivery_city && <div style={{ fontSize: 13, color: '#888' }}>City: {selectedOrder.delivery_city}</div>}
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
                <button onClick={() => handleAutoAssign(selectedOrder)} disabled={assigningDrivers[selectedOrder.id]} style={{ padding: '10px 20px', borderRadius: 8, background: '#e67e22', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  {assigningDrivers[selectedOrder.id] && <Spinner size={12} color="#fff" />}
                  <Zap size={14} /> {t('common.autoAssign') || 'Auto-Assign Driver'}
                </button>
              )}
              {['new', 'ready'].includes(selectedOrder.status) && (
                <button onClick={() => handleStatusUpdate(selectedOrder.id, 'cancelled')} disabled={confirmingPayments[selectedOrder.id]} style={{ padding: '10px 20px', borderRadius: 8, background: '#fef2f2', color: '#d32f2f', border: '1px solid #fecaca', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                  {confirmingPayments[selectedOrder.id] && <Spinner size={12} color="#d32f2f" />}
                  {t('common.cancel')}
                </button>
              )}
              <button onClick={() => setSelectedOrder(null)} style={{ padding: '10px 20px', borderRadius: 8, background: 'none', border: `1px solid ${'#eee'}`, cursor: 'pointer', fontWeight: 600 }}>{t('common.close')}</button>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
