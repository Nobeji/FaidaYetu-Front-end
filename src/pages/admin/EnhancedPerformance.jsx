import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import AnalyticsChart from '../../components/AnalyticsChart';

export default function EnhancedPerformance() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  useEffect(() => {
    setLoading(true);
    api.adminEnhancedPerformance(days).then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false));
  }, [days]);

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>Loading performance data...</div>;
  if (!data) return <div style={{ padding: 40, textAlign: 'center', color: '#d32f2f' }}>Failed to load data</div>;

  const { summary, daily, deliveries } = data;

  // Prepare trends chart data
  const trendChartData = {
    labels: (daily || []).map(d => d.date ? d.date.slice(5) : ''),
    datasets: [{
      label: 'Avg Delivery Time (mins)',
      data: (daily || []).map(d => d.avg_time),
      borderColor: '#0a6e46',
      backgroundColor: 'rgba(10, 110, 70, 0.1)',
      tension: 0.2,
      fill: true,
      pointRadius: 3,
    }]
  };

  const trendChartOptions = {
    scales: {
      x: { grid: { display: false } },
      y: { min: 0 }
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Enhanced Performance Analytics</h2>
          <p style={{ fontSize: 13, color: '#888', margin: '4px 0 0' }}>Delivery time analysis, efficiency metrics, and daily trends</p>
        </div>
        <select value={days} onChange={e => setDays(Number(e.target.value))} style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #ddd', fontSize: 13 }}>
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Total Deliveries', value: summary.total_deliveries, color: '#0a6e46' },
          { label: 'Avg Delivery Time', value: `${summary.avg_delivery_time_mins} min`, color: '#1976d2' },
          { label: 'On-Time Rate', value: summary.on_time_rate, color: '#388e3c' },
          { label: 'Avg Distance', value: `${summary.avg_distance_km} km`, color: '#f57c00' },
          { label: 'Speed', value: summary.avg_speed_per_km, color: '#7b1fa2' },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', borderRadius: 8, padding: 16, border: '1px solid #eee' }}>
            <div style={{ fontSize: 11, color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: s.color, marginTop: 4 }}>{s.value}</div>
          </div>
        ))}
      </div>

      {daily && daily.length > 0 && (
        <div style={{ background: '#fff', borderRadius: 8, padding: 20, border: '1px solid #eee', marginBottom: 24 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Daily Delivery Trends</h3>
          <div style={{ height: 200 }}>
            <AnalyticsChart type="line" data={trendChartData} options={trendChartOptions} height={200} />
          </div>
        </div>
      )}

      {deliveries && deliveries.length > 0 && (
        <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #eee' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #eee' }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>Recent Deliveries</h3>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#fafafa' }}>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#666' }}>ID</th>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#666' }}>Driver</th>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#666' }}>Distance</th>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#666' }}>Time</th>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#666' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {deliveries.map(d => (
                <tr key={d.id} style={{ borderTop: '1px solid #f5f5f5' }}>
                  <td style={{ padding: '10px 16px' }}>#{d.id}</td>
                  <td style={{ padding: '10px 16px' }}>{d.driver}</td>
                  <td style={{ padding: '10px 16px' }}>{d.distance_km} km</td>
                  <td style={{ padding: '10px 16px' }}>
                    <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 12, background: d.time_minutes <= 120 ? '#e8f5e9' : '#fff3e0', color: d.time_minutes <= 120 ? '#2e7d32' : '#e65100' }}>
                      {d.time_minutes} min
                    </span>
                  </td>
                  <td style={{ padding: '10px 16px', color: '#888' }}>{d.date?.slice(0, 10)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
