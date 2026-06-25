import { useState, useEffect } from 'react';
import { colors, spacing, radius } from '../../constants/theme';
import { api } from '../../services/api';

export default function SalesPrediction() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.adminSalesPrediction().then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ padding: spacing.xxl, textAlign: 'center', color: colors.onSurfaceVariant }}>
      {[1,2,3].map(i => <div key={i} style={{ height: 20, background: '#e0e8e4', borderRadius: 8, marginBottom: 12, width: `${60 + i * 10}%`, animation: 'pulse 1.5s infinite' }} />)}
    </div>
  );
  if (!data) return <div style={{ padding: spacing.xxl, textAlign: 'center' }}>No prediction data</div>;

  const maxCount = Math.max(...(data.dailyData || []).map(d => d.count), 1);
  const maxPred = Math.max(...(data.productForecast || []).map(p => p.predicted), 1);

  return (
    <div className="fade-in">
      <div style={{ marginBottom: spacing.xl }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#0a6e46', margin: 0 }}>🔮 Sales Prediction</h1>
        <p style={{ fontSize: 15, color: '#5f6b64', marginTop: 4 }}>AI-driven demand forecasting powered by historical data</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: spacing.md, marginBottom: spacing.xl }}>
        {[
          { label: 'Forecast (Next Week)', value: data.weeklyForecast, sub: data.weeklyRevenue, icon: '📅', gradient: 'linear-gradient(135deg, #0a6e46, #2d6a4f)' },
          { label: 'Forecast (Next Month)', value: data.monthlyForecast, sub: data.monthlyRevenue, icon: '📆', gradient: 'linear-gradient(135deg, #06402b, #0a6e46)' },
          { label: 'Avg Daily Orders', value: data.avgDailyOrders, sub: `${data.avgDailyRevenue?.toLocaleString() || 0} TZS/day`, icon: '📊', gradient: 'linear-gradient(135deg, #e07c00, #ff9e00)' },
          { label: 'Trend Direction', value: data.trend === 'up' ? '📈 Rising' : data.trend === 'down' ? '📉 Declining' : '➡️ Stable', sub: 'Last 14 days', icon: '🎯', gradient: data.trend === 'up' ? 'linear-gradient(135deg, #0a6e46, #52b788)' : data.trend === 'down' ? 'linear-gradient(135deg, #ba1a1a, #e07c00)' : 'linear-gradient(135deg, #5f6b64, #8a9b93)' },
        ].map(c => (
          <div key={c.label} style={{ background: c.gradient, borderRadius: 16, padding: spacing.lg, color: '#fff', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.85, marginBottom: spacing.sm }}>{c.label}</div>
            <div style={{ fontSize: 32, fontWeight: 800, marginBottom: 4 }}>{c.value}</div>
            <div style={{ fontSize: 13, opacity: 0.8 }}>{c.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.xl, marginBottom: spacing.xl }}>
        <div style={{ background: '#fff', borderRadius: 16, padding: spacing.lg, border: '1px solid #e0e8e4', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0a6e46', marginBottom: spacing.lg }}>📈 14-Day Order Trend</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 180 }}>
            {(data.dailyData || []).map((d, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <span style={{ fontSize: 9, fontWeight: 700, color: '#0a6e46' }}>{d.count}</span>
                <div style={{
                  width: '100%', height: `${(d.count / maxCount) * 150}px`,
                  background: i >= (data.dailyData || []).length - 7
                    ? 'linear-gradient(180deg, #e07c00, #ff9e00)'
                    : 'linear-gradient(180deg, #0a6e46, #52b788)',
                  borderRadius: '4px 4px 2px 2px', transition: 'height 0.3s',
                  minHeight: 3, opacity: i >= (data.dailyData || []).length - 7 ? 1 : 0.6,
                }} />
                <span style={{ fontSize: 8, color: '#5f6b64', transform: 'rotate(-60deg)', whiteSpace: 'nowrap', marginTop: 4 }}>
                  {d.date ? new Date(d.date).toLocaleDateString('en', { month: 'short', day: 'numeric' }) : ''}
                </span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: spacing.md, marginTop: spacing.md, fontSize: 12, color: '#5f6b64' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 10, height: 10, borderRadius: 2, background: '#0a6e46' }} /> Past</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 10, height: 10, borderRadius: 2, background: '#e07c00' }} /> Recent 7 days</span>
          </div>
        </div>

        <div style={{ background: '#fff', borderRadius: 16, padding: spacing.lg, border: '1px solid #e0e8e4', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0a6e46', marginBottom: spacing.lg }}>📦 Product Demand Forecast</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
            {(data.productForecast || []).map((p, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>{p.name}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#0a6e46' }}>{p.predicted} units</span>
                </div>
                <div style={{ height: 8, background: '#e8f5ee', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{
                    width: `${(p.predicted / maxPred) * 100}%`, height: '100%',
                    background: 'linear-gradient(90deg, #0a6e46, #52b788)', borderRadius: 4,
                    transition: 'width 0.5s',
                  }} />
                </div>
                <div style={{ fontSize: 11, color: '#5f6b64', marginTop: 2, textTransform: 'capitalize' }}>{p.category}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: 'linear-gradient(135deg, #e8f5ee, #c8e6d9)', borderRadius: 16, padding: spacing.lg, border: '1px solid #a3d8b5' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
          <span style={{ fontSize: 32 }}>🤖</span>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0a6e46', margin: '0 0 4px 0' }}>AI Prediction Summary</h3>
            <p style={{ fontSize: 14, color: '#2d6a4f', margin: 0 }}>
              Based on the last {data.dailyData?.length || 0} days of data, we predict <strong>{data.weeklyForecast} orders</strong> next week
              and <strong>{data.monthlyForecast} orders</strong> next month.
              {data.trend === 'up' ? ' 📈 Demand is rising — consider increasing stock.' : data.trend === 'down' ? ' 📉 Demand is declining — adjust inventory accordingly.' : ' ➡️ Demand is stable — maintain current stock levels.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
