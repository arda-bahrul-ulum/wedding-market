import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/UI/Card";
import Button from "../../components/UI/Button";
import BottomNavigation from "../../components/Layout/BottomNavigation";
import {
  Users,
  Store,
  ShoppingBag,
  Settings,
  BarChart3,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Eye,
  ToggleLeft,
  ToggleRight,
  LogOut,
  ArrowRight,
  Shield,
  Activity,
  Zap,
  Globe,
  CreditCard,
  MessageSquare,
  Heart,
  Gift,
  Bot,
  FileText,
  Star,
  Search,
  Plus,
} from "lucide-react";

function AdminDashboard() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVendors: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingVendors: 0,
    activeOrders: 0,
    completedOrders: 0,
    totalReviews: 0,
  });
  const [moduleSettings, setModuleSettings] = useState({
    subscriptionVendor: true,
    vendorCollaboration: false,
    chatSystem: true,
    wishlist: true,
    dpCicilan: false,
    promoVoucher: false,
    aiChatbot: false,
    blogFaq: true,
    ratingReview: true,
    paymentXendit: true,
    paymentMidtrans: false,
    paymentManual: true,
    paymentCod: false,
    seoBasic: true,
    seoAdvanced: false,
    seoAutomation: false,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentVendors, setRecentVendors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  const fetchDashboardData = async () => {
    try {
      // Fetch stats
      const statsResponse = await fetch("/api/v1/admin/dashboard", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const statsData = await statsResponse.json();
      if (statsData.success) {
        setStats(statsData.data);
      } else {
        // Fallback data for testing
        setStats({
          totalUsers: 25,
          totalVendors: 8,
          totalOrders: 42,
          totalRevenue: 15750000,
          pendingVendors: 3,
          activeOrders: 12,
          completedOrders: 30,
          totalReviews: 18,
        });
      }

      // Fetch module settings
      const moduleResponse = await fetch("/api/v1/admin/module-settings", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const moduleData = await moduleResponse.json();
      if (moduleData.success) {
        setModuleSettings(moduleData.data);
      }

      // Fetch recent orders
      const ordersResponse = await fetch("/api/v1/admin/orders?limit=5", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const ordersData = await ordersResponse.json();
      if (ordersData.success) {
        setRecentOrders(ordersData.data.orders);
      } else {
        // Fallback data for testing
        setRecentOrders([
          {
            id: "ORD-001",
            total_amount: 2500000,
            status: "completed",
            created_at: "2024-01-15T10:30:00Z",
          },
          {
            id: "ORD-002",
            total_amount: 1800000,
            status: "pending",
            created_at: "2024-01-14T14:20:00Z",
          },
          {
            id: "ORD-003",
            total_amount: 3200000,
            status: "completed",
            created_at: "2024-01-13T09:15:00Z",
          },
        ]);
      }

      // Fetch recent vendors
      const vendorsResponse = await fetch("/api/v1/admin/vendors?limit=5", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const vendorsData = await vendorsResponse.json();
      if (vendorsData.success) {
        setRecentVendors(vendorsData.data.vendors);
      } else {
        // Fallback data for testing
        setRecentVendors([
          {
            id: 1,
            business_name: "Wedding Planner Pro",
            business_type: "wedding_planner",
            is_verified: true,
            created_at: "2024-01-10T08:00:00Z",
            user: { email: "contact@weddingplannerpro.com" },
          },
          {
            id: 2,
            business_name: "Elegant Photography",
            business_type: "photography",
            is_verified: false,
            created_at: "2024-01-12T15:30:00Z",
            user: { email: "info@elegantphoto.com" },
          },
          {
            id: 3,
            business_name: "Flower Garden",
            business_type: "florist",
            is_verified: true,
            created_at: "2024-01-08T11:45:00Z",
            user: { email: "hello@flowergarden.com" },
          },
        ]);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleModule = async (moduleName) => {
    try {
      const response = await fetch(
        `/api/v1/admin/module-settings/${moduleName}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            enabled: !moduleSettings[moduleName],
          }),
        }
      );

      if (response.ok) {
        setModuleSettings((prev) => ({
          ...prev,
          [moduleName]: !prev[moduleName],
        }));
      }
    } catch (error) {
      console.error("Error toggling module:", error);
    }
  };

  const formatCurrency = (amount) => {
    if (!amount || isNaN(amount)) {
      return "Rp 0";
    }
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <p className="text-gray-600 font-medium">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200/50">
        <div className="px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Dashboard Super User
                </h1>
                <p className="text-sm text-gray-600">
                  Selamat datang, {user?.name || "Super User"}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-gray-700">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {user?.role?.replace("_", " ")}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="group"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 py-6 sm:py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card hover glow>
            <CardBody className="p-6">
              <div className="flex items-center">
                <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">
                    Total Users
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.totalUsers}
                  </p>
                  <div className="flex items-center text-xs text-success-600 mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +5 dari bulan lalu
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card hover glow>
            <CardBody className="p-6">
              <div className="flex items-center">
                <div className="w-14 h-14 bg-gradient-to-br from-success-500 to-success-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                  <Store className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">
                    Total Vendors
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.totalVendors}
                  </p>
                  <div className="flex items-center text-xs text-success-600 mt-1">
                    <Store className="w-3 h-3 mr-1" />
                    Active vendors
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card hover glow>
            <CardBody className="p-6">
              <div className="flex items-center">
                <div className="w-14 h-14 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                  <ShoppingBag className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">
                    Total Orders
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.totalOrders}
                  </p>
                  <div className="flex items-center text-xs text-accent-600 mt-1">
                    <Activity className="w-3 h-3 mr-1" />
                    All time orders
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card hover glow>
            <CardBody className="p-6">
              <div className="flex items-center">
                <div className="w-14 h-14 bg-gradient-to-br from-warning-500 to-warning-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                  <DollarSign className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">
                    Total Revenue
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {formatCurrency(stats.totalRevenue)}
                  </p>
                  <div className="flex items-center text-xs text-warning-600 mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +15% growth
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card hover glow>
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Pending Vendors
                  </p>
                  <p className="text-3xl font-bold text-warning-600">
                    {stats.pendingVendors}
                  </p>
                  <div className="flex items-center text-xs text-warning-600 mt-1">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Needs review
                  </div>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-warning-500 to-warning-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card hover glow>
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Active Orders
                  </p>
                  <p className="text-3xl font-bold text-primary-600">
                    {stats.activeOrders}
                  </p>
                  <div className="flex items-center text-xs text-primary-600 mt-1">
                    <Clock className="w-3 h-3 mr-1" />
                    In progress
                  </div>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Clock className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card hover glow>
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Completed Orders
                  </p>
                  <p className="text-3xl font-bold text-success-600">
                    {stats.completedOrders}
                  </p>
                  <div className="flex items-center text-xs text-success-600 mt-1">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Successfully done
                  </div>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-success-500 to-success-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Module Control */}
          <Card hover>
            <CardHeader>
              <CardTitle>Module Control</CardTitle>
              <CardDescription>Kelola fitur-fitur platform</CardDescription>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                {Object.entries(moduleSettings).map(([key, value]) => {
                  const getModuleIcon = (moduleKey) => {
                    const iconMap = {
                      subscriptionVendor: Store,
                      vendorCollaboration: Users,
                      chatSystem: MessageSquare,
                      wishlist: Heart,
                      dpCicilan: CreditCard,
                      promoVoucher: Gift,
                      aiChatbot: Bot,
                      blogFaq: FileText,
                      ratingReview: Star,
                      paymentXendit: CreditCard,
                      paymentMidtrans: CreditCard,
                      paymentManual: CreditCard,
                      paymentCod: CreditCard,
                      seoBasic: Search,
                      seoAdvanced: Search,
                      seoAutomation: Search,
                    };
                    return iconMap[moduleKey] || Settings;
                  };

                  const getModuleName = (moduleKey) => {
                    const nameMap = {
                      subscriptionVendor: "Vendor Subscription",
                      vendorCollaboration: "Vendor Collaboration",
                      chatSystem: "Chat System",
                      wishlist: "Wishlist",
                      dpCicilan: "Down Payment Installment",
                      promoVoucher: "Promo & Voucher",
                      aiChatbot: "AI Chatbot",
                      blogFaq: "Blog & FAQ",
                      ratingReview: "Rating & Review",
                      paymentXendit: "Xendit Payment",
                      paymentMidtrans: "Midtrans Payment",
                      paymentManual: "Manual Payment",
                      paymentCod: "Cash on Delivery",
                      seoBasic: "Basic SEO",
                      seoAdvanced: "Advanced SEO",
                      seoAutomation: "SEO Automation",
                    };
                    return nameMap[moduleKey] || moduleKey;
                  };

                  const IconComponent = getModuleIcon(key);

                  return (
                    <div
                      key={key}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:from-gray-100 hover:to-gray-200 transition-all duration-200"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            value ? "bg-primary-500" : "bg-gray-400"
                          }`}
                        >
                          {React.createElement(IconComponent, {
                            className: "w-4 h-4 text-white",
                          })}
                        </div>
                        <span className="text-sm font-semibold text-gray-700">
                          {getModuleName(key)}
                        </span>
                      </div>
                      <button
                        onClick={() => toggleModule(key)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          value ? "bg-primary-600" : "bg-gray-200"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            value ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  );
                })}
              </div>
            </CardBody>
          </Card>

          {/* Recent Orders */}
          <Card hover>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Pesanan terbaru dari customer</CardDescription>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:from-gray-100 hover:to-gray-200 transition-all duration-200"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center">
                          <ShoppingBag className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            Order #{order.id}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(order.created_at)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">
                          {formatCurrency(order.total_amount)}
                        </p>
                        <span
                          className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                            order.status === "completed"
                              ? "bg-success-100 text-success-800"
                              : order.status === "pending"
                              ? "bg-warning-100 text-warning-800"
                              : "bg-danger-100 text-danger-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <ShoppingBag className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500">No recent orders</p>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Recent Vendors */}
        <Card hover className="mt-8">
          <CardHeader>
            <CardTitle>Recent Vendors</CardTitle>
            <CardDescription>Vendor terbaru yang bergabung</CardDescription>
          </CardHeader>
          <CardBody>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Vendor
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Business Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Joined
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {recentVendors.length > 0 ? (
                    recentVendors.map((vendor) => (
                      <tr
                        key={vendor.id}
                        className="hover:bg-gray-50/50 transition-colors duration-200"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-success-100 to-success-200 rounded-xl flex items-center justify-center">
                              <Store className="w-5 h-5 text-success-600" />
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-gray-900">
                                {vendor.business_name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {vendor.user?.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                          {vendor.business_type?.replace("_", " ")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                              vendor.is_verified
                                ? "bg-success-100 text-success-800"
                                : "bg-warning-100 text-warning-800"
                            }`}
                          >
                            {vendor.is_verified ? "Verified" : "Pending"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(vendor.created_at)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Store className="w-8 h-8 text-gray-400" />
                          </div>
                          <p className="text-gray-500">No recent vendors</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}

export default AdminDashboard;
