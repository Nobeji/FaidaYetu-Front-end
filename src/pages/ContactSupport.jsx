import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { colors, spacing, radius } from '../constants/theme';

export default function ContactSupport() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

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

      <main style={{ maxWidth: 700, margin: '0 auto', padding: spacing.xl }}>
        <div style={{ textAlign: 'center', marginBottom: spacing.xl }}>
          <h1 style={{ fontSize: 32, fontWeight: 700, color: colors.onSurface, marginBottom: spacing.sm }}>Contact Support</h1>
          <p style={{ fontSize: 15, color: colors.onSurfaceVariant }}>We're here to help. Reach out to us anytime.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: spacing.md, marginBottom: spacing.xl }}>
          {[
            { icon: '📧', label: 'Email', val: 'support@faidayetu.co.tz' },
            { icon: '📞', label: 'Phone', val: '+255 800 123 456' },
            { icon: '💬', label: 'Live Chat', val: 'Available 24/7' },
          ].map(c => (
            <div key={c.label} style={{ background: '#fff', borderRadius: radius.xl, border: `1px solid ${colors.outlineVariant}`, padding: spacing.lg, textAlign: 'center' }}>
              <div style={{ fontSize: 28, marginBottom: spacing.sm }}>{c.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 14, color: colors.onSurface }}>{c.label}</div>
              <div style={{ fontSize: 13, color: colors.onSurfaceVariant }}>{c.val}</div>
            </div>
          ))}
        </div>

        <div style={{ background: '#fff', borderRadius: radius.xl, border: `1px solid ${colors.outlineVariant}`, padding: spacing.xl }}>
          {!sent ? (
            <>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: colors.onSurface, marginBottom: spacing.lg }}>Send us a Message</h2>
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.md, marginBottom: spacing.md }}>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: colors.onSurface, display: 'block', marginBottom: 6 }}>Full Name</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" required style={{
                      width: '100%', padding: '12px 16px', borderRadius: radius.md, border: `1px solid ${colors.outlineVariant}`,
                      fontSize: 15, color: colors.onSurface, background: colors.surface, outline: 'none', boxSizing: 'border-box',
                    }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: colors.onSurface, display: 'block', marginBottom: 6 }}>Email</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required style={{
                      width: '100%', padding: '12px 16px', borderRadius: radius.md, border: `1px solid ${colors.outlineVariant}`,
                      fontSize: 15, color: colors.onSurface, background: colors.surface, outline: 'none', boxSizing: 'border-box',
                    }} />
                  </div>
                </div>
                <div style={{ marginBottom: spacing.md }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: colors.onSurface, display: 'block', marginBottom: 6 }}>Subject</label>
                  <select value={subject} onChange={e => setSubject(e.target.value)} required style={{
                    width: '100%', padding: '12px 16px', borderRadius: radius.md, border: `1px solid ${colors.outlineVariant}`,
                    fontSize: 15, color: colors.onSurface, background: colors.surface, outline: 'none', boxSizing: 'border-box',
                  }}>
                    <option value="">Select a topic...</option>
                    <option>Account Issue</option>
                    <option>Payment Problem</option>
                    <option>Delivery Concern</option>
                    <option>Technical Support</option>
                    <option>Other</option>
                  </select>
                </div>
                <div style={{ marginBottom: spacing.lg }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: colors.onSurface, display: 'block', marginBottom: 6 }}>Message</label>
                  <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Describe your issue..." rows={5} required style={{
                    width: '100%', padding: '12px 16px', borderRadius: radius.md, border: `1px solid ${colors.outlineVariant}`,
                    fontSize: 15, color: colors.onSurface, background: colors.surface, outline: 'none', resize: 'vertical', boxSizing: 'border-box',
                  }} />
                </div>
                <button type="submit" style={{
                  width: '100%', padding: '14px', borderRadius: radius.md, background: colors.primary, color: colors.onPrimary,
                  border: 'none', cursor: 'pointer', fontSize: 16, fontWeight: 700,
                }}>Send Message</button>
              </form>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: spacing.xl }}>
              <div style={{ fontSize: 56, marginBottom: spacing.md }}>✅</div>
              <h2 style={{ fontSize: 24, fontWeight: 700, color: colors.onSurface, marginBottom: spacing.sm }}>Message Sent!</h2>
              <p style={{ fontSize: 15, color: colors.onSurfaceVariant, marginBottom: spacing.lg }}>Our team will respond within 24 hours.</p>
              <button onClick={() => { setSent(false); setName(''); setEmail(''); setSubject(''); setMessage(''); }} style={{
                padding: '12px 32px', borderRadius: radius.md, background: colors.primary, color: colors.onPrimary,
                border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 14,
              }}>Send Another Message</button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
