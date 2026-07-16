import { useState, useEffect } from 'react';
import DashboardShell from '../../components/DashboardShell';
import StatusBadge from '../../components/StatusBadge';
import { api } from '../../services/api';
import { Truck, Route, Coins, Settings, HelpCircle, Ruler, Star } from 'lucide-react';

const navItems = [
  { icon: Truck, label: 'Active Tasks', nav: '/delivery' },
  { icon: Route, label: 'Route History', nav: '/delivery/route-history' },
  { icon: Coins, label: 'Earnings', nav: '/delivery/earnings' },
  { icon: Settings, label: 'Settings', nav: '/delivery/settings' },
  { icon: HelpCircle, label: 'Support', nav: '/delivery/support' },
];

export default function RouteHistory() {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const did = JSON.parse(localStorage.getItem('delivery_person') || '{}').id || 1;
    api.deliveries({ delivery_person: did }).then(d => { setDeliveries(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const completed = deliveries.filter(d => d.status === 'completed');

  return (
    <DashboardShell brand="FaidaYetu" brandSub="Delivery Portal" navItems={navItems}>
      <div className="fade-in">
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: 28, fontWeight: 600, color: '#000' }}>Route History</h1>
          <p style={{ fontSize: 15, color: '#888' }}>Past deliveries and completed routes</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12, marginBottom: 20 }}>
          <div style={{ background: '#fff', borderRadius: 12, border: `1px solid ${'#eee'}`, padding: 20, textAlign: 'center' }}>
            <Route size={32} style={{ marginBottom: 8 }} />
            <div style={{ fontSize: 26, fontWeight: 800, color: '#111' }}>{completed.length}</div>
            <div style={{ fontSize: 13, color: '#888' }}>Total Routes</div>
          </div>
          <div style={{ background: '#fff', borderRadius: 12, border: `1px solid ${'#eee'}`, padding: 20, textAlign: 'center' }}>
            <Ruler size={32} style={{ marginBottom: 8 }} />
            <div style={{ fontSize: 26, fontWeight: 800, color: '#111' }}>{completed.reduce((s, d) => s + (d.distance_km || 0), 0).toFixed(0)} km</div>
            <div style={{ fontSize: 13, color: '#888' }}>Total Distance</div>
          </div>
          <div style={{ background: '#fff', borderRadius: 12, border: `1px solid ${'#eee'}`, padding: 20, textAlign: 'center' }}>
            <Coins size={32} style={{ marginBottom: 8 }} />
            <div style={{ fontSize: 26, fontWeight: 800, color: '#111' }}>${completed.reduce((s, d) => s + (d.earnings || 0), 0).toFixed(2)}</div>
            <div style={{ fontSize: 13, color: '#888' }}>Total Earnings</div>
          </div>
          <div style={{ background: '#fff', borderRadius: 12, border: `1px solid ${'#eee'}`, padding: 20, textAlign: 'center' }}>
            <Star size={32} style={{ marginBottom: 8 }} />
            <div style={{ fontSize: 26, fontWeight: 800, color: '#111' }}>--</div>
            <div style={{ fontSize: 13, color: '#888' }}>Avg Rating</div>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 48, color: '#888' }}>Loading...</div>
        ) : (
          <div style={{ background: '#fff', borderRadius: 12, border: `1px solid ${'#eee'}`, overflow: 'hidden' }}>
            <div style={{ padding: 20, borderBottom: `1px solid ${'#eee'}` }}>
              <h3 style={{ fontSize: 20, fontWeight: 600, color: '#000' }}>Completed Routes</h3>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'rgba(193,236,212,0.3)' }}>
                    {['Delivery ID', 'Distance', 'Earnings', 'Status'].map(h => (
                      <th key={h} style={{ padding: 12, fontSize: 13, fontWeight: 600, color: '#888', borderBottom: `1px solid ${'#eee'}` }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {completed.map(d => (
                    <tr key={d.id}>
                      <td style={{ padding: 12, fontWeight: 700, color: '#000' }}>#{d.id}</td>
                      <td style={{ padding: 12 }}>{d.distance_km || 0} km</td>
                      <td style={{ padding: 12, fontWeight: 700 }}>${d.earnings || 0}</td>
                      <td style={{ padding: 12 }}><StatusBadge status={d.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
