import { colors, spacing, radius } from '../constants/theme';
import RoleCard from '../components/RoleCard';
import { DATA } from '../constants/theme';
import { useState, useEffect } from 'react';
import { api } from '../services/api';
import MapComponent from '../components/MapComponent';
import { useNavigate } from 'react-router-dom';

export default function Welcome() {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState([]);
  const [stats, setStats] = useState({ activeFarmers: '500+', dailyDeliveries: '12k', onTimeRate: '98%' });

  useEffect(() => {
    api.suppliers().then(s => {
      setSuppliers(s);
      const count = s.length;
      setStats({
        activeFarmers: `${count}+`,
        dailyDeliveries: `${count * 12}+`,
        onTimeRate: '98%',
      });
    }).catch(() => {});
  }, []);

  return (
    <div style={{ background: colors.surface, minHeight: '100vh' }}>
      {/* Header */}
      <header style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: `0 ${spacing.lg}px`, height: 64,
        borderBottom: `1px solid ${colors.outlineVariant}`,
        background: colors.surface, position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      }}>
        <span style={{ fontSize: 20, fontWeight: 800, color: colors.primary }}>FaidaYetu</span>
        <div style={{ display: 'flex', gap: spacing.sm }}>
          <button onClick={() => navigate('/auth')} style={{
            padding: '8px 16px', borderRadius: radius.md,
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 14, fontWeight: 500, color: colors.onSurfaceVariant,
          }}>Log In</button>
          <button onClick={() => navigate('/auth')} style={{
            padding: '8px 24px', borderRadius: radius.round,
            background: colors.primary, color: colors.onPrimary,
            border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600,
          }}>Sign Up</button>
        </div>
      </header>

      <main style={{ paddingTop: 64 }}>
        {/* Hero */}
        <section style={{ maxWidth: 1200, margin: '0 auto', padding: `${spacing.xxl}px ${spacing.lg}px` }}>
          <div style={{
            display: 'inline-flex', padding: '4px 16px', background: colors.primaryFixed,
            borderRadius: radius.round, fontSize: 12, fontWeight: 600, color: colors.primary, marginBottom: spacing.lg,
          }}>FAIDAYETU</div>
          <h1 style={{
            fontSize: 42, fontWeight: 700, lineHeight: 1.15, marginBottom: spacing.md, maxWidth: 680,
          }}>
            Revolutionizing Poultry Logistics in <span style={{ color: colors.primary }}>Dar es Salaam</span>
          </h1>
          <p style={{
            fontSize: 17, color: colors.onSurfaceVariant, marginBottom: spacing.lg, maxWidth: 520, lineHeight: 1.6,
          }}>
            A data-driven geolocation system connecting poultry farmers directly with consumers through high-precision supply chain optimization.
          </p>
          <div style={{ display: 'flex', gap: spacing.md, marginBottom: spacing.xxl, flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/auth')} style={{
              display: 'flex', alignItems: 'center', gap: spacing.sm,
              padding: '16px 40px', borderRadius: radius.round, background: colors.primary, color: colors.onPrimary,
              border: 'none', cursor: 'pointer', fontSize: 16, fontWeight: 600,
            }}>
              Join the Network <span>→</span>
            </button>
            <button onClick={() => document.getElementById('overview-map')?.scrollIntoView({ behavior: 'smooth' })} style={{
              padding: '16px 40px', borderRadius: radius.round,
              border: `2px solid ${colors.primary}`, color: colors.primary,
              background: 'none', cursor: 'pointer', fontSize: 16, fontWeight: 600,
            }}>View Live Map</button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xl }}>
            {[
              { v: stats.activeFarmers, l: 'Active Farmers' },
              { v: stats.dailyDeliveries, l: 'Daily Deliveries' },
              { v: stats.onTimeRate, l: 'On-time Rate' },
            ].map((s, i) => (
              <div key={s.l} style={{ display: 'flex', alignItems: 'center', gap: spacing.xl }}>
                <div>
                  <div style={{ fontSize: 28, fontWeight: 600, color: colors.primary }}>{s.v}</div>
                  <div style={{ fontSize: 12, color: colors.onSurfaceVariant }}>{s.l}</div>
                </div>
                {i < 2 && <div style={{ width: 1, height: 36, background: colors.outlineVariant }} />}
              </div>
            ))}
          </div>
        </section>

        {/* Roles */}
        <section style={{ maxWidth: 1200, margin: '0 auto', padding: `${spacing.xxl}px ${spacing.lg}px` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: spacing.lg, flexWrap: 'wrap', gap: spacing.md }}>
            <div>
              <h2 style={{ fontSize: 28, fontWeight: 600, marginBottom: spacing.sm }}>Tailored for Every Stakeholder</h2>
              <p style={{ fontSize: 16, color: colors.onSurfaceVariant, maxWidth: 560 }}>
                Whether you're raising flocks, managing fleets, or stocking your kitchen, FaidaYetu empowers your role in the ecosystem.
              </p>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: spacing.lg }}>
            {DATA.roles.map(r => <RoleCard key={r.id} {...r} />)}
          </div>
        </section>

        {/* Overview Map */}
        <section id="overview-map" style={{ maxWidth: 1200, margin: '0 auto', padding: `${spacing.xxl}px ${spacing.lg}px` }}>
          <h2 style={{ fontSize: 28, fontWeight: 600, marginBottom: spacing.sm }}>Supplier Network Overview</h2>
          <p style={{ fontSize: 16, color: colors.onSurfaceVariant, marginBottom: spacing.lg }}>
            Explore all poultry suppliers across Dar es Salaam
          </p>
          <MapComponent height={420} suppliers={suppliers} />
        </section>

        {/* Partners */}
        <section style={{ padding: `${spacing.xl}px ${spacing.lg}px`, borderTop: `1px solid ${colors.outlineVariant}`, textAlign: 'center' }}>
          <p style={{ fontSize: 12, color: colors.onSurfaceVariant, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: spacing.lg }}>
            In Partnership with Industry Leaders
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: spacing.xl, opacity: 0.5, flexWrap: 'wrap' }}>
            {[
              { icon: 'E', bg: colors.primary, label: 'EASTC' },
              { icon: 'D', bg: colors.tertiary, label: 'DarLogix' },
              { icon: 'T', bg: '#5c5f60', label: 'TZAgri' },
              { icon: 'S', bg: colors.primaryLight, label: 'SwiftPoultry' },
            ].map(p => (
              <div key={p.label} style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, fontSize: 18, fontWeight: 600 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: p.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.white, fontWeight: 700, fontSize: 14 }}>{p.icon}</div>
                {p.label}
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section style={{ padding: `${spacing.xxl}px ${spacing.lg}px`, background: colors.inverseSurface, textAlign: 'center' }}>
          <h2 style={{ fontSize: 32, fontWeight: 700, color: colors.surfaceBright, marginBottom: spacing.md }}>Ready to Digitalize Your Supply Chain?</h2>
          <p style={{ fontSize: 16, color: colors.surfaceVariant, maxWidth: 560, margin: '0 auto 24px' }}>
            Join the most advanced poultry network in Tanzania. Start optimizing your operations today with FaidaYetu.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: spacing.md, flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/auth')} style={{
              padding: '16px 48px', borderRadius: radius.round,
              background: colors.primaryFixed, color: colors.onPrimaryFixed,
              border: 'none', cursor: 'pointer', fontSize: 16, fontWeight: 600,
            }}>Get Started Now</button>
          </div>
        </section>

        {/* Footer */}
        <footer style={{
          padding: spacing.lg, background: colors.inverseSurface,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          borderTop: '1px solid rgba(255,255,255,0.05)', color: colors.surfaceVariant, fontSize: 12, flexWrap: 'wrap', gap: spacing.md,
        }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: colors.surfaceBright, marginBottom: 4 }}>FaidaYetu</div>
            © 2024 FaidaYetu Logistics. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: spacing.lg }}>
            <a href="/privacy" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy Policy</a>
            <a href="/terms" style={{ color: 'inherit', textDecoration: 'none' }}>Terms of Service</a>
            <a href="/contact" style={{ color: 'inherit', textDecoration: 'none' }}>Contact Support</a>
          </div>
        </footer>
      </main>
    </div>
  );
}
