import { colors, spacing, radius } from '../../constants/theme';
import DashboardShell from '../../components/DashboardShell';

const navItems = [
  { icon: '📊', label: 'Dashboard', nav: '/supplier' },
  { icon: '📦', label: 'Inventory', nav: '/supplier/inventory' },
  { icon: '🛒', label: 'Orders', nav: '/supplier/orders' },
  { icon: '📈', label: 'Analytics', nav: '/supplier/analytics' },
  { icon: '📉', label: 'Statistics', nav: '/supplier/statistics' },
  { icon: '⚙️', label: 'Settings', nav: '/supplier/settings' },
  { icon: '❓', label: 'Support', nav: '/supplier/support' },
];

const faqs = [
  { q: 'How do I add a new product?', a: 'Navigate to Inventory and click "Add Product". Fill in the details and save.' },
  { q: 'How do I process an order?', a: 'Go to Orders, click "View" on any order, then follow the fulfillment workflow.' },
  { q: 'How do I update my payout details?', a: 'Go to Settings > Payment Information to update your bank or mobile money details.' },
  { q: 'What happens when stock is low?', a: 'You will receive push and SMS notifications. We recommend restocking when below 20%.' },
];

export default function SupplierSupport() {
  return (
    <DashboardShell brand="FaidaYetu" brandSub="Poultry Logistics Hub" navItems={navItems}>
      <div className="fade-in">
        <div style={{ marginBottom: spacing.lg }}>
          <h1 style={{ fontSize: 28, fontWeight: 600, color: colors.primary }}>Support</h1>
          <p style={{ fontSize: 15, color: colors.onSurfaceVariant }}>Get help with your supplier account</p>
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
                    <div style={{ fontSize: 13, color: colors.onSurfaceVariant }}>supplier@faidayetu.co.tz</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, padding: spacing.md, background: colors.surfaceContainerLow, borderRadius: radius.md }}>
                  <span style={{ fontSize: 24 }}>📞</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>Phone Support</div>
                    <div style={{ fontSize: 13, color: colors.onSurfaceVariant }}>+255 800 123 456</div>
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
              <div style={{ fontSize: 36, marginBottom: spacing.sm }}>🌟</div>
              <h4 style={{ fontSize: 18, fontWeight: 700, marginBottom: spacing.sm }}>Need urgent help?</h4>
              <p style={{ fontSize: 14, opacity: 0.9, marginBottom: spacing.md }}>Our support team typically responds within 2 hours during business hours.</p>
              <button onClick={() => alert('Live chat connecting...')} style={{ padding: '10px 20px', borderRadius: radius.md, background: '#fff', border: 'none', color: colors.primary, fontWeight: 700, cursor: 'pointer' }}>Start Live Chat</button>
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
