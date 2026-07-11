import { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const sidebarSections = [
  {
    label: 'ANALYTICS',
    items: [
      { label: 'Demand Analysis', icon: '📈', nav: '/admin/demand-analysis' },
      { label: 'Sales Prediction', icon: '🔮', nav: '/admin/sales-prediction' },
      { label: 'Customer Segmentation', icon: '🎯', nav: '/admin/customer-segmentation' },
      { label: 'Churn Prediction', icon: '⚠️', nav: '/admin/churn-prediction' },
      { label: 'Cohort Analysis', icon: '👥', nav: '/admin/cohort-analysis' },
      { label: 'Trend Insights', icon: '💡', nav: '/admin/trend-insights' },
    ],
  },
  {
    label: 'OPERATIONS',
    items: [
      { label: 'Heat Map', icon: '🔥', nav: '/admin/heat-map' },
      { label: 'Route Optimization', icon: '🗺️', nav: '/admin/route-optimization' },
      { label: 'Inventory Forecast', icon: '📦', nav: '/admin/inventory-forecast' },
      { label: 'Anomaly Detection', icon: '🕵️', nav: '/admin/anomaly-detection' },
    ],
  },
  {
    label: 'REPORTS & AI',
    items: [
      { label: 'Reports', icon: '📋', nav: '/admin/reports' },
      { label: 'Model Evaluation', icon: '📐', nav: '/admin/model-evaluation' },
      { label: 'What-if Simulator', icon: '🧪', nav: '/admin/what-if-simulator' },
      { label: 'Network Graph', icon: '🔗', nav: '/admin/network-graph' },
    ],
  },
{
        label: 'DATA',
        items: [
          { label: 'Suppliers', icon: '🏪', nav: '/admin/suppliers' },
          { label: 'Customers', icon: '👥', nav: '/admin/customers' },
          { label: 'Orders', icon: '🛒', nav: '/admin/orders' },
          { label: 'Deliveries', icon: '🚚', nav: '/admin/deliveries' },
          { label: 'Supplier Payouts', icon: '💰', nav: '/admin/supplier-payouts' },
        ],
      },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const profile = JSON.parse(localStorage.getItem('profile') || '{}');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || profile.role !== 'admin') {
      navigate('/auth?tab=login', { replace: true });
    }
  }, []);

  const userName = user.username || 'Admin';
  const initials = userName.charAt(0).toUpperCase();

  const isActive = (nav) => location.pathname === nav;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#fafafa' }}>
      <aside style={{
        width: 240, overflow: 'hidden',
        background: '#fff', borderRight: '1px solid #eaeaea',
        display: 'flex', flexDirection: 'column',
        flexShrink: 0, height: '100vh', position: 'sticky', top: 0,
      }}>
        <div style={{ minWidth: 240, padding: '24px 20px 20px' }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#000', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>FaidaYetu</div>
          <div style={{ fontSize: 11, color: '#888', whiteSpace: 'nowrap' }}>Admin Console</div>
        </div>

        <nav style={{ flex: 1, minWidth: 240, padding: '0 8px', overflowY: 'auto' }}>
          {sidebarSections.map((section) => (
            <div key={section.label}>
              <div style={{ padding: '16px 12px 4px', fontSize: 10, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{section.label}</div>
              {section.items.map((item) => (
                <div key={item.label} onClick={() => navigate(item.nav)} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '6px 12px', borderRadius: 6, cursor: 'pointer',
                  color: isActive(item.nav) ? '#000' : '#666',
                  background: isActive(item.nav) ? '#f0f0f0' : 'transparent',
                  fontWeight: isActive(item.nav) ? 600 : 400, fontSize: 13,
                  marginBottom: 1, transition: 'all 0.15s',
                  whiteSpace: 'nowrap',
                }}>
                  <span style={{ fontSize: 14, opacity: isActive(item.nav) ? 1 : 0.5 }}>{item.icon}</span>
                  {item.label}
                </div>
              ))}
            </div>
          ))}
        </nav>

        <div style={{ minWidth: 240, padding: '0 16px 20px', borderTop: '1px solid #eaeaea', marginTop: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 8px', marginBottom: 4 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 700, fontSize: 13 }}>{initials}</div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 13, color: '#111' }}>{userName}</div>
              <div style={{ fontSize: 11, color: '#888' }}>Admin Portal</div>
            </div>
          </div>
          <div onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('user'); localStorage.removeItem('profile'); localStorage.removeItem('customer'); localStorage.removeItem('supplier'); localStorage.removeItem('delivery_person'); navigate('/'); }} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 8px', borderRadius: 6, cursor: 'pointer',
            color: '#d32f2f', fontWeight: 500, fontSize: 13, whiteSpace: 'nowrap',
          }}>
            Logout <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d32f2f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          </div>
        </div>
      </aside>

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{
          height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 24px', background: '#fff',
          borderBottom: '1px solid #eaeaea', position: 'sticky', top: 0, zIndex: 30,
        }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: '#111' }}>Admin Dashboard</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: '#333' }}>{userName}</span>
            <div style={{
              width: 30, height: 30, borderRadius: '50%',
              background: '#f0f0f0', color: '#000',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 600,
            }}>{initials}</div>
          </div>
        </div>
        <div style={{ padding: 24, maxWidth: 1400, margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
