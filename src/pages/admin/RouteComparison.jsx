import { useState, useEffect } from 'react';
import { api } from '../../services/api';

export default function RouteComparison() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.adminRouteComparison().then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>Comparing route algorithms...</div>;
  if (!data || !data.comparison) return <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>No pending deliveries to optimize</div>;

  const { nearest_neighbor, genetic_algorithm, comparison, start } = data;

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Route Optimization Comparison</h2>
        <p style={{ fontSize: 13, color: '#888', margin: '4px 0 0' }}>Nearest Neighbor vs Genetic Algorithm performance comparison</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 24 }}>
        <div style={{ background: '#e3f2fd', borderRadius: 8, padding: 20, textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Nearest Neighbor</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#1976d2' }}>{comparison.nn_distance} km</div>
          <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>{nearest_neighbor.stop_count} stops</div>
        </div>
        <div style={{ background: '#e8f5e9', borderRadius: 8, padding: 20, textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Genetic Algorithm</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#388e3c' }}>{comparison.ga_distance} km</div>
          <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>{genetic_algorithm.stop_count} stops</div>
        </div>
        <div style={{ background: comparison.improvement_pct > 0 ? '#e8f5e9' : '#ffebee', borderRadius: 8, padding: 20, textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>GA Improvement</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: comparison.improvement_pct > 0 ? '#388e3c' : '#d32f2f' }}>
            {comparison.improvement_pct > 0 ? '+' : ''}{comparison.improvement_pct}%
          </div>
          <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>{Math.abs(comparison.saved_km)} km saved</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #eee' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #eee', background: '#e3f2fd', borderRadius: '8px 8px 0 0' }}>
            <h3 style={{ fontSize: 13, fontWeight: 600, margin: 0, color: '#1565c0' }}>Nearest Neighbor Route</h3>
          </div>
          <div style={{ padding: '12px 20px' }}>
            {nearest_neighbor.route.map((r, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: i < nearest_neighbor.route.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#1976d2', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, flexShrink: 0 }}>{i + 1}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{r.supplier}</div>
                  <div style={{ fontSize: 11, color: '#888' }}>{r.customer}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #eee' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #eee', background: '#e8f5e9', borderRadius: '8px 8px 0 0' }}>
            <h3 style={{ fontSize: 13, fontWeight: 600, margin: 0, color: '#2e7d32' }}>Genetic Algorithm Route</h3>
          </div>
          <div style={{ padding: '12px 20px' }}>
            {genetic_algorithm.route.map((r, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: i < genetic_algorithm.route.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#388e3c', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, flexShrink: 0 }}>{i + 1}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{r.supplier}</div>
                  <div style={{ fontSize: 11, color: '#888' }}>{r.customer}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 20, background: '#f5f5f5', borderRadius: 8, padding: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 8 }}>Algorithm Comparison</div>
        <div style={{ fontSize: 12, color: '#666', lineHeight: 1.8 }}>
          <strong>Nearest Neighbor:</strong> Greedy approach — always picks the closest unvisited point. Fast O(n²) but can get stuck in local optima. Best for small datasets.<br />
          <strong>Genetic Algorithm:</strong> Evolutionary approach — uses population-based search with crossover and mutation. Slower but often finds better solutions for larger datasets. Parameters: population=50, generations=100, mutation_rate=0.15.
        </div>
      </div>
    </div>
  );
}
