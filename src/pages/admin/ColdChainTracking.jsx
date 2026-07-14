import { useState, useEffect } from 'react';
import { api } from '../../services/api';

export default function ColdChainTracking() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.adminColdChain().then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>Loading cold chain data...</div>;
  if (!data) return <div style={{ padding: 40, textAlign: 'center', color: '#d32f2f' }}>Failed to load data</div>;

  const { active_deliveries, recent_alerts, summary } = data;

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Cold Chain Tracking</h2>
        <p style={{ fontSize: 13, color: '#888', margin: '4px 0 0' }}>Temperature monitoring for perishable poultry products</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Avg Temperature', value: `${summary.avg_temperature}°C`, color: '#1976d2', bg: '#e3f2fd' },
          { label: 'Total Alerts (30d)', value: summary.total_alerts_30d, color: '#d32f2f', bg: '#ffebee' },
          { label: 'Total Readings (30d)', value: summary.total_readings_30d, color: '#388e3c', bg: '#e8f5e9' },
          { label: 'Compliance Rate', value: summary.compliance_rate, color: '#0a6e46', bg: '#e8f5e9' },
        ].map(s => (
          <div key={s.label} style={{ background: s.bg, borderRadius: 8, padding: 16 }}>
            <div style={{ fontSize: 11, color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: s.color, marginTop: 4 }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #eee' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #eee' }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>Active Deliveries</h3>
          </div>
          {active_deliveries.length === 0 ? (
            <div style={{ padding: 30, textAlign: 'center', color: '#888', fontSize: 13 }}>No active deliveries</div>
          ) : (
            <div style={{ maxHeight: 400, overflowY: 'auto' }}>
              {active_deliveries.map(d => (
                <div key={d.delivery_id} style={{ padding: '12px 20px', borderBottom: '1px solid #f5f5f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>Delivery #{d.delivery_id}</div>
                    <div style={{ fontSize: 12, color: '#888' }}>{d.driver} · {d.distance_km} km</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    {d.current_temp !== null ? (
                      <span style={{
                        padding: '3px 10px', borderRadius: 12, fontSize: 12, fontWeight: 600,
                        background: d.has_alert ? '#ffebee' : d.current_temp > 8 ? '#fff3e0' : '#e8f5e9',
                        color: d.has_alert ? '#d32f2f' : d.current_temp > 8 ? '#e65100' : '#2e7d32',
                      }}>
                        {d.current_temp}°C {d.has_alert ? '⚠️' : '✓'}
                      </span>
                    ) : (
                      <span style={{ fontSize: 12, color: '#aaa' }}>No data</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #eee' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #eee' }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>Temperature Alerts (7 days)</h3>
          </div>
          {recent_alerts.length === 0 ? (
            <div style={{ padding: 30, textAlign: 'center', color: '#888', fontSize: 13 }}>No alerts in the last 7 days</div>
          ) : (
            <div style={{ maxHeight: 400, overflowY: 'auto' }}>
              {recent_alerts.map((a, i) => (
                <div key={i} style={{ padding: '12px 20px', borderBottom: '1px solid #f5f5f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>Delivery #{a.delivery_id} — {a.driver}</div>
                    <div style={{ fontSize: 11, color: '#888' }}>{a.timestamp?.slice(0, 16).replace('T', ' ')}</div>
                  </div>
                  <span style={{ padding: '3px 10px', borderRadius: 12, fontSize: 12, fontWeight: 600, background: '#ffebee', color: '#d32f2f' }}>
                    {a.temperature}°C ⚠️
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: 20, background: '#fffbe6', borderRadius: 8, padding: 16, border: '1px solid #ffe58f' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#ad6800' }}>Cold Chain Guidelines</div>
        <div style={{ fontSize: 12, color: '#8c6e00', marginTop: 4, lineHeight: 1.6 }}>
          Optimal temperature for poultry products: 0°C to 4°C. Alert threshold: &gt;8°C. Products exceeding temperature limits may compromise food safety and quality.
        </div>
      </div>
    </div>
  );
}
