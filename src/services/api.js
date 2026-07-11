const BASE = import.meta.env.VITE_API_URL || '/api';
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000;

function getCacheKey(method, url) {
  return `${method}:${url}`;
}

async function request(url, options = {}) {
  const token = localStorage.getItem('token');
  const headers = { ...options.headers };
  if (!options.noJson) headers['Content-Type'] = 'application/json';
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const method = (options.method || 'GET').toUpperCase();
  const cacheKey = getCacheKey(method, url);

  if (method === 'GET') {
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }
  }

  const res = await fetch(`${BASE}${url}`, { ...options, headers });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(body || `API error: ${res.status}`);
  }

  const data = await res.json();

  if (method === 'GET') {
    cache.set(cacheKey, { data, timestamp: Date.now() });
  } else {
    cache.clear();
  }

  return data;
}

async function upload(url, data, method = 'POST') {
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };
  const res = await fetch(`${BASE}${url}`, { method, headers, body: data });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(body || `API error: ${res.status}`);
  }
  cache.clear();
  return res.json();
}

export const api = {
  // Auth
  login: (data) => request('/auth/login/', { method: 'POST', body: JSON.stringify(data) }),
  register: (data) => request('/auth/register/', { method: 'POST', body: JSON.stringify(data) }),
  profile: () => request('/auth/profile/'),
  updateProfile: (data) => request('/auth/profile/', { method: 'PATCH', body: JSON.stringify(data) }),
  deleteAccount: () => request('/auth/delete-account/', { method: 'DELETE' }),

  // Suppliers
  suppliers: (params) => request(`/suppliers/${params ? '?' + new URLSearchParams(params) : ''}`),
  supplier: (id) => request(`/suppliers/${id}/`),
  supplierProducts: (id) => request(`/suppliers/${id}/products/`),

  // Products
  products: (params) => request(`/products/${params ? '?' + new URLSearchParams(params) : ''}`),
  createProduct: (data) => data instanceof FormData
    ? upload('/products/', data, 'POST')
    : request('/products/', { method: 'POST', body: JSON.stringify(data) }),
  updateProduct: (id, data) => data instanceof FormData
    ? upload(`/products/${id}/`, data, 'PATCH')
    : request(`/products/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),

  // Orders
  orders: (params) => request(`/orders/${params ? '?' + new URLSearchParams(params) : ''}`),
  order: (id) => request(`/orders/${id}/`),
  createOrder: (data) => request('/orders/', { method: 'POST', body: JSON.stringify(data) }),
  updateOrder: (id, data) => request(`/orders/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
  assignDelivery: (orderId, data) => request(`/orders/${orderId}/assign-delivery/`, { method: 'POST', body: JSON.stringify(data) }),

  // Deliveries
  deliveries: (params) => request(`/deliveries/${params ? '?' + new URLSearchParams(params) : ''}`),
  delivery: (id) => request(`/deliveries/${id}/`),
  updateDelivery: (id, data) => request(`/deliveries/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
  logLocation: (deliveryId, data) => request(`/deliveries/${deliveryId}/log-location/`, { method: 'POST', body: JSON.stringify(data) }),
  latestLocation: (deliveryId) => request(`/deliveries/${deliveryId}/latest-location/`),

  // Delivery Persons
  deliveryPersons: (params) => request(`/delivery-persons/${params ? '?' + new URLSearchParams(params) : ''}`),

  // Dashboard
  supplierDashboard: (id) => request(`/dashboard/supplier/${id}/`),
  customerDashboard: (id) => request(`/dashboard/customer/${id}/`),
  deliveryDashboard: (id) => request(`/dashboard/delivery/${id}/`),

  // Platform stats (public)
  stats: () => request('/stats/'),

  // Payments
  initiatePayment: (data) => request('/payments/initiate/', { method: 'POST', body: JSON.stringify(data) }),
  paymentStatus: (orderId) => request(`/payments/status/${orderId}/`),
  verifyPayment: (orderId) => request(`/payments/verify/${orderId}/`, { method: 'POST' }),
  manualConfirmPayment: (orderId) => request(`/payments/manual-confirm/${orderId}/`, { method: 'POST' }),

  // Notifications
  notifications: (params) => request(`/notifications/${params ? '?' + new URLSearchParams(params) : ''}`),
  markNotificationRead: (id) => request(`/notifications/${id}/read/`, { method: 'PATCH' }),
  markAllNotificationsRead: () => request('/notifications/read-all/', { method: 'PATCH' }),

  // Admin
  adminDashboard: () => request('/admin/dashboard/'),
  adminDemandAnalysis: () => request('/admin/demand-analysis/'),
  adminHeatMap: () => request('/admin/heat-map/'),
  adminSalesPrediction: () => request('/admin/sales-prediction/'),
  adminPerformance: () => request('/admin/performance/'),
  adminSuppliers: () => request('/admin/suppliers/'),
  adminCustomers: () => request('/admin/customers/'),
  adminList: (type) => request(`/admin/${type}/`),
  adminRFM: () => request('/admin/rfm-segmentation/'),
  adminChurn: () => request('/admin/churn-prediction/'),
  adminAnomaly: () => request('/admin/anomaly-detection/'),
  adminRoute: (params) => request(`/admin/route-optimization/${params ? '?' + new URLSearchParams(params) : ''}`),
  adminInventory: () => request('/admin/inventory-forecast/'),
  adminCohort: () => request('/admin/cohort-analysis/'),
  adminTrends: () => request('/admin/trend-insights/'),
  adminModelEval: () => request('/admin/model-evaluation/'),
  adminWhatIf: (price, promo) => request(`/admin/what-if-simulator/?price_change=${price}&promo_discount=${promo}`),
  adminNetwork: () => request('/admin/network-graph/'),
  adminSupplierPayouts: (params) => request(`/admin/supplier-payouts/${params ? '?' + new URLSearchParams(params) : ''}`),
};
