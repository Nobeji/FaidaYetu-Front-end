import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { colors, radius } from '../constants/theme';

export default function DashboardShell({ brand, brandSub, navItems, profile, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();
  const location = useLocation();

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
        position: 'fixed', top: 0, left: 0, width: 250, height: '100vh',
        background: '#fff',
        borderRight: '1px solid #e5e5e5',
        display: 'flex', flexDirection: 'column', zIndex: 40,
        padding: '20px 0',
        transform: !isMobile || sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.25s',
      }}>
        <div style={{ padding: '0 20px', marginBottom: 28 }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: colors.primary }}>{brand}</div>
          <div style={{ fontSize: 12, color: '#888' }}>{brandSub}</div>
        </div>
        <nav style={{ flex: 1, padding: '0 8px', display: 'flex', flexDirection: 'column', gap: 1 }}>
          {navItems.map((item) => {
            const active = location.pathname === (item.nav || '/');
            return (
              <div key={item.label} onClick={() => { navigate(item.nav || '#'); if (isMobile) setSidebarOpen(false); }} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px', borderRadius: 8, cursor: 'pointer', fontSize: 14,
                color: active ? colors.primary : '#555',
                background: active ? '#eaf7f0' : 'transparent',
                fontWeight: active ? 600 : 400,
                transition: 'all 0.15s',
              }}>
                <span style={{ fontSize: 18 }}>{item.icon}</span>
                {item.label}
              </div>
            );
          })}
        </nav>
        {profile && (
          <div style={{ padding: '8px 16px' }}>{profile}</div>
        )}
        <div style={{ padding: '0 16px 20px' }}>
          <div style={{ height: 1, background: '#e5e5e5', marginBottom: 12 }} />
          <div onClick={() => navigate('/')} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 12px', borderRadius: 8, cursor: 'pointer', fontSize: 14, color: '#888',
            transition: 'color 0.15s',
          }}>
            <span style={{ fontSize: 16 }}>🚪</span> Logout
          </div>
        </div>
      </aside>

      <div style={{ flex: 1, marginLeft: isMobile ? 0 : 250, minHeight: '100vh', paddingBottom: isMobile ? 64 : 0 }}>
        <div style={{
          height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 24px', background: '#fff',
          borderBottom: '1px solid #e5e5e5',
          position: 'sticky', top: 0, zIndex: 30,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {isMobile && (
              <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{
                width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: 8, fontSize: 18, cursor: 'pointer', background: 'none', border: 'none', color: '#333',
              }}>☰</button>
            )}
            <span style={{ fontSize: 15, fontWeight: 700, color: '#111' }}>{brand}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ fontSize: 13, color: '#888', textAlign: 'right' }}>
              <div style={{ fontWeight: 600, color: '#333' }}>Admin</div>
            </div>
            <div style={{
              width: 34, height: 34, borderRadius: '50%',
              background: '#eaf7f0', color: colors.primary,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 700,
            }}>A</div>
          </div>
        </div>

        <div style={{ padding: '28px 28px', maxWidth: 1280, margin: '0 auto' }}>
          {children}
        </div>
      </div>

      {isMobile && (
        <nav style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, background: '#fff',
          borderTop: '1px solid #e5e5e5', zIndex: 30, padding: '6px 0',
          display: 'flex', justifyContent: 'space-around',
        }}>
          {navItems.slice(0, 4).map(item => (
            <div key={item.label} onClick={() => navigate(item.nav || '#')} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1,
              padding: '4px 12px', cursor: 'pointer', fontSize: 10, fontWeight: 500,
              color: location.pathname === (item.nav || '/') ? colors.primary : '#999',
            }}>
              <span style={{ fontSize: 18 }}>{item.icon}</span>
              {item.label}
            </div>
          ))}
        </nav>
      )}
    </div>
  );
}
