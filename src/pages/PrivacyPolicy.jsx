import { useNavigate } from 'react-router-dom';
import { colors, spacing, radius } from '../constants/theme';

export default function PrivacyPolicy() {
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
        <h1 style={{ fontSize: 32, fontWeight: 700, color: colors.onSurface, marginBottom: spacing.sm }}>Privacy Policy</h1>
        <p style={{ fontSize: 14, color: colors.onSurfaceVariant, marginBottom: spacing.xl }}>Last updated: June 2026</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
          {[
            {
              title: 'Information We Collect',
              content: 'We collect information you provide when creating an account, including your name, email address, phone number, and business details. We also collect delivery data, location information, and transaction history necessary for platform operations.'
            },
            {
              title: 'How We Use Your Information',
              content: 'Your information is used to provide and improve our poultry logistics platform, process transactions, send notifications about deliveries, and personalize your experience. We may use aggregated data for analytics and service optimization.'
            },
            {
              title: 'Data Sharing',
              content: 'We share your information only with trusted partners necessary for platform operations, such as delivery partners and payment processors. We never sell your personal data to third parties for marketing purposes.'
            },
            {
              title: 'Data Security',
              content: 'We implement industry-standard security measures including encryption, access controls, and regular security audits to protect your personal and financial information.'
            },
            {
              title: 'Your Rights',
              content: 'You have the right to access, correct, or delete your personal data. You can manage your data preferences through your account settings or by contacting our support team.'
            },
            {
              title: 'Cookies',
              content: 'We use essential cookies for platform functionality and optional analytics cookies to improve our service. You can manage cookie preferences in your browser settings.'
            },
          ].map(s => (
            <div key={s.title}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: colors.primary, marginBottom: spacing.sm }}>{s.title}</h2>
              <p style={{ fontSize: 15, color: colors.onSurfaceVariant, lineHeight: 1.7 }}>{s.content}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: spacing.xl, padding: spacing.lg, background: '#fff', borderRadius: radius.xl, border: `1px solid ${colors.outlineVariant}` }}>
          <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: spacing.sm, color: colors.onSurface }}>Contact Us</h3>
          <p style={{ fontSize: 14, color: colors.onSurfaceVariant }}>If you have questions about this policy, please contact us at <strong style={{ color: colors.primary }}>privacy@faidayetu.co.tz</strong></p>
        </div>
      </main>
    </div>
  );
}
