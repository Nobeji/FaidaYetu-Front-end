import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function PasswordReset() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = (e) => { e.preventDefault(); setSent(true); };

  return (
    <div style={{
      minHeight: '100vh', width: '100%',
      background: '#f8fafc',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
    }}>
      <div style={{
        position: 'relative', zIndex: 2, width: '100%', maxWidth: 440,
        background: '#fff', border: '1px solid #e2e8f0', borderRadius: 24,
        padding: window.innerWidth < 768 ? '28px 24px' : '36px 40px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 52, height: 52, borderRadius: 16, background: 'linear-gradient(135deg, #0a6e46, #10b981)', marginBottom: 14, boxShadow: '0 4px 16px rgba(10,110,70,0.25)', cursor: 'pointer' }} onClick={() => navigate('/')}>
            <span style={{ fontSize: 24 }}>🐔</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a' }}>Reset Password</h1>
          <p style={{ fontSize: 14, color: '#64748b', marginTop: 4 }}>We'll send you a reset link.</p>
        </div>
        {!sent ? (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 8 }}>Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff', fontSize: 14, color: '#0f172a', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <button type="submit" style={{ width: '100%', padding: '14px', borderRadius: 12, background: '#0a6e46', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 15, fontWeight: 700 }}>Send Reset Link</button>
          </form>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 28 }}>📧</div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>Check Your Email</h2>
            <p style={{ fontSize: 14, color: '#64748b', marginBottom: 20 }}>We've sent a reset link to <strong style={{ color: '#0f172a' }}>{email}</strong></p>
            <button onClick={() => setSent(false)} style={{ padding: '12px 32px', borderRadius: 12, background: '#f1f5f9', border: '1px solid #e2e8f0', color: '#475569', cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>Resend Email</button>
          </div>
        )}
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Link to="/auth" style={{ fontSize: 14, color: '#0a6e46', fontWeight: 600 }}>Back to Login</Link>
        </div>
      </div>
    </div>
  );
}
