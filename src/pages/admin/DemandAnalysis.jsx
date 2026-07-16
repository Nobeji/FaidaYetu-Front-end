import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import AnalyticsChart from '../../components/AnalyticsChart';

export default function DemandAnalysis() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState(null);

  useEffect(() => {
    Promise.all([
      api.adminDemandAnalysis(),
      api.adminDashboard(),
    ]).then(([d, o]) => { setData(d); setOverview(o); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ padding: 48, textAlign: 'center', color: '#888' }}>
      {[1,2,3].map(i => <div key={i} style={{ height: 20, background: '#eaeaea', borderRadius: 8, marginBottom: 12, width: `${60 + i * 10}%`, animation: 'pulse 1.5s infinite' }} />)}
    </div>
  );
  if (!data) return <div style={{ padding: 48, textAlign: 'center' }}>No data available</div>;

  // Prepare Daily Orders chart data
  const ordersPerDay = data.ordersPerDay || [];
  const dailyChartData = {
    labels: ordersPerDay.map(d => d.date ? new Date(d.date).toLocaleDateString('en', { weekday: 'short' }) : ''),
    datasets: [{
      label: 'Orders',
      data: ordersPerDay.map(d => d.count),
      backgroundColor: '#0a6e46',
      borderRadius: 4,
      barThickness: 18,
    }]
  };

  const dailyChartOptions = {
    scales: {
      x: { grid: { display: false } },
      y: { min: 0 }
    }
  };

  // Prepare Wards horizontal bar chart data
  const ordersPerWard = data.ordersPerWard || [];
  const wardChartData = {
    labels: ordersPerWard.map(w => w.ward),
    datasets: [{
      label: 'Orders',
      data: ordersPerWard.map(w => w.count),
      backgroundColor: '#0f172a',
      borderRadius: 4,
      barThickness: 14,
    }]
  };

  const wardChartOptions = {
    indexAxis: 'y',
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: { grid: { display: false }, min: 0 },
      y: { grid: { display: false } }
    }
  };

  // Prepare Product Categories doughnut chart data
  const productCategories = data.productCategories || [];
  const categoryChartData = {
    labels: productCategories.map(c => c.category),
    datasets: [{
      data: productCategories.map(c => c.total),
      backgroundColor: ['#0a6e46', '#10b981', '#334155', '#64748b', '#cbd5e1'],
      borderWidth: 1,
    }]
  };

  const categoryChartOptions = {
    plugins: {
      legend: {
        display: true,
        position: 'right',
        labels: {
          font: { family: 'Inter, sans-serif', size: 11 }
        }
      }
    }
  };

  return (
    <div className="fade-in">
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#111', margin: 0 }}>Demand Analysis</h1>
        <p style={{ fontSize: 15, color: '#666', marginTop: 4 }}>Real-time demand insights across Dar es Salaam</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12, marginBottom: 28 }}>
        {[
          { label: 'Total Orders', value: data.totalOrders, color: '#111' },
          { label: 'Weekly Orders', value: data.ordersWeekly, color: '#333' },
          { label: 'Monthly Orders', value: data.ordersMonthly, color: '#40916c' },
          { label: 'Top Area', value: data.mostOrderedArea, color: '#e07c00' },
        ].map(c => (
          <div key={c.label} style={{ background: '#fff', borderRadius: 16, padding: 20, border: '1px solid #eaeaea', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>{c.label}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: c.color }}>{c.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, marginBottom: 28 }}>
        <div style={{ background: '#fff', borderRadius: 16, padding: 20, border: '1px solid #eaeaea', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111', marginBottom: 20 }}>Orders Per Day (Last 7 Days)</h3>
          <div style={{ height: 180 }}>
            <AnalyticsChart type="bar" data={dailyChartData} options={dailyChartOptions} height={180} />
          </div>
        </div>

        <div style={{ background: '#fff', borderRadius: 16, padding: 20, border: '1px solid #eaeaea', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111', marginBottom: 20 }}>Most Ordered Areas (Top 5 Wards)</h3>
          <div style={{ height: 180 }}>
            <AnalyticsChart type="bar" data={wardChartData} options={wardChartOptions} height={180} />
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>
        <div style={{ background: '#fff', borderRadius: 16, padding: 20, border: '1px solid #eaeaea', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111', marginBottom: 20 }}>Most Ordered Product</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, padding: 20, background: 'linear-gradient(135deg, #f5f5f5, #eee)', borderRadius: 12 }}>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#111' }}>{data.mostOrderedProduct?.name || 'N/A'}</div>
              <div style={{ fontSize: 15, color: '#666' }}>{data.mostOrderedProduct?.quantity || 0} units sold</div>
            </div>
          </div>
        </div>

        <div style={{ background: '#fff', borderRadius: 16, padding: 20, border: '1px solid #eaeaea', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111', marginBottom: 20 }}>Product Categories</h3>
          <div style={{ height: 180 }}>
            <AnalyticsChart type="doughnut" data={categoryChartData} options={categoryChartOptions} height={180} />
          </div>
        </div>
      </div>
    </div>
  );
}
