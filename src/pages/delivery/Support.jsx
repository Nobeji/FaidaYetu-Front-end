import { colors, spacing, radius } from '../../constants/theme';
import DashboardShell from '../../components/DashboardShell';

const navItems = [
  { icon: '🚚', label: 'Active Tasks', nav: '/delivery' },
  { icon: '🛣️', label: 'Route History', nav: '/delivery/route-history' },
  { icon: '💰', label: 'Earnings', nav: '/delivery/earnings' },
  { icon: '⚙️', label: 'Settings', nav: '/delivery/settings' },
  { icon: '❓', label: 'Support', nav: '/delivery/support' },
];

const faqs = [
  { q: 'How do I start a delivery task?', a: 'Accept an available task from your Active Tasks dashboard. Navigate to the pickup location to begin.' },
  { q: 'When do I get paid?', a: 'Earnings are processed weekly every Monday. You can withdraw anytime via your preferred payout method.' },
  { q: 'What if I need to cancel a task?', a: 'Contact support immediately. Frequent cancellations may affect your acceptance rate.' },
  { q: 'How is my route optimized?', a: 'Our AI analyzes traffic, distance, and delivery windows to suggest the most efficient route.' },
];

export default function DeliverySupport() {
  return (
    <DashboardShell brand="FaidaYetu" brandSub="Delivery Portal" navItems={navItems}>
      <div className="fade-in">
        <div style={{ marginBottom: spacing.lg }}>
          <h1 style={{ fontSize: 28, fontWeight: 600, color: colors.primary }}>Support</h1>
          <p style={{ fontSize: 15, color: colors.onSurfaceVariant }}>Get help with your delivery account</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.lg }}>
          <div>
            <div style={{ background: '#fff', borderRadius: radius.xl, border: `1px solid ${colors.outlineVariant}`, padding: spacing.lg, marginBottom: spacing.lg }}>
              <h3 style={{ fontSize: 20, fontWeight: 600, color: colors.primary, marginBottom: spacing.md }}>Contact Us</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, padding: spacing.md, background: colors.surfaceContainerLow, borderRadius: radius.md }}>
                  <span style={{ fontSize: 24 }}>📧</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>Email Support</div>
                    <div style={{ fontSize: 13, color: colors.onSurfaceVariant }}>delivery@faidayetu.co.tz</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, padding: spacing.md, background: colors.surfaceContainerLow, borderRadius: radius.md }}>
                  <span style={{ fontSize: 24 }}>📞</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>Phone Support</div>
                    <div style={{ fontSize: 13, color: colors.onSurfaceVariant }}>+255 800 789 012</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, padding: spacing.md, background: colors.surfaceContainerLow, borderRadius: radius.md }}>
                  <span style={{ fontSize: 24 }}>💬</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>Live Chat</div>
                    <div style={{ fontSize: 13, color: colors.onSurfaceVariant }}>Available 24/7</div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ background: colors.primaryLight, borderRadius: radius.xl, padding: spacing.lg, color: colors.onPrimaryContainer }}>
              <div style={{ fontSize: 36, marginBottom: spacing.sm }}>🚨</div>
              <h4 style={{ fontSize: 18, fontWeight: 700, marginBottom: spacing.sm }}>Roadside Assistance</h4>
              <p style={{ fontSize: 14, opacity: 0.9, marginBottom: spacing.md }}>Available 24/7 for emergency roadside support. We'll get you back on the road quickly.</p>
              <button onClick={() => alert('Calling roadside assistance...')} style={{ padding: '10px 20px', borderRadius: radius.md, background: '#fff', border: 'none', color: colors.primary, fontWeight: 700, cursor: 'pointer' }}>Call Now</button>
            </div>
          </div>

          <div style={{ background: '#fff', borderRadius: radius.xl, border: `1px solid ${colors.outlineVariant}`, padding: spacing.lg }}>
            <h3 style={{ fontSize: 20, fontWeight: 600, color: colors.primary, marginBottom: spacing.lg }}>Frequently Asked Questions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
              {faqs.map(f => (
                <div key={f.q} style={{ padding: spacing.md, background: colors.surfaceContainerLow, borderRadius: radius.md }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: colors.primary, marginBottom: 4 }}>{f.q}</div>
                  <div style={{ fontSize: 13, color: colors.onSurfaceVariant }}>{f.a}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
