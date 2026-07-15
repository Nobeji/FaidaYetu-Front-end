import { useNavigate } from 'react-router-dom';

const BG = 'linear-gradient(160deg, #020617 0%, #0a1628 30%, #0f1d32 60%, #1e3a5f 100%)';

export default function PrivacyPolicy() {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: '100vh', background: BG, color: '#f1f5f9' }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', height: 64, background: 'rgba(2,6,23,0.85)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.05)', position: 'sticky', top: 0, zIndex: 10 }}>
        <span style={{ fontSize: 20, fontWeight: 800, color: '#fff', cursor: 'pointer' }} onClick={() => navigate('/')}>FaidaYetu</span>
        <button onClick={() => navigate(-1)} style={{ padding: '8px 16px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', cursor: 'pointer', fontWeight: 600, fontSize: 14, color: 'rgba(255,255,255,0.55)' }}>← Back</button>
      </header>
      <main style={{ maxWidth: 800, margin: '0 auto', padding: 28 }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Privacy Policy</h1>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', marginBottom: 28 }}>Last updated: June 2026</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {[
            { title: 'Information We Collect', content: 'We collect information you provide when creating an account, including your name, email address, phone number, and business details. We also collect delivery data, location information, and transaction history necessary for platform operations.' },
            { title: 'How We Use Your Information', content: 'Your information is used to provide and improve our poultry logistics platform, process transactions, send notifications about deliveries, and personalize your experience. We may use aggregated data for analytics and service optimization.' },
            { title: 'Data Sharing', content: 'We share your information only with trusted partners necessary for platform operations, such as delivery partners and payment processors. We never sell your personal data to third parties for marketing purposes.' },
            { title: 'Data Security', content: 'We implement industry-standard security measures including encryption, access controls, and regular security audits to protect your personal and financial information.' },
            { title: 'Your Rights', content: 'You have the right to access, correct, or delete your personal data. You can manage your data preferences through your account settings or by contacting our support team.' },
            { title: 'Cookies', content: 'We use essential cookies for platform functionality and optional analytics cookies to improve our service. You can manage cookie preferences in your browser settings.' },
          ].map(s => (<div key={s.title}><h2 style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 8 }}>{s.title}</h2><p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7 }}>{s.content}</p></div>))}
        </div>
        <div style={{ marginTop: 28, padding: 20, background: 'rgba(255,255,255,0.05)', borderRadius: 14, border: '1px solid rgba(255,255,255,0.07)' }}>
          <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 8, color: '#fff' }}>Contact Us</h3>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>If you have questions about this policy, please contact us at <strong style={{ color: '#60a5fa' }}>privacy@faidayetu.co.tz</strong></p>
        </div>
      </main>
    </div>
  );
}
