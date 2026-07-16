import { useState, useEffect } from 'react';
import DashboardShell from '../../components/DashboardShell';
import { api } from '../../services/api';
import { useToast } from '../../components/ToastContext';
import { Truck, Route, Coins, Settings, HelpCircle } from 'lucide-react';
import { useLang } from '../../components/LanguageContext';

const fieldMeta = {
  'Full Name': { key: 'username', section: 'user' },
  'Email': { key: 'email', section: 'user' },
  'Phone': { key: 'phone', section: 'profile' },
  'Vehicle Type': { key: 'vehicle_type', section: 'dp' },
  'Status': { key: 'status', section: 'dp' },
};

export default function DeliverySettings() {
  const { t } = useLang();
  const navItems = [
    { icon: Truck, label: t('nav.activeTasks'), nav: '/delivery' },
    { icon: Route, label: t('nav.routeHistory'), nav: '/delivery/route-history' },
    { icon: Coins, label: t('nav.earnings'), nav: '/delivery/earnings' },
    { icon: Settings, label: t('nav.settings'), nav: '/delivery/settings' },
    { icon: HelpCircle, label: t('nav.support'), nav: '/delivery/support' },
  ];
  const toast = useToast();
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
    toast(`${label} updated to: ${editValue}`, 'success');
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
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: 28, fontWeight: 600, color: '#000' }}>{t('nav.settings')}</h1>
          <p style={{ fontSize: 15, color: '#888' }}>{t('delivery.awaitingTasks')}</p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 48, color: '#888' }}>{t('common.loading')}</div>
        ) : (
          sections.map(section => (
            <div key={section.title} style={{ background: '#fff', borderRadius: 12, border: `1px solid ${'#eee'}`, marginBottom: 20 }}>
              <div style={{ padding: 20, borderBottom: `1px solid ${'#eee'}` }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#000' }}>{section.title}</h3>
              </div>
              {section.items.map((item, i) => {
                const isEditing = editingField === item.label;
                const canEdit = !!fieldMeta[item.label];
                return (
                  <div key={item.label} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: `${12}px ${20}px`,
                    borderBottom: i < section.items.length - 1 ? `1px solid ${'#eee'}` : 'none',
                  }}>
                    <span style={{ fontWeight: 500, color: '#111', fontSize: 15, minWidth: 120 }}>{item.label}</span>
                    {isEditing ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, justifyContent: 'flex-end' }}>
                        <input
                          value={editValue}
                          onChange={e => setEditValue(e.target.value)}
                          style={{
                            padding: '6px 10px', borderRadius: 8, border: `1px solid ${'#000'}`,
                            fontSize: 14, flex: 1, maxWidth: 280, outline: 'none',
                          }}
                          autoFocus
                        />
                        <button onClick={() => saveEdit(item.label)} style={{ padding: '6px 14px', borderRadius: 8, background: '#000', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 12, whiteSpace: 'nowrap' }}>{t('common.save')}</button>
                        <button onClick={() => setEditingField(null)} style={{ padding: '6px 14px', borderRadius: 8, background: 'none', border: `1px solid ${'#eee'}`, cursor: 'pointer', fontWeight: 600, fontSize: 12 }}>{t('common.cancel')}</button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ color: '#888', fontSize: 14 }}>{item.value}</span>
                        {canEdit && <button onClick={() => startEdit(item.label, item.value)} style={{ padding: '4px 12px', borderRadius: 8, border: `1px solid ${'#000'}`, background: 'none', color: '#000', cursor: 'pointer', fontWeight: 600, fontSize: 12 }}>Edit</button>}
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
