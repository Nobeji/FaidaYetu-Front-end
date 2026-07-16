import { LayoutDashboard, Package, ShoppingCart, Bell, TrendingUp, TrendingDown, Settings, HelpCircle, Mail, Phone, MessageCircle, Star } from 'lucide-react';
import DashboardShell from '../../components/DashboardShell';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', nav: '/supplier' },
  { icon: Package, label: 'Inventory', nav: '/supplier/inventory' },
  { icon: ShoppingCart, label: 'Orders', nav: '/supplier/orders' },
  { icon: Bell, label: 'Notifications', nav: '/supplier/notifications' },
  { icon: TrendingUp, label: 'Analytics', nav: '/supplier/analytics' },
  { icon: TrendingDown, label: 'Statistics', nav: '/supplier/statistics' },
  { icon: Settings, label: 'Settings', nav: '/supplier/settings' },
  { icon: HelpCircle, label: 'Support', nav: '/supplier/support' },
];

const faqs = [];

export default function SupplierSupport() {
  return (
    <DashboardShell brand="FaidaYetu" brandSub="Poultry Logistics Hub" navItems={navItems}>
      <div className="fade-in">
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: 28, fontWeight: 600, color: '#000' }}>Support</h1>
          <p style={{ fontSize: 15, color: '#888' }}>Get help with your supplier account</p>
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
              <div style={{ marginBottom: 8 }}><Star size={36} /></div>
              <h4 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Have a Question?</h4>
              <p style={{ fontSize: 14, opacity: 0.9, marginBottom: 12 }}>Contact your account manager or email us for assistance.</p>
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
