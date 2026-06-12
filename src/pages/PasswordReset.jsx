import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { colors, spacing, radius } from '../constants/theme';

export default function PasswordReset() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div style={{ minHeight: '100vh', background: colors.surface, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: spacing.lg }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        <div style={{ textAlign: 'center', marginBottom: spacing.xl }}>
          <div style={{ fontSize: 32, fontWeight: 800, color: colors.primary, cursor: 'pointer' }} onClick={() => navigate('/')}>FaidaYetu</div>
        </div>

        <div style={{ background: '#fff', borderRadius: radius.xl, border: `1px solid ${colors.outlineVariant}`, padding: spacing.xl }}>
          {!sent ? (
            <>
              <h1 style={{ fontSize: 24, fontWeight: 700, color: colors.onSurface, marginBottom: spacing.sm }}>Reset Password</h1>
              <p style={{ fontSize: 14, color: colors.onSurfaceVariant, marginBottom: spacing.lg }}>Enter your email address and we'll send you a reset link.</p>

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: spacing.lg }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: colors.onSurface, display: 'block', marginBottom: 6 }}>Email Address</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required style={{
                    width: '100%', padding: '12px 16px', borderRadius: radius.md, border: `1px solid ${colors.outlineVariant}`,
                    fontSize: 15, color: colors.onSurface, background: colors.surface,
                    outline: 'none', boxSizing: 'border-box',
                  }} />
                </div>
                <button type="submit" style={{
                  width: '100%', padding: '14px', borderRadius: radius.md, background: colors.primary, color: colors.onPrimary,
                  border: 'none', cursor: 'pointer', fontSize: 16, fontWeight: 700,
                }}>Send Reset Link</button>
              </form>
            </>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: spacing.md }}>📧</div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: colors.onSurface, marginBottom: spacing.sm }}>Check Your Email</h2>
              <p style={{ fontSize: 14, color: colors.onSurfaceVariant, marginBottom: spacing.lg }}>We've sent a password reset link to <strong style={{ color: colors.primary }}>{email}</strong></p>
              <button onClick={() => setSent(false)} style={{
                padding: '12px 32px', borderRadius: radius.md, background: colors.primary, color: colors.onPrimary,
                border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 14,
              }}>Resend Email</button>
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: spacing.lg }}>
            <Link to="/auth" style={{ fontSize: 14, color: colors.primary, fontWeight: 600, textDecoration: 'none' }}>Back to Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
