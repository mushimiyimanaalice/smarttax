import { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { initOfflineSync } from './offline/syncManager';
import { setupPushNotifications } from './offline/swRegistration';
import api from './services/api';
import ProtectedRoute from './components/ProtectedRoute';
import RoleHomeRedirect from './components/RoleHomeRedirect';
import Layout from './components/Layout/Layout';
import AdminLayout from './components/Layout/AdminLayout';
import LoadingSpinner from './components/Common/LoadingSpinner';
import OfflineBanner from './components/Common/OfflineBanner';
import { ADMIN_ROLES } from './utils/roles';

const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Products = lazy(() => import('./pages/Products'));
const Sales = lazy(() => import('./pages/Sales'));
const Invoices = lazy(() => import('./pages/Invoices'));
const Taxes = lazy(() => import('./pages/Taxes'));

const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminApprovals = lazy(() => import('./pages/admin/AdminApprovals'));
const AdminBusinesses = lazy(() => import('./pages/admin/AdminBusinesses'));
const AdminReports = lazy(() => import('./pages/admin/AdminReports'));
const AdminCompliance = lazy(() => import('./pages/admin/AdminCompliance'));
const AdminAuditLogs = lazy(() => import('./pages/admin/AdminAuditLogs'));
const AdminInactivity = lazy(() => import('./pages/admin/AdminInactivity'));
const AdminAnalytics = lazy(() => import('./pages/admin/AdminAnalytics'));
const AdminRevenueMonitoring = lazy(() => import('./pages/admin/AdminRevenueMonitoring'));
const AdminProvincePerformance = lazy(() => import('./pages/admin/AdminProvincePerformance'));
const AdminBusinessLocations = lazy(() => import('./pages/admin/AdminBusinessLocations'));
const AdminActivityMonitoring = lazy(() => import('./pages/admin/AdminActivityMonitoring'));
const AdminUserManagement = lazy(() => import('./pages/admin/AdminUserManagement'));
const AdminPaymentMonitoring = lazy(() => import('./pages/admin/AdminPaymentMonitoring'));
const AdminMomoTransactions = lazy(() => import('./pages/admin/AdminMomoTransactions'));
const AdminAiInsights = lazy(() => import('./pages/admin/AdminAiInsights'));
const AdminSecurity = lazy(() => import('./pages/admin/AdminSecurity'));
const AdminNotifications = lazy(() => import('./pages/admin/AdminNotifications'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));
const AdminTaxSettings = lazy(() => import('./pages/admin/AdminTaxSettings'));
const AdminPenaltySettings = lazy(() => import('./pages/admin/AdminPenaltySettings'));
const AdminExport = lazy(() => import('./pages/admin/AdminExport'));
const AdminProfile = lazy(() => import('./pages/admin/AdminProfile'));
const AdminInactivityExplanations = lazy(() => import('./pages/admin/AdminInactivityExplanations'));
const AdminPaymentPlans = lazy(() => import('./pages/admin/AdminPaymentPlans'));
const AdminDistrictMonitoring = lazy(() => import('./pages/admin/AdminDistrictMonitoring'));
const AdminSectorMonitoring = lazy(() => import('./pages/admin/AdminSectorMonitoring'));

const Inventory = lazy(() => import('./pages/Inventory'));
const PendingTaxes = lazy(() => import('./pages/PendingTaxes'));
const PaymentHistory = lazy(() => import('./pages/PaymentHistory'));
const Reports = lazy(() => import('./pages/Reports'));
const AiAssistant = lazy(() => import('./pages/AiAssistant'));
const VoiceAssistant = lazy(() => import('./pages/VoiceAssistant'));
const BusinessNotifications = lazy(() => import('./pages/BusinessNotifications'));
const BusinessSettings = lazy(() => import('./pages/BusinessSettings'));
const NotificationPreferences = lazy(() => import('./pages/NotificationPreferences'));
const Profile = lazy(() => import('./pages/Profile'));
const Help = lazy(() => import('./pages/Help'));

function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
    initOfflineSync();
    setupPushNotifications(api).catch(() => {});
  }, [checkAuth]);

  return (
    <Router>
      <OfflineBanner />
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/"
            element={
              <ProtectedRoute businessOnly>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<RoleHomeRedirect />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="sales" element={<Sales />} />
            <Route path="invoices" element={<Invoices />} />
            <Route path="taxes" element={<Taxes />} />
            <Route path="pending-taxes" element={<PendingTaxes />} />
            <Route path="payment-history" element={<PaymentHistory />} />
            <Route path="reports" element={<Reports />} />
            <Route path="ai-assistant" element={<AiAssistant />} />
            <Route path="voice-assistant" element={<VoiceAssistant />} />
            <Route path="notifications" element={<BusinessNotifications />} />
            <Route path="business-settings" element={<BusinessSettings />} />
            <Route path="notification-preferences" element={<NotificationPreferences />} />
            <Route path="profile" element={<Profile />} />
            <Route path="help" element={<Help />} />
          </Route>

          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly roles={ADMIN_ROLES}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="approvals" element={<AdminApprovals />} />
            <Route path="businesses" element={<AdminBusinesses />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="compliance" element={<AdminCompliance />} />
            <Route path="audit-logs" element={<AdminAuditLogs />} />
            <Route path="inactivity" element={<AdminInactivity />} />

            <Route path="national-analytics" element={<AdminAnalytics scope="national" />} />
            <Route path="provincial-analytics" element={<AdminAnalytics scope="province" />} />
            <Route path="district-analytics" element={<AdminAnalytics scope="district" />} />
            <Route path="revenue-monitoring" element={<AdminRevenueMonitoring />} />
            <Route path="tax-reports" element={<AdminReports />} />
            <Route path="province-performance" element={<AdminProvincePerformance />} />
            <Route path="business-locations" element={<AdminBusinessLocations />} />
            <Route path="activity-monitoring" element={<AdminActivityMonitoring />} />
            <Route path="user-management" element={<AdminUserManagement />} />
            <Route path="provincial-admins" element={<AdminUserManagement filter="provincial_admin" />} />
            <Route path="district-admins" element={<AdminUserManagement filter="district_admin" />} />
            <Route path="sector-admins" element={<AdminUserManagement filter="sector_admin" />} />
            <Route path="payment-monitoring" element={<AdminPaymentMonitoring />} />
            <Route path="momo-transactions" element={<AdminMomoTransactions />} />
            <Route path="ai-insights" element={<AdminAiInsights />} />
            <Route path="security" element={<AdminSecurity />} />
            <Route path="notifications" element={<AdminNotifications />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="tax-settings" element={<AdminTaxSettings />} />
            <Route path="penalty-settings" element={<AdminPenaltySettings />} />
            <Route path="export" element={<AdminExport />} />
            <Route path="profile" element={<AdminProfile />} />
            <Route path="inactivity-explanations" element={<AdminInactivityExplanations />} />
            <Route path="payment-plans" element={<AdminPaymentPlans />} />
            <Route path="district-monitoring" element={<AdminDistrictMonitoring />} />
            <Route path="sector-monitoring" element={<AdminSectorMonitoring />} />
          </Route>

          <Route path="*" element={<RoleHomeRedirect />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
