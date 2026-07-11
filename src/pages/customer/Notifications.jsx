import { useState, useEffect } from 'react';
import DashboardShell from '../../components/DashboardShell';
import { api } from '../../services/api';
import Spinner from '../../components/Spinner';

const navItems = [
  { icon: '🏠', label: 'Explore', nav: '/customer' },
  { icon: '🛒', label: 'Marketplace', nav: '/customer/marketplace' },
  { icon: '📋', label: 'My Orders', nav: '/customer/orders' },
  { icon: '🔔', label: 'Notifications', nav: '/customer/notifications' },
  { icon: '👤', label: 'Profile', nav: '/customer/profile' },
];

const getIcon = (type) => {
  switch (type) {
    case 'payment_received': return '💰';
    case 'new_order': return '📦';
    case 'order_cancelled': return '❌';
    case 'delivery_update': return '🚚';
    case 'low_stock': return '⚠️';
    default: return '🔔';
  }
};

const formatTime = (dateStr) => {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now - d) / 1000);
  if (diff < 60) return 'sasa hivi';
  if (diff < 3600) return `${Math.floor(diff / 60)} dk iliyopita`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} saa iliyopita`;
  return d.toLocaleDateString('sw-TZ', { day: 'numeric', month: 'short', year: 'numeric' });
};

export default function CustomerNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(null);
  const customerId = JSON.parse(localStorage.getItem('customer') || '{}').id;

  const fetch = async () => {
    setLoading(true);
    try {
      const data = await api.notifications({ customer_id: customerId });
      setNotifications(data.notifications || []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { if (customerId) fetch(); else setLoading(false); }, []);

  const handleMarkRead = async (id) => {
    setMarking(id);
    try {
      await api.markNotificationRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch {}
    setMarking(null);
  };

  const handleMarkAllRead = async () => {
    setMarking('all');
    try {
      await api.markAllNotificationsRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch {}
    setMarking(null);
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <DashboardShell brand="FaidaYetu" brandSub="Customer Portal" navItems={navItems}>
      <div className="fade-in">
        <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 600, color: '#000', margin: 0 }}>Arifa</h1>
            <p style={{ fontSize: 15, color: '#888', margin: '4px 0 0' }}>Notifications and updates</p>
          </div>
          {unreadCount > 0 && (
            <button onClick={handleMarkAllRead} disabled={marking === 'all'} style={{
              padding: '8px 16px', borderRadius: 8, border: '1px solid #ddd',
              background: '#fff', color: '#1976d2', cursor: 'pointer', fontWeight: 600, fontSize: 13,
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              {marking === 'all' && <Spinner size={12} color="#1976d2" />}
              Zote zimesomwa ({unreadCount})
            </button>
          )}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 48, color: '#888' }}>
            <Spinner size={24} color="#888" />
            <div style={{ marginTop: 8 }}>Inapakia arifa...</div>
          </div>
        ) : notifications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 48, color: '#888' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔔</div>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Hakuna arifa bado</div>
            <div style={{ fontSize: 13, color: '#aaa' }}>Utapokea arifa za malipo na msafirishaji hapa.</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {notifications.map(n => (
              <div key={n.id} style={{
                display: 'flex', gap: 12, padding: '14px 16px',
                background: n.is_read ? '#fff' : '#f8fbff',
                border: `1px solid ${n.is_read ? '#eee' : '#cce5ff'}`,
                borderRadius: 10, alignItems: 'flex-start',
              }}>
                <span style={{ fontSize: 24, marginTop: 2, flexShrink: 0 }}>{getIcon(n.notification_type)}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: n.is_read ? 500 : 700, fontSize: 14, color: '#000', marginBottom: 4 }}>
                    {n.title}
                  </div>
                  <div style={{ fontSize: 13, color: '#555', lineHeight: 1.4, marginBottom: 6 }}>
                    {n.message}
                  </div>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center', fontSize: 12, color: '#aaa' }}>
                    <span>{formatTime(n.created_at)}</span>
                    {n.sms_sent && <span style={{ color: '#2e7d32' }}>✓ SMS imetumwa</span>}
                    {!n.sms_sent && n.notification_type === 'payment_received' && (
                      <span style={{ color: '#f57f17' }}>ℹ SMS haikufika (hakikisha namba ya simu imesajiliwa)</span>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                  {!n.is_read && (
                    <button onClick={() => handleMarkRead(n.id)} disabled={marking === n.id} style={{
                      padding: '4px 10px', borderRadius: 6, border: '1px solid #1976d2',
                      background: 'transparent', color: '#1976d2', cursor: 'pointer',
                      fontWeight: 600, fontSize: 11, display: 'flex', alignItems: 'center', gap: 4,
                    }}>
                      {marking === n.id && <Spinner size={10} color="#1976d2" />}
                      Soma
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
