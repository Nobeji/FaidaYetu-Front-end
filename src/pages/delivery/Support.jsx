import DashboardShell from '../../components/DashboardShell';
import { Truck, Route, Coins, Settings, HelpCircle, Mail, Phone, MessageCircle, AlertTriangle } from 'lucide-react';

const navItems = [
  { icon: Truck, label: 'Active Tasks', nav: '/delivery' },
  { icon: Route, label: 'Route History', nav: '/delivery/route-history' },
  { icon: Coins, label: 'Earnings', nav: '/delivery/earnings' },
  { icon: Settings, label: 'Settings', nav: '/delivery/settings' },
  { icon: HelpCircle, label: 'Support', nav: '/delivery/support' },
];

const faqs = [];

export default function DeliverySupport() {
  return (
    <DashboardShell brand="FaidaYetu" brandSub="Delivery Portal" navItems={navItems}>
      <div className="fade-in">
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: 28, fontWeight: 600, color: '#000' }}>Support</h1>
          <p style={{ fontSize: 15, color: '#888' }}>Get help with your delivery account</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div>
            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #eee', padding: 20, marginBottom: 20 }}>
              <h3 style={{ fontSize: 20, fontWeight: 600, color: '#000', marginBottom: 12 }}>Contact Us</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, background: '#fafafa', borderRadius: 8 }}>
                  <Mail size={24} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>Email Support</div>
                    <div style={{ fontSize: 13, color: '#888' }}>support@faidayetu.co.tz</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, background: '#fafafa', borderRadius: 8 }}>
                  <Phone size={24} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>Phone Support</div>
                    <div style={{ fontSize: 13, color: '#888' }}>Coming soon</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, background: '#fafafa', borderRadius: 8 }}>
                  <MessageCircle size={24} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>Live Chat</div>
                    <div style={{ fontSize: 13, color: '#888' }}>Coming soon</div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ background: '#f5f5f5', borderRadius: 12, padding: 20, color: '#111' }}>
              <AlertTriangle size={36} style={{ marginBottom: 8 }} />
              <h4 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Roadside Assistance</h4>
              <p style={{ fontSize: 14, opacity: 0.9, marginBottom: 12 }}>Coming soon.</p>
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: 20, fontWeight: 600, color: '#000', marginBottom: 12 }}>Frequently Asked Questions</h3>
            {faqs.length === 0 ? (
              <p style={{ color: '#888', fontSize: 14 }}>No FAQs yet. Check back later.</p>
            ) : (
              faqs.map((f, i) => (
                <div key={i} style={{ background: '#fff', borderRadius: 12, border: '1px solid #eee', padding: 16, marginBottom: 12 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: '#111', marginBottom: 6 }}>{f.q}</div>
                  <div style={{ fontSize: 14, color: '#888' }}>{f.a}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
