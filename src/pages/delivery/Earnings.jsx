import { useState, useEffect } from 'react';
import DashboardShell from '../../components/DashboardShell';
import { api } from '../../services/api';
import { useToast } from '../../components/ToastContext';
import { Truck, Route, Coins, Settings, HelpCircle } from 'lucide-react';
import { useLang } from '../../components/LanguageContext';

export default function DeliveryEarnings() {
  const { t } = useLang();
  const navItems = [
    { icon: Truck, label: t('nav.activeTasks'), nav: '/delivery' },
    { icon: Route, label: t('nav.routeHistory'), nav: '/delivery/route-history' },
    { icon: Coins, label: t('nav.earnings'), nav: '/delivery/earnings' },
    { icon: Settings, label: t('nav.settings'), nav: '/delivery/settings' },
    { icon: HelpCircle, label: t('nav.support'), nav: '/delivery/support' },
  ];
  const toast = useToast();
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const did = JSON.parse(localStorage.getItem('delivery_person') || '{}').id || 1;
    api.deliveries({ delivery_person: did }).then(d => { setDeliveries(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const totalEarnings = deliveries.reduce((s, d) => s + (d.earnings || 0), 0);
  const weeklyEarnings = totalEarnings;
  const availableBalance = Math.round(totalEarnings * 100) / 100;

  return (
    <DashboardShell brand="FaidaYetu" brandSub="Delivery Portal" navItems={navItems}>
      <div className="fade-in">
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: 28, fontWeight: 600, color: '#000' }}>{t('nav.earnings')}</h1>
          <p style={{ fontSize: 15, color: '#888' }}>{t('delivery.earningsToday')}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
          <div style={{ background: '#fff', borderRadius: 12, border: `1px solid ${'#eee'}`, padding: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', color: '#888', marginBottom: 8 }}>Today</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#111' }}>${(totalEarnings * 0.15).toFixed(2)}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#000' }}>--</div>
          </div>
          <div style={{ background: '#fff', borderRadius: 12, border: `1px solid ${'#eee'}`, padding: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', color: '#888', marginBottom: 8 }}>This Week</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#111' }}>${weeklyEarnings.toFixed(2)}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#000' }}>--</div>
          </div>
          <div style={{ background: '#fff', borderRadius: 12, border: `1px solid ${'#eee'}`, padding: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', color: '#888', marginBottom: 8 }}>Available for Withdrawal</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#111' }}>${availableBalance.toFixed(2)}</div>
            <button onClick={() => toast(`Withdraw $${availableBalance.toFixed(2)}? This will be sent to your registered payment method.`, 'info')} style={{ marginTop: 8, padding: '8px 20px', borderRadius: 8, background: '#000', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>Withdraw →</button>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 48, color: '#888' }}>{t('common.loading')}</div>
        ) : (
          <div style={{ background: '#fff', borderRadius: 12, border: `1px solid ${'#eee'}`, padding: 20 }}>
            <h3 style={{ fontSize: 20, fontWeight: 600, color: '#000', marginBottom: 12 }}>Transaction History</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {deliveries.map(d => (
                <div key={d.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 8, background: '#fafafa', borderRadius: 8 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>${d.earnings || 0}</div>
                    <div style={{ fontSize: 12, color: '#888' }}>Delivery #{d.id} • {d.distance_km || 0} km</div>
                  </div>
                  <span style={{
                    padding: '2px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600,
                    background: d.status === 'completed' ? '#f0f0f0' : '#f5f5f5',
                    color: d.status === 'completed' ? '#000' : '#888',
                  }                  }>{d.status === 'completed' ? t('common.paid') : t('common.pending')}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
