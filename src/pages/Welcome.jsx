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

  useEffect(() => {
    api.suppliers().then(s => {
      setSuppliers(s);
    }).catch(() => {});
    api.stats().then(setStats).catch(() => {});
  }, []);

  return (
    <div style={{ background: '#fafafa', minHeight: '100vh' }}>
      <style>{`button:active { transform: scale(0.96); }`}</style>
      {/* Header */}
      <header style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '0 20px', height: 64,
        borderBottom: '1px solid #eee',
        background: '#fafafa', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      }}>
        <span style={{ fontSize: 20, fontWeight: 800, color: '#0a6e46' }}>FaidaYetu</span>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => navigate('/auth?tab=login')} style={{
            padding: '8px 16px', borderRadius: 8,
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 14, fontWeight: 500, color: '#888',
          }}>Log In</button>
          <button onClick={() => navigate('/auth?tab=signup')} style={{
            padding: '8px 24px', borderRadius: 999,
            background: '#0a6e46', color: '#fff',
            border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600,
          }}>Sign Up</button>
        </div>
      </header>

      <main style={{ paddingTop: 64 }}>
        {/* Hero */}
        <section style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 20px' }}>
          <div style={{
            display: 'inline-flex', padding: '4px 16px', background: '#f0f0f0',
            borderRadius: 999, fontSize: 12, fontWeight: 600, color: '#0a6e46', marginBottom: 20,
          }}>FAIDAYETU</div>
          <h1 style={{
            fontSize: 42, fontWeight: 700, lineHeight: 1.15, marginBottom: 12, maxWidth: 680,
          }}>
            Revolutionizing Poultry Logistics in <span style={{ color: '#0a6e46' }}>Dar es Salaam</span>
          </h1>
          <p style={{
            fontSize: 17, color: '#888', marginBottom: 20, maxWidth: 520, lineHeight: 1.6,
          }}>
            A data-driven geolocation system connecting poultry farmers directly with consumers through high-precision supply chain optimization.
          </p>
          <div style={{ display: 'flex', gap: 12, marginBottom: 48, flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/auth')} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '16px 40px', borderRadius: 999, background: '#0a6e46', color: '#fff',
              border: 'none', cursor: 'pointer', fontSize: 16, fontWeight: 600,
            }}>
              Join the Network <span>→</span>
            </button>
            <button onClick={() => document.getElementById('overview-map')?.scrollIntoView({ behavior: 'smooth' })} style={{
              padding: '16px 40px', borderRadius: 999,
              border: '2px solid #000', color: '#0a6e46',
              background: 'none', cursor: 'pointer', fontSize: 16, fontWeight: 600,
            }}>View Live Map</button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
            {[
              { v: stats.activeFarmers || '--', l: 'Active Farmers' },
              { v: stats.dailyDeliveries || '--', l: 'Daily Deliveries' },
              { v: stats.onTimeRate || '--', l: 'On-time Rate' },
            ].map((s, i) => (
              <div key={s.l} style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
                <div>
                  <div style={{ fontSize: 28, fontWeight: 600, color: '#0a6e46' }}>{s.v}</div>
                  <div style={{ fontSize: 12, color: '#888' }}>{s.l}</div>
                </div>
                {i < 2 && <div style={{ width: 1, height: 36, background: '#eee' }} />}
              </div>
            ))}
          </div>
        </section>

        {/* Roles */}
        <section style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h2 style={{ fontSize: 28, fontWeight: 600, marginBottom: 8 }}>Tailored for Every Stakeholder</h2>
              <p style={{ fontSize: 16, color: '#888', maxWidth: 560 }}>
                Whether you're raising flocks, managing fleets, or stocking your kitchen, FaidaYetu empowers your role in the ecosystem.
              </p>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {DATA.roles.map(r => <RoleCard key={r.id} {...r} />)}
          </div>
        </section>

        {/* Overview Map */}
        <section id="overview-map" style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 20px' }}>
          <h2 style={{ fontSize: 28, fontWeight: 600, marginBottom: 8 }}>Supplier Network Overview</h2>
          <p style={{ fontSize: 16, color: '#888', marginBottom: 20 }}>
            Explore all poultry suppliers across Dar es Salaam
          </p>
          <MapComponent height={420} suppliers={suppliers} />
        </section>

        {/* CTA */}
        <section style={{ padding: '48px 20px', background: '#0a331c', textAlign: 'center' }}>
          <h2 style={{ fontSize: 32, fontWeight: 700, color: '#fff', marginBottom: 12 }}>Ready to Digitalize Your Supply Chain?</h2>
          <p style={{ fontSize: 16, color: '#f0f0f0', maxWidth: 560, margin: '0 auto 24px' }}>
            Join the most advanced poultry network in Tanzania. Start optimizing your operations today with FaidaYetu.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/auth')} style={{
              padding: '16px 48px', borderRadius: 999,
              background: '#0a6e46', color: '#fff',
              border: 'none', cursor: 'pointer', fontSize: 16, fontWeight: 600,
            }}>Get Started Now</button>
          </div>
        </section>

        {/* Footer */}
        <footer style={{
          padding: 20, background: '#0a331c',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          borderTop: '1px solid rgba(255,255,255,0.05)', color: '#f0f0f0', fontSize: 12, flexWrap: 'wrap', gap: 12,
        }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 4 }}>FaidaYetu</div>
            © 2024 FaidaYetu Logistics. All rights reserved.
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
