import { useNavigate } from 'react-router-dom';

export default function TermsOfService() {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b' }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', height: 64, background: '#fff', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 10 }}>
        <span style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', cursor: 'pointer' }} onClick={() => navigate('/')}>FaidaYetu</span>
        <button onClick={() => navigate(-1)} style={{ padding: '8px 16px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: 14, color: '#475569' }}>← Back</button>
      </header>
      <main style={{ maxWidth: 800, margin: '0 auto', padding: 28 }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>Terms of Service</h1>
        <p style={{ fontSize: 14, color: '#94a3b8', marginBottom: 28 }}>Last updated: June 2026</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {[
            { title: 'Acceptance of Terms', content: 'By creating an account or using the FaidaYetu platform, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you should not use our services.' },
            { title: 'User Accounts', content: 'You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account. You must provide accurate, current, and complete information during registration.' },
            { title: 'Platform Usage', content: 'FaidaYetu connects poultry suppliers, customers, and delivery partners. All parties agree to use the platform in good faith, provide accurate product and delivery information, and comply with all applicable laws and regulations.' },
            { title: 'Transactions & Payments', content: 'All transactions conducted through the platform are binding. Suppliers agree to fulfill orders as listed, customers agree to pay the stated amounts, and delivery partners agree to complete deliveries professionally.' },
            { title: 'Delivery Partner Terms', content: 'Delivery partners are independent contractors. They agree to maintain valid licenses, insurance, and vehicles in good condition. They are responsible for their own taxes, expenses, and compliance with local regulations.' },
            { title: 'Limitation of Liability', content: 'FaidaYetu acts as an intermediary platform and is not liable for disputes between users, product quality issues, delivery failures caused by force majeure, or any indirect damages arising from platform use.' },
            { title: 'Termination', content: 'We reserve the right to suspend or terminate accounts that violate these terms, engage in fraudulent activity, or negatively impact the platform community. Users may terminate their accounts at any time.' },
          ].map(s => (<div key={s.title}><h2 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>{s.title}</h2><p style={{ fontSize: 15, color: '#475569', lineHeight: 1.7 }}>{s.content}</p></div>))}
        </div>
        <div style={{ marginTop: 28, padding: 20, background: '#fff', borderRadius: 14, border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 8, color: '#0f172a' }}>Questions?</h3>
          <p style={{ fontSize: 14, color: '#64748b' }}>Contact us at <strong style={{ color: '#0a6e46' }}>legal@faidayetu.co.tz</strong></p>
        </div>
      </main>
    </div>
  );
}
