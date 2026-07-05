import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function PasswordReset() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#000', cursor: 'pointer' }} onClick={() => navigate('/')}>FaidaYetu</div>
        </div>

        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #eee', padding: 28 }}>
          {!sent ? (
            <>
              <h1 style={{ fontSize: 24, fontWeight: 700, color: '#111', marginBottom: 8 }}>Reset Password</h1>
              <p style={{ fontSize: 14, color: '#888', marginBottom: 20 }}>Enter your email address and we'll send you a reset link.</p>

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#111', display: 'block', marginBottom: 6 }}>Email Address</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required style={{
                    width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid #eee',
                    fontSize: 15, color: '#111', background: '#fafafa',
                    outline: 'none', boxSizing: 'border-box',
                  }} />
                </div>
                <button type="submit" style={{
                  width: '100%', padding: '14px', borderRadius: 8, background: '#000', color: '#fff',
                  border: 'none', cursor: 'pointer', fontSize: 16, fontWeight: 700,
                }}>Send Reset Link</button>
              </form>
            </>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📧</div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: '#111', marginBottom: 8 }}>Check Your Email</h2>
              <p style={{ fontSize: 14, color: '#888', marginBottom: 20 }}>We've sent a password reset link to <strong style={{ color: '#000' }}>{email}</strong></p>
              <button onClick={() => setSent(false)} style={{
                padding: '12px 32px', borderRadius: 8, background: '#000', color: '#fff',
                border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 14,
              }}>Resend Email</button>
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <Link to="/auth" style={{ fontSize: 14, color: '#000', fontWeight: 600, textDecoration: 'none' }}>Back to Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
