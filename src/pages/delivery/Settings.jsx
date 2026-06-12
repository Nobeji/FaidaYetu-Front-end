import { useState, useEffect } from 'react';
import { colors, spacing, radius } from '../../constants/theme';
import DashboardShell from '../../components/DashboardShell';
import { api } from '../../services/api';

const navItems = [
  { icon: '🚚', label: 'Active Tasks', nav: '/delivery' },
  { icon: '🛣️', label: 'Route History', nav: '/delivery/route-history' },
  { icon: '💰', label: 'Earnings', nav: '/delivery/earnings' },
  { icon: '⚙️', label: 'Settings', nav: '/delivery/settings' },
  { icon: '❓', label: 'Support', nav: '/delivery/support' },
];

const fieldMeta = {
  'Full Name': { key: 'username', section: 'user' },
  'Email': { key: 'email', section: 'user' },
  'Phone': { key: 'phone', section: 'profile' },
  'Vehicle Type': { key: 'vehicle_type', section: 'dp' },
  'Status': { key: 'status', section: 'dp' },
};

export default function DeliverySettings() {
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
    if (meta.section === 'user') {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({ ...user, [meta.key]: editValue }));
    }
    api.updateProfile(payload).catch(() => {});
    if (meta.section === 'user') {
      setProfile(prev => ({ ...prev, user: { ...prev.user, [meta.key]: editValue } }));
    } else if (meta.section === 'profile') {
      setProfile(prev => ({ ...prev, phone: editValue }));
    } else if (meta.section === 'dp') {
      setProfile(prev => ({ ...prev, delivery_person: { ...prev.delivery_person, [meta.key]: editValue } }));
    }
    alert(`${label} updated to: ${editValue}`);
    setEditingField(null);
  };

  const d = profile?.delivery_person || {};
  const u = profile?.user || {};
  const name = `${u.first_name || ''} ${u.last_name || ''}`.trim() || u.username || 'N/A';

  const sections = [
    {
      title: 'Account',
      items: [
        { label: 'Full Name', value: name },
        { label: 'Email', value: u.email || 'N/A' },
        { label: 'Phone', value: profile?.phone || 'N/A' },
        { label: 'Vehicle Type', value: d.vehicle_type || 'N/A' },
      ],
    },
    {
      title: 'Status',
      items: [
        { label: 'Status', value: d.status === 'available' ? 'Online - Accepting Tasks' : d.status || 'N/A' },
        { label: 'Total Routes', value: `${d.total_routes || 0}` },
        { label: 'Rating', value: `${d.rating || 'N/A'}` },
      ],
    },
  ];

  return (
    <DashboardShell brand="FaidaYetu" brandSub="Delivery Portal" navItems={navItems}>
      <div className="fade-in">
        <div style={{ marginBottom: spacing.lg }}>
          <h1 style={{ fontSize: 28, fontWeight: 600, color: colors.primary }}>Settings</h1>
          <p style={{ fontSize: 15, color: colors.onSurfaceVariant }}>Manage your delivery account</p>
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
                const canEdit = !!fieldMeta[item.label];
                return (
                  <div key={item.label} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: `${spacing.md}px ${spacing.lg}px`,
                    borderBottom: i < section.items.length - 1 ? `1px solid ${colors.outlineVariant}` : 'none',
                  }}>
                    <span style={{ fontWeight: 500, color: colors.onSurface, fontSize: 15, minWidth: 120 }}>{item.label}</span>
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
                        {canEdit && <button onClick={() => startEdit(item.label, item.value)} style={{ padding: '4px 12px', borderRadius: radius.md, border: `1px solid ${colors.primary}`, background: 'none', color: colors.primary, cursor: 'pointer', fontWeight: 600, fontSize: 12 }}>Edit</button>}
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
