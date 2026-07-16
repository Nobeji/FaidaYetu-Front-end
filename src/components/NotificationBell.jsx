import { useState, useEffect, useRef } from 'react';
import { Bell, CircleDollarSign, Package, XCircle, Truck, AlertTriangle } from 'lucide-react';
import { api } from '../services/api';

export default function NotificationBell({ supplierId, customerId }) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const params = {};
      if (supplierId) params.supplier_id = supplierId;
      if (customerId) params.customer_id = customerId;
      const data = await api.notifications(params);
      setNotifications(data.notifications || []);
      setUnreadCount(data.unread_count || 0);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchNotifications(); const i = setInterval(fetchNotifications, 30000); return () => clearInterval(i); }, [supplierId, customerId]);
  useEffect(() => { const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }; document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h); }, []);

  const handleMarkRead = async (id) => { try { await api.markNotificationRead(id); setNotifications(p => p.map(n => n.id === id ? { ...n, is_read: true } : n)); setUnreadCount(p => Math.max(0, p - 1)); } catch {} };
  const handleMarkAllRead = async () => { try { await api.markAllNotificationsRead(); setNotifications(p => p.map(n => ({ ...n, is_read: true }))); setUnreadCount(0); } catch {} };

  const iconStyle = { fontSize: 14 };
  const getIcon = (type) => {
    switch (type) {
      case 'payment_received': return <CircleDollarSign size={18} style={{ color: '#15803d', ...iconStyle }} />;
      case 'new_order': return <Package size={18} style={{ color: '#0369a1', ...iconStyle }} />;
      case 'order_cancelled': return <XCircle size={18} style={{ color: '#dc2626', ...iconStyle }} />;
      case 'delivery_update': return <Truck size={18} style={{ color: '#0a6e46', ...iconStyle }} />;
      case 'low_stock': return <AlertTriangle size={18} style={{ color: '#d97706', ...iconStyle }} />;
      default: return <Bell size={18} style={{ color: '#64748b', ...iconStyle }} />;
    }
  };
  const formatTime = (dateStr) => {
    const d = new Date(dateStr); const now = new Date(); const diff = Math.floor((now - d) / 1000);
    if (diff < 60) return 'sasa hivi'; if (diff < 3600) return `${Math.floor(diff / 60)} dk iliyopita`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} saa iliyopita`;
    return d.toLocaleDateString('sw-TZ', { day: 'numeric', month: 'short' });
  };

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={() => setOpen(!open)} style={{ position: 'relative', cursor: 'pointer', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, background: '#f1f5f9', border: '1px solid #e2e8f0' }}>
        <Bell size={18} color="#475569" />
        {unreadCount > 0 && <span style={{ position: 'absolute', top: 2, right: 2, background: '#ef4444', color: '#fff', borderRadius: '50%', width: 18, height: 18, fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(239,68,68,0.4)' }}>{unreadCount > 99 ? '99+' : unreadCount}</span>}
      </button>
      {open && (
        <div style={{ position: 'absolute', top: 44, right: 0, width: 360, maxHeight: 440, background: '#fff', borderRadius: 14, boxShadow: '0 8px 32px rgba(0,0,0,0.12)', border: '1px solid #e2e8f0', overflow: 'hidden', zIndex: 100 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid #e2e8f0' }}>
            <span style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>Arifa</span>
            {unreadCount > 0 && <button onClick={handleMarkAllRead} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: '#0a6e46', fontWeight: 600 }}>Zote zimesomwa</button>}
          </div>
          <div style={{ maxHeight: 380, overflow: 'auto' }}>
            {loading && notifications.length === 0 ? (
              <div style={{ padding: 24, textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>Inapakia arifa...</div>
            ) : notifications.length === 0 ? (
              <div style={{ padding: 24, textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>Hakuna arifa bado.</div>
            ) : notifications.map(n => (
              <div key={n.id} onClick={() => !n.is_read && handleMarkRead(n.id)} style={{ padding: '10px 16px', borderBottom: '1px solid #f1f5f9', cursor: n.is_read ? 'default' : 'pointer', background: n.is_read ? 'transparent' : '#f0fdf4', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{ marginTop: 2 }}>{getIcon(n.notification_type)}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: n.is_read ? 500 : 700, fontSize: 13, color: '#0f172a', marginBottom: 2, lineHeight: 1.3 }}>{n.title}</div>
                  <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{n.message}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>{formatTime(n.created_at)}{n.sms_sent && <span style={{ marginLeft: 8, color: '#15803d' }}>✓ SMS imetumwa</span>}</div>
                </div>
                {!n.is_read && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#0a6e46', marginTop: 6, flexShrink: 0 }} />}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
