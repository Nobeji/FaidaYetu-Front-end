export default function SupplierCard({ name, rating, distance, price, img }) {
  return (
    <div style={{
      minWidth: 300, background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 14, overflow: 'hidden', scrollSnapAlign: 'start', cursor: 'pointer', flexShrink: 0,
      transition: 'all 0.3s ease',
    }}
      onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      <div style={{ height: 100, position: 'relative' }}>
        <img src={img} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', padding: '2px 10px', borderRadius: 999, fontSize: 12, fontWeight: 700, color: '#fff', border: '1px solid rgba(255,255,255,0.12)' }}>⭐ {rating}</div>
      </div>
      <div style={{ padding: 14 }}>
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4, color: '#fff' }}>{name}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>📍 {distance} away</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#60a5fa' }}>From {price}</span>
        </div>
      </div>
    </div>
  );
}
