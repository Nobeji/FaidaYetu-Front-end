import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ShoppingCart, ClipboardList, Bell, User, FileText, Clipboard, Truck, Search, MapPin } from 'lucide-react';
import DashboardShell from '../components/DashboardShell';
import SupplierCard from '../components/SupplierCard';
import MapComponent from '../components/MapComponent';
import LocationPicker from '../components/LocationPicker';
import { api } from '../services/api';
import { useToast } from '../components/ToastContext';
import Spinner from '../components/Spinner';
import { useLang } from '../components/LanguageContext';

export default function CustomerDashboard() {
  const { t } = useLang();
  const [suppliers, setSuppliers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState(() => JSON.parse(localStorage.getItem('customer') || '{}'));
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const profile = JSON.parse(localStorage.getItem('profile') || '{}');
  const initialLat = profile.lat || -6.7924;
  const initialLng = profile.lng || 39.2083;
  const [userLocation, setUserLocation] = useState([initialLat, initialLng]);
  const [search, setSearch] = useState('');
  const [radiusFilter, setRadiusFilter] = useState(50);
  const [driverLocation, setDriverLocation] = useState(null);
  const userName = user.username || 'Customer';
  const initials = userName.charAt(0).toUpperCase();
  const navigate = useNavigate();
  const toast = useToast();
  const [showPayModal, setShowPayModal] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paying, setPaying] = useState(false);
  const [pendingPayments, setPendingPayments] = useState({});
  const pollRefs = useRef({});
  const [isMobile, setIsMobile] = useState(false);
  const [editLocation, setEditLocation] = useState(false);
  const [editCoords, setEditCoords] = useState({ lat: initialLat, lng: initialLng });
  const [savingLocation, setSavingLocation] = useState(false);
  const [checkingPayments, setCheckingPayments] = useState({});
  const [cancellingOrders, setCancellingOrders] = useState({});

  const navItems = [
    { icon: Home, label: t('nav.explore'), nav: '/customer' },
    { icon: ShoppingCart, label: t('nav.marketplace'), nav: '/customer/marketplace' },
    { icon: ClipboardList, label: t('nav.myOrders'), nav: '/customer/orders' },
    { icon: Bell, label: t('nav.notifications'), nav: '/customer/notifications' },
    { icon: User, label: t('nav.profile'), nav: '/customer/profile' },
    { icon: FileText, label: t('nav.tamSurvey'), nav: '/customer/tam-survey' },
    { icon: Clipboard, label: t('nav.susSurvey'), nav: '/customer/sus-survey' },
  ];

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const handlePay = async () => {
    if (!phoneNumber || phoneNumber.length < 10) { toast('Enter a valid phone number (e.g. 255712345678)', 'error'); return; }
    if (!phoneNumber.startsWith('255')) { toast('Phone number must start with 255 (e.g. 255712345678)', 'error'); return; }
    setPaying(true);
    try {
      const result = await api.initiatePayment({ order_id: showPayModal.id, phone: phoneNumber });
      if (result.success) {
        toast(result.message || 'Payment push sent! Check your phone.', 'success');
        setShowPayModal(null);
        setPendingPayments(prev => ({ ...prev, [showPayModal.id]: 'pending' }));
        startPolling(showPayModal.id);
        const cid = JSON.parse(localStorage.getItem('customer') || '{}').id || 1;
        const updated = await api.orders({ customer: cid });
        setOrders(updated);
      } else { toast(result.error || 'Payment failed', 'error'); }
    } catch (e) { toast(e.message || 'Payment failed. Try again.', 'error'); }
    finally { setPaying(false); }
  };

  const handleCancelOrder = async (id) => {
    setCancellingOrders(prev => ({ ...prev, [id]: true }));
    try {
      await api.updateOrder(id, { status: 'cancelled' });
      const cid = customer.id || JSON.parse(localStorage.getItem('customer') || '{}').id || 1;
      const updated = await api.orders({ customer: cid });
      setOrders(updated);
    } catch { toast('Failed to cancel order.', 'error'); }
    finally { setCancellingOrders(prev => ({ ...prev, [id]: false })); }
  };

  const canCancel = (status) => ['new', 'processing'].includes(status);

  useEffect(() => {
    api.profile().then(profileData => {
      localStorage.setItem('profile', JSON.stringify(profileData));
      if (profileData.customer) { localStorage.setItem('customer', JSON.stringify(profileData.customer)); setCustomer(profileData.customer); }
    }).catch(() => {});
    const profileData = JSON.parse(localStorage.getItem('profile') || '{}');
    if (!profileData.lat || !profileData.lng) {
      navigator.geolocation.getCurrentPosition(
        pos => { setUserLocation([pos.coords.latitude, pos.coords.longitude]); setEditCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }); },
        () => {}
      );
    }
  }, []);

  useEffect(() => {
    const cid = customer.id || 1;
    const cacheKey = `customer_dashboard_${cid}`;
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      try {
        const { suppliers: s, orders: o, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < 2 * 60 * 1000) { setSuppliers(s); setOrders(o); setLoading(false); }
      } catch {}
    }
    Promise.all([
      api.suppliers({ lat: userLocation[0], lng: userLocation[1], radius: radiusFilter }),
      api.orders({ customer: cid }),
    ]).then(([s, o]) => {
      setSuppliers(s); setOrders(o); setLoading(false);
      sessionStorage.setItem(cacheKey, JSON.stringify({ suppliers: s, orders: o, timestamp: Date.now() }));
    }).catch(() => setLoading(false));
  }, [customer.id, userLocation, radiusFilter]);

  useEffect(() => {
    const cid = customer.id || JSON.parse(localStorage.getItem('customer') || '{}').id || 1;
    const interval = setInterval(() => {
      api.orders({ customer: cid }).then(o => {
        setOrders(o);
        const pending = {};
        o.forEach(ord => { if (ord.payment_status === 'pending') pending[ord.id] = 'pending'; });
        setPendingPayments(pending);
      }).catch(() => {});
    }, 30000);
    return () => clearInterval(interval);
  }, [customer.id]);

  const activeOrder = orders.find(o => ['in_transit', 'assigned', 'picked_up'].includes(o.status));

  useEffect(() => {
    if (!activeOrder?.delivery_id) { setDriverLocation(null); return; }
    const poll = () => { api.latestLocation(activeOrder.delivery_id).then(loc => { if (loc?.lat != null && loc?.lng != null) setDriverLocation([loc.lat, loc.lng]); }).catch(() => {}); };
    poll();
    const id = setInterval(poll, 5000);
    return () => clearInterval(id);
  }, [activeOrder?.delivery_id]);

  useEffect(() => { return () => Object.values(pollRefs.current).forEach(clearInterval); }, []);

  const checkPaymentStatus = async (orderId) => {
    setCheckingPayments(prev => ({ ...prev, [orderId]: true }));
    const cid = JSON.parse(localStorage.getItem('customer') || '{}').id || 1;
    try {
      const res = await api.paymentStatus(orderId);
      if (res.paid) {
        setPendingPayments(prev => { const n = {...prev}; delete n[orderId]; return n; });
        const updated = await api.orders({ customer: cid }); setOrders(updated); toast('Payment confirmed!', 'success');
      } else if (res.status === 'failed') {
        setPendingPayments(prev => { const n = {...prev}; delete n[orderId]; return n; }); toast('Payment failed. You can try again.', 'error');
      } else {
        const verify = await api.verifyPayment(orderId);
        if (verify.paid) { setPendingPayments(prev => { const n = {...prev}; delete n[orderId]; return n; }); const updated = await api.orders({ customer: cid }); setOrders(updated); toast('Payment confirmed!', 'success'); }
        else { toast('Still pending. If USSD did not arrive, try paying again.', 'info'); }
      }
    } catch { toast('Could not check payment status.', 'error'); }
    finally { setCheckingPayments(prev => ({ ...prev, [orderId]: false })); }
  };

  const startPolling = (orderId) => {
    if (pollRefs.current[orderId]) return;
    let attempts = 0;
    pollRefs.current[orderId] = setInterval(async () => {
      attempts++;
      if (attempts > 12) { clearInterval(pollRefs.current[orderId]); delete pollRefs.current[orderId]; return; }
      try {
        let paid = false;
        const res = await api.paymentStatus(orderId);
        if (res.paid) { paid = true; } else if (res.status === 'pending') { const verify = await api.verifyPayment(orderId); paid = verify.paid; }
        if (paid) { clearInterval(pollRefs.current[orderId]); delete pollRefs.current[orderId]; setPendingPayments(prev => { const n = {...prev}; delete n[orderId]; return n; }); const cid = JSON.parse(localStorage.getItem('customer') || '{}').id || 1; const updated = await api.orders({ customer: cid }); setOrders(updated); }
        else if (res.status === 'failed') { clearInterval(pollRefs.current[orderId]); delete pollRefs.current[orderId]; setPendingPayments(prev => { const n = {...prev}; delete n[orderId]; return n; }); toast('Payment failed. You can try again.', 'error'); }
      } catch {}
    }, 10000);
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return null;
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const getDistanceStr = (s) => {
    const sLat = s.profile?.lat || s.lat; const sLng = s.profile?.lng || s.lng;
    const dist = calculateDistance(userLocation[0], userLocation[1], sLat, sLng);
    if (dist === null) return "Nearby";
    if (dist < 1) return `${Math.round(dist * 1000)} m`;
    return `${dist.toFixed(1)} km`;
  };

  const getDistance = (s) => {
    const sLat = s.profile?.lat || s.lat; const sLng = s.profile?.lng || s.lng;
    return calculateDistance(userLocation[0], userLocation[1], sLat, sLng);
  };

  const filtered = search ? suppliers.filter(s => s.business_name?.toLowerCase().includes(search.toLowerCase())) : suppliers;
  const sortedSuppliers = [...filtered].sort((a, b) => (getDistance(a) || Infinity) - (getDistance(b) || Infinity));

  return (
    <DashboardShell brand="FaidaYetu" brandSub="Customer Portal" navItems={navItems} profile={
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#f8fafc', padding: '8px 12px', borderRadius: 10, border: '1px solid #e2e8f0' }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #0a6e46, #10b981)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 13, boxShadow: '0 2px 6px rgba(10,110,70,0.2)' }}>{initials}</div>
        <div>
          <div style={{ fontWeight: 600, fontSize: 13, color: '#0f172a' }}>{userName}</div>
          <div style={{ fontSize: 11, color: '#94a3b8' }}>Customer Portal</div>
        </div>
      </div>
    }>
      <div>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: isMobile ? 18 : 22, fontWeight: 700, color: '#0f172a', margin: 0 }}>{t('dashboard.findPoultry')}</h1>
          <p style={{ fontSize: 13, color: '#64748b', margin: '4px 0 0' }}>{t('dashboard.discoverNearby')}</p>
        </div>

        {activeOrder && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, marginBottom: 20, flexWrap: 'wrap', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Truck size={16} color="#0a6e46" />
              <span style={{ fontSize: 13, color: '#0f172a' }}>{t('dashboard.activeInTransit')}</span>
            </div>
            <button onClick={() => navigate('/customer/orders')} style={{ fontSize: 12, fontWeight: 600, padding: '6px 16px', border: '1px solid #e2e8f0', borderRadius: 20, background: '#fff', color: '#475569', cursor: 'pointer' }}>{t('dashboard.trackLive')}</button>
          </div>
        )}

        <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexDirection: isMobile ? 'column' : 'row' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}><Search size={14} /></span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t('common.search') + ' supplier...'} style={{ width: '100%', padding: '10px 14px 10px 38px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff', boxSizing: 'border-box', outline: 'none', fontSize: 13, color: '#0f172a' }} />
          </div>
          <select value={radiusFilter} onChange={e => setRadiusFilter(Number(e.target.value))} style={{ padding: '10px 14px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff', fontSize: 13, fontWeight: 500, color: '#0f172a', outline: 'none' }}>
            <option value={10}>10 km</option>
            <option value={25}>25 km</option>
            <option value={50}>50 km</option>
            <option value={100}>100 km</option>
          </select>
        </div>

        <div style={{ marginBottom: 20, borderRadius: 10, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
          {editLocation ? (
            <>
              <LocationPicker lat={editCoords.lat} lng={editCoords.lng} height={isMobile ? 240 : 340} onChange={(lat, lng) => setEditCoords({ lat, lng })} />
              <div style={{ display: 'flex', gap: 8, padding: 10, borderTop: '1px solid #e2e8f0', background: '#fff' }}>
                <button onClick={() => { setEditLocation(false); setEditCoords({ lat: userLocation[0], lng: userLocation[1] }); }} style={{ flex: 1, padding: '8px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontWeight: 500, fontSize: 12, color: '#475569' }}>{t('common.cancel')}</button>
                <button onClick={async () => {
                  setSavingLocation(true);
                  try {
                    await api.updateProfile({ lat: editCoords.lat, lng: editCoords.lng });
                    const updated = await api.profile(); localStorage.setItem('profile', JSON.stringify(updated));
                    setUserLocation([editCoords.lat, editCoords.lng]); setEditLocation(false); toast('Location updated!', 'success');
                  } catch { toast('Failed to update location.', 'error'); }
                  finally { setSavingLocation(false); }
                }} disabled={savingLocation} style={{ flex: 1, padding: '8px', borderRadius: 8, background: '#0a6e46', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 12, opacity: savingLocation ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  {savingLocation && <Spinner size={12} color="#fff" />}
                  {savingLocation ? 'Saving...' : 'Save Location'}
                </button>
              </div>
            </>
          ) : (
            <>
              <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 999 }}>
                <button onClick={() => { setEditCoords({ lat: userLocation[0], lng: userLocation[1] }); setEditLocation(true); }} style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 11, fontWeight: 600, color: '#475569', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
                  <MapPin size={12} /> {isMobile ? 'Update' : 'Update My Location'}
                </button>
              </div>
              <MapComponent height={isMobile ? 240 : 340} userLocation={userLocation} suppliers={filtered} radiusKm={radiusFilter} driverLocation={driverLocation} />
            </>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', margin: 0 }}>{t('dashboard.recommended')}</h3>
          <span onClick={() => navigate('/customer/marketplace')} style={{ fontSize: 12, fontWeight: 600, color: '#0a6e46', cursor: 'pointer' }}>{t('common.viewAll')} →</span>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>{t('common.loading')}</div>
        ) : (
          <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 4 }}>
            {sortedSuppliers.map(s => (
              <SupplierCard key={s.id} id={s.id} name={s.business_name} rating={s.rating} distance={getDistanceStr(s)} price="From supplier" img={s.image} />
            ))}
          </div>
        )}

        {orders.length > 0 && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, marginTop: 32 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', margin: 0 }}>{t('dashboard.recentOrders')}</h3>
              <span onClick={() => navigate('/customer/orders')} style={{ fontSize: 12, fontWeight: 600, color: '#0a6e46', cursor: 'pointer' }}>{t('common.viewAll')} →</span>
            </div>
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
              {orders.slice(0, 5).map((o, i) => (
                <div key={o.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: i < orders.slice(0, 5).length - 1 ? '1px solid #f1f5f9' : 'none', flexWrap: 'wrap', gap: 8 }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13, color: '#0f172a' }}>{o.supplier_name || `Order #${o.id}`}</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>{Number(o.total).toLocaleString()} TZS • {o.status}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <button onClick={() => navigate('/customer/orders')} style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontWeight: 500, fontSize: 11, color: '#475569' }}>{t('common.details')}</button>
                    {o.status === 'new' && !o.paid && !pendingPayments[o.id] && (
                      <button onClick={() => { setShowPayModal(o); setPhoneNumber(''); }} style={{ padding: '6px 12px', borderRadius: 8, background: '#0a6e46', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 11 }}>{t('common.payNow')}</button>
                    )}
                    {pendingPayments[o.id] === 'pending' && (
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', alignItems: 'center' }}>
                        <span style={{ padding: '6px 12px', borderRadius: 8, background: '#fef9c3', color: '#a16207', fontWeight: 600, fontSize: 11 }}>⌛ {t('common.pending')}</span>
                        <button onClick={() => checkPaymentStatus(o.id)} disabled={checkingPayments[o.id]} style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid #fde68a', background: '#fff', color: '#a16207', cursor: 'pointer', fontWeight: 600, fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}>
                          {checkingPayments[o.id] && <Spinner size={10} color="#a16207" />}{t('common.confirm')}
                        </button>
                      </div>
                    )}
                    {o.paid && <span style={{ padding: '6px 12px', borderRadius: 8, background: '#f0fdf4', color: '#15803d', fontWeight: 600, fontSize: 11 }}>✓ {t('common.paid')}</span>}
                    {o.status === 'cancelled' && <span style={{ padding: '6px 12px', borderRadius: 8, background: '#fef2f2', color: '#dc2626', fontWeight: 600, fontSize: 11 }}>✕ {t('common.cancelled')}</span>}
                    {canCancel(o.status) && (
                      <button onClick={() => handleCancelOrder(o.id)} disabled={cancellingOrders[o.id]} style={{ padding: '6px 12px', borderRadius: 8, background: '#fef2f2', color: '#dc2626', border: 'none', cursor: 'pointer', fontWeight: 500, fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}>
                        {cancellingOrders[o.id] && <Spinner size={10} color="#dc2626" />}{t('common.cancel')}
                      </button>
                    )}
                    {o.status === 'in_transit' && (
                      <button onClick={() => navigate('/customer')} style={{ padding: '6px 12px', borderRadius: 8, background: '#000', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 500, fontSize: 11 }}>{t('common.track')}</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {showPayModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }} onClick={() => !paying && setShowPayModal(null)}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 24, width: '100%', maxWidth: 440, border: '1px solid #e2e8f0' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', margin: 0 }}>{t('payment.payForOrder')} #{showPayModal.id}</h3>
              <button onClick={() => !paying && setShowPayModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#94a3b8' }}>✕</button>
            </div>
            <p style={{ fontSize: 14, color: '#475569', marginBottom: 16 }}>
              {t('payment.amount')}: <strong>{Number(showPayModal.total).toLocaleString()} TZS</strong><br />
              {t('payment.phonePrompt')}
            </p>
            <input type="tel" placeholder={t('payment.phonePlaceholder')} value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} disabled={paying}
              style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 16, boxSizing: 'border-box', marginBottom: 16, background: '#fff', color: '#0f172a', outline: 'none' }} />
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setShowPayModal(null)} disabled={paying} style={{ flex: 1, padding: '12px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', color: '#475569', cursor: 'pointer', fontWeight: 600 }}>{t('common.cancel')}</button>
              <button onClick={handlePay} disabled={paying} style={{ flex: 1, padding: '12px', borderRadius: 8, background: '#0a6e46', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700, opacity: paying ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                {paying && <Spinner size={14} color="#fff" />}
                {paying ? t('payment.sending') : `Pay ${Number(showPayModal.total).toLocaleString()} TZS`}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
