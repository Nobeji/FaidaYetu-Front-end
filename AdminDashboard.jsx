import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

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
  const [collapsed, setCollapsed] = useState(false);
  const [analyticsOpen, setAnalyticsOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (nav) => location.pathname === nav;
  const isAnalyticsChild = () => ['/admin/demand-analysis', '/admin/heat-map', '/admin/sales-prediction', '/admin/reports'].includes(location.pathname);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f0f5f2' }}>
      <aside style={{
        width: collapsed ? 0 : 260, overflow: 'hidden',
        background: '#fff', borderRight: '1px solid #e0e8e4',
        display: 'flex', flexDirection: 'column',
        transition: 'width 0.25s',
        flexShrink: 0, height: '100vh', position: 'sticky', top: 0,
      }}>
        <div style={{ minWidth: 260, padding: '24px 24px 0', marginBottom: 24 }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#0a6e46', whiteSpace: 'nowrap' }}>🌿 FaidaYetu</div>
          <div style={{ fontSize: 12, color: '#8a9b93', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Admin Console</div>
        </div>

        <nav style={{ flex: 1, minWidth: 260, padding: '0 8px', overflowY: 'auto' }}>
          {sidebarItems.map((item) => (
            item.children ? (
              <div key={item.label} style={{ marginBottom: 2 }}>
                <div onClick={() => setAnalyticsOpen(!analyticsOpen)} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 14px', borderRadius: 10, cursor: 'pointer',
                  color: isAnalyticsChild() ? '#0a6e46' : '#5f6b64',
                  fontWeight: 700, fontSize: 12,
                  textTransform: 'uppercase', letterSpacing: '0.06em',
                  background: isAnalyticsChild() ? '#e8f5ee' : 'transparent',
                  whiteSpace: 'nowrap',
                }}>
                  <span>{item.icon} {item.label}</span>
                  <span style={{ transform: analyticsOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', fontSize: 10 }}>▼</span>
                </div>
                {analyticsOpen && item.children.map(child => {
                  const active = isActive(child.nav);
                  return (
                    <div key={child.label} onClick={() => navigate(child.nav)} style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '10px 14px 10px 36px', borderRadius: 10, cursor: 'pointer',
                      color: active ? '#0a6e46' : '#5f6b64',
                      background: active ? '#e8f5ee' : 'transparent',
                      fontWeight: active ? 700 : 500, fontSize: 14,
                      marginBottom: 1, transition: 'all 0.15s',
                      whiteSpace: 'nowrap',
                    }}>
                      <span style={{ fontSize: 16 }}>{child.icon}</span>
                      {child.label}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div key={item.label} onClick={() => navigate(item.nav)} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '11px 14px', borderRadius: 10, cursor: 'pointer',
                color: isActive(item.nav) ? '#0a6e46' : '#5f6b64',
                background: isActive(item.nav) ? '#e8f5ee' : 'transparent',
                fontWeight: isActive(item.nav) ? 700 : 500, fontSize: 14,
                marginBottom: 1, transition: 'all 0.15s',
                whiteSpace: 'nowrap',
              }}>
                <span style={{ fontSize: 18 }}>{item.icon}</span>
                {item.label}
              </div>
            )
          ))}
        </nav>

        <div style={{ minWidth: 260, padding: '0 16px 24px' }}>
          <div style={{ height: 1, background: '#e0e8e4', margin: '0 8px 16px' }} />
          <div onClick={() => navigate('/')} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '11px 14px', borderRadius: 10, cursor: 'pointer',
            color: '#8a9b93', fontWeight: 500, fontSize: 14, whiteSpace: 'nowrap',
          }}>
            <span style={{ fontSize: 16 }}>🚪</span> Back to Site
          </div>
        </div>
      </aside>

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{
          height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 24px', background: '#fff',
          borderBottom: '1px solid #e0e8e4', position: 'sticky', top: 0, zIndex: 30,
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button onClick={() => setCollapsed(!collapsed)} style={{
              width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: 10, fontSize: 18, cursor: 'pointer', background: '#f0f5f2', border: 'none',
              color: '#0a6e46', flexShrink: 0,
            }}>{collapsed ? '☰' : '✕'}</button>
            <span style={{ fontSize: 16, fontWeight: 700, color: '#0a6e46' }}>Admin Dashboard</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ fontSize: 13, color: '#8a9b93', textAlign: 'right' }}>
              <div style={{ fontWeight: 600, color: '#1a1a1a' }}>Admin</div>
              <div style={{ fontSize: 12 }}>Super User</div>
            </div>
            <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg, #0a6e46, #52b788)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, boxShadow: '0 2px 6px rgba(10,110,70,0.3)', flexShrink: 0 }}>A</div>
          </div>
        </div>
        <div style={{ padding: 24, maxWidth: 1400, margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
