import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';

export default function SupplierPayouts() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    fetchPayouts();
  }, [days]);

  const fetchPayouts = async () => {
    setLoading(true);
    try {
      const data = await api.adminSupplierPayouts({ days });
      setSuppliers(data.suppliers || []);
    } catch (err) {
      console.error('Failed to load supplier payouts:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatTZS = (n) => new Intl.NumberFormat('sw-TZ', { style: 'currency', currency: 'TZS', maximumFractionDigits: 0 }).format(n);

  return (
    <div className="fade-in" style={{ padding: '24px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#111', margin: 0 }}>Supplier Payouts</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#333' }}>
            Period:
            <select
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #ddd', fontSize: 13 }}
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
              <option value={180}>Last 180 days</option>
            </select>
          </label>
          <button onClick={fetchPayouts} disabled={loading} style={{
            padding: '8px 16px', borderRadius: 6, border: '1px solid #1976d2', background: '#fff',
            color: '#1976d2', fontWeight: 600, fontSize: 13, cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1
          }}>
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #eee', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 48, textAlign: 'center', color: '#888' }}>Loading supplier payouts...</div>
        ) : suppliers.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center', color: '#888' }}>No supplier data found</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#fafafa', borderBottom: '1px solid #eee' }}>
                  <th style={{ padding: '14px 16px', textAlign: 'left', fontWeight: 600, fontSize: 12, color: '#666', textTransform: 'uppercase' }}>Supplier</th>
                  <th style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 600, fontSize: 12, color: '#666', textTransform: 'uppercase' }}>Total Orders</th>
                  <th style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 600, fontSize: 12, color: '#666', textTransform: 'uppercase' }}>Delivered</th>
                  <th style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 600, fontSize: 12, color: '#666', textTransform: 'uppercase' }}>Delivered Revenue</th>
                  <th style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 600, fontSize: 12, color: '#666', textTransform: 'uppercase' }}>Pending</th>
                  <th style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 600, fontSize: 12, color: '#666', textTransform: 'uppercase' }}>Cancelled</th>
                  <th style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 600, fontSize: 12, color: '#666', textTransform: 'uppercase' }}>Payout Amount</th>
                  <th style={{ padding: '14px 16px', textAlign: 'center', fontWeight: 600, fontSize: 12, color: '#666', textTransform: 'uppercase' }}>Details</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map((s) => (
                  <React.Fragment key={s.supplier_id}>
                    <tr style={{ borderBottom: '1px solid #f0f0f0', cursor: 'pointer' }}
                      onClick={() => setExpanded(prev => ({ ...prev, [s.supplier_id]: !prev[s.supplier_id] }))}>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 600, color: '#111' }}>{s.business_name}</div>
                        <div style={{ fontSize: 12, color: '#888' }}>ID: {s.supplier_id} • {s.total_orders} orders</div>
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 500 }}>{s.total_orders}</td>
                      <td style={{ padding: '14px 16px', textAlign: 'right', color: '#2e7d32', fontWeight: 500 }}>{s.delivered_count}</td>
                      <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 500 }}>{formatTZS(s.delivered_revenue)}</td>
                      <td style={{ padding: '14px 16px', textAlign: 'right', color: '#f57c00', fontWeight: 500 }}>{s.pending_count} ({formatTZS(s.pending_revenue)})</td>
                      <td style={{ padding: '14px 16px', textAlign: 'right', color: '#c62828', fontWeight: 500 }}>{s.cancelled_count}</td>
                      <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 700, color: '#1976d2', fontSize: 15 }}>{formatTZS(s.payout_amount)}</td>
                      <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                          width: 28, height: 28, borderRadius: 6, background: '#f5f5f5', color: '#666',
                          transition: 'transform 0.2s',
                          transform: expanded[s.supplier_id] ? 'rotate(180deg)' : 'rotate(0deg)'
                        }}>
                          ▼
                        </span>
                      </td>
                    </tr>
                    {expanded[s.supplier_id] && (
                      <tr>
                        <td colSpan={8} style={{ padding: 0, background: '#fafafa', borderTop: '1px solid #eee' }}>
                          <div style={{ padding: '16px' }}>
                            <h4 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 600, color: '#333' }}>Order Breakdown</h4>
                            <div style={{ overflowX: 'auto' }}>
                              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                                <thead>
                                  <tr style={{ background: '#f0f0f0' }}>
                                    <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600, fontSize: 11, color: '#666' }}>Order ID</th>
                                    <th style={{ padding: '8px 12px', textAlign: 'center', fontWeight: 600, fontSize: 11, color: '#666' }}>Status</th>
                                    <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600, fontSize: 11, color: '#666' }}>Items</th>
                                    <th style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 600, fontSize: 11, color: '#666' }}>Total</th>
                                    <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600, fontSize: 11, color: '#666' }}>Date</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {s.orders.slice(0, 20).map((o) => (
                                    <tr key={o.id} style={{ borderBottom: '1px solid #eee' }}>
                                      <td style={{ padding: '10px 12px', fontWeight: 500, fontSize: 13 }}>{o.id}</td>
                                      <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                                        <span style={{
                                          display: 'inline-block', padding: '2px 8px', borderRadius: 10, fontSize: 11, fontWeight: 600,
                                          background: o.status === 'delivered' ? '#e8f5e9' : o.status === 'cancelled' ? '#fdecea' : '#fff3e0',
                                          color: o.status === 'delivered' ? '#2e7d32' : o.status === 'cancelled' ? '#c62828' : '#f57c00'
                                        }}>
                                          {o.status}
                                        </span>
                                      </td>
                                      <td style={{ padding: '10px 12px', color: '#555' }}>
                                        {o.items.map((i) => (
                                          <div key={i.name} style={{ fontSize: 12 }}>{i.name} × {i.qty} @ {formatTZS(i.price)}</div>
                                        ))}
                                      </td>
                                      <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 500 }}>{formatTZS(o.total)}</td>
                                      <td style={{ padding: '10px 12px', fontSize: 12, color: '#666' }}>
                                        {new Date(o.created_at).toLocaleDateString('sw-TZ', { day: 'numeric', month: 'short', year: 'numeric' })}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}