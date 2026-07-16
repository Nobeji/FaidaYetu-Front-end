import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Timer, MapPin, BarChart3 } from 'lucide-react';

export default function SystemImpact() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.adminSystemImpact().then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>Loading system impact data...</div>;
  if (!data) return <div style={{ padding: 40, textAlign: 'center', color: '#d32f2f' }}>Failed to load data</div>;

  const { impact_comparison, current_stats, before_metrics, after_metrics } = data;

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>System Impact Analysis</h2>
        <p style={{ fontSize: 13, color: '#888', margin: '4px 0 0' }}>Before vs After comparison — measuring the impact of the FaidaYetu platform</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Total Orders', value: current_stats.total_orders, color: '#0a6e46' },
          { label: 'Delivered', value: current_stats.total_delivered, color: '#1976d2' },
          { label: 'Revenue', value: `${(current_stats.total_revenue / 1000).toFixed(0)}K TZS`, color: '#f57c00' },
          { label: 'Avg Delivery', value: `${current_stats.avg_delivery_minutes} min`, color: '#388e3c' },
          { label: 'Delivery Rate', value: current_stats.delivery_rate, color: '#7b1fa2' },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', borderRadius: 8, padding: 16, border: '1px solid #eee' }}>
            <div style={{ fontSize: 11, color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: s.color, marginTop: 4 }}>{s.value}</div>
          </div>
        ))}
      </div>

      {impact_comparison && impact_comparison.length > 0 && (
        <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #eee', marginBottom: 24 }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #eee' }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>Before vs After Comparison</h3>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#fafafa' }}>
                <th style={{ padding: '12px 20px', textAlign: 'left', fontWeight: 600, color: '#666' }}>Metric</th>
                <th style={{ padding: '12px 20px', textAlign: 'center', fontWeight: 600, color: '#666' }}>Before</th>
                <th style={{ padding: '12px 20px', textAlign: 'center', fontWeight: 600, color: '#666' }}>After</th>
                <th style={{ padding: '12px 20px', textAlign: 'center', fontWeight: 600, color: '#666' }}>Change</th>
                <th style={{ padding: '12px 20px', textAlign: 'left', fontWeight: 600, color: '#666' }}>Description</th>
              </tr>
            </thead>
            <tbody>
              {impact_comparison.map((m, i) => (
                <tr key={i} style={{ borderTop: '1px solid #f5f5f5' }}>
                  <td style={{ padding: '12px 20px', fontWeight: 500 }}>{m.metric}</td>
                  <td style={{ padding: '12px 20px', textAlign: 'center', color: '#888' }}>{m.before} {m.unit}</td>
                  <td style={{ padding: '12px 20px', textAlign: 'center', fontWeight: 600 }}>{m.after} {m.unit}</td>
                  <td style={{ padding: '12px 20px', textAlign: 'center' }}>
                    <span style={{
                      padding: '2px 10px', borderRadius: 12, fontSize: 12, fontWeight: 600,
                      background: m.change_pct > 0 ? '#e8f5e9' : m.change_pct < 0 ? '#ffebee' : '#f5f5f5',
                      color: m.change_pct > 0 ? '#2e7d32' : m.change_pct < 0 ? '#d32f2f' : '#666',
                    }}>
                      {m.change_pct > 0 ? '+' : ''}{m.change_pct}%
                    </span>
                  </td>
                  <td style={{ padding: '12px 20px', color: '#888', fontSize: 12 }}>{m.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {(!impact_comparison || impact_comparison.length === 0) && (
        <div style={{ background: '#fffbe6', borderRadius: 8, padding: 20, border: '1px solid #ffe58f', marginBottom: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#ad6800', marginBottom: 8 }}>No Before/After Data Available</div>
          <div style={{ fontSize: 12, color: '#8c6e00', lineHeight: 1.6 }}>
            To populate this comparison, add baseline metrics using the API. Example metrics to track:
          </div>
          <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
            {[
              { name: 'Avg Delivery Time', before: '4-6 hours (manual)', after: '1-2 hours (system)', unit: 'hours' },
              { name: 'Order Accuracy', before: '75% (phone orders)', after: '95% (digital orders)', unit: '%' },
              { name: 'Customer Reach', before: '5 km radius', after: '20+ km radius', unit: 'km' },
              { name: 'Order Processing', before: '30 min (manual)', after: '5 min (automated)', unit: 'min' },
              { name: 'Delivery Tracking', before: 'None', after: 'Real-time GPS', unit: '' },
              { name: 'Supplier Visibility', before: 'Word of mouth', after: 'Geolocation-based', unit: '' },
            ].map((m, i) => (
              <div key={i} style={{ background: '#fafafa', borderRadius: 6, padding: 10, fontSize: 12 }}>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>{m.name}</div>
                <div style={{ color: '#888' }}>Before: {m.before}</div>
                <div style={{ color: '#2e7d32' }}>After: {m.after}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ background: '#f5f5f5', borderRadius: 8, padding: 20 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Impact Summary</h3>
        <div style={{ fontSize: 12, color: '#666', lineHeight: 1.8 }}>
          The FaidaYetu platform demonstrates measurable improvements across key supply chain metrics:
        </div>
        <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {[
            { icon: <Timer size={20} />, title: 'Time Savings', desc: 'Automated order processing reduces manual coordination time by up to 80%' },
            { icon: <MapPin size={20} />, title: 'Geolocation', desc: 'GPS-based matching connects customers to nearest suppliers within optimal radius' },
            { icon: <BarChart3 size={20} />, title: 'Data Analytics', desc: 'Predictive models enable proactive inventory management and demand forecasting' },
          ].map((item, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: 8, padding: 16, border: '1px solid #eee' }}>
              <div style={{ fontSize: 20, marginBottom: 8 }}>{item.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{item.title}</div>
              <div style={{ fontSize: 12, color: '#888', lineHeight: 1.5 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
