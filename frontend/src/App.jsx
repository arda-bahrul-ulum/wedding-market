import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { SessionProvider, useSession } from "./contexts/SessionContext";
import SessionExpiredModal from "./components/UI/SessionExpiredModal";
import { setSessionExpiredHandler } from "./services/api";
import Layout from "./components/Layout/Layout";
import AdminLayout from "./components/Layout/AdminLayout";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import RoleRoute from "./components/Auth/RoleRoute";

// Public Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import MarketplacePage from "./pages/Marketplace/MarketplacePage";
import VendorDetailPage from "./pages/Marketplace/VendorDetailPage";
import ServiceDetailPage from "./pages/Marketplace/ServiceDetailPage";
import PackageDetailPage from "./pages/Marketplace/PackageDetailPage";
import SearchPage from "./pages/Marketplace/SearchPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";

// Customer Pages
import CustomerDashboard from "./pages/Customer/DashboardPage";
import CustomerOrders from "./pages/Customer/OrdersPage";
import CustomerWishlist from "./pages/Customer/WishlistPage";
import CustomerProfile from "./pages/Customer/ProfilePage";

// Vendor Pages
import VendorDashboard from "./pages/Vendor/DashboardPage";
import VendorProfile from "./pages/Vendor/ProfilePage";
import VendorServices from "./pages/Vendor/ServicesPage";
import VendorPackages from "./pages/Vendor/PackagesPage";
import VendorOrders from "./pages/Vendor/OrdersPage";
import VendorPortfolio from "./pages/Vendor/PortfolioPage";
import VendorAvailability from "./pages/Vendor/AvailabilityPage";

// Admin Pages
import AdminDashboard from "./pages/Admin/DashboardPage";
import AdminUsers from "./pages/Admin/UsersPage";
import AdminVendors from "./pages/Admin/VendorsPage";
import AdminOrders from "./pages/Admin/OrdersPage";
import AdminSettings from "./pages/Admin/SettingsPage";

// Error Pages
import NotFoundPage from "./pages/Error/NotFoundPage";

// Component to handle session expired modal
function SessionHandler() {
  const { isSessionExpired, showSessionExpired, hideSessionExpired } =
    useSession();

  // Set up session expired handler
  React.useEffect(() => {
    setSessionExpiredHandler(showSessionExpired);
  }, [showSessionExpired]);

  return (
    <SessionExpiredModal
      isOpen={isSessionExpired}
      onClose={hideSessionExpired}
    />
  );
}

// Main App Content Component
function AppContent() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="marketplace" element={<MarketplacePage />} />
        <Route path="vendor/:id" element={<VendorDetailPage />} />
        <Route path="service/:id" element={<ServiceDetailPage />} />
        <Route path="package/:id" element={<PackageDetailPage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />

        {/* Customer Routes */}
        <Route
          path="customer"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["customer"]}>
                <CustomerDashboard />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="customer/orders"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["customer"]}>
                <CustomerOrders />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="customer/wishlist"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["customer"]}>
                <CustomerWishlist />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="customer/profile"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["customer"]}>
                <CustomerProfile />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        {/* Vendor Routes */}
        <Route
          path="vendor"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["vendor"]}>
                <VendorDashboard />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="vendor/profile"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["vendor"]}>
                <VendorProfile />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="vendor/services"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["vendor"]}>
                <VendorServices />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="vendor/packages"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["vendor"]}>
                <VendorPackages />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="vendor/orders"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["vendor"]}>
                <VendorOrders />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="vendor/portfolio"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["vendor"]}>
                <VendorPortfolio />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="vendor/availability"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["vendor"]}>
                <VendorAvailability />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        {/* Error Routes */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Admin Routes - Inside AuthProvider but outside Layout wrapper */}
      <Route
        path="admin"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["super_user"]}>
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="admin/users"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["super_user"]}>
              <AdminLayout>
                <AdminUsers />
              </AdminLayout>
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="admin/vendors"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["super_user"]}>
              <AdminLayout>
                <AdminVendors />
              </AdminLayout>
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="admin/orders"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["super_user"]}>
              <AdminLayout>
                <AdminOrders />
              </AdminLayout>
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="admin/settings"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["super_user"]}>
              <AdminLayout>
                <AdminSettings />
              </AdminLayout>
            </RoleRoute>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

// Wrapper component to ensure all providers are available
function AppWrapper() {
  return (
    <SessionProvider>
      <AuthProvider>
        <CartProvider>
          <SessionHandler />
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </SessionProvider>
  );
}

function App() {
  return <AppWrapper />;
}

export default App;
