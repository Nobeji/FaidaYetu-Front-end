import { useState, useEffect } from 'react';
import { api } from '../../services/api';

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

  const allVals = (data.dailyData || []).flatMap(d => [d.count, d.predicted, d.upper]).filter(v => v != null);
  const maxCount = Math.max(...allVals, 1);
  const maxPred = Math.max(...(data.productForecast || []).map(p => p.predicted), 1);

  return (
    <div className="fade-in">
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#111', margin: 0 }}>🔮 Sales Prediction</h1>
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
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 200, overflowX: 'auto', paddingBottom: 20 }}>
            {(data.dailyData || []).map((d, i) => {
              const hasActual = d.count != null;
              const hasPred = d.predicted != null;
              const val = hasActual ? d.count : d.predicted;
              const barH = (val / (maxCount * 1.3)) * 160;
              const isPred = i >= ((data.dailyData || []).length - (data.dailyData.filter(x => x.predicted != null).length || 7));
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, minWidth: 28, position: 'relative' }}>
                  {hasPred && d.lower != null && d.upper != null && (
                    <div style={{
                      position: 'absolute', bottom: 0, width: '100%',
                      height: `${((d.upper * 1.0) / (maxCount * 1.3)) * 160}px`,
                      background: 'rgba(224, 124, 0, 0.1)',
                      borderLeft: '2px solid rgba(224, 124, 0, 0.3)',
                      borderRight: '2px solid rgba(224, 124, 0, 0.3)',
                      borderRadius: 2,
                    }} />
                  )}
                  <span style={{ fontSize: 8, fontWeight: 700, color: hasActual ? '#111' : '#e07c00' }}>{val}</span>
                  <div style={{
                    width: '100%', height: `${barH}px`,
                    background: hasActual
                      ? 'linear-gradient(180deg, #111, #555)'
                      : 'linear-gradient(180deg, #e07c00, #ff9e00)',
                    borderRadius: '4px 4px 2px 2px', transition: 'height 0.3s',
                    minHeight: 3, opacity: hasActual ? 0.7 : 1,
                  }} />
                  <span style={{ fontSize: 7, color: '#666', whiteSpace: 'nowrap', marginTop: 2 }}>
                    {d.date ? new Date(d.date).toLocaleDateString('en', { month: 'short', day: 'numeric' }) : ''}
                  </span>
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 4, fontSize: 12, color: '#666' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 10, height: 10, borderRadius: 2, background: '#111' }} /> Actual</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 10, height: 10, borderRadius: 2, background: '#e07c00' }} /> Predicted</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 10, height: 10, borderRadius: 2, background: 'rgba(224,124,0,0.15)', border: '1px solid rgba(224,124,0,0.3)' }} /> 80% Confidence</span>
          </div>
        </div>

        <div style={{ background: '#fff', borderRadius: 16, padding: 20, border: '1px solid #eaeaea', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111', marginBottom: 20 }}>Product Demand Forecast</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {(data.productForecast || []).map((p, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>{p.name}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#111' }}>{p.predicted} units</span>
                </div>
                <div style={{ height: 8, background: '#f5f5f5', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{
                    width: `${(p.predicted / maxPred) * 100}%`, height: '100%',
                    background: 'linear-gradient(90deg, #111, #555)', borderRadius: 4,
                    transition: 'width 0.5s',
                  }} />
                </div>
                <div style={{ fontSize: 11, color: '#666', marginTop: 2, textTransform: 'capitalize' }}>{p.category}</div>
              </div>
            ))}
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
