import { Navigate } from 'react-router-dom';

const ROLE_ROUTES = {
  admin: '/admin',
  supplier: '/supplier',
  customer: '/customer',
  delivery: '/delivery',
};

export default function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem('token');
  const profile = JSON.parse(localStorage.getItem('profile') || '{}');
  const role = profile.role;

  if (!token) {
    return <Navigate to="/auth?tab=login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    const redirect = ROLE_ROUTES[role] || '/auth?tab=login';
    return <Navigate to={redirect} replace />;
  }

  return children;
}
