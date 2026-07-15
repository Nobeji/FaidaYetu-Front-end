import RoleCard from '../components/RoleCard';
import { DATA } from '../constants/theme';
import { useState, useEffect } from 'react';
import { api } from '../services/api';
import MapComponent from '../components/MapComponent';
import { useNavigate } from 'react-router-dom';

export default function Welcome() {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState([]);
  const [stats, setStats] = useState({});
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    api.suppliers().then(s => setSuppliers(s)).catch(() => {});
    api.stats().then(setStats).catch(() => {});
  }, []);

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', color: '#1e293b' }}>
      <header style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '0 24px', height: 64,
        background: '#fff', borderBottom: '1px solid #e2e8f0',
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      }}>
        <span style={{ fontSize: 20, fontWeight: 800, color: '#0f172a' }}>FaidaYetu</span>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => navigate('/auth?tab=login')} style={{
            padding: '8px 20px', borderRadius: 10, background: '#fff',
            border: '1px solid #e2e8f0', cursor: 'pointer', fontSize: 14, fontWeight: 500,
            color: '#475569',
          }}>Log In</button>
          <button onClick={() => navigate('/auth?tab=signup')} style={{
            padding: '8px 24px', borderRadius: 10,
            background: '#0a6e46', color: '#fff',
            border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600,
          }}>Sign Up</button>
        </div>
      </header>

      <main style={{ paddingTop: 64 }}>
        <section style={{ position: 'relative', overflow: 'hidden', padding: isMobile ? '60px 20px 80px' : '100px 20px 120px', maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'inline-flex', padding: '6px 16px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 999, fontSize: 12, fontWeight: 600, color: '#0a6e46', marginBottom: 24 }}>FAIDAYETU</div>
            <h1 style={{ fontSize: isMobile ? 36 : 52, fontWeight: 800, lineHeight: 1.1, marginBottom: 16, maxWidth: 720, letterSpacing: '-0.03em', color: '#0f172a' }}>
              Revolutionizing Poultry Logistics in <span style={{ color: '#0a6e46' }}>Dar es Salaam</span>
            </h1>
            <p style={{ fontSize: 17, color: '#64748b', marginBottom: 32, maxWidth: 540, lineHeight: 1.7 }}>
              A data-driven geolocation system connecting poultry farmers directly with consumers through high-precision supply chain optimization.
            </p>
            <div style={{ display: 'flex', gap: 12, marginBottom: 56, flexWrap: 'wrap' }}>
              <button onClick={() => navigate('/auth')} style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '16px 40px', borderRadius: 14,
                background: '#0a6e46', color: '#fff',
                border: 'none', cursor: 'pointer', fontSize: 16, fontWeight: 700,
              }}>Join the Network <span>→</span></button>
              <button onClick={() => document.getElementById('overview-map')?.scrollIntoView({ behavior: 'smooth' })} style={{
                padding: '16px 40px', borderRadius: 14,
                border: '1px solid #e2e8f0', color: '#475569',
                background: '#fff', cursor: 'pointer', fontSize: 16, fontWeight: 600,
              }}>View Live Map</button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 12 : 32, flexWrap: 'wrap' }}>
              {[{ v: stats.activeFarmers || '--', l: 'Active Farmers' }, { v: stats.dailyDeliveries || '--', l: 'Daily Deliveries' }, { v: stats.onTimeRate || '--', l: 'On-time Rate' }].map((s, i) => (
                <div key={s.l} style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 12 : 32 }}>
                  <div style={{ padding: isMobile ? '12px 16px' : '16px 24px', borderRadius: 16, background: '#fff', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: isMobile ? 22 : 26, fontWeight: 700, color: '#0f172a' }}>{s.v}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{s.l}</div>
                  </div>
                  {i < 2 && !isMobile && <div style={{ width: 1, height: 36, background: '#e2e8f0' }} />}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 20px' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={{ fontSize: isMobile ? 26 : 32, fontWeight: 700, marginBottom: 12, color: '#0f172a' }}>Tailored for Every Stakeholder</h2>
            <p style={{ fontSize: 16, color: '#64748b', maxWidth: 560, margin: '0 auto' }}>Whether you're raising flocks, managing fleets, or stocking your kitchen, FaidaYetu empowers your role in the ecosystem.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 20 }}>
            {DATA.roles.map(r => <RoleCard key={r.id} {...r} />)}
          </div>
        </section>

        <section id="overview-map" style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 20px' }}>
          <h2 style={{ fontSize: isMobile ? 26 : 32, fontWeight: 700, marginBottom: 8, color: '#0f172a' }}>Supplier Network Overview</h2>
          <p style={{ fontSize: 16, color: '#64748b', marginBottom: 24 }}>Explore all poultry suppliers across Dar es Salaam</p>
          <div style={{ borderRadius: 20, overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <MapComponent height={isMobile ? 280 : 420} suppliers={suppliers} />
          </div>
        </section>

        <section style={{ padding: '80px 20px', textAlign: 'center', background: '#fff', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ maxWidth: 600, margin: '0 auto' }}>
            <h2 style={{ fontSize: isMobile ? 28 : 36, fontWeight: 800, color: '#0f172a', marginBottom: 16 }}>Ready to Digitalize Your Supply Chain?</h2>
            <p style={{ fontSize: 16, color: '#64748b', maxWidth: 480, margin: '0 auto 32px', lineHeight: 1.6 }}>Join the most advanced poultry network in Tanzania. Start optimizing your operations today with FaidaYetu.</p>
            <button onClick={() => navigate('/auth')} style={{ padding: isMobile ? '14px 32px' : '16px 56px', borderRadius: 14, background: '#0a6e46', color: '#fff', border: 'none', cursor: 'pointer', fontSize: isMobile ? 15 : 16, fontWeight: 700 }}>Get Started Now</button>
          </div>
        </section>

        <footer style={{ padding: '24px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#94a3b8', fontSize: 12, flexWrap: 'wrap', gap: 12, maxWidth: 1200, margin: '0 auto' }}>
          <div><div style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>FaidaYetu</div>© 2026 FaidaYetu Logistics. All rights reserved.</div>
          <div style={{ display: 'flex', gap: 20 }}>
            <a href="/privacy" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy Policy</a>
            <a href="/terms" style={{ color: 'inherit', textDecoration: 'none' }}>Terms of Service</a>
            <a href="/contact" style={{ color: 'inherit', textDecoration: 'none' }}>Contact Support</a>
          </div>
        </footer>
      </main>
    </div>
  );
}
