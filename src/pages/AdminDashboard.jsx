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
    <div style={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(160deg, #020617 0%, #0a1628 30%, #0f1d32 60%, #1e3a5f 100%)', color: '#f1f5f9' }}>
      {isMobile && sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 35 }} />
      )}

      <aside style={{
        width: 260, overflow: 'hidden',
        background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(255,255,255,0.05)',
        display: 'flex', flexDirection: 'column', flexShrink: 0, height: '100vh', position: 'sticky', top: 0,
        transform: !isMobile || sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: isMobile ? 'transform 0.3s ease' : 'none', zIndex: 40,
      }}>
        <div style={{ minWidth: 260, padding: '24px 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg, #1e40af, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, boxShadow: '0 2px 8px rgba(30,64,175,0.3)' }}>🐔</div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap' }}>FaidaYetu</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', whiteSpace: 'nowrap' }}>Admin Console</div>
            </div>
          </div>
        </div>
        <nav style={{ flex: 1, minWidth: 260, padding: '12px 8px', overflowY: 'auto' }}>
          {sidebarSections.map((section) => (
            <div key={section.label} style={{ marginBottom: 4 }}>
              <div style={{ padding: '14px 12px 6px', fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{section.label}</div>
              {section.items.map((item) => {
                const active = isActive(item.nav);
                return (
                  <div key={item.label} onClick={() => { navigate(item.nav); if (isMobile) setSidebarOpen(false); }} style={{
                    display: 'flex', alignItems: 'center', gap: 9, padding: '7px 12px', borderRadius: 8, cursor: 'pointer',
                    color: active ? '#fff' : 'rgba(255,255,255,0.45)',
                    background: active ? 'rgba(30,64,175,0.3)' : 'transparent',
                    fontWeight: active ? 600 : 400, fontSize: 12.5, transition: 'all 0.15s', whiteSpace: 'nowrap',
                    border: active ? '1px solid rgba(30,64,175,0.2)' : '1px solid transparent',
                  }}>
                    <span style={{ fontSize: 14, opacity: active ? 1 : 0.45 }}>{item.icon}</span>{item.label}
                  </div>
                );
              })}
            </div>
          ))}
        </nav>
        <div style={{ minWidth: 260, padding: '16px', borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px', marginBottom: 6 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #1e40af, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 13, boxShadow: '0 2px 8px rgba(30,64,175,0.3)' }}>{initials}</div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 13, color: '#fff' }}>{userName}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>Admin Portal</div>
            </div>
          </div>
          <div onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('user'); localStorage.removeItem('profile'); localStorage.removeItem('customer'); localStorage.removeItem('supplier'); localStorage.removeItem('delivery_person'); navigate('/'); }} style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 8, cursor: 'pointer', color: '#f87171', fontWeight: 500, fontSize: 13,
          }}>
            Logout <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          </div>
        </div>
      </aside>

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{
          height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px',
          background: 'rgba(2,6,23,0.85)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255,255,255,0.05)', position: 'sticky', top: 0, zIndex: 30,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {isMobile && (
              <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, fontSize: 18, cursor: 'pointer', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.06)', color: '#fff' }}>☰</button>
            )}
            <span style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>Admin Dashboard</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.65)' }}>{userName}</span>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg, #1e40af, #3b82f6)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, boxShadow: '0 2px 8px rgba(30,64,175,0.3)' }}>{initials}</div>
          </div>
        </div>
        <div style={{ padding: 24, maxWidth: 1400, margin: '0 auto', width: '100%', boxSizing: 'border-box' }}><Outlet /></div>
      </div>
    </div>
  );
}
