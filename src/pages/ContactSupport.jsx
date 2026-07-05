import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ContactSupport() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px', height: 64, borderBottom: '1px solid #eee',
        background: '#fafafa', position: 'sticky', top: 0, zIndex: 10,
      }}>
        <span style={{ fontSize: 20, fontWeight: 800, color: '#000', cursor: 'pointer' }} onClick={() => navigate('/')}>FaidaYetu</span>
        <button onClick={() => navigate(-1)} style={{
          padding: '8px 16px', borderRadius: 8, border: '1px solid #eee',
          background: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 14, color: '#888',
        }}>← Back</button>
      </header>

      <main style={{ maxWidth: 700, margin: '0 auto', padding: 28 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <h1 style={{ fontSize: 32, fontWeight: 700, color: '#111', marginBottom: 8 }}>Contact Support</h1>
          <p style={{ fontSize: 15, color: '#888' }}>We're here to help. Reach out to us anytime.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 28 }}>
          {[
            { icon: '📧', label: 'Email', val: 'support@faidayetu.co.tz' },
            { icon: '📞', label: 'Phone', val: 'Coming soon' },
            { icon: '💬', label: 'Live Chat', val: 'Coming soon' },
          ].map(c => (
            <div key={c.label} style={{ background: '#fff', borderRadius: 12, border: '1px solid #eee', padding: 20, textAlign: 'center' }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{c.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#111' }}>{c.label}</div>
              <div style={{ fontSize: 13, color: '#888' }}>{c.val}</div>
            </div>
          ))}
        </div>

        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #eee', padding: 28 }}>
          {!sent ? (
            <>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: '#111', marginBottom: 20 }}>Send us a Message</h2>
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: '#111', display: 'block', marginBottom: 6 }}>Full Name</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" required style={{
                      width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid #eee',
                      fontSize: 15, color: '#111', background: '#fafafa', outline: 'none', boxSizing: 'border-box',
                    }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: '#111', display: 'block', marginBottom: 6 }}>Email</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required style={{
                      width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid #eee',
                      fontSize: 15, color: '#111', background: '#fafafa', outline: 'none', boxSizing: 'border-box',
                    }} />
                  </div>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#111', display: 'block', marginBottom: 6 }}>Subject</label>
                  <select value={subject} onChange={e => setSubject(e.target.value)} required style={{
                    width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid #eee',
                    fontSize: 15, color: '#111', background: '#fafafa', outline: 'none', boxSizing: 'border-box',
                  }}>
                    <option value="">Select a topic...</option>
                    <option>Account Issue</option>
                    <option>Payment Problem</option>
                    <option>Delivery Concern</option>
                    <option>Technical Support</option>
                    <option>Other</option>
                  </select>
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#111', display: 'block', marginBottom: 6 }}>Message</label>
                  <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Describe your issue..." rows={5} required style={{
                    width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid #eee',
                    fontSize: 15, color: '#111', background: '#fafafa', outline: 'none', resize: 'vertical', boxSizing: 'border-box',
                  }} />
                </div>
                <button type="submit" style={{
                  width: '100%', padding: '14px', borderRadius: 8, background: '#000', color: '#fff',
                  border: 'none', cursor: 'pointer', fontSize: 16, fontWeight: 700,
                }}>Send Message</button>
              </form>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: 28 }}>
              <div style={{ fontSize: 56, marginBottom: 12 }}>✅</div>
              <h2 style={{ fontSize: 24, fontWeight: 700, color: '#111', marginBottom: 8 }}>Message Sent!</h2>
              <p style={{ fontSize: 15, color: '#888', marginBottom: 20 }}>Our team will respond within 24 hours.</p>
              <button onClick={() => { setSent(false); setName(''); setEmail(''); setSubject(''); setMessage(''); }} style={{
                padding: '12px 32px', borderRadius: 8, background: '#000', color: '#fff',
                border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 14,
              }}>Send Another Message</button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
