import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { colors, spacing, radius } from '../constants/theme';

const sidebarItems = [
  {
    label: 'Analytics', icon: '📊',
    children: [
      { label: 'Demand Analysis', icon: '📈', nav: '/admin/demand-analysis' },
      { label: 'Heat Map', icon: '🔥', nav: '/admin/heat-map' },
      { label: 'Sales Prediction', icon: '🔮', nav: '/admin/sales-prediction' },
      { label: 'Reports', icon: '📋', nav: '/admin/reports' },
    ],
  },
  { label: 'Suppliers', icon: '🏪', nav: '/admin/suppliers' },
  { label: 'Customers', icon: '👥', nav: '/admin/customers' },
  { label: 'Orders', icon: '🛒', nav: '/admin/orders' },
  { label: 'Deliveries', icon: '🚚', nav: '/admin/deliveries' },
];

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [analyticsOpen, setAnalyticsOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (nav) => location.pathname === nav;
  const isAnalyticsChild = (nav) => nav.startsWith('/admin/') && ['/admin/demand-analysis', '/admin/heat-map', '/admin/sales-prediction', '/admin/reports'].includes(nav);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f0f5f2' }}>
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 35 }} />
      )}
      <aside style={{
        position: 'fixed', top: 0, left: 0, width: 270, height: '100vh',
        background: 'linear-gradient(180deg, #0a6e46 0%, #06402b 100%)',
        display: 'flex', flexDirection: 'column', zIndex: 40,
        padding: `${spacing.lg}px 0`,
        transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s',
        overflowY: 'auto',
      }}>
        <div style={{ padding: `0 ${spacing.lg}px`, marginBottom: spacing.xl }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#fff' }}>🌿 FaidaYetu</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Admin Console</div>
        </div>
        <nav style={{ flex: 1, padding: `0 ${spacing.md}px` }}>
          {sidebarItems.map((item) => (
            item.children ? (
              <div key={item.label} style={{ marginBottom: 4 }}>
                <div onClick={() => setAnalyticsOpen(!analyticsOpen)} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 14px', borderRadius: radius.round, cursor: 'pointer',
                  color: 'rgba(255,255,255,0.8)', fontWeight: 700, fontSize: 13,
                  textTransform: 'uppercase', letterSpacing: '0.05em',
                  background: isAnalyticsChild(location.pathname) ? 'rgba(255,255,255,0.15)' : 'transparent',
                }}>
                  <span>{item.icon} {item.label}</span>
                  <span style={{ transform: analyticsOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▼</span>
                </div>
                {analyticsOpen && item.children.map(child => (
                  <div key={child.label} onClick={() => { navigate(child.nav); setSidebarOpen(false); }} style={{
                    display: 'flex', alignItems: 'center', gap: spacing.sm,
                    padding: '10px 14px 10px 36px', borderRadius: radius.round, cursor: 'pointer',
                    color: isActive(child.nav) ? '#fff' : 'rgba(255,255,255,0.65)',
                    background: isActive(child.nav) ? 'rgba(255,255,255,0.2)' : 'transparent',
                    fontWeight: isActive(child.nav) ? 700 : 500, fontSize: 14,
                    marginBottom: 2, transition: 'all 0.2s',
                  }}>
                    <span>{child.icon}</span>
                    {child.label}
                  </div>
                ))}
              </div>
            ) : (
              <div key={item.label} onClick={() => { navigate(item.nav); setSidebarOpen(false); }} style={{
                display: 'flex', alignItems: 'center', gap: spacing.sm,
                padding: '12px 14px', borderRadius: radius.round, cursor: 'pointer',
                color: isActive(item.nav) ? '#fff' : 'rgba(255,255,255,0.7)',
                background: isActive(item.nav) ? 'rgba(255,255,255,0.2)' : 'transparent',
                fontWeight: isActive(item.nav) ? 700 : 500, fontSize: 14,
                marginBottom: 2, transition: 'all 0.2s',
              }}>
                <span style={{ fontSize: 18 }}>{item.icon}</span>
                {item.label}
              </div>
            )
          ))}
        </nav>
        <div style={{ padding: `0 ${spacing.md}px ${spacing.lg}px` }}>
          <div style={{ height: 1, background: 'rgba(255,255,255,0.15)', margin: `0 ${spacing.sm}px ${spacing.md}px` }} />
          <div onClick={() => navigate('/')} style={{
            display: 'flex', alignItems: 'center', gap: spacing.sm,
            padding: '12px 14px', borderRadius: radius.round, cursor: 'pointer',
            color: 'rgba(255,255,255,0.7)', fontWeight: 500, fontSize: 14,
          }}>
            <span>🚪</span> Back to Site
          </div>
        </div>
      </aside>

      <div style={{ flex: 1, marginLeft: 270, minHeight: '100vh' }}>
        <div style={{
          height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: `0 ${spacing.xl}px`, background: '#fff',
          borderBottom: '1px solid #e0e8e4', position: 'sticky', top: 0, zIndex: 30,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{
              width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: radius.md, fontSize: 20, cursor: 'pointer', background: '#f0f5f2', border: 'none',
              color: '#0a6e46',
            }}>☰</button>
            <span style={{ fontSize: 18, fontWeight: 800, color: '#0a6e46' }}>Admin Dashboard</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
            <button style={{
              position: 'relative', width: 40, height: 40, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: '#f0f5f2', border: 'none', cursor: 'pointer', fontSize: 18,
            }}>
              🔔
              <span style={{ position: 'absolute', top: 10, right: 10, width: 8, height: 8, background: '#ba1a1a', borderRadius: '50%', border: '2px solid #fff' }} />
            </button>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #0a6e46, #06402b)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700 }}>A</div>
          </div>
        </div>
        <div style={{ padding: spacing.xl, maxWidth: 1400, margin: '0 auto' }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
