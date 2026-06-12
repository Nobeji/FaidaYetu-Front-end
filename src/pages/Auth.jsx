import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { colors, spacing, radius } from '../constants/theme';
import { api } from '../services/api';

export default function Auth() {
  const [tab, setTab] = useState('login');
  const [role, setRole] = useState('customer');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [locating, setLocating] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (tab === 'login') {
      try {
        const data = await api.login({ username, password });
        localStorage.setItem('token', data.access);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('profile', JSON.stringify(data.profile));
        if (data.customer) localStorage.setItem('customer', JSON.stringify(data.customer));
        if (data.supplier) localStorage.setItem('supplier', JSON.stringify(data.supplier));
        if (data.delivery_person) localStorage.setItem('delivery_person', JSON.stringify(data.delivery_person));

        const userRole = data.profile.role;
        if (userRole === 'customer') navigate('/customer');
        else if (userRole === 'supplier') navigate('/supplier');
        else navigate('/delivery');
      } catch (err) {
        setError('Invalid username or password');
      }
    } else {
      setLocating(true);
      try {
        const coords = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            pos => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
            () => reject(new Error('Location is required. Please enable GPS and reload.')),
            { timeout: 10000 },
          );
        });

        const data = await api.register({
          username, password,
          email: `${username}@faidayetu.co.tz`,
          role,
          lat: coords.lat,
          lng: coords.lng,
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
        setLocating(false);
      }
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <div style={{
        width: '50%', background: colors.primary, display: 'flex',
        flexDirection: 'column', justifyContent: 'center', padding: spacing.xxl,
        color: colors.white, position: 'relative', overflow: 'hidden',
      }}>
        <img src="https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?w=800" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.3, mixBlendMode: 'overlay' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontSize: 36, fontWeight: 700, lineHeight: 1.2, marginBottom: spacing.lg }}>
            Powering the Future of <span style={{ color: colors.tertiaryFixed }}>Poultry Logistics</span>
          </h1>
          <p style={{ fontSize: 16, opacity: 0.9, marginBottom: spacing.xl, maxWidth: 440, lineHeight: 1.6 }}>
            The integrated platform for suppliers, customers, and delivery personnel.
          </p>
          <div style={{ display: 'flex', gap: spacing.lg }}>
            <div><div style={{ fontSize: 22, fontWeight: 600 }}>10K+</div><div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.7 }}>Orders Delivered</div></div>
            <div style={{ width: 1, height: 36, background: 'rgba(255,255,255,0.2)' }} />
            <div><div style={{ fontSize: 22, fontWeight: 600 }}>4.9/5</div><div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.7 }}>Trust Rating</div></div>
          </div>
        </div>
      </div>

      <div style={{
        width: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: spacing.lg, background: colors.surface,
      }}>
        <div style={{
          width: '100%', maxWidth: 420, background: colors.surfaceContainerLowest,
          padding: spacing.xl, borderRadius: radius.xl, border: `1px solid ${colors.outlineVariant}`,
        }}>
          <div style={{ textAlign: 'center', marginBottom: spacing.lg }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: colors.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: spacing.sm }}>
              🌿 FaidaYetu
            </h2>
            <p style={{ fontSize: 13, color: colors.onSurfaceVariant, marginTop: spacing.xs }}>
              {tab === 'login' ? 'Welcome back. Please enter your details.' : 'Create your account.'}
            </p>
          </div>

          <div style={{ display: 'flex', borderBottom: `1px solid ${colors.outlineVariant}`, marginBottom: spacing.lg }}>
            {['login', 'signup'].map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                flex: 1, padding: spacing.md, textAlign: 'center', fontSize: 14, fontWeight: tab === t ? 700 : 500,
                color: tab === t ? colors.primary : colors.onSurfaceVariant,
                borderBottom: tab === t ? `2px solid ${colors.primary}` : '2px solid transparent',
                background: 'none', cursor: 'pointer',
              }}>
                {t === 'login' ? 'Log In' : 'Sign Up'}
              </button>
            ))}
          </div>

          {error && (
            <div style={{ padding: spacing.md, background: colors.errorContainer, borderRadius: radius.md, color: colors.error, fontSize: 13, fontWeight: 600, marginBottom: spacing.md }}>{error}</div>
          )}

          <form onSubmit={handleSubmit}>
            {tab === 'signup' && (
              <div style={{ marginBottom: spacing.md }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: spacing.sm }}>I am a...</label>
                <select value={role} onChange={e => setRole(e.target.value)} style={{
                  width: '100%', padding: '12px 16px', background: colors.surface,
                  border: `1px solid ${colors.outlineVariant}`, borderRadius: radius.md,
                  fontSize: 15, color: colors.onSurface,
                }}>
                  <option value="customer">Customer</option>
                  <option value="supplier">Supplier</option>
                  <option value="delivery">Delivery Personnel</option>
                </select>
              </div>
            )}
            <div style={{ marginBottom: spacing.md }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: spacing.sm }}>Username</label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="username" required style={{
                width: '100%', padding: '12px 16px', background: colors.surface,
                border: `1px solid ${colors.outlineVariant}`, borderRadius: radius.md,
                fontSize: 15, color: colors.onSurface,
              }} />
            </div>
            <div style={{ marginBottom: spacing.md }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm }}>
                <label style={{ fontSize: 13, fontWeight: 600 }}>Password</label>
                {tab === 'login' && <a href="/password-reset" style={{ fontSize: 12, color: colors.primary, textDecoration: 'none' }}>Forgot password?</a>}
              </div>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required style={{
                width: '100%', padding: '12px 16px', background: colors.surface,
                border: `1px solid ${colors.outlineVariant}`, borderRadius: radius.md,
                fontSize: 15, color: colors.onSurface,
              }} />
            </div>
            <button type="submit" disabled={locating} style={{
              width: '100%', padding: '14px', borderRadius: radius.md,
              background: locating ? colors.primaryLight : colors.primary, color: colors.onPrimary, border: 'none',
              cursor: locating ? 'not-allowed' : 'pointer', fontSize: 15, fontWeight: 600, marginTop: spacing.sm,
            }}>
              {locating ? 'Getting your location...' : tab === 'login' ? 'Log In' : 'Create Account'}
            </button>


          </form>

          <div style={{ marginTop: spacing.lg, paddingTop: spacing.lg, borderTop: `1px solid ${colors.outlineVariant}`, textAlign: 'center' }}>
            <p style={{ fontSize: 12, color: colors.onSurfaceVariant }}>© 2026 FaidaYetu. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
