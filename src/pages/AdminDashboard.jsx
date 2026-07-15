import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const sidebarSections = [
  { label: 'ANALYTICS', items: [
    { label: 'Demand Analysis', icon: '📈', nav: '/admin/demand-analysis' },
    { label: 'Sales Prediction', icon: '🔮', nav: '/admin/sales-prediction' },
    { label: 'Customer Segmentation', icon: '🎯', nav: '/admin/customer-segmentation' },
    { label: 'Churn Prediction', icon: '⚠️', nav: '/admin/churn-prediction' },
    { label: 'Cohort Analysis', icon: '👥', nav: '/admin/cohort-analysis' },
    { label: 'Trend Insights', icon: '💡', nav: '/admin/trend-insights' },
  ]},
  { label: 'OPERATIONS', items: [
    { label: 'Heat Map', icon: '🔥', nav: '/admin/heat-map' },
    { label: 'Route Optimization', icon: '🗺️', nav: '/admin/route-optimization' },
    { label: 'Inventory Forecast', icon: '📦', nav: '/admin/inventory-forecast' },
    { label: 'Anomaly Detection', icon: '🕵️', nav: '/admin/anomaly-detection' },
  ]},
  { label: 'IMPACT & TRACKING', items: [
    { label: 'Enhanced Performance', icon: '📊', nav: '/admin/enhanced-performance' },
    { label: 'Cold Chain Tracking', icon: '🌡️', nav: '/admin/cold-chain' },
    { label: 'Route Comparison', icon: '⚡', nav: '/admin/route-comparison' },
    { label: 'Spatial Accuracy', icon: '📍', nav: '/admin/spatial-accuracy' },
    { label: 'Usability Metrics', icon: '👥', nav: '/admin/usability-metrics' },
    { label: 'System Impact', icon: '🎯', nav: '/admin/system-impact' },
  ]},
  { label: 'RESEARCH', items: [
    { label: 'TAM Survey', icon: '📝', nav: '/admin/tam-survey' },
    { label: 'SUS Usability', icon: '📋', nav: '/admin/sus-survey' },
  ]},
  { label: 'REPORTS & AI', items: [
    { label: 'Reports', icon: '📋', nav: '/admin/reports' },
    { label: 'Model Evaluation', icon: '📐', nav: '/admin/model-evaluation' },
    { label: 'What-if Simulator', icon: '🧪', nav: '/admin/what-if-simulator' },
    { label: 'Network Graph', icon: '🔗', nav: '/admin/network-graph' },
  ]},
  { label: 'DATA', items: [
    { label: 'Suppliers', icon: '🏪', nav: '/admin/suppliers' },
    { label: 'Customers', icon: '👥', nav: '/admin/customers' },
    { label: 'Orders', icon: '🛒', nav: '/admin/orders' },
    { label: 'Deliveries', icon: '🚚', nav: '/admin/deliveries' },
    { label: 'Supplier Payouts', icon: '💰', nav: '/admin/supplier-payouts' },
  ]},
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const profile = JSON.parse(localStorage.getItem('profile') || '{}');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || profile.role !== 'admin') navigate('/auth?tab=login', { replace: true });
  }, []);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const userName = user.username || 'Admin';
  const initials = userName.charAt(0).toUpperCase();
  const isActive = (nav) => location.pathname === nav;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', color: '#1e293b' }}>
      {isMobile && sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 35 }} />
      )}

      <aside style={{
        width: 260, overflow: 'hidden',
        background: '#fff', borderRight: '1px solid #e2e8f0',
        display: 'flex', flexDirection: 'column', flexShrink: 0, height: '100vh', position: 'sticky', top: 0,
        transform: !isMobile || sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: isMobile ? 'transform 0.3s ease' : 'none', zIndex: 40,
        boxShadow: isMobile ? '4px 0 20px rgba(0,0,0,0.1)' : 'none',
      }}>
        <div style={{ minWidth: 260, padding: '24px 20px 20px', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg, #0a6e46, #10b981)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, boxShadow: '0 2px 8px rgba(10,110,70,0.25)' }}>🐔</div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap' }}>FaidaYetu</div>
              <div style={{ fontSize: 10, color: '#94a3b8', whiteSpace: 'nowrap' }}>Admin Console</div>
            </div>
          </div>
        </div>
        <nav style={{ flex: 1, minWidth: 260, padding: '12px 8px', overflowY: 'auto' }}>
          {sidebarSections.map((section) => (
            <div key={section.label} style={{ marginBottom: 4 }}>
              <div style={{ padding: '14px 12px 6px', fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{section.label}</div>
              {section.items.map((item) => {
                const active = isActive(item.nav);
                return (
                  <div key={item.label} onClick={() => { navigate(item.nav); if (isMobile) setSidebarOpen(false); }} style={{
                    display: 'flex', alignItems: 'center', gap: 9, padding: '8px 12px', borderRadius: 8, cursor: 'pointer',
                    color: active ? '#0f172a' : '#475569',
                    background: active ? '#f0fdf4' : 'transparent',
                    fontWeight: active ? 600 : 400, fontSize: 12.5, transition: 'all 0.15s', whiteSpace: 'nowrap',
                    border: active ? '1px solid #bbf7d0' : '1px solid transparent',
                  }}>
                    <span style={{ fontSize: 14, opacity: active ? 1 : 0.6 }}>{item.icon}</span>{item.label}
                  </div>
                );
              })}
            </div>
          ))}
        </nav>
        <div style={{ minWidth: 260, padding: '16px', borderTop: '1px solid #e2e8f0', marginTop: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px', marginBottom: 6 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #0a6e46, #10b981)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 13, boxShadow: '0 2px 6px rgba(10,110,70,0.2)' }}>{initials}</div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 13, color: '#0f172a' }}>{userName}</div>
              <div style={{ fontSize: 10, color: '#94a3b8' }}>Admin Portal</div>
            </div>
          </div>
          <div onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('user'); localStorage.removeItem('profile'); localStorage.removeItem('customer'); localStorage.removeItem('supplier'); localStorage.removeItem('delivery_person'); navigate('/'); }} style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 8, cursor: 'pointer', color: '#ef4444', fontWeight: 500, fontSize: 13,
          }}>
            Logout <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          </div>
        </div>
      </aside>

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{
          height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px',
          background: '#fff', borderBottom: '1px solid #e2e8f0',
          position: 'sticky', top: 0, zIndex: 30,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {isMobile && (
              <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, fontSize: 18, cursor: 'pointer', background: '#f1f5f9', border: '1px solid #e2e8f0', color: '#475569' }}>☰</button>
            )}
            <span style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>Admin Dashboard</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: '#475569' }}>{userName}</span>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg, #0a6e46, #10b981)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, boxShadow: '0 2px 6px rgba(10,110,70,0.2)' }}>{initials}</div>
          </div>
        </div>
        <div style={{ padding: 24, maxWidth: 1400, margin: '0 auto', width: '100%', boxSizing: 'border-box' }}><Outlet /></div>
      </div>
    </div>
  );
}
