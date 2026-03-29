import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import ErrorBoundary from './components/common/ErrorBoundary';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import RegisterCustomer from './pages/RegisterCustomer';
import RegisterAgent from './pages/RegisterAgent';

// Customer Pages
import CustomerDashboard from './pages/customer/Dashboard';
import MyVehicles from './pages/customer/MyVehicles';
import AddVehicle from './pages/customer/AddVehicle';
import BrowsePlans from './pages/customer/BrowsePlans';
import SelectAgent from './pages/customer/SelectAgent';
import PolicySummary from './pages/customer/PolicySummary';
import Payment from './pages/customer/Payment';
import MyPolicies from './pages/customer/MyPolicies';
import FileClaim from './pages/customer/FileClaim';
import MyClaims from './pages/customer/MyClaims';
import MyDocuments from './pages/customer/MyDocuments';
import CustomerProfile from './pages/customer/Profile';

// Agent Pages
import AgentDashboard from './pages/agent/Dashboard';
import MyCustomers from './pages/agent/MyCustomers';
import CustomerDetail from './pages/agent/CustomerDetail';
import PendingClaims from './pages/agent/PendingClaims';
import ReviewClaim from './pages/agent/ReviewClaim';
import ManagedPolicies from './pages/agent/ManagedPolicies';
import ManagePlans from './pages/agent/ManagePlans';
import AgentProfile from './pages/agent/Profile';

// Layout
import DashboardLayout from './components/common/DashboardLayout';

import './styles/index.css';

// Protected Route
const ProtectedRoute = ({ children, role }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-page">
        <div className="spinner"></div>
        <p className="text-secondary">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role && user?.role !== role) {
    return <Navigate to={`/${user?.role}/dashboard`} replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <ErrorBoundary>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1A1F42',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
            },
            success: {
              iconTheme: { primary: '#00D4AA', secondary: '#0A0E27' },
            },
            error: {
              iconTheme: { primary: '#FF6B6B', secondary: '#0A0E27' },
            },
          }}
        />
        <Routes>
          {/* Public */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register/customer" element={<RegisterCustomer />} />
          <Route path="/register/agent" element={<RegisterAgent />} />

          {/* Customer Portal */}
          <Route path="/customer" element={
            <ProtectedRoute role="customer">
              <DashboardLayout role="customer" />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<CustomerDashboard />} />
            <Route path="vehicles" element={<MyVehicles />} />
            <Route path="vehicles/add" element={<AddVehicle />} />
            <Route path="plans" element={<BrowsePlans />} />
            <Route path="select-agent" element={<SelectAgent />} />
            <Route path="policy-summary" element={<PolicySummary />} />
            <Route path="payment" element={<Payment />} />
            <Route path="policies" element={<MyPolicies />} />
            <Route path="claims/new" element={<FileClaim />} />
            <Route path="claims" element={<MyClaims />} />
            <Route path="documents" element={<MyDocuments />} />
            <Route path="profile" element={<CustomerProfile />} />
          </Route>

          {/* Agent Portal */}
          <Route path="/agent" element={
            <ProtectedRoute role="agent">
              <DashboardLayout role="agent" />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<AgentDashboard />} />
            <Route path="customers" element={<MyCustomers />} />
            <Route path="customers/:id" element={<CustomerDetail />} />
            <Route path="claims" element={<PendingClaims />} />
            <Route path="claims/:id/review" element={<ReviewClaim />} />
            <Route path="policies" element={<ManagedPolicies />} />
            <Route path="plans" element={<ManagePlans />} />
            <Route path="profile" element={<AgentProfile />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      </ErrorBoundary>
    </AuthProvider>
  );
}

export default App;
