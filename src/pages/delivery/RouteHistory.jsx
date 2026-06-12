import { useState, useEffect } from 'react';
import { colors, spacing, radius } from '../../constants/theme';
import DashboardShell from '../../components/DashboardShell';
import StatusBadge from '../../components/StatusBadge';
import { api } from '../../services/api';

const navItems = [
  { icon: '🚚', label: 'Active Tasks', nav: '/delivery' },
  { icon: '🛣️', label: 'Route History', nav: '/delivery/route-history' },
  { icon: '💰', label: 'Earnings', nav: '/delivery/earnings' },
  { icon: '⚙️', label: 'Settings', nav: '/delivery/settings' },
  { icon: '❓', label: 'Support', nav: '/delivery/support' },
];

export default function RouteHistory() {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const did = JSON.parse(localStorage.getItem('delivery_person') || '{}').id || 1;
    api.deliveries({ delivery_person: did }).then(d => { setDeliveries(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const completed = deliveries.filter(d => d.status === 'completed');

  return (
    <DashboardShell brand="FaidaYetu" brandSub="Delivery Portal" navItems={navItems}>
      <div className="fade-in">
        <div style={{ marginBottom: spacing.lg }}>
          <h1 style={{ fontSize: 28, fontWeight: 600, color: colors.primary }}>Route History</h1>
          <p style={{ fontSize: 15, color: colors.onSurfaceVariant }}>Past deliveries and completed routes</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: spacing.md, marginBottom: spacing.lg }}>
          <div style={{ background: '#fff', borderRadius: radius.xl, border: `1px solid ${colors.outlineVariant}`, padding: spacing.lg, textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: spacing.sm }}>🛣️</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: colors.onSurface }}>{completed.length}</div>
            <div style={{ fontSize: 13, color: colors.onSurfaceVariant }}>Total Routes</div>
          </div>
          <div style={{ background: '#fff', borderRadius: radius.xl, border: `1px solid ${colors.outlineVariant}`, padding: spacing.lg, textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: spacing.sm }}>📏</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: colors.onSurface }}>{completed.reduce((s, d) => s + (d.distance_km || 0), 0).toFixed(0)} km</div>
            <div style={{ fontSize: 13, color: colors.onSurfaceVariant }}>Total Distance</div>
          </div>
          <div style={{ background: '#fff', borderRadius: radius.xl, border: `1px solid ${colors.outlineVariant}`, padding: spacing.lg, textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: spacing.sm }}>💰</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: colors.onSurface }}>${completed.reduce((s, d) => s + (d.earnings || 0), 0).toFixed(2)}</div>
            <div style={{ fontSize: 13, color: colors.onSurfaceVariant }}>Total Earnings</div>
          </div>
          <div style={{ background: '#fff', borderRadius: radius.xl, border: `1px solid ${colors.outlineVariant}`, padding: spacing.lg, textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: spacing.sm }}>⭐</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: colors.onSurface }}>4.8</div>
            <div style={{ fontSize: 13, color: colors.onSurfaceVariant }}>Avg Rating</div>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: spacing.xxl, color: colors.onSurfaceVariant }}>Loading...</div>
        ) : (
          <div style={{ background: '#fff', borderRadius: radius.xl, border: `1px solid ${colors.outlineVariant}`, overflow: 'hidden' }}>
            <div style={{ padding: spacing.lg, borderBottom: `1px solid ${colors.outlineVariant}` }}>
              <h3 style={{ fontSize: 20, fontWeight: 600, color: colors.primary }}>Completed Routes</h3>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'rgba(193,236,212,0.3)' }}>
                    {['Delivery ID', 'Distance', 'Earnings', 'Status'].map(h => (
                      <th key={h} style={{ padding: spacing.md, fontSize: 13, fontWeight: 600, color: colors.onSurfaceVariant, borderBottom: `1px solid ${colors.outlineVariant}` }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {completed.map(d => (
                    <tr key={d.id}>
                      <td style={{ padding: spacing.md, fontWeight: 700, color: colors.primary }}>#{d.id}</td>
                      <td style={{ padding: spacing.md }}>{d.distance_km || 0} km</td>
                      <td style={{ padding: spacing.md, fontWeight: 700 }}>${d.earnings || 0}</td>
                      <td style={{ padding: spacing.md }}><StatusBadge status={d.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
