import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function PasswordReset() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = (e) => { e.preventDefault(); setSent(true); };

  return (
    <div style={{
      minHeight: '100vh', width: '100%', position: 'relative', overflow: 'hidden',
      background: 'linear-gradient(135deg, #020617 0%, #0f172a 25%, #1e3a5f 55%, #1e40af 80%, #1e3a5f 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
    }}>
      <style>{`@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-20px)}}@keyframes slideIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(30,64,175,0.3) 0%, transparent 70%)', filter: 'blur(60px)', animation: 'float 8s ease-in-out infinite', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-15%', right: '-10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.2) 0%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none' }} />

      <div style={{
        position: 'relative', zIndex: 2, width: '100%', maxWidth: 440,
        background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24, padding: window.innerWidth < 768 ? '28px 24px' : '36px 40px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)',
        animation: 'slideIn 0.5s ease-out',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 52, height: 52, borderRadius: 16, background: 'linear-gradient(135deg, #1e40af, #3b82f6)', marginBottom: 14, boxShadow: '0 4px 16px rgba(30,64,175,0.4)', cursor: 'pointer' }} onClick={() => navigate('/')}>
            <span style={{ fontSize: 24 }}>🐔</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#fff' }}>Reset Password</h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginTop: 4 }}>We'll send you a reset link.</p>
        </div>
        {!sent ? (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.65)', display: 'block', marginBottom: 8 }}>Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required className="glass-input" />
            </div>
            <button type="submit" style={{ width: '100%', padding: '14px', borderRadius: 12, background: 'linear-gradient(135deg, #1e40af 0%, #2563eb 50%, #3b82f6 100%)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 15, fontWeight: 700, boxShadow: '0 4px 20px rgba(30,64,175,0.4)' }}>Send Reset Link</button>
          </form>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(30,64,175,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 28 }}>📧</div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Check Your Email</h2>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 20 }}>We've sent a reset link to <strong style={{ color: '#fff' }}>{email}</strong></p>
            <button onClick={() => setSent(false)} style={{ padding: '12px 32px', borderRadius: 12, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>Resend Email</button>
          </div>
        )}
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Link to="/auth" style={{ fontSize: 14, color: 'rgba(96,165,250,0.9)', fontWeight: 600 }}>Back to Login</Link>
        </div>
      </div>
    </div>
  );
}
