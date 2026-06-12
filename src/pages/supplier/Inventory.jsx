import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { colors, spacing, radius } from '../../constants/theme';
import DashboardShell from '../../components/DashboardShell';
import ProgressBar from '../../components/ProgressBar';
import { api } from '../../services/api';

const navItems = [
  { icon: '📊', label: 'Dashboard', nav: '/supplier' },
  { icon: '📦', label: 'Inventory', nav: '/supplier/inventory' },
  { icon: '🛒', label: 'Orders', nav: '/supplier/orders' },
  { icon: '📈', label: 'Analytics', nav: '/supplier/analytics' },
  { icon: '⚙️', label: 'Settings', nav: '/supplier/settings' },
  { icon: '❓', label: 'Support', nav: '/supplier/support' },
];

const modalOverlay = {
  position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex',
  alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16,
};

const modalBox = {
  background: '#fff', borderRadius: 16, padding: 24, width: '100%', maxWidth: 480,
  maxHeight: '90vh', overflow: 'auto',
};

const fallbackImg = 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400';

export default function SupplierInventory() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(null);
  const [form, setForm] = useState({ name: '', category: 'Eggs', price: '', unit: 'kg', stock: '', min_stock: '' });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const navigate = useNavigate();
  const supplierId = JSON.parse(localStorage.getItem('supplier') || '{}').id || 1;

  const loadProducts = () => api.supplierProducts(supplierId).then(setProducts).catch(() => {});
  useEffect(() => { loadProducts().then(() => setLoading(false)); }, []);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setForm({ name: '', category: 'Eggs', price: '', unit: 'kg', stock: '', min_stock: '' });
    setImageFile(null);
    setImagePreview('');
  };

  const buildPayload = () => {
    if (imageFile) {
      const fd = new FormData();
      fd.append('supplier', supplierId);
      fd.append('name', form.name);
      fd.append('category', form.category);
      fd.append('price', form.price);
      fd.append('unit', form.unit);
      fd.append('stock', form.stock || 0);
      fd.append('min_stock', form.min_stock || 0);
      fd.append('image', imageFile);
      return fd;
    }
    return { supplier: supplierId, name: form.name, category: form.category, price: form.price, unit: form.unit, stock: form.stock || 0, min_stock: form.min_stock || 0 };
  };

  const handleAdd = () => {
    if (!form.name || !form.price) { alert('Name and price are required.'); return; }
    api.createProduct(buildPayload())
      .then(() => { loadProducts(); setShowAdd(false); resetForm(); })
      .catch(() => alert('Failed to add product.'));
  };

  const handleEdit = (item) => {
    setShowEdit(item);
    setForm({ name: item.name, category: item.category, price: item.price.toString(), unit: item.unit, stock: item.stock.toString(), min_stock: item.min_stock.toString() });
    if (item.image) setImagePreview(item.image);
    else setImagePreview('');
    setImageFile(null);
  };

  const handleSaveEdit = () => {
    if (!form.name || !form.price) { alert('Name and price are required.'); return; }
    const payload = imageFile ? buildPayload() : { name: form.name, category: form.category, price: form.price, unit: form.unit, stock: form.stock, min_stock: form.min_stock };
    api.updateProduct(showEdit.id, payload)
      .then(() => { loadProducts(); setShowEdit(null); resetForm(); })
      .catch(() => alert('Failed to update product.'));
  };

  const inputStyle = {
    width: '100%', padding: '10px 12px', borderRadius: 8, border: `1px solid ${colors.outlineVariant}`,
    fontSize: 14, boxSizing: 'border-box', marginBottom: 12,
  };

  return (
    <DashboardShell brand="FaidaYetu" brandSub="Poultry Logistics Hub" navItems={navItems}>
      <div className="fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg, flexWrap: 'wrap', gap: spacing.md }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 600, color: colors.primary }}>Inventory</h1>
            <p style={{ fontSize: 15, color: colors.onSurfaceVariant }}>Manage your poultry product stock</p>
          </div>
          <div style={{ display: 'flex', gap: spacing.md }}>
            <span onClick={() => alert('Exporting inventory data...')} style={{ fontSize: 14, color: colors.primary, cursor: 'pointer', alignSelf: 'center' }}>Export →</span>
            <button onClick={() => setShowAdd(true)} style={{ padding: '12px 24px', borderRadius: radius.md, background: colors.primary, color: colors.onPrimary, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 14 }}>+ Add Product</button>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: spacing.xxl, color: colors.onSurfaceVariant }}>Loading inventory...</div>
        ) : (
          <div style={{ background: '#fff', borderRadius: radius.xl, border: `1px solid ${colors.outlineVariant}`, overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'rgba(193,236,212,0.3)' }}>
                    {['Image', 'Product', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map(h => (
                      <th key={h} style={{ padding: spacing.md, fontSize: 13, fontWeight: 600, color: colors.onSurfaceVariant, borderBottom: `1px solid ${colors.outlineVariant}` }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.map(item => (
                    <tr key={item.id}>
                      <td style={{ padding: spacing.md }}>
                        <img src={item.image || fallbackImg} alt="" style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover' }} />
                      </td>
                      <td style={{ padding: spacing.md, fontWeight: 700, color: colors.onSurface }}>{item.name}</td>
                      <td style={{ padding: spacing.md, color: colors.onSurfaceVariant }}>{item.category}</td>
                      <td style={{ padding: spacing.md, fontWeight: 700 }}>{Number(item.price).toLocaleString()} TZS</td>
                      <td style={{ padding: spacing.md }}>{item.stock} {item.unit}</td>
                      <td style={{ padding: spacing.md }}><span style={{ padding: '2px 10px', borderRadius: radius.round, fontSize: 11, fontWeight: 600, background: item.stock <= item.min_stock ? '#ffebee' : '#e8f5e9', color: item.stock <= item.min_stock ? '#c62828' : '#2e7d32' }}>{item.stock <= item.min_stock ? 'Low' : 'In Stock'}</span></td>
                      <td style={{ padding: spacing.md }}><button onClick={() => handleEdit(item)} style={{ padding: '6px 14px', borderRadius: radius.md, border: `1px solid ${colors.primary}`, background: 'none', color: colors.primary, cursor: 'pointer', fontWeight: 600, fontSize: 12 }}>Edit</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {showAdd && (
        <div style={modalOverlay} onClick={() => setShowAdd(false)}>
          <div style={modalBox} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: colors.primary, marginBottom: 16 }}>Add Product</h3>

            <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>Product Image</label>
            <input type="file" accept="image/*" onChange={handleImageChange} style={inputStyle} />
            {imagePreview && <img src={imagePreview} alt="preview" style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 8, marginBottom: 12 }} />}

            <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>Product Name</label>
            <input style={inputStyle} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Grade A Eggs" />

            <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>Category</label>
            <select style={inputStyle} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
              {['Eggs', 'Chicken', 'Feed', 'Supplements'].map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>Price (TZS)</label>
                <input style={inputStyle} type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="12000" />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>Unit</label>
                <select style={inputStyle} value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })}>
                  {['kg', 'crate', 'unit', 'piece'].map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>Stock</label>
                <input style={inputStyle} type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} placeholder="100" />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>Min Stock Level</label>
                <input style={inputStyle} type="number" value={form.min_stock} onChange={e => setForm({ ...form, min_stock: e.target.value })} placeholder="10" />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <button onClick={handleAdd} style={{ flex: 1, padding: '12px', borderRadius: 8, background: colors.primary, color: colors.onPrimary, border: 'none', cursor: 'pointer', fontWeight: 700 }}>Add Product</button>
              <button onClick={() => { setShowAdd(false); resetForm(); }} style={{ flex: 1, padding: '12px', borderRadius: 8, background: 'none', border: `1px solid ${colors.outlineVariant}`, cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEdit && (
        <div style={modalOverlay} onClick={() => setShowEdit(null)}>
          <div style={modalBox} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: colors.primary, marginBottom: 16 }}>Edit Product</h3>

            <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>Product Image</label>
            <input type="file" accept="image/*" onChange={handleImageChange} style={inputStyle} />
            {imagePreview && <img src={imagePreview} alt="preview" style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 8, marginBottom: 12 }} />}

            <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>Product Name</label>
            <input style={inputStyle} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />

            <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>Category</label>
            <select style={inputStyle} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
              {['Eggs', 'Chicken', 'Feed', 'Supplements'].map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>Price (TZS)</label>
                <input style={inputStyle} type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>Unit</label>
                <select style={inputStyle} value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })}>
                  {['kg', 'crate', 'unit', 'piece'].map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>Stock</label>
                <input style={inputStyle} type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>Min Stock Level</label>
                <input style={inputStyle} type="number" value={form.min_stock} onChange={e => setForm({ ...form, min_stock: e.target.value })} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <button onClick={handleSaveEdit} style={{ flex: 1, padding: '12px', borderRadius: 8, background: colors.primary, color: colors.onPrimary, border: 'none', cursor: 'pointer', fontWeight: 700 }}>Save Changes</button>
              <button onClick={() => { setShowEdit(null); resetForm(); }} style={{ flex: 1, padding: '12px', borderRadius: 8, background: 'none', border: `1px solid ${colors.outlineVariant}`, cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
