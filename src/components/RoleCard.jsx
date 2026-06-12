import { colors, spacing, radius } from '../constants/theme';
import { useNavigate } from 'react-router-dom';

export default function RoleCard({ title, subtitle, badge, img }) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate('/auth')}
      style={{
        background: colors.white, border: `1px solid ${colors.outlineVariant}`,
        borderRadius: radius.xl, overflow: 'hidden', cursor: 'pointer',
        transition: 'all 0.3s',
      }}
    >
      <div style={{ height: 180, overflow: 'hidden' }}>
        <img src={img} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
          onMouseOver={e => e.target.style.transform = 'scale(1.05)'}
          onMouseOut={e => e.target.style.transform = 'scale(1)'}
        />
      </div>
      <div style={{ padding: spacing.lg }}>
        <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: spacing.sm }}>{title}</h3>
        <p style={{ fontSize: 14, color: colors.onSurfaceVariant, marginBottom: spacing.md, lineHeight: 1.6 }}>{subtitle}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs, fontSize: 13, fontWeight: 600, color: colors.primary }}>
          ✓ {badge}
        </div>
      </div>
    </div>
  );
}
