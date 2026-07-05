export default function SupplierCard({ name, rating, distance, price, img }) {
  return (
    <div style={{
      minWidth: 300, background: '#fff',
      border: '1px solid #eee',
      borderRadius: 12, overflow: 'hidden',
      scrollSnapAlign: 'start', cursor: 'pointer', flexShrink: 0,
    }}>
      <div style={{ height: 100, position: 'relative' }}>
        <img src={img} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{
          position: 'absolute', top: 8, right: 8,
          background: '#fff', padding: '2px 8px',
          borderRadius: 999, fontSize: 12, fontWeight: 700,
          color: '#000', display: 'flex', alignItems: 'center', gap: 2,
        }}>⭐ {rating}</div>
      </div>
      <div style={{ padding: 12 }}>
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{name}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: '#888' }}>📍 {distance} away</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#000' }}>From {price}</span>
        </div>
      </div>
    </div>
  );
}
