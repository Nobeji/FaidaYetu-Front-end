import { useState, useEffect } from 'react';
import { colors, spacing, radius } from '../../constants/theme';
import DashboardShell from '../../components/DashboardShell';
import { api } from '../../services/api';

const navItems = [
  { icon: '🏠', label: 'Explore', nav: '/customer' },
  { icon: '🛒', label: 'Marketplace', nav: '/customer/marketplace' },
  { icon: '📋', label: 'My Orders', nav: '/customer/orders' },
  { icon: '👤', label: 'Profile', nav: '/customer/profile' },
];

const sectionsConfig = {
  addresses: {
    icon: '📍', label: 'Saved Addresses',
    fields: [
      { key: 'home', label: 'Home Address', type: 'text' },
      { key: 'work', label: 'Work Address', type: 'text' },
      { key: 'other', label: 'Other', type: 'text' },
    ],
  },
  payments: {
    icon: '💳', label: 'Payment Methods',
    fields: [
      { key: 'mobile', label: 'Mobile Money', type: 'text', placeholder: 'e.g. +255 712 345 678' },
      { key: 'card', label: 'Card (last 4 digits)', type: 'text', placeholder: 'e.g. 4242' },
    ],
  },
  notifications: {
    icon: '🔔', label: 'Notifications',
    fields: [
      { key: 'push', label: 'Push Notifications', type: 'toggle' },
      { key: 'sms', label: 'SMS Alerts', type: 'toggle' },
      { key: 'email', label: 'Email Updates', type: 'toggle' },
    ],
  },
  security: {
    icon: '🔒', label: 'Privacy & Security',
    fields: [
      { key: 'current_password', label: 'Current Password', type: 'password' },
      { key: 'new_password', label: 'New Password', type: 'password' },
      { key: 'two_factor', label: 'Two-Factor Auth', type: 'toggle' },
    ],
  },
  language: {
    icon: '🌐', label: 'Language & Region',
    fields: [
      { key: 'language', label: 'Language', type: 'select', options: ['English', 'Swahili'] },
      { key: 'region', label: 'Region', type: 'select', options: ['Tanzania', 'Kenya', 'Uganda'] },
      { key: 'timezone', label: 'Timezone', type: 'text', value: 'Africa/Dar_es_Salaam' },
    ],
  },
};

export default function CustomerProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [openSection, setOpenSection] = useState(null);
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', phone: '' });
  const [sectionData, setSectionData] = useState({
    addresses: { home: '123 Mwai Kibaki Rd, Dar es Salaam', work: '456 Nyerere Rd, Dar es Salaam', other: '' },
    payments: { mobile: '+255 712 345 678', card: '4242' },
    notifications: { push: true, sms: true, email: false },
    security: { current_password: '', new_password: '', two_factor: false },
    language: { language: 'English', region: 'Tanzania', timezone: 'Africa/Dar_es_Salaam' },
  });

  useEffect(() => {
    api.profile().then(p => { setProfile(p); setForm({ first_name: p.user.first_name || '', last_name: p.user.last_name || '', email: p.user.email || '', phone: p.phone || '' }); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handleSave = () => {
    localStorage.setItem('user', JSON.stringify({ ...JSON.parse(localStorage.getItem('user') || '{}'), first_name: form.first_name, last_name: form.last_name, email: form.email }));
    setProfile(prev => ({ ...prev, user: { ...prev.user, first_name: form.first_name, last_name: form.last_name, email: form.email }, phone: form.phone }));
    setEditing(false);
  };

  const handleSectionSave = (section) => {
    const data = sectionData[section];
    if (section === 'security' && data.new_password && data.new_password.length < 6) {
      alert('Password must be at least 6 characters.');
      return;
    }
    alert(`${sectionsConfig[section].label} saved!`);
    setOpenSection(null);
  };

  const renderField = (sectionKey, field) => {
    const val = sectionData[sectionKey][field.key];
    if (field.type === 'toggle') {
      return (
        <div
          onClick={() => setSectionData(prev => ({ ...prev, [sectionKey]: { ...prev[sectionKey], [field.key]: !prev[sectionKey][field.key] } }))}
          style={{
            width: 44, height: 24, borderRadius: 12, cursor: 'pointer', position: 'relative',
            background: val ? colors.primary : colors.surfaceContainerHigh, transition: '0.2s',
          }}
        >
          <div style={{
            width: 20, height: 20, borderRadius: '50%', background: '#fff', position: 'absolute', top: 2,
            left: val ? 22 : 2, transition: '0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          }} />
        </div>
      );
    }
    if (field.type === 'select') {
      return (
        <select
          value={val}
          onChange={e => setSectionData(prev => ({ ...prev, [sectionKey]: { ...prev[sectionKey], [field.key]: e.target.value } }))}
          style={{
            width: '100%', padding: '10px 12px', borderRadius: 8, border: `1px solid ${colors.outlineVariant}`,
            fontSize: 14, background: '#fff', boxSizing: 'border-box',
          }}
        >
          {field.options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      );
    }
    if (field.type === 'password') {
      return (
        <input
          type="password" value={val} placeholder={field.label}
          onChange={e => setSectionData(prev => ({ ...prev, [sectionKey]: { ...prev[sectionKey], [field.key]: e.target.value } }))}
          style={{
            width: '100%', padding: '10px 12px', borderRadius: 8, border: `1px solid ${colors.outlineVariant}`,
            fontSize: 14, boxSizing: 'border-box',
          }}
        />
      );
    }
    return (
      <input
        type="text" value={val} placeholder={field.placeholder || field.label}
        onChange={e => setSectionData(prev => ({ ...prev, [sectionKey]: { ...prev[sectionKey], [field.key]: e.target.value } }))}
        style={{
          width: '100%', padding: '10px 12px', borderRadius: 8, border: `1px solid ${colors.outlineVariant}`,
          fontSize: 14, boxSizing: 'border-box',
        }}
      />
    );
  };

  if (loading) return (
    <DashboardShell brand="FaidaYetu" brandSub="Customer Portal" navItems={navItems} profile="JB">
      <div style={{ textAlign: 'center', padding: spacing.xxl, color: colors.onSurfaceVariant }}>Loading profile...</div>
    </DashboardShell>
  );

  const u = profile?.user || {};
  const c = profile?.customer || {};

  return (
    <DashboardShell brand="FaidaYetu" brandSub="Customer Portal" navItems={navItems} profile="JB">
      <div className="fade-in">
        <div style={{ marginBottom: spacing.lg }}>
          <h1 style={{ fontSize: 28, fontWeight: 600, color: colors.primary }}>My Profile</h1>
          <p style={{ fontSize: 15, color: colors.onSurfaceVariant }}>Manage your account and preferences</p>
        </div>

        <div style={{ background: '#fff', borderRadius: radius.xl, border: `1px solid ${colors.outlineVariant}`, padding: spacing.lg, marginBottom: spacing.lg, display: 'flex', alignItems: 'center', gap: spacing.lg }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', overflow: 'hidden', border: `3px solid ${colors.primary}`, flexShrink: 0 }}>
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200" alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: colors.onSurface }}>{u.first_name || u.username || 'Customer'}</div>
            <div style={{ fontSize: 14, color: colors.onSurfaceVariant }}>{u.email} • {profile.phone || 'No phone'}</div>
            <div style={{ marginTop: spacing.sm, display: 'flex', gap: spacing.sm }}>
              <span style={{ padding: '4px 12px', background: colors.primaryFixed, borderRadius: radius.round, fontSize: 12, fontWeight: 600, color: colors.primary }}>Verified Buyer</span>
              <span style={{ padding: '4px 12px', background: colors.surfaceContainerHigh, borderRadius: radius.round, fontSize: 12, fontWeight: 600, color: colors.onSurfaceVariant }}>Member since {new Date(c.created_at).getFullYear() || 2026}</span>
            </div>
          </div>
          <button onClick={() => setEditing(true)} style={{ padding: '10px 20px', borderRadius: radius.md, background: colors.primary, color: colors.onPrimary, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>Edit Profile</button>
        </div>

        {editing && (
          <div style={{ background: '#fff', borderRadius: radius.xl, border: `1px solid ${colors.primary}`, padding: spacing.lg, marginBottom: spacing.lg }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: colors.primary, marginBottom: spacing.md }}>Edit Profile</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.md, marginBottom: spacing.md }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>First Name</label>
                <input value={form.first_name} onChange={e => setForm({ ...form, first_name: e.target.value })} style={{ width: '100%', padding: '10px 12px', borderRadius: radius.md, border: `1px solid ${colors.outlineVariant}`, fontSize: 14 }} />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>Last Name</label>
                <input value={form.last_name} onChange={e => setForm({ ...form, last_name: e.target.value })} style={{ width: '100%', padding: '10px 12px', borderRadius: radius.md, border: `1px solid ${colors.outlineVariant}`, fontSize: 14 }} />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>Email</label>
                <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={{ width: '100%', padding: '10px 12px', borderRadius: radius.md, border: `1px solid ${colors.outlineVariant}`, fontSize: 14 }} />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>Phone</label>
                <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} style={{ width: '100%', padding: '10px 12px', borderRadius: radius.md, border: `1px solid ${colors.outlineVariant}`, fontSize: 14 }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: spacing.md }}>
              <button onClick={handleSave} style={{ padding: '10px 24px', borderRadius: radius.md, background: colors.primary, color: colors.onPrimary, border: 'none', cursor: 'pointer', fontWeight: 700 }}>Save Changes</button>
              <button onClick={() => setEditing(false)} style={{ padding: '10px 24px', borderRadius: radius.md, background: 'none', border: `1px solid ${colors.outlineVariant}`, cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: spacing.md }}>
          {Object.entries(sectionsConfig).map(([key, section]) => (
            <div key={key} style={{ background: '#fff', borderRadius: radius.xl, border: `1px solid ${colors.outlineVariant}`, overflow: 'hidden' }}>
              <div
                onClick={() => setOpenSection(openSection === key ? null : key)}
                style={{ padding: spacing.md, display: 'flex', alignItems: 'center', gap: spacing.md, cursor: 'pointer' }}
              >
                <div style={{ width: 48, height: 48, borderRadius: radius.md, background: colors.surfaceContainerHigh, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{section.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: colors.onSurface }}>{section.label}</div>
                  <div style={{ fontSize: 13, color: colors.onSurfaceVariant }}>{openSection === key ? 'Click to close' : 'Click to manage'}</div>
                </div>
                <span style={{ color: colors.onSurfaceVariant, transform: openSection === key ? 'rotate(90deg)' : 'none', transition: '0.2s' }}>→</span>
              </div>
              {openSection === key && (
                <div style={{ padding: `0 ${spacing.md}px ${spacing.md}px`, borderTop: `1px solid ${colors.outlineVariant}` }}>
                  <div style={{ padding: spacing.md, display: 'flex', flexDirection: 'column', gap: spacing.md }}>
                    {section.fields.map(f => (
                      <div key={f.key}>
                        {f.type !== 'toggle' && <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>{f.label}</label>}
                        {f.type === 'toggle' ? (
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: 14 }}>{f.label}</span>
                            {renderField(key, f)}
                          </div>
                        ) : (
                          renderField(key, f)
                        )}
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: spacing.md }}>
                    <button onClick={() => handleSectionSave(key)} style={{ flex: 1, padding: '10px', borderRadius: radius.md, background: colors.primary, color: colors.onPrimary, border: 'none', cursor: 'pointer', fontWeight: 700 }}>Save</button>
                    <button onClick={() => setOpenSection(null)} style={{ flex: 1, padding: '10px', borderRadius: radius.md, background: 'none', border: `1px solid ${colors.outlineVariant}`, cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
