import { useState, useEffect } from 'react';
import { colors, spacing, radius } from '../../constants/theme';
import DashboardShell from '../../components/DashboardShell';
import { api } from '../../services/api';

const navItems = [
  { icon: '📊', label: 'Dashboard', nav: '/supplier' },
  { icon: '📦', label: 'Inventory', nav: '/supplier/inventory' },
  { icon: '🛒', label: 'Orders', nav: '/supplier/orders' },
  { icon: '📈', label: 'Analytics', nav: '/supplier/analytics' },
  { icon: '📉', label: 'Statistics', nav: '/supplier/statistics' },
  { icon: '⚙️', label: 'Settings', nav: '/supplier/settings' },
  { icon: '❓', label: 'Support', nav: '/supplier/support' },
];

const fieldMeta = {
  'Business Name': { key: 'business_name', section: 'store', type: 'text' },
  'Business Email': { key: 'business_email', section: 'store', type: 'text' },
  'Phone': { key: 'phone', section: 'store', type: 'text' },
  'Location': { key: 'address', section: 'store', type: 'text' },
  'Username': { key: 'username', section: 'account', type: 'text' },
  'Email': { key: 'email', section: 'account', type: 'text' },
};

export default function SupplierSettings() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    api.profile().then(p => { setProfile(p); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const startEdit = (label, currentValue) => {
    setEditingField(label);
    setEditValue(currentValue);
  };

  const saveEdit = (label) => {
    const meta = fieldMeta[label];
    const payload = { [meta.key]: editValue };
    if (meta.key === 'username' || meta.key === 'email') {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({ ...user, [meta.key]: editValue }));
    }
    api.updateProfile(payload).catch(() => {});
    if (meta.section === 'store') {
      setProfile(prev => ({ ...prev, supplier: { ...prev.supplier, [meta.key]: editValue } }));
    } else if (meta.key === 'phone') {
      setProfile(prev => ({ ...prev, phone: editValue }));
    } else if (meta.key === 'username' || meta.key === 'email') {
      setProfile(prev => ({ ...prev, user: { ...prev.user, [meta.key]: editValue } }));
    }
    alert(`${label} updated to: ${editValue}`);
    setEditingField(null);
  };

  const s = profile?.supplier || {};
  const u = profile?.user || {};

  const sections = [
    {
      title: 'Store Profile',
      items: [
        { label: 'Business Name', value: s.business_name || 'N/A' },
        { label: 'Business Email', value: s.business_email || u.email || 'N/A' },
        { label: 'Phone', value: profile?.phone || 'N/A' },
        { label: 'Location', value: s.address || 'N/A' },
      ],
    },
    {
      title: 'Account',
      items: [
        { label: 'Username', value: u.username || 'N/A' },
        { label: 'Email', value: u.email || 'N/A' },
      ],
    },
  ];

  return (
    <DashboardShell brand="FaidaYetu" brandSub="Poultry Logistics Hub" navItems={navItems}>
      <div className="fade-in">
        <div style={{ marginBottom: spacing.lg }}>
          <h1 style={{ fontSize: 28, fontWeight: 600, color: colors.primary }}>Settings</h1>
          <p style={{ fontSize: 15, color: colors.onSurfaceVariant }}>Manage your business configuration</p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: spacing.xxl, color: colors.onSurfaceVariant }}>Loading settings...</div>
        ) : (
          sections.map(section => (
            <div key={section.title} style={{ background: '#fff', borderRadius: radius.xl, border: `1px solid ${colors.outlineVariant}`, marginBottom: spacing.lg }}>
              <div style={{ padding: spacing.lg, borderBottom: `1px solid ${colors.outlineVariant}` }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: colors.primary }}>{section.title}</h3>
              </div>
              {section.items.map((item, i) => {
                const isEditing = editingField === item.label;
                return (
                  <div key={item.label} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: `${spacing.md}px ${spacing.lg}px`,
                    borderBottom: i < section.items.length - 1 ? `1px solid ${colors.outlineVariant}` : 'none',
                  }}>
                    <span style={{ fontWeight: 500, color: colors.onSurface, fontSize: 15, minWidth: 140 }}>{item.label}</span>
                    {isEditing ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, flex: 1, justifyContent: 'flex-end' }}>
                        <input
                          value={editValue}
                          onChange={e => setEditValue(e.target.value)}
                          style={{
                            padding: '6px 10px', borderRadius: radius.md, border: `1px solid ${colors.primary}`,
                            fontSize: 14, flex: 1, maxWidth: 280, outline: 'none',
                          }}
                          autoFocus
                        />
                        <button onClick={() => saveEdit(item.label)} style={{ padding: '6px 14px', borderRadius: radius.md, background: colors.primary, color: colors.onPrimary, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 12, whiteSpace: 'nowrap' }}>Save</button>
                        <button onClick={() => setEditingField(null)} style={{ padding: '6px 14px', borderRadius: radius.md, background: 'none', border: `1px solid ${colors.outlineVariant}`, cursor: 'pointer', fontWeight: 600, fontSize: 12 }}>Cancel</button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
                        <span style={{ color: colors.onSurfaceVariant, fontSize: 14 }}>{item.value}</span>
                        <button onClick={() => startEdit(item.label, item.value)} style={{ padding: '4px 12px', borderRadius: radius.md, border: `1px solid ${colors.primary}`, background: 'none', color: colors.primary, cursor: 'pointer', fontWeight: 600, fontSize: 12 }}>Edit</button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))
        )}
      </div>
    </DashboardShell>
  );
}
