import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import NotificationBell from './NotificationBell';

export default function DashboardShell({ brand, brandSub, navItems, profile, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userName = user.username || 'User';
  const initials = userName.charAt(0).toUpperCase();
  const supplierData = JSON.parse(localStorage.getItem('supplier') || '{}');
  const customerData = JSON.parse(localStorage.getItem('customer') || '{}');
  const supplierId = supplierData.id || null;
  const customerId = customerData.id || null;

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', color: '#1e293b' }}>
      {isMobile && sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 35 }} />
      )}

      <aside style={{
        position: 'fixed', top: 0, left: 0, width: 250, height: '100vh',
        background: '#fff', borderRight: '1px solid #e2e8f0',
        display: 'flex', flexDirection: 'column', zIndex: 40,
        transform: !isMobile || sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s ease', boxShadow: isMobile ? '4px 0 20px rgba(0,0,0,0.1)' : 'none',
      }}>
        <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #0a6e46, #10b981)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, boxShadow: '0 2px 8px rgba(10,110,70,0.25)' }}>🐔</div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', letterSpacing: '-0.02em' }}>{brand}</div>
              {brandSub && <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 1 }}>{brandSub}</div>}
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' }}>
          {navItems.map((item) => {
            const active = location.pathname === (item.nav || '/');
            return (
              <div key={item.label} onClick={() => { navigate(item.nav || '#'); if (isMobile) setSidebarOpen(false); }} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 10, cursor: 'pointer', fontSize: 13,
                color: active ? '#0f172a' : '#475569',
                background: active ? '#f0fdf4' : 'transparent',
                fontWeight: active ? 600 : 400, transition: 'all 0.2s ease',
                border: active ? '1px solid #bbf7d0' : '1px solid transparent',
              }}>
                <span style={{ fontSize: 15, opacity: active ? 1 : 0.6 }}>{item.icon}</span>
                {item.label}
              </div>
            );
          })}
        </nav>

        <div style={{ padding: '12px 16px 20px', borderTop: '1px solid #e2e8f0', marginTop: 'auto' }}>
          {profile && <div style={{ marginBottom: 8 }}>{profile}</div>}
          <div onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('user'); localStorage.removeItem('profile'); localStorage.removeItem('customer'); localStorage.removeItem('supplier'); localStorage.removeItem('delivery_person'); navigate('/'); }} style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 8, cursor: 'pointer', fontSize: 13, color: '#ef4444', fontWeight: 500,
          }}>
            Logout <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          </div>
        </div>
      </aside>

      <div style={{ flex: 1, marginLeft: isMobile ? 0 : 250, minHeight: '100vh', paddingBottom: isMobile ? 64 : 0 }}>
        <div style={{
          height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px',
          background: '#fff', borderBottom: '1px solid #e2e8f0',
          position: 'sticky', top: 0, zIndex: 30,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {isMobile && (
              <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{
                width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: 8, fontSize: 18, cursor: 'pointer',
                background: '#f1f5f9', border: '1px solid #e2e8f0', color: '#475569',
              }}>☰</button>
            )}
            <span style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{brand}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {(supplierId || customerId) && <NotificationBell supplierId={supplierId} customerId={customerId} />}
            <span style={{ fontSize: 13, fontWeight: 500, color: '#475569' }}>{userName}</span>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg, #0a6e46, #10b981)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, boxShadow: '0 2px 6px rgba(10,110,70,0.2)' }}>{initials}</div>
          </div>
        </div>
        <div style={{ padding: '24px 24px', maxWidth: 1200, margin: '0 auto' }}>{children}</div>
      </div>

      {isMobile && (
        <nav style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          background: '#fff', borderTop: '1px solid #e2e8f0', boxShadow: '0 -2px 10px rgba(0,0,0,0.05)',
          zIndex: 30, padding: '6px 0', display: 'flex', justifyContent: 'space-around',
        }}>
          {navItems.slice(0, 4).map(item => (
            <div key={item.label} onClick={() => navigate(item.nav || '#')} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
              cursor: 'pointer', fontSize: 10, fontWeight: 500,
              color: location.pathname === (item.nav || '/') ? '#0a6e46' : '#94a3b8',
              padding: '8px 14px', minHeight: 44,
            }}>
              <span style={{ fontSize: 20 }}>{item.icon}</span>{item.label}
            </div>
          ))}
        </nav>
      )}
    </div>
  );
}
