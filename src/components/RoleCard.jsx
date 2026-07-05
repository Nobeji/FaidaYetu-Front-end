import { useNavigate } from 'react-router-dom';

export default function RoleCard({ title, subtitle, badge, img }) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate('/auth')}
      style={{
        background: '#fff', border: '1px solid #eee',
        borderRadius: 12, overflow: 'hidden', cursor: 'pointer',
        transition: 'all 0.3s',
      }}
    >
      <div style={{ height: 180, overflow: 'hidden' }}>
        <img src={img} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
          onMouseOver={e => e.target.style.transform = 'scale(1.05)'}
          onMouseOut={e => e.target.style.transform = 'scale(1)'}
        />
      </div>
      <div style={{ padding: 20 }}>
        <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>{title}</h3>
        <p style={{ fontSize: 14, color: '#888', marginBottom: 12, lineHeight: 1.6 }}>{subtitle}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 600, color: '#000' }}>
          ✓ {badge}
        </div>
      </div>
    </div>
  );
}
