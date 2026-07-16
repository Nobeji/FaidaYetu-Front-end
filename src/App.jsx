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
import TAMSurvey from './pages/admin/TAMSurvey';
import SUSSurvey from './pages/admin/SUSSurvey';
import SpatialAccuracy from './pages/admin/SpatialAccuracy';
import { ToastProvider } from './components/ToastContext';
import { LanguageProvider } from './components/LanguageContext';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
      <ToastProvider>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/password-reset" element={<PasswordReset />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/contact" element={<ContactSupport />} />

        <Route path="/customer" element={<ProtectedRoute allowedRoles={['customer']}><CustomerDashboard /></ProtectedRoute>} />
        <Route path="/customer/marketplace" element={<ProtectedRoute allowedRoles={['customer']}><Marketplace /></ProtectedRoute>} />
        <Route path="/customer/orders" element={<ProtectedRoute allowedRoles={['customer']}><MyOrders /></ProtectedRoute>} />
        <Route path="/customer/notifications" element={<ProtectedRoute allowedRoles={['customer']}><CustomerNotifications /></ProtectedRoute>} />
        <Route path="/customer/profile" element={<ProtectedRoute allowedRoles={['customer']}><CustomerProfile /></ProtectedRoute>} />
        <Route path="/customer/tam-survey" element={<ProtectedRoute allowedRoles={['customer']}><TAMSurvey /></ProtectedRoute>} />
        <Route path="/customer/sus-survey" element={<ProtectedRoute allowedRoles={['customer']}><SUSSurvey /></ProtectedRoute>} />

        <Route path="/supplier" element={<ProtectedRoute allowedRoles={['supplier']}><SupplierDashboard /></ProtectedRoute>} />
        <Route path="/supplier/inventory" element={<ProtectedRoute allowedRoles={['supplier']}><SupplierInventory /></ProtectedRoute>} />
        <Route path="/supplier/orders" element={<ProtectedRoute allowedRoles={['supplier']}><SupplierOrders /></ProtectedRoute>} />
        <Route path="/supplier/notifications" element={<ProtectedRoute allowedRoles={['supplier']}><SupplierNotifications /></ProtectedRoute>} />
        <Route path="/supplier/analytics" element={<ProtectedRoute allowedRoles={['supplier']}><SupplierAnalytics /></ProtectedRoute>} />
        <Route path="/supplier/statistics" element={<ProtectedRoute allowedRoles={['supplier']}><SupplierStatistics /></ProtectedRoute>} />
        <Route path="/supplier/settings" element={<ProtectedRoute allowedRoles={['supplier']}><SupplierSettings /></ProtectedRoute>} />
        <Route path="/supplier/support" element={<ProtectedRoute allowedRoles={['supplier']}><SupplierSupport /></ProtectedRoute>} />
        <Route path="/supplier/tam-survey" element={<ProtectedRoute allowedRoles={['supplier']}><TAMSurvey /></ProtectedRoute>} />
        <Route path="/supplier/sus-survey" element={<ProtectedRoute allowedRoles={['supplier']}><SUSSurvey /></ProtectedRoute>} />

        <Route path="/delivery" element={<ProtectedRoute allowedRoles={['delivery']}><DeliveryDashboard /></ProtectedRoute>} />
        <Route path="/delivery/route-history" element={<ProtectedRoute allowedRoles={['delivery']}><RouteHistory /></ProtectedRoute>} />
        <Route path="/delivery/earnings" element={<ProtectedRoute allowedRoles={['delivery']}><DeliveryEarnings /></ProtectedRoute>} />
        <Route path="/delivery/settings" element={<ProtectedRoute allowedRoles={['delivery']}><DeliverySettings /></ProtectedRoute>} />
        <Route path="/delivery/support" element={<ProtectedRoute allowedRoles={['delivery']}><DeliverySupport /></ProtectedRoute>} />
        <Route path="/delivery/tam-survey" element={<ProtectedRoute allowedRoles={['delivery']}><TAMSurvey /></ProtectedRoute>} />
        <Route path="/delivery/sus-survey" element={<ProtectedRoute allowedRoles={['delivery']}><SUSSurvey /></ProtectedRoute>} />

        <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>}>
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
          <Route path="spatial-accuracy" element={<SpatialAccuracy />} />
          <Route path="usability-metrics" element={<UsabilityMetrics />} />
          <Route path="system-impact" element={<SystemImpact />} />
          <Route path="tam-survey" element={<TAMSurvey />} />
          <Route path="sus-survey" element={<SUSSurvey />} />
        </Route>
      </Routes>
      </ToastProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}
