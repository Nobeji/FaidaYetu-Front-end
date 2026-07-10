import { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';

export default function NotificationBell({ supplierId }) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await api.notifications(supplierId);
      setNotifications(data.notifications || []);
      setUnreadCount(data.unread_count || 0);
    } catch {
      // silent fail
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [supplierId]);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await api.markNotificationRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch {
      // silent fail
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.markAllNotificationsRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch {
      // silent fail
    }
  };

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
    return d.toLocaleDateString('sw-TZ', { day: 'numeric', month: 'short' });
  };

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: 'relative', background: 'none', border: 'none', cursor: 'pointer',
          width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
          borderRadius: 8, fontSize: 18,
        }}
      >
        🔔
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute', top: 2, right: 2,
            background: '#d32f2f', color: '#fff', borderRadius: '50%',
            width: 18, height: 18, fontSize: 10, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 44, right: 0, width: 360, maxHeight: 440,
          background: '#fff', borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
          border: '1px solid #eee', overflow: 'hidden', zIndex: 100,
        }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '12px 16px', borderBottom: '1px solid #eee',
          }}>
            <span style={{ fontWeight: 700, fontSize: 14, color: '#000' }}>Arifa</span>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 12, color: '#1976d2', fontWeight: 600,
                }}
              >
                Zote zimesomwa
              </button>
            )}
          </div>

          <div style={{ maxHeight: 380, overflow: 'auto' }}>
            {loading && notifications.length === 0 ? (
              <div style={{ padding: 24, textAlign: 'center', color: '#888', fontSize: 13 }}>
                Inapakia arifa...
              </div>
            ) : notifications.length === 0 ? (
              <div style={{ padding: 24, textAlign: 'center', color: '#888', fontSize: 13 }}>
                Hakuna arifa bado.
              </div>
            ) : (
              notifications.map(n => (
                <div
                  key={n.id}
                  onClick={() => !n.is_read && handleMarkRead(n.id)}
                  style={{
                    padding: '10px 16px', borderBottom: '1px solid #f5f5f5',
                    cursor: n.is_read ? 'default' : 'pointer',
                    background: n.is_read ? '#fff' : '#f8fbff',
                    display: 'flex', gap: 10, alignItems: 'flex-start',
                  }}
                >
                  <span style={{ fontSize: 20, marginTop: 2 }}>{getIcon(n.notification_type)}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontWeight: n.is_read ? 500 : 700, fontSize: 13, color: '#000',
                      marginBottom: 2, lineHeight: 1.3,
                    }}>{n.title}</div>
                    <div style={{
                      fontSize: 12, color: '#666', lineHeight: 1.3,
                      display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                    }}>{n.message}</div>
                    <div style={{ fontSize: 11, color: '#aaa', marginTop: 4 }}>
                      {formatTime(n.created_at)}
                      {n.sms_sent && <span style={{ marginLeft: 8, color: '#2e7d32' }}>✓ SMS imetumwa</span>}
                    </div>
                  </div>
                  {!n.is_read && (
                    <div style={{
                      width: 8, height: 8, borderRadius: '50%', background: '#1976d2',
                      marginTop: 6, flexShrink: 0,
                    }} />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
