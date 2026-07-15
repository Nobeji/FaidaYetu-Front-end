import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ContactSupport() {
  const [name, setName] = useState(''); const [email, setEmail] = useState('');
  const [subject, setSubject] = useState(''); const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false); const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => { const c = () => setIsMobile(window.innerWidth < 768); window.addEventListener('resize', c); return () => window.removeEventListener('resize', c); }, []);
  const handleSubmit = (e) => { e.preventDefault(); setSent(true); };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b' }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', height: 64, background: '#fff', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 10 }}>
        <span style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', cursor: 'pointer' }} onClick={() => navigate('/')}>FaidaYetu</span>
        <button onClick={() => navigate(-1)} style={{ padding: '8px 16px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: 14, color: '#475569' }}>← Back</button>
      </header>
      <main style={{ maxWidth: 700, margin: '0 auto', padding: 28 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <h1 style={{ fontSize: 32, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>Contact Support</h1>
          <p style={{ fontSize: 15, color: '#64748b' }}>We're here to help. Reach out to us anytime.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 12, marginBottom: 28 }}>
          {[{ icon: '📧', label: 'Email', val: 'support@faidayetu.co.tz' }, { icon: '📞', label: 'Phone', val: 'Coming soon' }, { icon: '💬', label: 'Live Chat', val: 'Coming soon' }].map(c => (
            <div key={c.label} style={{ background: '#fff', borderRadius: 14, border: '1px solid #e2e8f0', padding: 20, textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{c.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>{c.label}</div>
              <div style={{ fontSize: 13, color: '#64748b' }}>{c.val}</div>
            </div>
          ))}
        </div>
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 28, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          {!sent ? (
            <>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', marginBottom: 20 }}>Send us a Message</h2>
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 12, marginBottom: 12 }}>
                  <div><label style={{ fontSize: 13, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>Full Name</label><input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" required style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff', fontSize: 14, color: '#0f172a', outline: 'none', boxSizing: 'border-box' }} /></div>
                  <div><label style={{ fontSize: 13, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff', fontSize: 14, color: '#0f172a', outline: 'none', boxSizing: 'border-box' }} /></div>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>Subject</label>
                  <select value={subject} onChange={e => setSubject(e.target.value)} required style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff', fontSize: 14, color: '#0f172a', outline: 'none', boxSizing: 'border-box' }}>
                    <option value="">Select a topic...</option><option>Account Issue</option><option>Payment Problem</option><option>Delivery Concern</option><option>Technical Support</option><option>Other</option>
                  </select>
                </div>
                <div style={{ marginBottom: 20 }}><label style={{ fontSize: 13, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>Message</label><textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Describe your issue..." rows={5} required style={{ width: '100%', padding: '13px 16px', borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 15, color: '#0f172a', background: '#fff', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} /></div>
                <button type="submit" style={{ width: '100%', padding: '14px', borderRadius: 12, background: '#0a6e46', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 16, fontWeight: 700 }}>Send Message</button>
              </form>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: 28 }}>
              <div style={{ fontSize: 56, marginBottom: 12 }}>✅</div>
              <h2 style={{ fontSize: 24, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>Message Sent!</h2>
              <p style={{ fontSize: 15, color: '#64748b', marginBottom: 20 }}>Our team will respond within 24 hours.</p>
              <button onClick={() => { setSent(false); setName(''); setEmail(''); setSubject(''); setMessage(''); }} style={{ padding: '12px 32px', borderRadius: 12, background: '#f1f5f9', border: '1px solid #e2e8f0', color: '#475569', cursor: 'pointer', fontWeight: 700, fontSize: 14 }}>Send Another Message</button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
