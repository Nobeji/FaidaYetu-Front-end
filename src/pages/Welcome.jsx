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
    api.suppliers().then(s => {
      setSuppliers(s);
    }).catch(() => {});
    api.stats().then(setStats).catch(() => {});
  }, []);

  return (
    <div style={{ background: '#021a0e', minHeight: '100vh', color: '#e8fff0' }}>
      <style>{`
        button:active { transform: scale(0.97); }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes slideIn { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {/* Header */}
      <header style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '0 24px', height: 64,
        background: 'rgba(2,26,14,0.8)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      }}>
        <span style={{ fontSize: 20, fontWeight: 800, color: '#fff' }}>FaidaYetu</span>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => navigate('/auth?tab=login')} style={{
            padding: '8px 20px', borderRadius: 10,
            background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)',
            cursor: 'pointer', fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,0.7)',
            backdropFilter: 'blur(8px)', transition: 'all 0.2s',
          }}>Log In</button>
          <button onClick={() => navigate('/auth?tab=signup')} style={{
            padding: '8px 24px', borderRadius: 10,
            background: 'linear-gradient(135deg, #0a6e46, #2d8a5e)', color: '#fff',
            border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600,
            boxShadow: '0 2px 12px rgba(10,110,70,0.4)', transition: 'all 0.2s',
          }}>Sign Up</button>
        </div>
      </header>

      <main style={{ paddingTop: 64 }}>
        {/* Hero */}
        <section style={{
          position: 'relative', overflow: 'hidden',
          padding: isMobile ? '60px 20px 80px' : '100px 20px 120px',
          maxWidth: 1200, margin: '0 auto',
        }}>
          {/* Hero decorative blobs */}
          <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(10,110,70,0.2) 0%, transparent 70%)', filter: 'blur(80px)', animation: 'float 8s ease-in-out infinite', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '-30%', left: '-5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,222,169,0.08) 0%, transparent 70%)', filter: 'blur(60px)', animation: 'float 12s ease-in-out infinite 2s', pointerEvents: 'none' }} />

          <div style={{ position: 'relative', zIndex: 1, animation: 'slideIn 0.7s ease-out' }}>
            <div style={{
              display: 'inline-flex', padding: '6px 16px', background: 'rgba(10,110,70,0.2)',
              border: '1px solid rgba(10,110,70,0.3)', borderRadius: 999, fontSize: 12, fontWeight: 600,
              color: 'rgba(255,222,169,0.9)', marginBottom: 24,
            }}>FAIDAYETU</div>
            <h1 style={{
              fontSize: isMobile ? 36 : 52, fontWeight: 800, lineHeight: 1.1, marginBottom: 16,
              maxWidth: 720, letterSpacing: '-0.03em',
            }}>
              Revolutionizing Poultry Logistics in <span style={{
                background: 'linear-gradient(135deg, #4caf7d, #ffdea9)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>Dar es Salaam</span>
            </h1>
            <p style={{
              fontSize: 17, color: 'rgba(255,255,255,0.5)', marginBottom: 32, maxWidth: 540, lineHeight: 1.7,
            }}>
              A data-driven geolocation system connecting poultry farmers directly with consumers through high-precision supply chain optimization.
            </p>
            <div style={{ display: 'flex', gap: 12, marginBottom: 56, flexWrap: 'wrap' }}>
              <button onClick={() => navigate('/auth')} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '16px 40px', borderRadius: 14,
                background: 'linear-gradient(135deg, #0a6e46, #2d8a5e)', color: '#fff',
                border: 'none', cursor: 'pointer', fontSize: 16, fontWeight: 700,
                boxShadow: '0 4px 24px rgba(10,110,70,0.4)',
              }}>
                Join the Network <span>→</span>
              </button>
              <button onClick={() => document.getElementById('overview-map')?.scrollIntoView({ behavior: 'smooth' })} style={{
                padding: '16px 40px', borderRadius: 14,
                border: '1px solid rgba(255,255,255,0.15)', color: '#fff',
                background: 'rgba(255,255,255,0.06)', cursor: 'pointer', fontSize: 16, fontWeight: 600,
                backdropFilter: 'blur(8px)',
              }}>View Live Map</button>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 32, flexWrap: 'wrap' }}>
              {[
                { v: stats.activeFarmers || '--', l: 'Active Farmers' },
                { v: stats.dailyDeliveries || '--', l: 'Daily Deliveries' },
                { v: stats.onTimeRate || '--', l: 'On-time Rate' },
              ].map((s, i) => (
                <div key={s.l} style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
                  <div style={{
                    padding: '16px 24px', borderRadius: 16,
                    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
                    backdropFilter: 'blur(8px)',
                  }}>
                    <div style={{ fontSize: 26, fontWeight: 700, color: '#fff' }}>{s.v}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>{s.l}</div>
                  </div>
                  {i < 2 && !isMobile && <div style={{ width: 1, height: 36, background: 'rgba(255,255,255,0.08)' }} />}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Roles */}
        <section style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 20px' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={{ fontSize: isMobile ? 26 : 32, fontWeight: 700, marginBottom: 12 }}>Tailored for Every Stakeholder</h2>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.45)', maxWidth: 560, margin: '0 auto' }}>
              Whether you're raising flocks, managing fleets, or stocking your kitchen, FaidaYetu empowers your role in the ecosystem.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 20 }}>
            {DATA.roles.map(r => <RoleCard key={r.id} {...r} />)}
          </div>
        </section>

        {/* Overview Map */}
        <section id="overview-map" style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 20px' }}>
          <h2 style={{ fontSize: isMobile ? 26 : 32, fontWeight: 700, marginBottom: 8 }}>Supplier Network Overview</h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.45)', marginBottom: 24 }}>
            Explore all poultry suppliers across Dar es Salaam
          </p>
          <div style={{
            borderRadius: 20, overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          }}>
            <MapComponent height={420} suppliers={suppliers} />
          </div>
        </section>

        {/* CTA */}
        <section style={{
          padding: '80px 20px', textAlign: 'center', position: 'relative', overflow: 'hidden',
          background: 'linear-gradient(135deg, rgba(10,110,70,0.15) 0%, rgba(45,138,94,0.1) 100%)',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{ position: 'relative', zIndex: 1, maxWidth: 600, margin: '0 auto' }}>
            <h2 style={{ fontSize: isMobile ? 28 : 36, fontWeight: 800, color: '#fff', marginBottom: 16, letterSpacing: '-0.02em' }}>Ready to Digitalize Your Supply Chain?</h2>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', maxWidth: 480, margin: '0 auto 32px', lineHeight: 1.6 }}>
              Join the most advanced poultry network in Tanzania. Start optimizing your operations today with FaidaYetu.
            </p>
            <button onClick={() => navigate('/auth')} style={{
              padding: '16px 56px', borderRadius: 14,
              background: 'linear-gradient(135deg, #0a6e46 0%, #2d8a5e 50%, #4caf7d 100%)',
              color: '#fff', border: 'none', cursor: 'pointer', fontSize: 16, fontWeight: 700,
              boxShadow: '0 4px 24px rgba(10,110,70,0.4)',
            }}>Get Started Now</button>
          </div>
        </section>

        {/* Footer */}
        <footer style={{
          padding: '24px 20px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          color: 'rgba(255,255,255,0.4)', fontSize: 12, flexWrap: 'wrap', gap: 12,
          maxWidth: 1200, margin: '0 auto',
        }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 4 }}>FaidaYetu</div>
            © 2026 FaidaYetu Logistics. All rights reserved.
          </div>
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
