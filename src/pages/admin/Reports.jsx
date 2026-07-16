import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { FileText, BarChart3, Truck } from 'lucide-react';

export default function AdminReports() {
  const [dashboard, setDashboard] = useState(null);
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.adminDashboard(),
      api.adminPerformance(),
    ]).then(([d, p]) => { setDashboard(d); setPerformance(p); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const downloadReport = () => {
    const d = dashboard || {};
    const p = performance || {};
    const date = new Date().toLocaleDateString('en-TZ');
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>FaidaYetu Report - ${date}</title>
<style>
  body { font-family: 'Segoe UI', Arial, sans-serif; color: #111; padding: 40px; max-width: 800px; margin: 0 auto; }
  h1 { font-size: 28px; margin-bottom: 4px; }
  h2 { font-size: 20px; margin: 24px 0 12px; border-bottom: 2px solid #0a6e46; padding-bottom: 6px; }
  table { width: 100%; border-collapse: collapse; margin: 12px 0; }
  th, td { text-align: left; padding: 8px 12px; border-bottom: 1px solid #ddd; }
  th { background: #f5f5f5; font-weight: 600; }
  .footer { margin-top: 32px; font-size: 12px; color: #888; text-align: center; }
  .badge { display: inline-block; background: #0a6e46; color: #fff; padding: 2px 10px; border-radius: 12px; font-size: 12px; }
</style></head><body>
<h1>FaidaYetu Platform Report</h1>
<p style="color:#666">Generated: ${new Date().toLocaleString('en-TZ')} &nbsp;|&nbsp; <span class="badge">v1.0</span></p>
<h2>Key Metrics</h2>
<table><tr><th>Metric</th><th>Value</th></tr>
<tr><td>Total Users</td><td>${d.totalUsers || 0}</td></tr>
<tr><td>Suppliers</td><td>${d.totalSuppliers || 0}</td></tr>
<tr><td>Customers</td><td>${d.totalCustomers || 0}</td></tr>
<tr><td>Total Orders</td><td>${d.totalOrders || 0}</td></tr>
<tr><td>Orders Today</td><td>${d.ordersToday || 0}</td></tr>
<tr><td>Total Products</td><td>${d.totalProducts || 0}</td></tr>
<tr><td>Active Deliveries</td><td>${d.activeDeliveries || 0}</td></tr>
<tr><td>Total Revenue</td><td>${d.totalRevenue || '0 TZS'}</td></tr>
<tr><td>Revenue Today</td><td>${d.revenueToday || '0 TZS'}</td></tr>
<tr><td>Supplier→Customer Ratio</td><td>${d.totalSuppliers && d.totalCustomers ? ((d.totalSuppliers / Math.max(d.totalCustomers, 1)) * 100).toFixed(1) + '%' : 'N/A'}</td></tr>
<tr><td>Revenue per Order</td><td>${d.totalRevenueRaw && d.totalOrders ? (d.totalRevenueRaw / d.totalOrders).toLocaleString() + ' TZS' : 'N/A'}</td></tr>
</table>
<h2>Delivery Performance</h2>
<table><tr><th>Metric</th><th>Value</th></tr>
<tr><td>Avg Delivery Time</td><td>${p.avgDeliveryTime || 'N/A'}</td></tr>
<tr><td>Fastest Route</td><td>${p.fastestRoute || 'N/A'}</td></tr>
<tr><td>Efficiency</td><td>${p.deliveryEfficiency || 'N/A'}</td></tr>
<tr><td>Completion Rate</td><td>${p.completionRate || 'N/A'}</td></tr>
<tr><td>Total Routes</td><td>${p.totalRoutes || 0}</td></tr>
<tr><td>Cancelled Deliveries</td><td>${p.cancelledDeliveries || 0}</td></tr>
</table>
<p class="footer">FaidaYetu — Poultry Logistics Platform &bull; This report was auto-generated on ${date}</p>
</body></html>`;
    const win = window.open('', '_blank');
    if (win) {
      win.document.write(html);
      win.document.close();
      win.focus();
      setTimeout(() => win.print(), 500);
    }
  };

  if (loading) return (
    <div style={{ padding: 48, textAlign: 'center', color: '#888' }}>
      {[1,2,3].map(i => <div key={i} style={{ height: 20, background: '#eaeaea', borderRadius: 8, marginBottom: 12, width: `${60 + i * 10}%`, animation: 'pulse 1.5s infinite' }} />)}
    </div>
  );

  return (
    <div className="fade-in">
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#111', margin: 0 }}><span style={{display:'inline-flex',verticalAlign:'middle',marginRight:8}}><FileText size={24} /></span> Reports</h1>
        <p style={{ fontSize: 15, color: '#666', marginTop: 4 }}>Platform-wide performance and operational reports</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12, marginBottom: 28 }}>
        {[
          { label: 'Total Users', value: dashboard?.totalUsers },
          { label: 'Suppliers', value: dashboard?.totalSuppliers },
          { label: 'Customers', value: dashboard?.totalCustomers },
          { label: 'Orders Today', value: dashboard?.ordersToday },
          { label: 'Revenue Today', value: dashboard?.revenueToday },
          { label: 'Products', value: dashboard?.totalProducts },
          { label: 'Active Deliveries', value: dashboard?.activeDeliveries },
          { label: 'Total Revenue', value: dashboard?.totalRevenue },
        ].map(c => (
          <div key={c.label} style={{ background: '#fff', borderRadius: 12, padding: 12, border: '1px solid #eaeaea', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{c.label}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#111' }}>{c.value || 0}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, marginBottom: 28 }}>
        <div style={{ background: '#fff', borderRadius: 16, padding: 20, border: '1px solid #eaeaea', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111', marginBottom: 20 }}>Delivery Performance</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              { label: 'Avg Delivery Time', value: performance?.avgDeliveryTime },
              { label: 'Fastest Route', value: performance?.fastestRoute },
              { label: 'Efficiency', value: performance?.deliveryEfficiency },
              { label: 'Completion Rate', value: performance?.completionRate },
              { label: 'Total Routes', value: performance?.totalRoutes },
              { label: 'Cancelled', value: performance?.cancelledDeliveries },
            ].map(m => (
              <div key={m.label} style={{ padding: 12, background: '#f8faf9', borderRadius: 10 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#666', textTransform: 'uppercase', marginBottom: 4 }}>{m.label}</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#111' }}>{m.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: '#fff', borderRadius: 16, padding: 20, border: '1px solid #eaeaea', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111', marginBottom: 20 }}>Platform Overview</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { label: 'Supplier to Customer Ratio', value: dashboard?.totalSuppliers && dashboard?.totalCustomers ? `${((dashboard.totalSuppliers / Math.max(dashboard.totalCustomers, 1)) * 100).toFixed(1)}%` : 'N/A' },
              { label: 'Orders per Customer', value: dashboard?.totalOrders && dashboard?.totalCustomers ? (dashboard.totalOrders / dashboard.totalCustomers).toFixed(1) : '0' },
              { label: 'Revenue per Order', value: dashboard?.totalRevenueRaw && dashboard?.totalOrders ? `${(dashboard.totalRevenueRaw / dashboard.totalOrders).toLocaleString()} TZS` : 'N/A' },
              { label: 'Platform Growth', value: dashboard?.ordersToday && dashboard?.totalOrders ? `${((dashboard.ordersToday / (dashboard.totalOrders / 30)) * 100).toFixed(1)}%` : 'N/A' },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', padding: 8, borderBottom: '1px solid #f5f5f5' }}>
                <span style={{ fontSize: 14, color: '#666' }}>{s.label}</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#111' }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: 'linear-gradient(135deg, #111, #111)', borderRadius: 16, padding: 28, color: '#fff' }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 12px 0' }}>Generate Full Report</h3>
        <p style={{ fontSize: 14, opacity: 0.85, marginBottom: 20 }}>Download a comprehensive PDF report with all platform analytics, charts, and predictions.</p>
        <button onClick={downloadReport} style={{ padding: '12px 32px', borderRadius: 12, background: '#fff', color: '#111', border: 'none', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
          Download Report (PDF)
        </button>
      </div>
    </div>
  );
}
