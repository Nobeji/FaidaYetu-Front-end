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
  const supplierId = supplierData.id || null;

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#fafafa' }}>
      {isMobile && sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 35 }} />
      )}

      <aside style={{
        position: 'fixed', top: 0, left: 0, width: 240, height: '100vh',
        background: '#fff',
        borderRight: '1px solid #eaeaea',
        display: 'flex', flexDirection: 'column', zIndex: 40,
        transform: !isMobile || sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.25s',
      }}>
        <div style={{ padding: '24px 20px 20px' }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#000', letterSpacing: '-0.02em' }}>{brand}</div>
        </div>
        <nav style={{ flex: 1, padding: '0 8px', display: 'flex', flexDirection: 'column', gap: 1 }}>
          {navItems.map((item) => {
            const active = location.pathname === (item.nav || '/');
            return (
              <div key={item.label} onClick={() => { navigate(item.nav || '#'); if (isMobile) setSidebarOpen(false); }} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 13,
                color: active ? '#000' : '#666',
                background: active ? '#f5f5f5' : 'transparent',
                fontWeight: active ? 500 : 400,
                transition: 'all 0.15s',
              }}>
                <span style={{ fontSize: 16, opacity: active ? 1 : 0.6 }}>{item.icon}</span>
                {item.label}
              </div>
            );
          })}
        </nav>
        <div style={{ padding: '12px 16px 20px', borderTop: '1px solid #eaeaea', marginTop: 'auto' }}>
          {profile && <div style={{ marginBottom: 8 }}>{profile}</div>}
          <div onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('user'); localStorage.removeItem('profile'); localStorage.removeItem('customer'); localStorage.removeItem('supplier'); localStorage.removeItem('delivery_person'); navigate('/'); }} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '6px 8px', borderRadius: 6, cursor: 'pointer', fontSize: 13, color: '#d32f2f', fontWeight: 500,
          }}>
            Logout <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d32f2f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          </div>
        </div>
      </aside>

      <div style={{ flex: 1, marginLeft: isMobile ? 0 : 240, minHeight: '100vh', paddingBottom: isMobile ? 64 : 0 }}>
        <div style={{
          height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 24px', background: '#fff',
          borderBottom: '1px solid #eaeaea',
          position: 'sticky', top: 0, zIndex: 30,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {isMobile && (
              <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{
                width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: 6, fontSize: 18, cursor: 'pointer', background: 'none', border: 'none', color: '#333',
              }}>☰</button>
            )}
            <span style={{ fontSize: 14, fontWeight: 600, color: '#111' }}>{brand}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {supplierId && <NotificationBell supplierId={supplierId} />}
            <span style={{ fontSize: 13, fontWeight: 500, color: '#333' }}>{userName}</span>
            <div style={{
              width: 30, height: 30, borderRadius: '50%',
              background: '#f0f0f0', color: '#000',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 600,
            }}>{initials}</div>
          </div>
        </div>

        <div style={{ padding: '32px 32px', maxWidth: 1200, margin: '0 auto' }}>
          {children}
        </div>
      </div>

      {isMobile && (
        <nav style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, background: '#fff',
          borderTop: '1px solid #eaeaea', zIndex: 30, padding: '6px 0',
          display: 'flex', justifyContent: 'space-around',
        }}>
          {navItems.slice(0, 4).map(item => (
            <div key={item.label} onClick={() => navigate(item.nav || '#')} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1,
              padding: '4px 12px', cursor: 'pointer', fontSize: 10, fontWeight: 500,
              color: location.pathname === (item.nav || '/') ? '#000' : '#999',
            }}>
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              {item.label}
            </div>
          ))}
        </nav>
      )}
    </div>
  );
}
