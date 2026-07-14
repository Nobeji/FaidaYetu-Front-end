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

  const { nearest_neighbor, dijkstra, genetic_algorithm, comparison } = data;
  const algorithms = [
    { key: 'nn', name: 'Nearest Neighbor', color: '#1976d2', bg: '#e3f2fd', data: nearest_neighbor, dist: comparison.nn_distance },
    { key: 'dijkstra', name: 'Dijkstra TSP', color: '#7b1fa2', bg: '#f3e5f5', data: dijkstra, dist: comparison.dijkstra_distance },
    { key: 'ga', name: 'Genetic Algorithm', color: '#388e3c', bg: '#e8f5e9', data: genetic_algorithm, dist: comparison.ga_distance },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Route Optimization Comparison</h2>
        <p style={{ fontSize: 13, color: '#888', margin: '4px 0 0' }}>Nearest Neighbor vs Dijkstra vs Genetic Algorithm</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        {algorithms.map(a => (
          <div key={a.key} style={{ background: a.bg, borderRadius: 8, padding: 20, textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>{a.name}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: a.color }}>{a.dist} km</div>
            <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>{a.data.stop_count} stops</div>
          </div>
        ))}
        <div style={{ background: '#fff3e0', borderRadius: 8, padding: 20, textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Best Algorithm</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#e65100' }}>{comparison.best_algorithm}</div>
          <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>{comparison.improvement_pct}% improvement</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
        {algorithms.map(a => (
          <div key={a.key} style={{ background: '#fff', borderRadius: 8, border: '1px solid #eee' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #eee', background: a.bg, borderRadius: '8px 8px 0 0' }}>
              <h3 style={{ fontSize: 13, fontWeight: 600, margin: 0, color: a.color }}>{a.name} Route</h3>
            </div>
            <div style={{ padding: '12px 20px' }}>
              {a.data.route.map((r, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: i < a.data.route.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: a.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, flexShrink: 0 }}>{i + 1}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{r.supplier}</div>
                    <div style={{ fontSize: 11, color: '#888' }}>{r.customer}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 20, background: '#f5f5f5', borderRadius: 8, padding: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 8 }}>Algorithm Descriptions</div>
        <div style={{ fontSize: 12, color: '#666', lineHeight: 1.8 }}>
          <strong>Nearest Neighbor:</strong> Greedy approach — picks closest unvisited point. O(n²) complexity. Fast but prone to local optima.<br />
          <strong>Dijkstra TSP:</strong> Builds complete shortest-path matrix between all delivery points, then finds the optimal ordering by trying all starting permutations. Finds guaranteed shortest Hamiltonian path on the distance graph. O(n² · 2ⁿ) for exact, heuristic for large n.<br />
          <strong>Genetic Algorithm:</strong> Evolutionary search using population, crossover, mutation (rate=0.15, pop=50, gen=100). Good for larger datasets.
        </div>
      </div>
    </div>
  );
}
