export const colors = {
  primary: '#0a6e46',
  primaryLight: '#10b981',
  primaryContainer: '#d1fae5',
  onPrimary: '#ffffff',
  onPrimaryContainer: '#064e3b',

  secondary: '#0369a1',
  secondaryLight: '#0ea5e9',

  surface: '#f8fafc',
  surfaceAlt: '#f1f5f9',
  onSurface: '#0f172a',
  onSurfaceVariant: '#64748b',
  muted: '#94a3b8',

  border: '#e2e8f0',
  borderLight: '#f1f5f9',

  error: '#dc2626',
  errorContainer: '#fef2f2',
  errorBorder: '#fecaca',

  success: '#15803d',
  successContainer: '#f0fdf4',
  successBorder: '#bbf7d0',

  warning: '#a16207',
  warningContainer: '#fef9c3',
  warningBorder: '#fde68a',

  info: '#1d4ed8',
  infoContainer: '#dbeafe',

  white: '#ffffff',
  black: '#0f172a',

  text: {
    primary: '#0f172a',
    secondary: '#475569',
    muted: '#64748b',
    faint: '#94a3b8',
    inverse: '#ffffff',
  },
};

export const shadow = {
  xs: '0 1px 2px rgba(0,0,0,0.04)',
  sm: '0 1px 3px rgba(0,0,0,0.06)',
  md: '0 4px 6px rgba(0,0,0,0.07)',
  lg: '0 4px 24px rgba(0,0,0,0.06)',
  xl: '0 8px 32px rgba(0,0,0,0.08)',
};

export const card = {
  base: {
    background: colors.white,
    border: `1px solid ${colors.border}`,
    borderRadius: 12,
    boxShadow: shadow.sm,
  },
  hover: {
    boxShadow: shadow.md,
    transform: 'translateY(-2px)',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radius = {
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  round: 9999,
};

export const chartColors = [
  '#0a6e46', '#10b981', '#3b82f6', '#f59e0b', '#ef4444',
  '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16', '#f97316',
];

export const chartDefaults = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: colors.text.primary,
        font: { family: "'Inter', sans-serif", size: 12, weight: 500 },
        padding: 16,
      },
    },
    tooltip: {
      backgroundColor: colors.white,
      titleColor: colors.text.primary,
      bodyColor: colors.text.secondary,
      borderColor: colors.border,
      borderWidth: 1,
      padding: 12,
      cornerRadius: 8,
      boxPadding: 4,
      titleFont: { family: "'Inter', sans-serif", size: 13, weight: 600 },
      bodyFont: { family: "'Inter', sans-serif", size: 12 },
      displayColors: true,
      usePointStyle: true,
    },
  },
  scales: {
    x: {
      grid: { color: colors.borderLight, drawBorder: false },
      ticks: { color: colors.text.muted, font: { family: "'Inter', sans-serif", size: 11 } },
    },
    y: {
      grid: { color: colors.borderLight, drawBorder: false },
      ticks: { color: colors.text.muted, font: { family: "'Inter', sans-serif", size: 11 } },
    },
  },
};

export const DATA = {
  roles: [
    { id: 1, title: 'For Suppliers', subtitle: 'Expand your market reach beyond local borders. Get access to verified buyers and automated inventory management.', badge: 'Guaranteed Market Access', img: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=600' },
    { id: 2, title: 'For Customers', subtitle: 'Source the freshest products directly from the farm. Transparent pricing and full traceability for every bird you purchase.', badge: 'Farm-to-Table Freshness', img: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=600' },
    { id: 3, title: 'For Delivery', subtitle: 'Optimize your earnings with AI-driven route planning. Reduce fuel consumption and maximize deliveries per hour.', badge: 'Smart Earning Potential', img: 'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?w=600' },
  ],
};
