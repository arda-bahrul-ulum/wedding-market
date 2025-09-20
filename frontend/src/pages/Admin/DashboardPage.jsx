import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Card, CardBody } from "../../components/UI/Card";
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Dashboard Super User
              </h1>
              <p className="text-gray-600 mt-1">
                Selamat datang, {user?.name || "Super User"}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-700">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {user?.role?.replace("_", " ")}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardBody className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total Users
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalUsers}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Store className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total Vendors
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalVendors}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <ShoppingBag className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total Orders
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalOrders}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total Revenue
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(stats.totalRevenue)}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Pending Vendors
                  </p>
                  <p className="text-2xl font-bold text-orange-600">
                    {stats.pendingVendors}
                  </p>
                </div>
                <AlertCircle className="h-8 w-8 text-orange-500" />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Active Orders
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {stats.activeOrders}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-blue-500" />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Completed Orders
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {stats.completedOrders}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Module Control */}
          <Card>
            <CardBody className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Module Control
                </h3>
                <Settings className="h-5 w-5 text-gray-400" />
              </div>
              <div className="space-y-4">
                {Object.entries(moduleSettings).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      {key
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase())}
                    </span>
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
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Recent Orders */}
          <Card>
            <CardBody className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Recent Orders
                </h3>
                <Eye className="h-5 w-5 text-gray-400" />
              </div>
              <div className="space-y-4">
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Order #{order.id}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(order.created_at)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">
                          {formatCurrency(order.total_amount)}
                        </p>
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            order.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : order.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No recent orders
                  </p>
                )}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Recent Vendors */}
        <Card className="mt-8">
          <CardBody className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Recent Vendors
              </h3>
              <Store className="h-5 w-5 text-gray-400" />
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vendor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Business Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentVendors.length > 0 ? (
                    recentVendors.map((vendor) => (
                      <tr key={vendor.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {vendor.business_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {vendor.user?.email}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {vendor.business_type?.replace("_", " ")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              vendor.is_verified
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
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
                      <td
                        colSpan="4"
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        No recent vendors
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default AdminDashboard;
