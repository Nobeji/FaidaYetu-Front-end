import { useState, useEffect } from 'react';
import { api } from '../../services/api';

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
          {Object.keys(action_counts).length === 0 ? (
            <div style={{ color: '#888', fontSize: 13, textAlign: 'center', padding: 20 }}>No data available</div>
          ) : (
            Object.entries(action_counts).sort((a, b) => b[1] - a[1]).map(([action, count]) => {
              const maxCount = Math.max(...Object.values(action_counts));
              const pct = (count / maxCount) * 100;
              return (
                <div key={action} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 3 }}>
                    <span style={{ fontWeight: 500 }}>{actionLabels[action] || action}</span>
                    <span style={{ color: '#888' }}>{count}</span>
                  </div>
                  <div style={{ height: 6, background: '#f0f0f0', borderRadius: 3 }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: '#0a6e46', borderRadius: 3, transition: 'width 0.5s' }} />
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #eee', padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Task Completion Rates</h3>
          {Object.keys(completion_rates).length === 0 ? (
            <div style={{ color: '#888', fontSize: 13, textAlign: 'center', padding: 20 }}>No data available</div>
          ) : (
            Object.entries(completion_rates).sort((a, b) => b[1] - a[1]).map(([action, rate]) => (
              <div key={action} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f5f5f5' }}>
                <span style={{ fontSize: 13 }}>{actionLabels[action] || action}</span>
                <span style={{
                  padding: '2px 10px', borderRadius: 12, fontSize: 12, fontWeight: 600,
                  background: rate >= 90 ? '#e8f5e9' : rate >= 70 ? '#fff3e0' : '#ffebee',
                  color: rate >= 90 ? '#2e7d32' : rate >= 70 ? '#e65100' : '#d32f2f',
                }}>{rate}%</span>
              </div>
            ))
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
          {Object.keys(device_breakdown).length === 0 ? (
            <div style={{ color: '#888', fontSize: 13, textAlign: 'center', padding: 20 }}>No data available</div>
          ) : (
            Object.entries(device_breakdown).sort((a, b) => b[1] - a[1]).map(([device, count]) => {
              const total = Object.values(device_breakdown).reduce((a, b) => a + b, 0);
              const pct = Math.round(count / total * 100);
              return (
                <div key={device} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
                    {device === 'mobile' ? '📱' : device === 'tablet' ? '📟' : '💻'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 2 }}>
                      <span style={{ fontWeight: 500, textTransform: 'capitalize' }}>{device}</span>
                      <span style={{ color: '#888' }}>{count} ({pct}%)</span>
                    </div>
                    <div style={{ height: 4, background: '#f0f0f0', borderRadius: 2 }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: '#0a6e46', borderRadius: 2 }} />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {daily_activity && daily_activity.length > 0 && (
        <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #eee', padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Daily Activity</h3>
          <div style={{ display: 'flex', gap: 3, alignItems: 'flex-end', height: 120 }}>
            {daily_activity.map((d, i) => {
              const maxActions = Math.max(...daily_activity.map(x => x.actions), 1);
              const h = (d.actions / maxActions) * 100;
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ fontSize: 9, color: '#888', marginBottom: 2 }}>{d.actions}</div>
                  <div style={{ width: '100%', height: h, background: '#0a6e46', borderRadius: '3px 3px 0 0', minHeight: 2 }} />
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: 3, marginTop: 4 }}>
            {daily_activity.map((d, i) => (
              <div key={i} style={{ flex: 1, fontSize: 8, color: '#aaa', textAlign: 'center' }}>{d.date?.slice(5)}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
