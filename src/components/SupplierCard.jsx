export default function SupplierCard({ name, rating, distance, price, img }) {
  return (
    <div style={{
      minWidth: 300, background: '#fff',
      border: '1px solid #e2e8f0',
      borderRadius: 14, overflow: 'hidden', scrollSnapAlign: 'start', cursor: 'pointer', flexShrink: 0,
      transition: 'all 0.3s ease', boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    }}
      onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'; }}
      onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)'; }}
    >
      <div style={{ height: 100, position: 'relative' }}>
        <img src={img} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)', padding: '2px 10px', borderRadius: 999, fontSize: 12, fontWeight: 700, color: '#0f172a', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>⭐ {rating}</div>
      </div>
      <div style={{ padding: 14 }}>
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4, color: '#0f172a' }}>{name}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: '#94a3b8' }}>📍 {distance} away</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#0a6e46' }}>From {price}</span>
        </div>
      </div>
    </div>
  );
}
