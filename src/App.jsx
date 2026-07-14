import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
import CustomerNotifications from './pages/customer/Notifications';

import SupplierDashboard from './pages/SupplierDashboard';
import SupplierInventory from './pages/supplier/Inventory';
import SupplierOrders from './pages/supplier/Orders';
import SupplierAnalytics from './pages/supplier/Analytics';
import SupplierStatistics from './pages/supplier/Statistics';
import SupplierSettings from './pages/supplier/Settings';
import SupplierSupport from './pages/supplier/Support';
import SupplierNotifications from './pages/supplier/Notifications';

import DeliveryDashboard from './pages/DeliveryDashboard';
import RouteHistory from './pages/delivery/RouteHistory';
import DeliveryEarnings from './pages/delivery/Earnings';
import DeliverySettings from './pages/delivery/Settings';
import DeliverySupport from './pages/delivery/Support';

import AdminDashboard from './pages/AdminDashboard';
import DemandAnalysis from './pages/admin/DemandAnalysis';
import AdminHeatMap from './pages/admin/HeatMap';
import SalesPrediction from './pages/admin/SalesPrediction';
import AdminReports from './pages/admin/Reports';
import AdminSuppliers from './pages/admin/Suppliers';
import AdminCustomers from './pages/admin/Customers';
import AdminOrders from './pages/admin/Orders';
import AdminDeliveries from './pages/admin/Deliveries';
import SupplierPayouts from './pages/admin/SupplierPayouts';
import CustomerSegmentation from './pages/admin/CustomerSegmentation';
import ChurnPrediction from './pages/admin/ChurnPrediction';
import AnomalyDetection from './pages/admin/AnomalyDetection';
import RouteOptimization from './pages/admin/RouteOptimization';
import InventoryForecast from './pages/admin/InventoryForecast';
import CohortAnalysis from './pages/admin/CohortAnalysis';
import TrendInsights from './pages/admin/TrendInsights';
import ModelEvaluation from './pages/admin/ModelEvaluation';
import WhatIfSimulator from './pages/admin/WhatIfSimulator';
import NetworkGraph from './pages/admin/NetworkGraph';
import EnhancedPerformance from './pages/admin/EnhancedPerformance';
import ColdChainTracking from './pages/admin/ColdChainTracking';
import RouteComparison from './pages/admin/RouteComparison';
import UsabilityMetrics from './pages/admin/UsabilityMetrics';
import SystemImpact from './pages/admin/SystemImpact';
import { ToastProvider } from './components/ToastContext';

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
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
        <Route path="/customer/notifications" element={<CustomerNotifications />} />
        <Route path="/customer/profile" element={<CustomerProfile />} />

        <Route path="/supplier" element={<SupplierDashboard />} />
        <Route path="/supplier/inventory" element={<SupplierInventory />} />
        <Route path="/supplier/orders" element={<SupplierOrders />} />
        <Route path="/supplier/notifications" element={<SupplierNotifications />} />
        <Route path="/supplier/analytics" element={<SupplierAnalytics />} />
        <Route path="/supplier/statistics" element={<SupplierStatistics />} />
        <Route path="/supplier/settings" element={<SupplierSettings />} />
        <Route path="/supplier/support" element={<SupplierSupport />} />

        <Route path="/delivery" element={<DeliveryDashboard />} />
        <Route path="/delivery/route-history" element={<RouteHistory />} />
        <Route path="/delivery/earnings" element={<DeliveryEarnings />} />
        <Route path="/delivery/settings" element={<DeliverySettings />} />
        <Route path="/delivery/support" element={<DeliverySupport />} />

        <Route path="/admin" element={<AdminDashboard />}>
          <Route index element={<Navigate to="/admin/demand-analysis" replace />} />
          <Route path="demand-analysis" element={<DemandAnalysis />} />
          <Route path="heat-map" element={<AdminHeatMap />} />
          <Route path="sales-prediction" element={<SalesPrediction />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="suppliers" element={<AdminSuppliers />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="deliveries" element={<AdminDeliveries />} />
          <Route path="supplier-payouts" element={<SupplierPayouts />} />
          <Route path="customer-segmentation" element={<CustomerSegmentation />} />
          <Route path="churn-prediction" element={<ChurnPrediction />} />
          <Route path="anomaly-detection" element={<AnomalyDetection />} />
          <Route path="route-optimization" element={<RouteOptimization />} />
          <Route path="inventory-forecast" element={<InventoryForecast />} />
          <Route path="cohort-analysis" element={<CohortAnalysis />} />
          <Route path="trend-insights" element={<TrendInsights />} />
          <Route path="model-evaluation" element={<ModelEvaluation />} />
          <Route path="what-if-simulator" element={<WhatIfSimulator />} />
          <Route path="network-graph" element={<NetworkGraph />} />
          <Route path="enhanced-performance" element={<EnhancedPerformance />} />
          <Route path="cold-chain" element={<ColdChainTracking />} />
          <Route path="route-comparison" element={<RouteComparison />} />
          <Route path="usability-metrics" element={<UsabilityMetrics />} />
          <Route path="system-impact" element={<SystemImpact />} />
        </Route>
      </Routes>
      </ToastProvider>
    </BrowserRouter>
  );
}
