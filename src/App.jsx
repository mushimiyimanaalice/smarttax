import { useEffect, Suspense, lazy } from 'react';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { useAuthStore } from './store/authStore';

import { initOfflineSync } from './offline/syncManager';

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



function App() {

  const checkAuth = useAuthStore((state) => state.checkAuth);



  useEffect(() => {

    checkAuth();

    initOfflineSync();

  }, [checkAuth]);



  return (

    <Router>

      <OfflineBanner />

      <Suspense fallback={<LoadingSpinner />}>

        <Routes>

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />



          {/* Business owner — mobile layout */}

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

            <Route path="sales" element={<Sales />} />

            <Route path="invoices" element={<Invoices />} />

            <Route path="taxes" element={<Taxes />} />

          </Route>



          {/* Admins — desktop console (separate from business app) */}

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

          </Route>



          <Route path="*" element={<RoleHomeRedirect />} />

        </Routes>

      </Suspense>

    </Router>

  );

}



export default App;


