import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { colors, spacing, radius } from '../../constants/theme';
import DashboardShell from '../../components/DashboardShell';
import { api } from '../../services/api';

const navItems = [
  { icon: '🏠', label: 'Explore', nav: '/customer' },
  { icon: '🛒', label: 'Marketplace', nav: '/customer/marketplace' },
  { icon: '📋', label: 'My Orders', nav: '/customer/orders' },
  { icon: '👤', label: 'Profile', nav: '/customer/profile' },
];

const modalOverlay = {
  position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex',
  alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16,
};
const modalBox = {
  background: '#fff', borderRadius: 16, padding: 24, width: '100%', maxWidth: 400,
  maxHeight: '90vh', overflow: 'auto',
};

export default function Marketplace() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCat, setActiveCat] = useState('All');
  const [cartItem, setCartItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    api.products().then(p => { setProducts(p); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const filtered = activeCat === 'All' ? products : products.filter(p => p.category === activeCat);

  const handleAddToCart = (p) => {
    setCartItem(p);
    setQuantity(1);
  };

  const handleConfirmCart = async () => {
    if (!cartItem) return;
    const customerId = JSON.parse(localStorage.getItem('customer') || '{}').id || 1;
    try {
      await api.createOrder({
        customer: customerId,
        supplier: cartItem.supplier,
        total: cartItem.price * quantity,
        status: 'new',
      });
      setCartItem(null);
      navigate('/customer/orders');
    } catch (e) {
      alert('Failed to create order. Please try again.');
    }
  };

  return (
    <DashboardShell brand="FaidaYetu" brandSub="Customer Portal" navItems={navItems} profile="JB">
      <div className="fade-in">
        <div style={{ marginBottom: spacing.lg }}>
          <h1 style={{ fontSize: 28, fontWeight: 600, color: colors.primary }}>Marketplace</h1>
          <p style={{ fontSize: 15, color: colors.onSurfaceVariant }}>Browse and order fresh poultry products</p>
        </div>

        <div style={{ display: 'flex', gap: spacing.md, marginBottom: spacing.lg, flexWrap: 'wrap' }}>
          {['All', 'Eggs', 'Chicken', 'Feed', 'Supplements'].map(c => (
            <button key={c} onClick={() => setActiveCat(c)} style={{
              padding: '8px 20px', borderRadius: radius.round, border: 'none', cursor: 'pointer',
              background: c === activeCat ? colors.primary : colors.surfaceContainerHigh,
              color: c === activeCat ? colors.onPrimary : colors.onSurfaceVariant,
              fontWeight: 600, fontSize: 13,
            }}>{c}</button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: spacing.xxl, color: colors.onSurfaceVariant }}>Loading products...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: spacing.md }}>
            {filtered.map(p => (
              <div key={p.id} style={{ background: '#fff', borderRadius: radius.xl, border: `1px solid ${colors.outlineVariant}`, overflow: 'hidden' }}>
                <img src={p.image || 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400'} alt={p.name} style={{ width: '100%', height: 160, objectFit: 'cover' }} />
                <div style={{ padding: spacing.md }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15, color: colors.onSurface }}>{p.name}</div>
                      <div style={{ fontSize: 12, color: colors.onSurfaceVariant }}>{p.supplier_name} • {p.category}</div>
                    </div>
                    <span style={{ fontWeight: 800, fontSize: 16, color: colors.primary }}>{Number(p.price).toLocaleString()} TZS</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 12, color: colors.onSurfaceVariant }}>{p.stock} {p.unit} available</span>
                    <button onClick={() => handleAddToCart(p)} style={{ padding: '8px 16px', borderRadius: radius.md, background: colors.primary, color: colors.onPrimary, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>Add to Cart</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add to Cart Modal */}
      {cartItem && (
        <div style={modalOverlay} onClick={() => setCartItem(null)}>
          <div style={modalBox} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: colors.primary, marginBottom: 8 }}>{cartItem.name}</h3>
            <p style={{ fontSize: 14, color: colors.onSurfaceVariant, marginBottom: 16 }}>{cartItem.supplier_name} • {Number(cartItem.price).toLocaleString()} TZS / {cartItem.unit}</p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 16 }}>
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ width: 40, height: 40, borderRadius: '50%', background: colors.surfaceContainerHigh, border: 'none', cursor: 'pointer', fontSize: 20, fontWeight: 700 }}>−</button>
              <span style={{ fontSize: 28, fontWeight: 800, minWidth: 48, textAlign: 'center' }}>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} style={{ width: 40, height: 40, borderRadius: '50%', background: colors.surfaceContainerHigh, border: 'none', cursor: 'pointer', fontSize: 20, fontWeight: 700 }}>+</button>
            </div>

            <div style={{ textAlign: 'center', fontSize: 14, color: colors.onSurfaceVariant, marginBottom: 16 }}>
              Total: <strong style={{ fontSize: 22, color: colors.primary }}>{(cartItem.price * quantity).toLocaleString()} TZS</strong>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={handleConfirmCart} style={{ flex: 1, padding: '12px', borderRadius: 8, background: colors.primary, color: colors.onPrimary, border: 'none', cursor: 'pointer', fontWeight: 700 }}>Add to Cart</button>
              <button onClick={() => setCartItem(null)} style={{ flex: 1, padding: '12px', borderRadius: 8, background: 'none', border: `1px solid ${colors.outlineVariant}`, cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
