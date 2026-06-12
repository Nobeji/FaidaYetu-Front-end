import { useState, useEffect } from 'react';
import { colors, spacing, radius } from '../../constants/theme';
import DashboardShell from '../../components/DashboardShell';
import { api } from '../../services/api';

const navItems = [
  { icon: '🚚', label: 'Active Tasks', nav: '/delivery' },
  { icon: '🛣️', label: 'Route History', nav: '/delivery/route-history' },
  { icon: '💰', label: 'Earnings', nav: '/delivery/earnings' },
  { icon: '⚙️', label: 'Settings', nav: '/delivery/settings' },
  { icon: '❓', label: 'Support', nav: '/delivery/support' },
];

export default function DeliveryEarnings() {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const did = JSON.parse(localStorage.getItem('delivery_person') || '{}').id || 1;
    api.deliveries({ delivery_person: did }).then(d => { setDeliveries(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const totalEarnings = deliveries.reduce((s, d) => s + (d.earnings || 0), 0);
  const weeklyEarnings = totalEarnings;
  const availableBalance = Math.round(totalEarnings * 100) / 100;

  return (
    <DashboardShell brand="FaidaYetu" brandSub="Delivery Portal" navItems={navItems}>
      <div className="fade-in">
        <div style={{ marginBottom: spacing.lg }}>
          <h1 style={{ fontSize: 28, fontWeight: 600, color: colors.primary }}>Earnings</h1>
          <p style={{ fontSize: 15, color: colors.onSurfaceVariant }}>Track your income and withdrawals</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: spacing.md, marginBottom: spacing.lg }}>
          <div style={{ background: '#fff', borderRadius: radius.xl, border: `1px solid ${colors.outlineVariant}`, padding: spacing.lg }}>
            <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', color: colors.onSurfaceVariant, marginBottom: spacing.sm }}>Today</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: colors.onSurface }}>${(totalEarnings * 0.15).toFixed(2)}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: colors.primary }}>+12% vs avg</div>
          </div>
          <div style={{ background: '#fff', borderRadius: radius.xl, border: `1px solid ${colors.outlineVariant}`, padding: spacing.lg }}>
            <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', color: colors.onSurfaceVariant, marginBottom: spacing.sm }}>This Week</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: colors.onSurface }}>${weeklyEarnings.toFixed(2)}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: colors.primary }}>+8% vs last week</div>
          </div>
          <div style={{ background: '#fff', borderRadius: radius.xl, border: `1px solid ${colors.outlineVariant}`, padding: spacing.lg }}>
            <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', color: colors.onSurfaceVariant, marginBottom: spacing.sm }}>Available for Withdrawal</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: colors.onSurface }}>${Math.min(availableBalance, 100).toFixed(2)}</div>
            <button onClick={() => alert(`Withdraw $${Math.min(availableBalance, 100).toFixed(2)}? This will be sent to your registered payment method.`)} style={{ marginTop: spacing.sm, padding: '8px 20px', borderRadius: radius.md, background: colors.primary, color: colors.onPrimary, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>Withdraw →</button>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: spacing.xxl, color: colors.onSurfaceVariant }}>Loading...</div>
        ) : (
          <div style={{ background: '#fff', borderRadius: radius.xl, border: `1px solid ${colors.outlineVariant}`, padding: spacing.lg }}>
            <h3 style={{ fontSize: 20, fontWeight: 600, color: colors.primary, marginBottom: spacing.md }}>Transaction History</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
              {deliveries.map(d => (
                <div key={d.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: spacing.sm, background: colors.surfaceContainerLow, borderRadius: radius.md }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>${d.earnings || 0}</div>
                    <div style={{ fontSize: 12, color: colors.onSurfaceVariant }}>Delivery #{d.id} • {d.distance_km || 0} km</div>
                  </div>
                  <span style={{
                    padding: '2px 10px', borderRadius: radius.round, fontSize: 11, fontWeight: 600,
                    background: d.status === 'completed' ? colors.primaryFixed : colors.surfaceContainerHigh,
                    color: d.status === 'completed' ? colors.primary : colors.onSurfaceVariant,
                  }}>{d.status === 'completed' ? 'Paid' : 'Pending'}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
