import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardShell from '../../components/DashboardShell';
import { api } from '../../services/api';
import { useToast } from '../../components/ToastContext';
import Spinner from '../../components/Spinner';
import { Home, ShoppingCart, ClipboardList, Bell, User, Package } from 'lucide-react';

const navItems = [
  { icon: Home, label: 'Explore', nav: '/customer' },
  { icon: ShoppingCart, label: 'Marketplace', nav: '/customer/marketplace' },
  { icon: ClipboardList, label: 'My Orders', nav: '/customer/orders' },
  { icon: Bell, label: 'Notifications', nav: '/customer/notifications' },
  { icon: User, label: 'Profile', nav: '/customer/profile' },
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
  const [activeCat, setActiveCat] = useState('all');
  const [cartItem, setCartItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [deliveryArea, setDeliveryArea] = useState('');
  const [deliveryStreet, setDeliveryStreet] = useState('');
  const [deliveryCity, setDeliveryCity] = useState('');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userName = user.username || 'Customer';
  const initials = userName.charAt(0).toUpperCase();
  const navigate = useNavigate();
  const toast = useToast();
  const [placingOrder, setPlacingOrder] = useState(false);

  useEffect(() => {
    api.products().then(p => { setProducts(p); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const filtered = activeCat === 'all' ? products : products.filter(p => p.category === activeCat);

  const handleAddToCart = (p) => {
    setCartItem(p);
    setQuantity(1);
    const profile = JSON.parse(localStorage.getItem('profile') || '{}');
    setDeliveryArea(profile.area || '');
    setDeliveryStreet('');
    setDeliveryCity(profile.city || '');
  };

  const handleConfirmCart = async () => {
    if (!cartItem) return;
    setPlacingOrder(true);
    const customerId = JSON.parse(localStorage.getItem('customer') || '{}').id || 1;
    const profile = JSON.parse(localStorage.getItem('profile') || '{}');
    try {
      await api.createOrder({
        customer: customerId,
        supplier: cartItem.supplier,
        total: cartItem.price * quantity,
        status: 'new',
        delivery_lat: profile.lat,
        delivery_lng: profile.lng,
        delivery_area: deliveryArea,
        delivery_street: deliveryStreet,
        delivery_city: deliveryCity,
        delivery_address: `${deliveryArea}, ${deliveryStreet}, ${deliveryCity}`.replace(/, , /g, ', ').replace(/^, |, $/g, ''),
        items_data: [{ product: cartItem.id, quantity, price: cartItem.price }],
      });
      setCartItem(null);
      toast('Order placed successfully!', 'success');
      navigate('/customer/orders');
    } catch (e) {
      toast('Failed to create order. Please try again.', 'error');
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <DashboardShell brand="FaidaYetu" brandSub="Customer Portal" navItems={navItems} profile={
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#f9f9f9', padding: '8px 12px', borderRadius: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 700, fontSize: 13 }}>{initials}</div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 13 }}>{userName}</div>
            <div style={{ fontSize: 11, color: '#888' }}>Customer Portal</div>
          </div>
        </div>
      }>
      <div className="fade-in">
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: 28, fontWeight: 600, color: '#000' }}>Marketplace</h1>
          <p style={{ fontSize: 15, color: '#888' }}>Browse and order fresh poultry products</p>
        </div>

        <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
          {[['all','All'],['eggs','Eggs'],['chicken','Chicken'],['feed','Feed'],['supplements','Supplements']].map(([v,l]) => (
            <button key={v} onClick={() => setActiveCat(v)} style={{
              padding: '8px 20px', borderRadius: 999, border: 'none', cursor: 'pointer',
              background: v === activeCat ? '#000' : '#f5f5f5',
              color: v === activeCat ? '#fff' : '#888',
              fontWeight: 600, fontSize: 13,
            }}>{l}</button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 48, color: '#888' }}>Loading products...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
            {filtered.map(p => (
              <div key={p.id} style={{ background: '#fff', borderRadius: 12, border: `1px solid ${'#eee'}`, overflow: 'hidden' }}>
                <div style={{ width: '100%', height: 160, background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, color: '#888' }}>{p.image ? <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Package size={40} />}</div>
                <div style={{ padding: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15, color: '#111' }}>{p.name}</div>
                      <div style={{ fontSize: 12, color: '#888' }}>{p.supplier_name} • {p.category}</div>
                    </div>
                    <span style={{ fontWeight: 800, fontSize: 16, color: '#000' }}>{Number(p.price).toLocaleString()} TZS</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 12, color: '#888' }}>{p.stock} {p.unit} available</span>
                    <button onClick={() => handleAddToCart(p)} style={{ padding: '8px 16px', borderRadius: 8, background: '#000', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>Add to Cart</button>
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
            <h3 style={{ fontSize: 20, fontWeight: 700, color: '#000', marginBottom: 8 }}>{cartItem.name}</h3>
            <p style={{ fontSize: 14, color: '#888', marginBottom: 16 }}>{cartItem.supplier_name} • {Number(cartItem.price).toLocaleString()} TZS / {cartItem.unit}</p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 16 }}>
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ width: 40, height: 40, borderRadius: '50%', background: '#f5f5f5', border: 'none', cursor: 'pointer', fontSize: 20, fontWeight: 700 }}>−</button>
              <span style={{ fontSize: 28, fontWeight: 800, minWidth: 48, textAlign: 'center' }}>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} style={{ width: 40, height: 40, borderRadius: '50%', background: '#f5f5f5', border: 'none', cursor: 'pointer', fontSize: 20, fontWeight: 700 }}>+</button>
            </div>

            <div style={{ textAlign: 'center', fontSize: 14, color: '#888', marginBottom: 16 }}>
              Total: <strong style={{ fontSize: 22, color: '#000' }}>{(cartItem.price * quantity).toLocaleString()} TZS</strong>
            </div>

            <div style={{ marginBottom: 16 }}>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: '#000', marginBottom: 8 }}>Delivery Address</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <input type="text" value={deliveryArea} onChange={e => setDeliveryArea(e.target.value)} placeholder="Area (e.g. Kariakoo)" required style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #eee', fontSize: 14, boxSizing: 'border-box' }} />
                <input type="text" value={deliveryStreet} onChange={e => setDeliveryStreet(e.target.value)} placeholder="Street / Landmark" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #eee', fontSize: 14, boxSizing: 'border-box' }} />
                <input type="text" value={deliveryCity} onChange={e => setDeliveryCity(e.target.value)} placeholder="City" required style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #eee', fontSize: 14, boxSizing: 'border-box' }} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={handleConfirmCart} disabled={placingOrder} style={{ flex: 1, padding: '12px', borderRadius: 8, background: '#000', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700, opacity: placingOrder ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                {placingOrder && <Spinner size={14} color="#fff" />}
                {placingOrder ? 'Ordering...' : 'Add to Cart'}
              </button>
              <button onClick={() => setCartItem(null)} style={{ flex: 1, padding: '12px', borderRadius: 8, background: 'none', border: `1px solid ${'#eee'}`, cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
