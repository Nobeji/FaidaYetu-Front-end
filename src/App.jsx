import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Welcome from './pages/Welcome';
import Auth from './pages/Auth';
import PasswordReset from './pages/PasswordReset';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import ContactSupport from './pages/ContactSupport';

import CustomerDashboard from './pages/CustomerDashboard';
import Marketplace from './pages/customer/Marketplace';
import MyOrders from './pages/customer/MyOrders';
import CustomerProfile from './pages/customer/Profile';

import SupplierDashboard from './pages/SupplierDashboard';
import SupplierInventory from './pages/supplier/Inventory';
import SupplierOrders from './pages/supplier/Orders';
import SupplierAnalytics from './pages/supplier/Analytics';
import SupplierStatistics from './pages/supplier/Statistics';
import SupplierSettings from './pages/supplier/Settings';
import SupplierSupport from './pages/supplier/Support';

import DeliveryDashboard from './pages/DeliveryDashboard';
import RouteHistory from './pages/delivery/RouteHistory';
import DeliveryEarnings from './pages/delivery/Earnings';
import DeliverySettings from './pages/delivery/Settings';
import DeliverySupport from './pages/delivery/Support';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/password-reset" element={<PasswordReset />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/contact" element={<ContactSupport />} />

        <Route path="/customer" element={<CustomerDashboard />} />
        <Route path="/customer/marketplace" element={<Marketplace />} />
        <Route path="/customer/orders" element={<MyOrders />} />
        <Route path="/customer/profile" element={<CustomerProfile />} />

        <Route path="/supplier" element={<SupplierDashboard />} />
        <Route path="/supplier/inventory" element={<SupplierInventory />} />
        <Route path="/supplier/orders" element={<SupplierOrders />} />
        <Route path="/supplier/analytics" element={<SupplierAnalytics />} />
        <Route path="/supplier/statistics" element={<SupplierStatistics />} />
        <Route path="/supplier/settings" element={<SupplierSettings />} />
        <Route path="/supplier/support" element={<SupplierSupport />} />

        <Route path="/delivery" element={<DeliveryDashboard />} />
        <Route path="/delivery/route-history" element={<RouteHistory />} />
        <Route path="/delivery/earnings" element={<DeliveryEarnings />} />
        <Route path="/delivery/settings" element={<DeliverySettings />} />
        <Route path="/delivery/support" element={<DeliverySupport />} />
      </Routes>
    </BrowserRouter>
  );
}
