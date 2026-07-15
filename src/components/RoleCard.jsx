import { useNavigate } from 'react-router-dom';

export default function RoleCard({ title, subtitle, badge, img }) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate('/auth')}
      style={{
        background: '#fff',
        border: '1px solid #e2e8f0',
        borderRadius: 16, overflow: 'hidden', cursor: 'pointer',
        transition: 'all 0.3s ease', boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      }}
      onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; e.currentTarget.style.borderColor = '#bbf7d0'; }}
      onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
    >
      <div style={{ height: 180, overflow: 'hidden' }}>
        <img src={img} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
          onMouseOver={e => e.target.style.transform = 'scale(1.05)'}
          onMouseOut={e => e.target.style.transform = 'scale(1)'}
        />
      </div>
      <div style={{ padding: 20 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: '#0f172a' }}>{title}</h3>
        <p style={{ fontSize: 13, color: '#64748b', marginBottom: 12, lineHeight: 1.6 }}>{subtitle}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, color: '#0a6e46' }}>✓ {badge}</div>
      </div>
    </div>
  );
}
