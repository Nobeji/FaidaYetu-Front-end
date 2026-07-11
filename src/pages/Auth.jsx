import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../services/api';

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

  useEffect(() => {
    api.stats().then(setPublicStats).catch(() => {});
  }, []);
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
      if (data.status === 'success' && data.lat && data.lon) {
        setSignupCoords({ lat: data.lat, lng: data.lon });
        return true;
      }
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

  useEffect(() => {
    if (tab !== 'signup') return;
    detectLocation();
  }, [tab, role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (tab === 'login') {
      setLoginLoading(true);
      try {
        const data = await api.login({ username, password });
        localStorage.setItem('token', data.access);
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
      } catch (err) {
        setError('Invalid username or password');
      } finally {
        setLoginLoading(false);
      }
    } else {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      setSignupLoading(true);
      try {
        const data = await api.register({
          username, password, email, phone,
          area, city,
          role,
          lat: signupCoords.lat,
          lng: signupCoords.lng,
        });
        localStorage.setItem('token', data.access);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('profile', JSON.stringify(data.profile));
        if (data.customer) localStorage.setItem('customer', JSON.stringify(data.customer));
        if (data.supplier) localStorage.setItem('supplier', JSON.stringify(data.supplier));
        if (data.delivery_person) localStorage.setItem('delivery_person', JSON.stringify(data.delivery_person));

        if (role === 'customer') navigate('/customer');
        else if (role === 'supplier') navigate('/supplier');
        else navigate('/delivery');
      } catch (err) {
        setError(err.message || 'Registration failed. Try a different username.');
      } finally {
        setSignupLoading(false);
      }
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', flexDirection: isMobile ? 'column' : 'row' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{
        width: isMobile ? '100%' : '50%', minHeight: isMobile ? 200 : 'auto',
        background: '#0a6e46', display: 'flex',
        flexDirection: 'column', justifyContent: 'center', padding: isMobile ? 24 : 48,
        color: '#fff', position: 'relative', overflow: 'hidden',
      }}>
        <img src="https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=800" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.3, mixBlendMode: 'overlay' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontSize: isMobile ? 22 : 36, fontWeight: 700, lineHeight: 1.2, marginBottom: 16 }}>
            Powering the Future of <span style={{ color: '#ffdea9' }}>Poultry Logistics</span>
          </h1>
          <p style={{ fontSize: isMobile ? 14 : 16, opacity: 0.9, marginBottom: 20, maxWidth: 440, lineHeight: 1.6 }}>
            The integrated platform for suppliers, customers, and delivery personnel.
          </p>
          <div style={{ display: 'flex', gap: isMobile ? 12 : 20, flexDirection: isMobile ? 'column' : 'row' }}>
            <div><div style={{ fontSize: 22, fontWeight: 600 }}>{publicStats.dailyDeliveries || '0'}</div><div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.7 }}>Orders Delivered</div></div>
            {!isMobile && <div style={{ width: 1, height: 36, background: 'rgba(255,255,255,0.2)' }} />}
            <div><div style={{ fontSize: 22, fontWeight: 600 }}>{publicStats.onTimeRate || '0'}</div><div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.7 }}>Trust Rating</div></div>
          </div>
        </div>
      </div>

      <div style={{
        width: isMobile ? '100%' : '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: isMobile ? 16 : 20, background: '#fafafa',
      }}>
        <div style={{
          width: '100%', maxWidth: 420, background: '#fff',
          padding: isMobile ? 20 : 28, borderRadius: 12, border: '1px solid #eee',
        }}>
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0a6e46', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              FaidaYetu
            </h2>
            <p style={{ fontSize: 13, color: '#888', marginTop: 4 }}>
              {tab === 'login' ? 'Welcome back. Please enter your details.' : 'Create your account.'}
            </p>
          </div>

          <div style={{ display: 'flex', borderBottom: '1px solid #eee', marginBottom: 20 }}>
            {['login', 'signup'].map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                flex: 1, padding: 12, textAlign: 'center', fontSize: 14, fontWeight: tab === t ? 700 : 500,
                color: tab === t ? '#0a6e46' : '#888',
                borderBottom: tab === t ? '2px solid #000' : '2px solid transparent',
                background: 'none', cursor: 'pointer',
              }}>
                {t === 'login' ? 'Log In' : 'Sign Up'}
              </button>
            ))}
          </div>

          {error && (
            <div style={{ padding: 12, background: '#fef2f2', borderRadius: 8, color: '#d32f2f', fontSize: 13, fontWeight: 600, marginBottom: 12 }}>{error}</div>
          )}

          <form onSubmit={handleSubmit}>
            {tab === 'signup' && (
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>I am a...</label>
                <select value={role} onChange={e => setRole(e.target.value)} style={{
                  width: '100%', padding: '12px 16px', background: '#fafafa',
                  border: '1px solid #eee', borderRadius: 8,
                  fontSize: 15, color: '#0a6e46',
                }}>
                  <option value="customer">Customer</option>
                  <option value="supplier">Supplier</option>
                  <option value="delivery">Delivery Personnel</option>
                </select>
              </div>
            )}
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Username</label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="username" required style={{
                width: '100%', padding: '12px 16px', background: '#fafafa',
                border: '1px solid #eee', borderRadius: 8,
                fontSize: 15, color: '#0a6e46',
              }} />
            </div>
            {tab === 'signup' && (
              <>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Email</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@example.com" required style={{
                    width: '100%', padding: '12px 16px', background: '#fafafa',
                    border: '1px solid #eee', borderRadius: 8,
                    fontSize: 15, color: '#0a6e46',
                  }} />
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Phone Number</label>
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+255 7XX XXX XXX" required style={{
                    width: '100%', padding: '12px 16px', background: '#fafafa',
                    border: '1px solid #eee', borderRadius: 8,
                    fontSize: 15, color: '#0a6e46',
                  }} />
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Area</label>
                  <input type="text" value={area} onChange={e => setArea(e.target.value)} placeholder="e.g. Kariakoo, Upanga" required style={{
                    width: '100%', padding: '12px 16px', background: '#fafafa',
                    border: '1px solid #eee', borderRadius: 8,
                    fontSize: 15, color: '#0a6e46',
                  }} />
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>City</label>
                  <input type="text" value={city} onChange={e => setCity(e.target.value)} placeholder="e.g. Dar es Salaam" required style={{
                    width: '100%', padding: '12px 16px', background: '#fafafa',
                    border: '1px solid #eee', borderRadius: 8,
                    fontSize: 15, color: '#0a6e46',
                  }} />
                </div>
              </>
            )}

            <div style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <label style={{ fontSize: 13, fontWeight: 600 }}>Password</label>
                {tab === 'login' && <a href="/password-reset" style={{ fontSize: 12, color: '#0a6e46', textDecoration: 'none' }}>Forgot password?</a>}
              </div>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required style={{
                width: '100%', padding: '12px 16px', background: '#fafafa',
                border: '1px solid #eee', borderRadius: 8,
                fontSize: 15, color: '#0a6e46',
              }} />
            </div>
            {tab === 'signup' && (
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Confirm Password</label>
                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••" required style={{
                  width: '100%', padding: '12px 16px', background: '#fafafa',
                  border: '1px solid #eee', borderRadius: 8,
                  fontSize: 15, color: '#0a6e46',
                }} />
              </div>
            )}
            <button type="submit" disabled={loginLoading || signupLoading} style={{
              width: '100%', padding: '14px', borderRadius: 8,
              background: loginLoading || signupLoading ? '#f5f5f5' : '#0a6e46',
              color: loginLoading || signupLoading ? '#999' : '#fff',
              border: 'none',
              cursor: loginLoading || signupLoading ? 'not-allowed' : 'pointer',
              fontSize: 15, fontWeight: 600, marginTop: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            }}>
              {loginLoading ? (
                <><div style={{ width: 18, height: 18, border: '2px solid rgba(0,0,0,0.15)', borderTopColor: '#0a6e46', borderRadius: '50%', animation: 'spin 0.6s linear infinite', display: 'inline-block' }} /> Logging in...</>
              ) : signupLoading ? (
                <><div style={{ width: 18, height: 18, border: '2px solid rgba(0,0,0,0.15)', borderTopColor: '#0a6e46', borderRadius: '50%', animation: 'spin 0.6s linear infinite', display: 'inline-block' }} /> Creating account...</>
              ) : (
                tab === 'login' ? 'Log In' : 'Create Account'
              )}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '16px 0' }}>
              <div style={{ flex: 1, height: 1, background: '#eee' }} />
              <span style={{ fontSize: 12, color: '#888' }}>or continue with</span>
              <div style={{ flex: 1, height: 1, background: '#eee' }} />
            </div>

            <button type="button" style={{
              width: '100%', padding: '12px', borderRadius: 8,
              border: '1px solid #eee', background: '#fff', cursor: 'pointer',
              fontSize: 14, fontWeight: 600, color: '#333',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Continue with Google
            </button>
          </form>

          <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid #eee', textAlign: 'center' }}>
            <p style={{ fontSize: 12, color: '#888' }}>&copy; 2026 FaidaYetu. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
