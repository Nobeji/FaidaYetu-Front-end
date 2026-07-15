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
    <div style={{ background: '#020617', minHeight: '100vh', color: '#f1f5f9' }}>
      <style>{`
        button:active { transform: scale(0.97); }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes slideIn { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {/* Header */}
      <header style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '0 24px', height: 64,
        background: 'rgba(2,6,23,0.85)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      }}>
        <span style={{ fontSize: 20, fontWeight: 800, color: '#fff' }}>FaidaYetu</span>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => navigate('/auth?tab=login')} style={{
            padding: '8px 20px', borderRadius: 10, background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', fontSize: 14, fontWeight: 500,
            color: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(8px)',
          }}>Log In</button>
          <button onClick={() => navigate('/auth?tab=signup')} style={{
            padding: '8px 24px', borderRadius: 10,
            background: 'linear-gradient(135deg, #1e40af, #2563eb)', color: '#fff',
            border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600,
            boxShadow: '0 2px 12px rgba(30,64,175,0.4)',
          }}>Sign Up</button>
        </div>
      </header>

      <main style={{ paddingTop: 64 }}>
        {/* Hero */}
        <section style={{ position: 'relative', overflow: 'hidden', padding: isMobile ? '60px 20px 80px' : '100px 20px 120px', maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(30,64,175,0.2) 0%, transparent 70%)', filter: 'blur(80px)', animation: 'float 8s ease-in-out infinite', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '-30%', left: '-5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />

          <div style={{ position: 'relative', zIndex: 1, animation: 'slideIn 0.7s ease-out' }}>
            <div style={{ display: 'inline-flex', padding: '6px 16px', background: 'rgba(30,64,175,0.2)', border: '1px solid rgba(30,64,175,0.3)', borderRadius: 999, fontSize: 12, fontWeight: 600, color: 'rgba(96,165,250,0.9)', marginBottom: 24 }}>FAIDAYETU</div>
            <h1 style={{ fontSize: isMobile ? 36 : 52, fontWeight: 800, lineHeight: 1.1, marginBottom: 16, maxWidth: 720, letterSpacing: '-0.03em' }}>
              Revolutionizing Poultry Logistics in <span style={{ background: 'linear-gradient(135deg, #3b82f6, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Dar es Salaam</span>
            </h1>
            <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.45)', marginBottom: 32, maxWidth: 540, lineHeight: 1.7 }}>
              A data-driven geolocation system connecting poultry farmers directly with consumers through high-precision supply chain optimization.
            </p>
            <div style={{ display: 'flex', gap: 12, marginBottom: 56, flexWrap: 'wrap' }}>
              <button onClick={() => navigate('/auth')} style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '16px 40px', borderRadius: 14,
                background: 'linear-gradient(135deg, #1e40af, #2563eb)', color: '#fff',
                border: 'none', cursor: 'pointer', fontSize: 16, fontWeight: 700,
                boxShadow: '0 4px 24px rgba(30,64,175,0.4)',
              }}>Join the Network <span>→</span></button>
              <button onClick={() => document.getElementById('overview-map')?.scrollIntoView({ behavior: 'smooth' })} style={{
                padding: '16px 40px', borderRadius: 14,
                border: '1px solid rgba(255,255,255,0.12)', color: '#fff',
                background: 'rgba(255,255,255,0.05)', cursor: 'pointer', fontSize: 16, fontWeight: 600,
                backdropFilter: 'blur(8px)',
              }}>View Live Map</button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 12 : 32, flexWrap: 'wrap' }}>
              {[{ v: stats.activeFarmers || '--', l: 'Active Farmers' }, { v: stats.dailyDeliveries || '--', l: 'Daily Deliveries' }, { v: stats.onTimeRate || '--', l: 'On-time Rate' }].map((s, i) => (
                <div key={s.l} style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 12 : 32 }}>
                  <div style={{ padding: isMobile ? '12px 16px' : '16px 24px', borderRadius: 16, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(8px)' }}>
                    <div style={{ fontSize: isMobile ? 22 : 26, fontWeight: 700, color: '#fff' }}>{s.v}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{s.l}</div>
                  </div>
                  {i < 2 && !isMobile && <div style={{ width: 1, height: 36, background: 'rgba(255,255,255,0.06)' }} />}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Roles */}
        <section style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 20px' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={{ fontSize: isMobile ? 26 : 32, fontWeight: 700, marginBottom: 12 }}>Tailored for Every Stakeholder</h2>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.4)', maxWidth: 560, margin: '0 auto' }}>Whether you're raising flocks, managing fleets, or stocking your kitchen, FaidaYetu empowers your role in the ecosystem.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 20 }}>
            {DATA.roles.map(r => <RoleCard key={r.id} {...r} />)}
          </div>
        </section>

        {/* Map */}
        <section id="overview-map" style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 20px' }}>
          <h2 style={{ fontSize: isMobile ? 26 : 32, fontWeight: 700, marginBottom: 8 }}>Supplier Network Overview</h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.4)', marginBottom: 24 }}>Explore all poultry suppliers across Dar es Salaam</p>
          <div style={{ borderRadius: 20, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
            <MapComponent height={isMobile ? 280 : 420} suppliers={suppliers} />
          </div>
        </section>

        {/* CTA */}
        <section style={{ padding: '80px 20px', textAlign: 'center', position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, rgba(30,64,175,0.12) 0%, rgba(6,182,212,0.06) 100%)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ position: 'relative', zIndex: 1, maxWidth: 600, margin: '0 auto' }}>
            <h2 style={{ fontSize: isMobile ? 28 : 36, fontWeight: 800, color: '#fff', marginBottom: 16, letterSpacing: '-0.02em' }}>Ready to Digitalize Your Supply Chain?</h2>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.45)', maxWidth: 480, margin: '0 auto 32px', lineHeight: 1.6 }}>Join the most advanced poultry network in Tanzania. Start optimizing your operations today with FaidaYetu.</p>
            <button onClick={() => navigate('/auth')} style={{ padding: isMobile ? '14px 32px' : '16px 56px', borderRadius: 14, background: 'linear-gradient(135deg, #1e40af 0%, #2563eb 50%, #3b82f6 100%)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: isMobile ? 15 : 16, fontWeight: 700, boxShadow: '0 4px 24px rgba(30,64,175,0.4)' }}>Get Started Now</button>
          </div>
        </section>

        {/* Footer */}
        <footer style={{ padding: '24px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'rgba(255,255,255,0.35)', fontSize: 12, flexWrap: 'wrap', gap: 12, maxWidth: 1200, margin: '0 auto' }}>
          <div><div style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 4 }}>FaidaYetu</div>© 2026 FaidaYetu Logistics. All rights reserved.</div>
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
