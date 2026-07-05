import { useState, useEffect } from 'react';
import DashboardShell from '../../components/DashboardShell';
import { api } from '../../services/api';
import { useToast } from '../../components/ToastContext';

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
      { key: 'mobile', label: 'Mobile Money', type: 'text', placeholder: 'e.g. +255 7XX XXX XXX' },
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
  const toast = useToast();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [openSection, setOpenSection] = useState(null);
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', phone: '' });
  const [sectionData, setSectionData] = useState({
    addresses: { home: '', work: '', other: '' },
    payments: { mobile: '', card: '' },
    notifications: { push: false, sms: false, email: false },
    security: { current_password: '', new_password: '', two_factor: false },
    language: { language: 'English', region: 'Tanzania', timezone: 'Africa/Dar_es_Salaam' },
  });

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userName = user.username || 'Customer';
  const initials = userName.charAt(0).toUpperCase();

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
      toast('Password must be at least 6 characters.', 'error');
      return;
    }
    toast(`${sectionsConfig[section].label} saved!`, 'success');
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
            background: val ? '#000' : '#f5f5f5', transition: '0.2s',
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
            width: '100%', padding: '10px 12px', borderRadius: 8, border: `1px solid ${'#eee'}`,
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
            width: '100%', padding: '10px 12px', borderRadius: 8, border: `1px solid ${'#eee'}`,
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
          width: '100%', padding: '10px 12px', borderRadius: 8, border: `1px solid ${'#eee'}`,
          fontSize: 14, boxSizing: 'border-box',
        }}
      />
    );
  };

  if (loading) return (
    <DashboardShell brand="FaidaYetu" brandSub="Customer Portal" navItems={navItems} profile={
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#f9f9f9', padding: '8px 12px', borderRadius: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 700, fontSize: 13 }}>{initials}</div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 13 }}>{userName}</div>
            <div style={{ fontSize: 11, color: '#888' }}>Customer Portal</div>
          </div>
        </div>
      }>
      <div style={{ textAlign: 'center', padding: 48, color: '#888' }}>Loading profile...</div>
    </DashboardShell>
  );

  const u = profile?.user || {};
  const c = profile?.customer || {};

  return (
    <DashboardShell brand="FaidaYetu" brandSub="Customer Portal" navItems={navItems} profile={
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#f9f9f9', padding: '8px 12px', borderRadius: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 700, fontSize: 13 }}>{initials}</div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 13 }}>{userName}</div>
            <div style={{ fontSize: 11, color: '#888' }}>Customer Portal</div>
          </div>
        </div>
      }>
      <div className="fade-in">
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: 28, fontWeight: 600, color: '#000' }}>My Profile</h1>
          <p style={{ fontSize: 15, color: '#888' }}>Manage your account and preferences</p>
        </div>

        <div style={{ background: '#fff', borderRadius: 12, border: `1px solid ${'#eee'}`, padding: 20, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', overflow: 'hidden', border: `3px solid ${'#0a6e46'}`, flexShrink: 0, background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 700, color: '#0a6e46' }}>
            {initials}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#111' }}>{u.first_name || u.username || 'Customer'}</div>
            <div style={{ fontSize: 14, color: '#888' }}>{u.email} • {profile.phone || 'No phone'}</div>
            <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
              <span style={{ padding: '4px 12px', background: '#f0f0f0', borderRadius: 999, fontSize: 12, fontWeight: 600, color: '#000' }}>Verified Buyer</span>
              <span style={{ padding: '4px 12px', background: '#f5f5f5', borderRadius: 999, fontSize: 12, fontWeight: 600, color: '#888' }}>Member since {new Date(c.created_at).getFullYear() || 2026}</span>
            </div>
          </div>
          <button onClick={() => setEditing(true)} style={{ padding: '10px 20px', borderRadius: 8, background: '#000', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>Edit Profile</button>
        </div>

        {editing && (
          <div style={{ background: '#fff', borderRadius: 12, border: `1px solid ${'#000'}`, padding: 20, marginBottom: 20 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#000', marginBottom: 12 }}>Edit Profile</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>First Name</label>
                <input value={form.first_name} onChange={e => setForm({ ...form, first_name: e.target.value })} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: `1px solid ${'#eee'}`, fontSize: 14 }} />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>Last Name</label>
                <input value={form.last_name} onChange={e => setForm({ ...form, last_name: e.target.value })} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: `1px solid ${'#eee'}`, fontSize: 14 }} />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>Email</label>
                <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: `1px solid ${'#eee'}`, fontSize: 14 }} />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>Phone</label>
                <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: `1px solid ${'#eee'}`, fontSize: 14 }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={handleSave} style={{ padding: '10px 24px', borderRadius: 8, background: '#000', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700 }}>Save Changes</button>
              <button onClick={() => setEditing(false)} style={{ padding: '10px 24px', borderRadius: 8, background: 'none', border: `1px solid ${'#eee'}`, cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12 }}>
          {Object.entries(sectionsConfig).map(([key, section]) => (
            <div key={key} style={{ background: '#fff', borderRadius: 12, border: `1px solid ${'#eee'}`, overflow: 'hidden' }}>
              <div
                onClick={() => setOpenSection(openSection === key ? null : key)}
                style={{ padding: 12, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}
              >
                <div style={{ width: 48, height: 48, borderRadius: 8, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{section.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: '#111' }}>{section.label}</div>
                  <div style={{ fontSize: 13, color: '#888' }}>{openSection === key ? 'Click to close' : 'Click to manage'}</div>
                </div>
                <span style={{ color: '#888', transform: openSection === key ? 'rotate(90deg)' : 'none', transition: '0.2s' }}>→</span>
              </div>
              {openSection === key && (
                <div style={{ padding: `0 ${12}px ${12}px`, borderTop: `1px solid ${'#eee'}` }}>
                  <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
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
                  <div style={{ display: 'flex', gap: 12 }}>
                    <button onClick={() => handleSectionSave(key)} style={{ flex: 1, padding: '10px', borderRadius: 8, background: '#000', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700 }}>Save</button>
                    <button onClick={() => setOpenSection(null)} style={{ flex: 1, padding: '10px', borderRadius: 8, background: 'none', border: `1px solid ${'#eee'}`, cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
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
