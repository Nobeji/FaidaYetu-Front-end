import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import LocationPicker from '../components/LocationPicker';

export default function Auth() {
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState(searchParams.get('tab') === 'signup' ? 'signup' : 'login');
  const [role, setRole] = useState('customer');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [area, setArea] = useState('');
  const [city, setCity] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [publicStats, setPublicStats] = useState({});

  useEffect(() => { localStorage.removeItem('token'); localStorage.removeItem('refresh'); }, []);
  useEffect(() => { api.stats().then(setPublicStats).catch(() => {}); }, []);
  const [signupLoading, setSignupLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [signupCoords, setSignupCoords] = useState({ lat: -6.7924, lng: 39.2083 });
  const navigate = useNavigate();

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const detectFromIP = async () => {
    try {
      const res = await fetch('https://ip-api.com/json/');
      const data = await res.json();
      if (data.status === 'success' && data.lat && data.lon) { setSignupCoords({ lat: data.lat, lng: data.lon }); return true; }
    } catch {}
    return false;
  };

  const detectLocation = useCallback(async () => {
    if (!navigator.geolocation) { await detectFromIP(); return; }
    navigator.geolocation.getCurrentPosition(
      pos => { setSignupCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }); },
      async () => { await detectFromIP(); },
      { timeout: 8000 },
    );
  }, []);

  useEffect(() => { if (tab !== 'signup') return; detectLocation(); }, [tab, role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (tab === 'login') {
      setLoginLoading(true);
      try {
        const data = await api.login({ username, password });
        localStorage.setItem('token', data.access);
        localStorage.setItem('refresh', data.refresh);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('profile', JSON.stringify(data.profile));
        if (data.customer) localStorage.setItem('customer', JSON.stringify(data.customer));
        if (data.supplier) localStorage.setItem('supplier', JSON.stringify(data.supplier));
        if (data.delivery_person) localStorage.setItem('delivery_person', JSON.stringify(data.delivery_person));
        const userRole = data.profile.role;
        if (userRole === 'admin') navigate('/admin', { replace: true });
        else if (userRole === 'customer') navigate('/customer');
        else if (userRole === 'supplier') navigate('/supplier');
        else navigate('/delivery');
      } catch (err) { setError('Invalid username or password'); }
      finally { setLoginLoading(false); }
    } else {
      if (password !== confirmPassword) { setError('Passwords do not match'); return; }
      setSignupLoading(true);
      try {
        const data = await api.register({ username, password, email, phone, area, city, role, lat: signupCoords.lat, lng: signupCoords.lng });
        localStorage.setItem('token', data.access);
        localStorage.setItem('refresh', data.refresh);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('profile', JSON.stringify(data.profile));
        if (data.customer) localStorage.setItem('customer', JSON.stringify(data.customer));
        if (data.supplier) localStorage.setItem('supplier', JSON.stringify(data.supplier));
        if (data.delivery_person) localStorage.setItem('delivery_person', JSON.stringify(data.delivery_person));
        if (role === 'customer') navigate('/customer');
        else if (role === 'supplier') navigate('/supplier');
        else navigate('/delivery');
      } catch (err) { setError(err.message || 'Registration failed. Try a different username.'); }
      finally { setSignupLoading(false); }
    }
  };

  return (
    <div style={{
      minHeight: '100vh', width: '100%', position: 'relative', overflow: 'hidden',
      background: 'linear-gradient(135deg, #020617 0%, #0f172a 25%, #1e3a5f 55%, #1e40af 80%, #1e3a5f 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: isMobile ? 16 : 24,
    }}>
      <style>{`
        @keyframes float { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-20px) rotate(3deg)} }
        @keyframes floatSlow { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-10px) scale(1.02)} }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideIn { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {/* Decorative blobs */}
      <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: isMobile ? 300 : 500, height: isMobile ? 300 : 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(30,64,175,0.3) 0%, transparent 70%)', filter: 'blur(60px)', animation: 'float 8s ease-in-out infinite', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-15%', right: '-10%', width: isMobile ? 250 : 400, height: isMobile ? 250 : 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.2) 0%, transparent 70%)', filter: 'blur(80px)', animation: 'floatSlow 10s ease-in-out infinite', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '30%', right: '15%', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(96,165,250,0.1) 0%, transparent 70%)', filter: 'blur(50px)', animation: 'float 12s ease-in-out infinite 2s', pointerEvents: 'none' }} />

      {/* Glass card */}
      <div style={{
        position: 'relative', zIndex: 2,
        width: '100%', maxWidth: isMobile ? '100%' : 480,
        background: 'rgba(255,255,255,0.06)',
        backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: isMobile ? 20 : 24,
        padding: isMobile ? 28 : '36px 40px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)',
        animation: 'slideIn 0.5s ease-out',
        maxHeight: '90vh', overflowY: 'auto',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 52, height: 52, borderRadius: 16,
            background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
            marginBottom: 14, boxShadow: '0 4px 16px rgba(30,64,175,0.4)',
          }}>
            <span style={{ fontSize: 24 }}>🐔</span>
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>FaidaYetu</h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginTop: 4 }}>
            {tab === 'login' ? 'Welcome back. Sign in to your account.' : 'Join the poultry supply network.'}
          </p>
        </div>

        <div style={{ display: 'flex', borderRadius: 12, padding: 4, background: 'rgba(255,255,255,0.05)', marginBottom: 24 }}>
          {['login', 'signup'].map(t => (
            <button key={t} onClick={() => { setTab(t); setError(''); }} style={{
              flex: 1, padding: '10px 0', borderRadius: 10, fontSize: 14, fontWeight: tab === t ? 700 : 500,
              color: tab === t ? '#fff' : 'rgba(255,255,255,0.4)',
              background: tab === t ? 'rgba(30,64,175,0.5)' : 'transparent',
              border: 'none', cursor: 'pointer', transition: 'all 0.25s ease',
            }}>
              {t === 'login' ? 'Log In' : 'Sign Up'}
            </button>
          ))}
        </div>

        {error && (
          <div style={{ padding: '12px 16px', borderRadius: 12, marginBottom: 16, background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', color: '#fca5a5', fontSize: 13, fontWeight: 600 }}>{error}</div>
        )}

        <form onSubmit={handleSubmit} style={{ animation: 'slideIn 0.3s ease-out' }}>
          {tab === 'signup' && (
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'rgba(255,255,255,0.65)' }}>I am a...</label>
              <select value={role} onChange={e => setRole(e.target.value)} className="glass-select">
                <option value="customer">Customer</option>
                <option value="supplier">Supplier</option>
                <option value="delivery">Delivery Personnel</option>
              </select>
            </div>
          )}
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'rgba(255,255,255,0.65)' }}>Username</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Enter your username" required className="glass-input" />
          </div>
          {tab === 'signup' && (
            <>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'rgba(255,255,255,0.65)' }}>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@example.com" required className="glass-input" />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'rgba(255,255,255,0.65)' }}>Phone Number</label>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+255 7XX XXX XXX" required className="glass-input" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 12, marginBottom: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'rgba(255,255,255,0.65)' }}>Area</label>
                  <input type="text" value={area} onChange={e => setArea(e.target.value)} placeholder="Kariakoo" required className="glass-input" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'rgba(255,255,255,0.65)' }}>City</label>
                  <input type="text" value={city} onChange={e => setCity(e.target.value)} placeholder="Dar es Salaam" required className="glass-input" />
                </div>
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'rgba(255,255,255,0.65)' }}>Pinpoint Your Location on Map</label>
                <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.12)' }}>
                  <LocationPicker lat={signupCoords.lat} lng={signupCoords.lng} height={180} onChange={(lat, lng) => setSignupCoords({ lat, lng })} />
                </div>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 6, display: 'block' }}>Drag the marker to set your exact location.</span>
              </div>
            </>
          )}
          <div style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.65)' }}>Password</label>
              {tab === 'login' && <a href="/password-reset" style={{ fontSize: 12, color: 'rgba(96,165,250,0.9)', textDecoration: 'none', fontWeight: 500 }}>Forgot password?</a>}
            </div>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required className="glass-input" />
          </div>
          {tab === 'signup' && (
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'rgba(255,255,255,0.65)' }}>Confirm Password</label>
              <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••" required className="glass-input" />
            </div>
          )}
          <button type="submit" disabled={loginLoading || signupLoading} style={{
            width: '100%', padding: '14px', borderRadius: 12,
            background: loginLoading || signupLoading ? 'rgba(255,255,255,0.08)' : 'linear-gradient(135deg, #1e40af 0%, #2563eb 50%, #3b82f6 100%)',
            color: '#fff', border: 'none',
            cursor: loginLoading || signupLoading ? 'not-allowed' : 'pointer',
            fontSize: 15, fontWeight: 700, marginTop: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            boxShadow: loginLoading || signupLoading ? 'none' : '0 4px 20px rgba(30,64,175,0.4)',
            transition: 'all 0.3s ease',
          }}>
            {loginLoading ? (
              <><div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.2)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.6s linear infinite', display: 'inline-block' }} /> Signing in...</>
            ) : signupLoading ? (
              <><div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.2)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.6s linear infinite', display: 'inline-block' }} /> Creating account...</>
            ) : (tab === 'login' ? 'Sign In' : 'Create Account')}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>or continue with</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
          </div>

          <button type="button" style={{
            width: '100%', padding: '12px', borderRadius: 12,
            border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)',
            cursor: 'pointer', fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.75)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </button>
        </form>

        <div style={{ display: 'flex', justifyContent: 'center', gap: isMobile ? 20 : 32, marginTop: 24, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>{publicStats.dailyDeliveries || '0'}</div>
            <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.35)' }}>Deliveries</div>
          </div>
          <div style={{ width: 1, height: 32, background: 'rgba(255,255,255,0.08)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>{publicStats.onTimeRate || '0'}</div>
            <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.35)' }}>On-time</div>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>&copy; 2026 FaidaYetu. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
