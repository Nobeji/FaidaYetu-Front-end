import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardShell from '../../components/DashboardShell';
import StatusBadge from '../../components/StatusBadge';
import MapComponent from '../../components/MapComponent';
import { api } from '../../services/api';
import { useToast } from '../../components/ToastContext';
import Spinner from '../../components/Spinner';
import { Home, ShoppingCart, ClipboardList, Bell, User, Package, Clock, MapPin, FileText, Star } from 'lucide-react';
import { useLang } from '../../components/LanguageContext';

const modalOverlay = {
  position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex',
  alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16,
};
const modalBox = {
  background: '#fff', borderRadius: 16, padding: 24, width: '100%', maxWidth: 480,
  maxHeight: '90vh', overflow: 'auto',
};

export default function MyOrders() {
  const { t } = useLang();
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
  const [pendingPayments, setPendingPayments] = useState({});
  const pollRefs = useRef({});
  const [checkingPayments, setCheckingPayments] = useState({});
  const [cancellingOrders, setCancellingOrders] = useState({});
  const [driverLocation, setDriverLocation] = useState(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userName = user.username || 'Customer';
  const initials = userName.charAt(0).toUpperCase();
  const navigate = useNavigate();
  const toast = useToast();

  const customerId = JSON.parse(localStorage.getItem('customer') || '{}').id || 1;

  const navItems = [
    { icon: Home, label: t('nav.explore'), nav: '/customer' },
    { icon: ShoppingCart, label: t('nav.marketplace'), nav: '/customer/marketplace' },
    { icon: ClipboardList, label: t('nav.myOrders'), nav: '/customer/orders' },
    { icon: Bell, label: t('nav.notifications'), nav: '/customer/notifications' },
    { icon: User, label: t('nav.profile'), nav: '/customer/profile' },
  ];

  const filters = ['All', 'new', 'paid', 'processing', 'delivered', 'cancelled'];

  useEffect(() => {
    if (!selectedOrder || selectedOrder.status !== 'in_transit' || !selectedOrder.delivery_id) {
      setDriverLocation(null);
      return;
    }
    const poll = () => {
      api.latestLocation(selectedOrder.delivery_id).then(loc => {
        if (loc?.lat != null && loc?.lng != null) setDriverLocation([loc.lat, loc.lng]);
      }).catch(() => {});
    };
    poll();
    const id = setInterval(poll, 5000);
    return () => clearInterval(id);
  }, [selectedOrder?.id, selectedOrder?.status, selectedOrder?.delivery_id]);

  useEffect(() => {
    api.orders({ customer: customerId }).then(o => {
      setOrders(o);
      setLoading(false);
      const pending = {};
      o.forEach(ord => { if (ord.payment_status === 'pending') pending[ord.id] = 'pending'; });
      setPendingPayments(pending);
      Object.keys(pending).forEach(id => startPolling(Number(id)));
    }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    return () => Object.values(pollRefs.current).forEach(clearInterval);
  }, []);

  const checkPaymentStatus = async (orderId) => {
    setCheckingPayments(prev => ({ ...prev, [orderId]: true }));
    try {
      const res = await api.paymentStatus(orderId);
      if (res.paid) {
        setPendingPayments(prev => { const n = {...prev}; delete n[orderId]; return n; });
        const updated = await api.orders({ customer: customerId });
        setOrders(updated);
        toast('Payment confirmed!', 'success');
      } else if (res.status === 'failed') {
        setPendingPayments(prev => { const n = {...prev}; delete n[orderId]; return n; });
        toast('Payment failed. You can try again.', 'error');
      } else {
        toast('Still pending. If USSD did not arrive, try paying again.', 'info');
      }
    } catch {
      toast('Could not check payment status.', 'error');
    } finally {
      setCheckingPayments(prev => ({ ...prev, [orderId]: false }));
    }
  };

  const startPolling = (orderId) => {
    if (pollRefs.current[orderId]) return;
    let attempts = 0;
    pollRefs.current[orderId] = setInterval(async () => {
      attempts++;
      if (attempts > 12) {
        clearInterval(pollRefs.current[orderId]);
        delete pollRefs.current[orderId];
        return;
      }
      try {
        const res = await api.paymentStatus(orderId);
        if (res.paid) {
          clearInterval(pollRefs.current[orderId]);
          delete pollRefs.current[orderId];
          setPendingPayments(prev => { const n = {...prev}; delete n[orderId]; return n; });
          const updated = await api.orders({ customer: customerId });
          setOrders(updated);
        } else if (res.status === 'failed') {
          clearInterval(pollRefs.current[orderId]);
          delete pollRefs.current[orderId];
          setPendingPayments(prev => { const n = {...prev}; delete n[orderId]; return n; });
          toast('Payment failed. You can try again.', 'error');
        }
      } catch {}
    }, 10000);
  };

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
      toast('Enter a valid phone number (e.g. 255712345678)', 'error');
      return;
    }
    if (!phoneNumber.startsWith('255')) {
      toast('Phone number must start with 255 (e.g. 255712345678)', 'error');
      return;
    }
    setPaying(true);
    try {
      const result = await api.initiatePayment({ order_id: showPayModal.id, phone: phoneNumber });
      if (result.success) {
        toast(result.message || 'Payment push sent! Check your phone.', 'success');
        setShowPayModal(null);
        setPendingPayments(prev => ({ ...prev, [showPayModal.id]: 'pending' }));
        startPolling(showPayModal.id);
        const updated = await api.orders({ customer: customerId });
        setOrders(updated);
      } else {
        toast(result.error || 'Payment failed', 'error');
      }
    } catch (e) {
      toast(e.message || 'Payment failed. Try again.', 'error');
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
          <h1 style={{ fontSize: 28, fontWeight: 600, color: '#000' }}>{t('orders.title')}</h1>
          <p style={{ fontSize: 15, color: '#888' }}>{t('orders.subtitle')}</p>
        </div>

        <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '8px 20px', borderRadius: 999, border: 'none', cursor: 'pointer',
              background: f === filter ? '#000' : '#f5f5f5',
              color: f === filter ? '#fff' : '#888',
              fontWeight: 600, fontSize: 13, textTransform: 'capitalize',
            }}>{f === 'new' ? t('common.newLabel') : f === 'processing' ? t('common.active') : f.charAt(0).toUpperCase() + f.slice(1)}</button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 48, color: '#888' }}>{t('common.loading')}</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 48, color: '#888' }}>{t('orders.noOrders')}</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.map(o => (
              <div key={o.id} style={{ display: 'flex', gap: 12, background: '#fff', padding: 12, borderRadius: 12, border: `1px solid ${'#eee'}`, alignItems: 'center' }}>
                <div style={{ width: 80, height: 80, borderRadius: 8, background: '#f0f0f0', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Package size={28} /></div>
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
                      <button onClick={() => setSelectedOrder(o)} style={{ padding: '6px 14px', borderRadius: 8, border: `1px solid ${'#000'}`, background: 'none', color: '#000', cursor: 'pointer', fontWeight: 600, fontSize: 12 }}>{t('common.details')}</button>
                      {o.status === 'new' && !o.paid && !pendingPayments[o.id] && (
                        <button onClick={() => { setShowPayModal(o); setPhoneNumber(''); }} style={{ padding: '6px 14px', borderRadius: 8, background: '#0a6e46', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 12 }}>{t('common.payNow')}</button>
                      )}
                      {pendingPayments[o.id] === 'pending' && (
                        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', alignItems: 'center' }}>
                          <span style={{ padding: '6px 14px', borderRadius: 8, background: '#fff8e1', color: '#f57f17', fontWeight: 600, fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={12} /> {t('common.pending')}</span>
                          <button onClick={() => checkPaymentStatus(o.id)} disabled={checkingPayments[o.id]} style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid #f57f17', background: '#fff', color: '#f57f17', cursor: 'pointer', fontWeight: 600, fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                            {checkingPayments[o.id] && <Spinner size={10} color="#f57f17" />}
                            {t('common.confirm')}
                          </button>
                        </div>
                      )}
                      {o.paid && (
                        <span style={{ padding: '6px 14px', borderRadius: 8, background: '#e8f5e9', color: '#2e7d32', fontWeight: 600, fontSize: 12 }}>✓ {t('common.paid')}</span>
                      )}
                      {o.status === 'in_transit' && <button onClick={() => navigate('/customer')} style={{ padding: '6px 14px', borderRadius: 8, background: '#000', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 12 }}>{t('common.track')}</button>}
                      {!o.delivery && ['new', 'processing'].includes(o.status) && o.paid && (
                        <button onClick={() => openAssign(o)} style={{ padding: '6px 14px', borderRadius: 8, background: '#e67e22', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 12 }}>{t('orders.assignDriver')}</button>
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
              <h3 style={{ fontSize: 20, fontWeight: 700, color: '#000' }}>{t('orders.order')} #{selectedOrder.id}</h3>
              <StatusBadge status={selectedOrder.status} />
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, color: '#888', marginBottom: 4 }}>{t('orders.supplier')}: <strong>{selectedOrder.supplier_name}</strong></div>
              <div style={{ fontSize: 13, color: '#888', marginBottom: 4 }}>{t('orders.date')}: {new Date(selectedOrder.created_at).toLocaleString()}</div>
              {selectedOrder.delivery_address && <div style={{ fontSize: 13, color: '#888', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={14} /> {selectedOrder.delivery_address}</div>}
              {selectedOrder.notes && <div style={{ fontSize: 13, color: '#888', display: 'flex', alignItems: 'center', gap: 4 }}><FileText size={14} /> {selectedOrder.notes}</div>}
            </div>

            <div style={{ marginBottom: 16 }}>
              <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{t('orders.items')}</h4>
              {(selectedOrder.items || []).map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: `1px solid ${'#eee'}` }}>
                  <span>{item.product_name} x{item.quantity}</span>
                  <span style={{ fontWeight: 600 }}>{Number(item.price).toLocaleString()} TZS</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontWeight: 700, fontSize: 16 }}>
                <span>{t('orders.total')}</span>
                <span style={{ color: '#000' }}>{Number(selectedOrder.total).toLocaleString()} TZS</span>
              </div>
            </div>

            {selectedOrder.status === 'in_transit' && selectedOrder.delivery_id && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  <MapPin size={14} color="#0a6e46" />
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: 0 }}>{t('orders.driverLocation')}</h4>
                  {driverLocation && <span style={{ fontSize: 11, color: '#15803d', fontWeight: 600 }}>Updating</span>}
                </div>
                <div style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                  <MapComponent
                    height={220}
                    userLocation={driverLocation || [-6.7924, 39.2083]}
                    driverLocation={driverLocation}
                    routePoints={
                      selectedOrder.delivery_lat && selectedOrder.delivery_lng
                        ? [driverLocation, [selectedOrder.delivery_lat, selectedOrder.delivery_lng]].filter(Boolean)
                        : []
                    }
                  />
                </div>
                {!driverLocation && (
                  <div style={{ textAlign: 'center', padding: 12, color: '#94a3b8', fontSize: 12 }}>
                    Waiting for driver location updates...
                  </div>
                )}
              </div>
            )}

            <button onClick={() => setSelectedOrder(null)} style={{ width: '100%', padding: '12px', borderRadius: 8, background: '#000', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700 }}>{t('common.close')}</button>
          </div>
        </div>
      )}

      {/* Assign Delivery Modal */}
      {/* Payment Modal */}
      {showPayModal && (
        <div style={modalOverlay} onClick={() => !paying && setShowPayModal(null)}>
          <div style={modalBox} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: '#000' }}>{t('payment.payForOrder')} #{showPayModal.id}</h3>
              <button onClick={() => !paying && setShowPayModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#888' }}>✕</button>
            </div>
            <p style={{ fontSize: 14, color: '#666', marginBottom: 16 }}>
              {t('payment.amount')}: <strong style={{ color: '#000' }}>{Number(showPayModal.total).toLocaleString()} TZS</strong>
              <br />
              {t('payment.phonePrompt')}
            </p>
            <input
              type="tel"
              placeholder={t('payment.phonePlaceholder')}
              value={phoneNumber}
              onChange={e => setPhoneNumber(e.target.value)}
              disabled={paying}
              style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: '1px solid #ddd', fontSize: 16, boxSizing: 'border-box', marginBottom: 16 }}
            />
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setShowPayModal(null)} disabled={paying} style={{ flex: 1, padding: '12px', borderRadius: 8, border: '1px solid #ddd', background: '#fff', color: '#666', cursor: 'pointer', fontWeight: 600 }}>{t('common.cancel')}</button>
              <button onClick={handlePay} disabled={paying} style={{ flex: 1, padding: '12px', borderRadius: 8, background: '#0a6e46', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700, opacity: paying ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                {paying && <Spinner size={14} color="#fff" />}
                {paying ? t('payment.sending') : `Pay ${Number(showPayModal.total).toLocaleString()} TZS`}
              </button>
            </div>
          </div>
        </div>
      )}

      {showAssign && (
        <div style={modalOverlay} onClick={() => setShowAssign(null)}>
          <div style={modalBox} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: '#000' }}>{t('orders.assignDriver')} — {t('orders.order')} #{showAssign.id}</h3>
              <button onClick={() => setShowAssign(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#888' }}>✕</button>
            </div>
            <p style={{ fontSize: 14, color: '#888', marginBottom: 16 }}>{t('orders.nearbyDrivers')}</p>

            {loadingDrivers ? (
              <div style={{ textAlign: 'center', padding: 28, color: '#888' }}>{t('common.loading')}</div>
            ) : drivers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 28, color: '#888' }}>{t('orders.noDrivers')}</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {drivers.map(d => (
                  <div key={d.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 12, borderRadius: 8, border: `1px solid ${'#eee'}`, background: '#fafafa' }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{d.profile?.user?.username || `Driver #${d.id}`}</div>
                      <div style={{ fontSize: 12, color: '#888', display: 'flex', alignItems: 'center', gap: 4 }}>
                        {d.vehicle_type} • <Star size={14} fill="#f59e0b" color="#f59e0b" /> {d.rating || 'N/A'} • {d.total_routes || 0} {t('orders.routes')}
                      </div>
                    </div>
                    <button onClick={() => handleAssign(showAssign.id, d.id)} style={{ padding: '8px 16px', borderRadius: 8, background: '#000', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>{t('common.confirm')}</button>
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
