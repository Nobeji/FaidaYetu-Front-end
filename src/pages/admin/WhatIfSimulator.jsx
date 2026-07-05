import { useState, useEffect } from 'react';
import { api } from '../../services/api';

export default function WhatIfSimulator() {
  const [priceChange, setPriceChange] = useState(0);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSim = (price, promo) => {
    setLoading(true);
    api.adminWhatIf(price, promo).then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchSim(0, 0); }, []);

  return (
    <div className="fade-in">
      <h1 style={{ fontSize: 28, fontWeight: 700, margin: '0 0 4px' }}>🧪 What-if Simulator</h1>
      <p style={{ fontSize: 15, color: '#666', marginBottom: 24 }}>Model the impact of price changes and promotions on revenue</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: '1px solid #eaeaea' }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 16px' }}>Adjust Parameters</h3>
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 14, fontWeight: 600, color: '#333', display: 'block', marginBottom: 6 }}>Price Change: {priceChange > 0 ? '+' : ''}{priceChange}%</label>
            <input type="range" min="-30" max="50" value={priceChange} onChange={e => setPriceChange(Number(e.target.value))} style={{ width: '100%' }} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 14, fontWeight: 600, color: '#333', display: 'block', marginBottom: 6 }}>Promo Discount: {promoDiscount}%</label>
            <input type="range" min="0" max="50" value={promoDiscount} onChange={e => setPromoDiscount(Number(e.target.value))} style={{ width: '100%' }} />
          </div>
          <button onClick={() => fetchSim(priceChange, promoDiscount)} style={{ padding: '12px 24px', borderRadius: 8, background: '#000', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700, width: '100%' }}>
            {loading ? 'Calculating...' : 'Simulate'}
          </button>
        </div>
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: '1px solid #eaeaea' }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 16px' }}>Projected Impact</h3>
          {data?.current_scenario ? (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div style={{ padding: 16, background: '#f8faf9', borderRadius: 12 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#888', textTransform: 'uppercase' }}>Projected Volume</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: '#111' }}>{data.current_scenario.projected_volume?.toLocaleString()}</div>
                  <div style={{ fontSize: 12, color: '#888' }}>Base: {data.base_volume?.toLocaleString()}</div>
                </div>
                <div style={{ padding: 16, background: '#f8faf9', borderRadius: 12 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#888', textTransform: 'uppercase' }}>Projected Revenue</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: '#111' }}>{data.current_scenario.projected_revenue?.toLocaleString()} TZS</div>
                  <div style={{ fontSize: 12, color: '#888' }}>Base: {data.base_revenue?.toLocaleString()} TZS</div>
                </div>
              </div>
              <div style={{ fontSize: 14, color: data.current_scenario.revenue_change_pct >= 0 ? '#2e7d32' : '#d32f2f', fontWeight: 700 }}>
                Revenue {data.current_scenario.revenue_change_pct >= 0 ? 'increases' : 'decreases'} by {Math.abs(data.current_scenario.revenue_change_pct)}%
              </div>
            </>
          ) : <div style={{ color: '#888' }}>Run a simulation to see results</div>}
        </div>
      </div>
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #eaeaea', overflow: 'hidden' }}>
        <div style={{ padding: 16, fontWeight: 700, borderBottom: '1px solid #eaeaea' }}>Comparison Scenarios</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8faf9' }}>
                {['Scenario', 'Price Change', 'Promo Discount', 'Projected Volume', 'Projected Revenue'].map(h => (
                  <th key={h} style={{ padding: 12, fontSize: 12, fontWeight: 700, color: '#666', textTransform: 'uppercase', textAlign: 'left', borderBottom: '1px solid #eaeaea' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data?.scenarios?.map(s => (
                <tr key={s.label} style={{ borderBottom: '1px solid #fafafa' }}>
                  <td style={{ padding: 12, fontWeight: 600 }}>{s.label}</td>
                  <td style={{ padding: 12 }}>{s.price_change > 0 ? '+' : ''}{s.price_change}%</td>
                  <td style={{ padding: 12 }}>{s.promo > 0 ? `${s.promo}%` : '-'}</td>
                  <td style={{ padding: 12 }}>{s.projected_volume?.toLocaleString()}</td>
                  <td style={{ padding: 12, fontWeight: 700 }}>{s.projected_revenue?.toLocaleString()} TZS</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
