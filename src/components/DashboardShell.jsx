import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { colors, spacing, radius } from '../constants/theme';

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

  const activeStyle = (active) => ({
    display: 'flex', alignItems: 'center', gap: spacing.md,
    padding: '12px 16px', borderRadius: radius.round,
    color: active ? colors.onPrimaryContainer : colors.onSurfaceVariant,
    background: active ? colors.primaryLight : 'transparent',
    fontWeight: active ? 700 : 500,
    fontSize: 14, cursor: 'pointer', transition: 'all 0.2s',
  });

  const sidebarVisible = !isMobile || sidebarOpen;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: colors.surface }}>
      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 35,
        }} />
      )}

      {/* Sidebar */}
      <aside style={{
        position: 'fixed', top: 0, left: 0, width: 260, height: '100vh',
        background: colors.surfaceContainerLow,
        borderRight: `1px solid ${colors.outlineVariant}`,
        display: 'flex', flexDirection: 'column', zIndex: 40,
        padding: `${spacing.lg}px 0`,
        transform: sidebarVisible ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s',
      }}>
        <div style={{ padding: `0 ${spacing.lg}px`, marginBottom: spacing.xl }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: colors.primary }}>{brand}</div>
          <div style={{ fontSize: 13, color: colors.onSurfaceVariant }}>{brandSub}</div>
        </div>
        <nav style={{ flex: 1, padding: `0 ${spacing.md}px`, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {navItems.map((item) => (
            <div
              key={item.label}
              onClick={() => { navigate(item.nav || '#'); if (isMobile) setSidebarOpen(false); }}
              style={activeStyle(location.pathname === (item.nav || '/'))}
            >
              <span style={{ fontSize: 20 }}>{item.icon}</span>
              {item.label}
            </div>
          ))}
        </nav>
        {profile && (
          <div style={{ padding: spacing.md, margin: `0 ${spacing.md}px` }}>
            {profile}
          </div>
        )}
        <div style={{ padding: `0 ${spacing.md}px ${spacing.lg}px ${spacing.md}px` }}>
          <div style={{ height: 1, background: colors.outlineVariant, margin: `0 ${spacing.sm}px ${spacing.md}px` }} />
          <div onClick={() => navigate('/')} style={activeStyle(false)}>
            Logout
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <div style={{
        flex: 1,
        marginLeft: isMobile ? 0 : 260,
        minHeight: '100vh',
        paddingBottom: isMobile ? 72 : 0,
      }}>
        {/* Topbar */}
        <div style={{
          height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: `0 ${spacing.lg}px`, background: colors.surface,
          borderBottom: `1px solid ${colors.outlineVariant}`,
          position: 'sticky', top: 0, zIndex: 30,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
            {isMobile && (
              <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{
                width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: radius.md, fontSize: 20, cursor: 'pointer', background: 'none', border: 'none',
                color: colors.onSurface,
              }}>☰</button>
            )}
            <span style={{ fontSize: 18, fontWeight: 800, color: colors.primary }}>{brand}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
            <button style={{
              position: 'relative', width: 40, height: 40, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: colors.surfaceContainerHigh, border: 'none', cursor: 'pointer', fontSize: 18,
            }}>
              🔔
              <span style={{
                position: 'absolute', top: 10, right: 10, width: 8, height: 8,
                background: colors.error, borderRadius: '50%', border: `2px solid ${colors.surface}`,
              }} />
            </button>
            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              background: colors.primaryContainer, color: colors.onPrimaryContainer,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontWeight: 700,
            }}>
              U
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: spacing.lg, maxWidth: 1280, margin: '0 auto' }}>
          {children}
        </div>
      </div>

      {/* Bottom Nav - mobile only */}
      {isMobile && (
        <nav style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, background: colors.surface,
          borderTop: `1px solid ${colors.outlineVariant}`, zIndex: 30, padding: '8px 0',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
            {navItems.slice(0, 4).map(item => (
              <div key={item.label} onClick={() => navigate(item.nav || '#')} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                padding: '4px 16px', cursor: 'pointer',
                color: location.pathname === (item.nav || '/') ? colors.primary : colors.onSurfaceVariant,
                fontSize: 11, fontWeight: 600,
              }}>
                <span style={{ fontSize: 20 }}>{item.icon}</span>
                {item.label}
              </div>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
}
