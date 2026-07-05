import { useState, useEffect } from 'react';
import DashboardShell from '../../components/DashboardShell';
import { api } from '../../services/api';
import { useToast } from '../../components/ToastContext';

const navItems = [
  { icon: '📊', label: 'Dashboard', nav: '/supplier' },
  { icon: '📦', label: 'Inventory', nav: '/supplier/inventory' },
  { icon: '🛒', label: 'Orders', nav: '/supplier/orders' },
  { icon: '📈', label: 'Analytics', nav: '/supplier/analytics' },
  { icon: '📉', label: 'Statistics', nav: '/supplier/statistics' },
  { icon: '⚙️', label: 'Settings', nav: '/supplier/settings' },
  { icon: '❓', label: 'Support', nav: '/supplier/support' },
];

const sectionsConfig = {
  store: {
    icon: '🏪', label: 'Store Profile',
    fields: [
      { key: 'business_name', label: 'Business Name', type: 'text' },
      { key: 'business_email', label: 'Business Email', type: 'text' },
      { key: 'phone', label: 'Phone Number', type: 'text' },
      { key: 'address', label: 'Location', type: 'text' },
      { key: 'description', label: 'Description', type: 'text' },
    ],
  },
  account: {
    icon: '👤', label: 'Account',
    fields: [
      { key: 'username', label: 'Username', type: 'text' },
      { key: 'email', label: 'Email', type: 'text' },
      { key: 'current_password', label: 'Current Password', type: 'password' },
      { key: 'new_password', label: 'New Password', type: 'password' },
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
  business: {
    icon: '⏰', label: 'Business Hours',
    fields: [
      { key: 'opening', label: 'Opening Time', type: 'text', placeholder: 'e.g. 08:00' },
      { key: 'closing', label: 'Closing Time', type: 'text', placeholder: 'e.g. 18:00' },
      { key: 'weekends', label: 'Open on Weekends', type: 'toggle' },
    ],
  },
};

export default function SupplierSettings() {
  const toast = useToast();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [openSection, setOpenSection] = useState(null);
  const [form, setForm] = useState({ first_name: '', last_name: '', business_name: '', business_email: '', phone: '', address: '' });
  const [sectionData, setSectionData] = useState({
    store: { business_name: '', business_email: '', phone: '', address: '', description: '' },
    account: { username: '', email: '', current_password: '', new_password: '' },
    notifications: { push: false, sms: false, email: false },
    business: { opening: '', closing: '', weekends: false },
  });

  useEffect(() => {
    api.profile().then(p => {
      setProfile(p);
      const s = p.supplier || {};
      const u = p.user || {};
      setForm({ first_name: u.first_name || '', last_name: u.last_name || '', business_name: s.business_name || '', business_email: s.business_email || '', phone: p.phone || '', address: s.address || '' });
      setSectionData(prev => ({
        ...prev,
        store: { business_name: s.business_name || '', business_email: s.business_email || '', phone: p.phone || '', address: s.address || '', description: s.description || '' },
        account: { ...prev.account, username: u.username || '', email: u.email || '' },
      }));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleSave = () => {
    setProfile(prev => {
      const s = prev?.supplier || {};
      const u = prev?.user || {};
      return { ...prev, supplier: { ...s, business_name: form.business_name, business_email: form.business_email, address: form.address }, phone: form.phone, user: { ...u, first_name: form.first_name, last_name: form.last_name } };
    });
    api.updateProfile({ business_name: form.business_name, business_email: form.business_email, phone: form.phone, address: form.address }).catch(() => {});
    setEditing(false);
  };

  const handleSectionSave = (section) => {
    const data = sectionData[section];
    if (section === 'store') {
      setProfile(prev => ({ ...prev, supplier: { ...prev.supplier, ...data }, phone: data.phone }));
      api.updateProfile(data).catch(() => {});
    } else if (section === 'account') {
      if (data.new_password && data.new_password.length < 6) {
        toast('Password must be at least 6 characters.', 'error');
        return;
      }
      if (data.new_password) {
        api.updateProfile({ current_password: data.current_password, new_password: data.new_password }).catch(() => {});
      }
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
    if (field.type === 'password') {
      return (
        <input type="password" value={val} placeholder={field.label}
          onChange={e => setSectionData(prev => ({ ...prev, [sectionKey]: { ...prev[sectionKey], [field.key]: e.target.value } }))}
          style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #eee', fontSize: 14, boxSizing: 'border-box' }}
        />
      );
    }
    return (
      <input type="text" value={val} placeholder={field.placeholder || field.label}
        onChange={e => setSectionData(prev => ({ ...prev, [sectionKey]: { ...prev[sectionKey], [field.key]: e.target.value } }))}
        style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #eee', fontSize: 14, boxSizing: 'border-box' }}
      />
    );
  };

  if (loading) return (
    <DashboardShell brand="FaidaYetu" brandSub="Poultry Logistics Hub" navItems={navItems}>
      <div style={{ textAlign: 'center', padding: 48, color: '#888' }}>Loading settings...</div>
    </DashboardShell>
  );

  const s = profile?.supplier || {};
  const u = profile?.user || {};
  const initials = (u.first_name?.[0] || u.username?.[0] || 'S').toUpperCase();

  return (
    <DashboardShell brand="FaidaYetu" brandSub="Poultry Logistics Hub" navItems={navItems}>
      <div className="fade-in">
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: 28, fontWeight: 600, color: '#000' }}>Settings</h1>
          <p style={{ fontSize: 15, color: '#888' }}>Manage your business profile and preferences</p>
        </div>

        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #eee', padding: 20, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', overflow: 'hidden', border: '3px solid #0a6e46', flexShrink: 0, background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 700, color: '#0a6e46' }}>
            {initials}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#111' }}>{s.business_name || u.username || 'Supplier'}</div>
            <div style={{ fontSize: 14, color: '#888' }}>{s.business_email || u.email} • {profile.phone || 'No phone'}</div>
            <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
              <span style={{ padding: '4px 12px', background: '#f0f0f0', borderRadius: 999, fontSize: 12, fontWeight: 600, color: '#000' }}>Verified Supplier</span>
              {s.address && <span style={{ padding: '4px 12px', background: '#f5f5f5', borderRadius: 999, fontSize: 12, fontWeight: 600, color: '#888' }}>{s.address}</span>}
            </div>
          </div>
          <button onClick={() => setEditing(true)} style={{ padding: '10px 20px', borderRadius: 8, background: '#000', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>Edit Profile</button>
        </div>

        {editing && (
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #000', padding: 20, marginBottom: 20 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#000', marginBottom: 12 }}>Edit Profile</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>First Name</label>
                <input value={form.first_name} onChange={e => setForm({ ...form, first_name: e.target.value })} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #eee', fontSize: 14, boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>Last Name</label>
                <input value={form.last_name} onChange={e => setForm({ ...form, last_name: e.target.value })} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #eee', fontSize: 14, boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>Business Name</label>
                <input value={form.business_name} onChange={e => setForm({ ...form, business_name: e.target.value })} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #eee', fontSize: 14, boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>Business Email</label>
                <input value={form.business_email} onChange={e => setForm({ ...form, business_email: e.target.value })} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #eee', fontSize: 14, boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>Phone</label>
                <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #eee', fontSize: 14, boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>Location</label>
                <input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #eee', fontSize: 14, boxSizing: 'border-box' }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={handleSave} style={{ padding: '10px 24px', borderRadius: 8, background: '#000', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700 }}>Save Changes</button>
              <button onClick={() => setEditing(false)} style={{ padding: '10px 24px', borderRadius: 8, background: 'none', border: '1px solid #eee', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12 }}>
          {Object.entries(sectionsConfig).map(([key, section]) => (
            <div key={key} style={{ background: '#fff', borderRadius: 12, border: '1px solid #eee', overflow: 'hidden' }}>
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
                <div style={{ padding: '0 12px 12px', borderTop: '1px solid #eee' }}>
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
                    <button onClick={() => setOpenSection(null)} style={{ flex: 1, padding: '10px', borderRadius: 8, background: 'none', border: '1px solid #eee', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
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
