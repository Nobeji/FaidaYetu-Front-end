import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Sparkles } from 'lucide-react';
import AnalyticsChart from '../../components/AnalyticsChart';

export default function SalesPrediction() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.adminSalesPrediction().then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ padding: 48, textAlign: 'center', color: '#888' }}>
      {[1,2,3].map(i => <div key={i} style={{ height: 20, background: '#eaeaea', borderRadius: 8, marginBottom: 12, width: `${60 + i * 10}%`, animation: 'pulse 1.5s infinite' }} />)}
    </div>
  );
  if (!data) return <div style={{ padding: 48, textAlign: 'center' }}>No prediction data</div>;

  // Prepare Forecast line chart data
  const dailyData = data.dailyData || [];
  const forecastChartData = {
    labels: dailyData.map(d => d.date ? new Date(d.date).toLocaleDateString('en', { month: 'short', day: 'numeric' }) : ''),
    datasets: [
      {
        label: 'Actual Orders',
        data: dailyData.map(d => d.count),
        borderColor: '#0a6e46',
        backgroundColor: 'rgba(10, 110, 70, 0.1)',
        tension: 0.3,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Predicted Orders',
        data: dailyData.map(d => d.predicted),
        borderColor: '#e07c00',
        backgroundColor: 'transparent',
        borderDash: [5, 5],
        tension: 0.3,
        fill: false,
        pointRadius: 4,
        pointHoverRadius: 6,
      }
    ]
  };

  const forecastChartOptions = {
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          font: { family: 'Inter, sans-serif', size: 11 }
        }
      }
    },
    scales: {
      x: { grid: { display: false } },
      y: { min: 0 }
    }
  };

  // Prepare Product Demand forecast horizontal bar chart data
  const productForecast = data.productForecast || [];
  const productChartData = {
    labels: productForecast.map(p => p.name),
    datasets: [{
      label: 'Predicted Units',
      data: productForecast.map(p => p.predicted),
      backgroundColor: '#0a6e46',
      borderRadius: 6,
      borderWidth: 0,
      barThickness: 14,
    }]
  };

  const productChartOptions = {
    indexAxis: 'y',
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: { grid: { display: false }, min: 0 },
      y: { grid: { display: false } }
    }
  };

  return (
    <div className="fade-in">
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#111', margin: 0 }}><span style={{display:'inline-flex',verticalAlign:'middle',marginRight:8}}><Sparkles size={24} /></span> Sales Prediction</h1>
        <p style={{ fontSize: 15, color: '#666', marginTop: 4 }}>AI-driven demand forecasting powered by historical data</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 28 }}>
        {[
          { label: 'Forecast (Next Week)', value: data.weeklyForecast, sub: data.model === 'prophet' ? `±${Math.round((data.weeklyForecastUpper - data.weeklyForecastLower) / 2)} range • ${data.weeklyRevenue}` : `${data.weeklyRevenue}`, gradient: 'linear-gradient(135deg, #111, #333)' },
          { label: 'Forecast (Next Month)', value: data.monthlyForecast, sub: data.model === 'prophet' ? `±${Math.round((data.monthlyForecastUpper - data.monthlyForecastLower) / 2)} range • ${data.monthlyRevenue}` : `${data.monthlyRevenue}`, gradient: 'linear-gradient(135deg, #111, #111)' },
          { label: 'Avg Daily Orders', value: data.avgDailyOrders, sub: `${data.avgDailyRevenue?.toLocaleString() || 0} TZS/day`, gradient: 'linear-gradient(135deg, #e07c00, #ff9e00)' },
          { label: 'Trend Direction', value: data.trend === 'up' ? 'Rising' : data.trend === 'down' ? 'Declining' : 'Stable', sub: `Model: ${data.model === 'prophet' ? 'Prophet (AI)' : 'Moving Average'}`, gradient: data.trend === 'up' ? 'linear-gradient(135deg, #111, #555)' : data.trend === 'down' ? 'linear-gradient(135deg, #ba1a1a, #e07c00)' : 'linear-gradient(135deg, #666, #888)' },
        ].map(c => (
          <div key={c.label} style={{ background: c.gradient, borderRadius: 16, padding: 20, color: '#fff', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.85, marginBottom: 8 }}>{c.label}</div>
            <div style={{ fontSize: 32, fontWeight: 800, marginBottom: 4 }}>{c.value}</div>
            <div style={{ fontSize: 13, opacity: 0.8 }}>{c.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, marginBottom: 28 }}>
        <div style={{ background: '#fff', borderRadius: 16, padding: 20, border: '1px solid #eaeaea', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111', marginBottom: 20 }}>Forecast: Past Orders + Predicted</h3>
          <div style={{ height: 220 }}>
            <AnalyticsChart type="line" data={forecastChartData} options={forecastChartOptions} height={220} />
          </div>
        </div>

        <div style={{ background: '#fff', borderRadius: 16, padding: 20, border: '1px solid #eaeaea', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111', marginBottom: 20 }}>Product Demand Forecast</h3>
          <div style={{ height: 220 }}>
            <AnalyticsChart type="bar" data={productChartData} options={productChartOptions} height={220} />
          </div>
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: 16, padding: 20, border: '1px solid #eaeaea', textAlign: 'center' }}>
        {data.model === 'prophet'
          ? <span style={{ fontSize: 13, color: '#888' }}>Powered by Facebook Prophet • 80% confidence interval</span>
          : <span style={{ fontSize: 13, color: '#888' }}>Collecting data... Prophet AI will activate once 14+ days of order history are available. Currently showing moving average estimates.</span>
        }
      </div>
    </div>
  );
}
