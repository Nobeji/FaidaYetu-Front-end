import { useNavigate } from 'react-router-dom';
import { colors, spacing, radius } from '../constants/theme';

export default function TermsOfService() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: colors.surface }}>
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: `0 ${spacing.lg}px`, height: 64, borderBottom: `1px solid ${colors.outlineVariant}`,
        background: colors.surface, position: 'sticky', top: 0, zIndex: 10,
      }}>
        <span style={{ fontSize: 20, fontWeight: 800, color: colors.primary, cursor: 'pointer' }} onClick={() => navigate('/')}>FaidaYetu</span>
        <button onClick={() => navigate(-1)} style={{
          padding: '8px 16px', borderRadius: radius.md, border: `1px solid ${colors.outlineVariant}`,
          background: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 14, color: colors.onSurfaceVariant,
        }}>← Back</button>
      </header>

      <main style={{ maxWidth: 800, margin: '0 auto', padding: spacing.xl }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: colors.onSurface, marginBottom: spacing.sm }}>Terms of Service</h1>
        <p style={{ fontSize: 14, color: colors.onSurfaceVariant, marginBottom: spacing.xl }}>Last updated: June 2026</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
          {[
            {
              title: 'Acceptance of Terms',
              content: 'By creating an account or using the FaidaYetu platform, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you should not use our services.'
            },
            {
              title: 'User Accounts',
              content: 'You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account. You must provide accurate, current, and complete information during registration.'
            },
            {
              title: 'Platform Usage',
              content: 'FaidaYetu connects poultry suppliers, customers, and delivery partners. All parties agree to use the platform in good faith, provide accurate product and delivery information, and comply with all applicable laws and regulations.'
            },
            {
              title: 'Transactions & Payments',
              content: 'All transactions conducted through the platform are binding. Suppliers agree to fulfill orders as listed, customers agree to pay the stated amounts, and delivery partners agree to complete deliveries professionally. Payment processing is handled through secure third-party providers.'
            },
            {
              title: 'Delivery Partner Terms',
              content: 'Delivery partners are independent contractors. They agree to maintain valid licenses, insurance, and vehicles in good condition. They are responsible for their own taxes, expenses, and compliance with local regulations.'
            },
            {
              title: 'Limitation of Liability',
              content: 'FaidaYetu acts as an intermediary platform and is not liable for disputes between users, product quality issues, delivery failures caused by force majeure, or any indirect damages arising from platform use.'
            },
            {
              title: 'Termination',
              content: 'We reserve the right to suspend or terminate accounts that violate these terms, engage in fraudulent activity, or negatively impact the platform community. Users may terminate their accounts at any time.'
            },
          ].map(s => (
            <div key={s.title}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: colors.primary, marginBottom: spacing.sm }}>{s.title}</h2>
              <p style={{ fontSize: 15, color: colors.onSurfaceVariant, lineHeight: 1.7 }}>{s.content}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: spacing.xl, padding: spacing.lg, background: '#fff', borderRadius: radius.xl, border: `1px solid ${colors.outlineVariant}` }}>
          <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: spacing.sm, color: colors.onSurface }}>Questions?</h3>
          <p style={{ fontSize: 14, color: colors.onSurfaceVariant }}>Contact us at <strong style={{ color: colors.primary }}>legal@faidayetu.co.tz</strong></p>
        </div>
      </main>
    </div>
  );
}
