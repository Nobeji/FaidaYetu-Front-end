import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import AnalyticsChart from '../../components/AnalyticsChart';

export default function UsabilityMetrics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  useEffect(() => {
    setLoading(true);
    api.adminUsabilityMetrics(days).then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false));
  }, [days]);

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>Loading usability data...</div>;
  if (!data) return <div style={{ padding: 40, textAlign: 'center', color: '#d32f2f' }}>Failed to load data</div>;

  const { summary, action_counts, completion_rates, avg_durations, device_breakdown, daily_activity } = data;

  const actionLabels = {
    login: 'Login', signup: 'Signup', browse: 'Browse', order: 'Place Order',
    track: 'Track Delivery', pay: 'Payment', inventory: 'Inventory', analytics: 'Analytics',
  };

  // 1. Actions by Type Chart Data (Horizontal Bar)
  const sortedActions = Object.entries(action_counts || {}).sort((a, b) => b[1] - a[1]);
  const actionsChartData = {
    labels: sortedActions.map(([action]) => actionLabels[action] || action),
    datasets: [{
      label: 'Actions',
      data: sortedActions.map(([, count]) => count),
      backgroundColor: '#0a6e46',
      borderRadius: 4,
      barThickness: 12,
    }]
  };

  const actionsChartOptions = {
    indexAxis: 'y',
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: { grid: { display: false }, min: 0 },
      y: { grid: { display: false } }
    }
  };

  // 2. Device Breakdown Chart Data (Doughnut)
  const sortedDevices = Object.entries(device_breakdown || {}).sort((a, b) => b[1] - a[1]);
  const deviceChartData = {
    labels: sortedDevices.map(([device]) => device.charAt(0).toUpperCase() + device.slice(1)),
    datasets: [{
      data: sortedDevices.map(([, count]) => count),
      backgroundColor: ['#0a6e46', '#10b981', '#64748b'],
      borderWidth: 1,
    }]
  };

  const deviceChartOptions = {
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

  // 3. Daily Activity Chart Data (Line)
  const activityData = daily_activity || [];
  const activityChartData = {
    labels: activityData.map(d => d.date ? d.date.slice(5) : ''),
    datasets: [{
      label: 'Total Actions',
      data: activityData.map(d => d.actions),
      borderColor: '#0a6e46',
      backgroundColor: 'rgba(10, 110, 70, 0.1)',
      tension: 0.3,
      fill: true,
      pointRadius: 3,
    }]
  };

  const activityChartOptions = {
    scales: {
      x: { grid: { display: false } },
      y: { min: 0 }
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Usability Metrics</h2>
          <p style={{ fontSize: 13, color: '#888', margin: '4px 0 0' }}>User engagement, task completion, and interaction patterns</p>
        </div>
        <select value={days} onChange={e => setDays(Number(e.target.value))} style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #ddd', fontSize: 13 }}>
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Total Actions', value: summary.total_actions, color: '#0a6e46' },
          { label: 'Unique Users', value: summary.unique_users, color: '#1976d2' },
          { label: 'Total Logins', value: summary.total_logins, color: '#388e3c' },
          { label: 'Success Rate', value: summary.success_rate, color: '#f57c00' },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', borderRadius: 8, padding: 16, border: '1px solid #eee' }}>
            <div style={{ fontSize: 11, color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: s.color, marginTop: 4 }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #eee', padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Actions by Type</h3>
          {sortedActions.length === 0 ? (
            <div style={{ color: '#888', fontSize: 13, textAlign: 'center', padding: 20 }}>No data available</div>
          ) : (
            <div style={{ height: 200 }}>
              <AnalyticsChart type="bar" data={actionsChartData} options={actionsChartOptions} height={200} />
            </div>
          )}
        </div>

        <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #eee', padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Task Completion Rates</h3>
          {Object.keys(completion_rates).length === 0 ? (
            <div style={{ color: '#888', fontSize: 13, textAlign: 'center', padding: 20 }}>No data available</div>
          ) : (
            <div style={{ maxHeight: 200, overflowY: 'auto' }}>
              {Object.entries(completion_rates).sort((a, b) => b[1] - a[1]).map(([action, rate]) => (
                <div key={action} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f5f5f5' }}>
                  <span style={{ fontSize: 13 }}>{actionLabels[action] || action}</span>
                  <span style={{
                    padding: '2px 10px', borderRadius: 12, fontSize: 12, fontWeight: 600,
                    background: rate >= 90 ? '#e8f5e9' : rate >= 70 ? '#fff3e0' : '#ffebee',
                    color: rate >= 90 ? '#2e7d32' : rate >= 70 ? '#e65100' : '#d32f2f',
                  }}>{rate}%</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #eee', padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Avg Duration by Action</h3>
          {Object.keys(avg_durations).length === 0 ? (
            <div style={{ color: '#888', fontSize: 13, textAlign: 'center', padding: 20 }}>No data available</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
              {Object.entries(avg_durations).map(([action, dur]) => (
                <div key={action} style={{ background: '#fafafa', borderRadius: 6, padding: 12 }}>
                  <div style={{ fontSize: 11, color: '#888' }}>{actionLabels[action] || action}</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#333', marginTop: 2 }}>{dur}s</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #eee', padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Device Breakdown</h3>
          {sortedDevices.length === 0 ? (
            <div style={{ color: '#888', fontSize: 13, textAlign: 'center', padding: 20 }}>No data available</div>
          ) : (
            <div style={{ height: 160 }}>
              <AnalyticsChart type="doughnut" data={deviceChartData} options={deviceChartOptions} height={160} />
            </div>
          )}
        </div>
      </div>

      {activityData.length > 0 && (
        <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #eee', padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Daily Activity</h3>
          <div style={{ height: 160 }}>
            <AnalyticsChart type="line" data={activityChartData} options={activityChartOptions} height={160} />
          </div>
        </div>
      )}
    </div>
  );
}
