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
  BarChart3,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Eye,
  LogOut,
  ArrowRight,
  Shield,
  Activity,
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

      // Fetch recent orders
      const ordersResponse = await fetch("/api/v1/admin/orders?limit=5", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const ordersData = await ordersResponse.json();
      if (ordersData.success && ordersData.data && ordersData.data.orders) {
        setRecentOrders(ordersData.data.orders);
      } else {
        setRecentOrders([]);
      }

      // Fetch recent vendors
      const vendorsResponse = await fetch("/api/v1/admin/vendors?limit=5", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const vendorsData = await vendorsResponse.json();
      if (vendorsData.success && vendorsData.data && vendorsData.data.vendors) {
        setRecentVendors(vendorsData.data.vendors);
      } else {
        setRecentVendors([]);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "text-yellow-600 bg-yellow-100",
      accepted: "text-blue-600 bg-blue-100",
      rejected: "text-red-600 bg-red-100",
      in_progress: "text-purple-600 bg-purple-100",
      completed: "text-green-600 bg-green-100",
      cancelled: "text-gray-600 bg-gray-100",
    };
    return colors[status] || "text-gray-600 bg-gray-100";
  };

  const getStatusText = (status) => {
    const statusMap = {
      pending: "Pending",
      accepted: "Diterima",
      rejected: "Ditolak",
      in_progress: "Dalam Proses",
      completed: "Selesai",
      cancelled: "Dibatalkan",
    };
    return statusMap[status] || status;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Dashboard Admin
                </h1>
                <p className="text-gray-600 mt-1">
                  Selamat datang kembali, {user?.name}
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
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardBody className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">
                    Total Users
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stats.totalUsers}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Store className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">
                    Total Vendors
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stats.totalVendors}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ShoppingBag className="h-8 w-8 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">
                    Total Orders
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stats.totalOrders}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <DollarSign className="h-8 w-8 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">
                    Total Revenue
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {formatCurrency(stats.totalRevenue)}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardBody className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-8 w-8 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">
                    Pending Vendors
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stats.pendingVendors}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Clock className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">
                    Active Orders
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stats.activeOrders}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">
                    Completed Orders
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stats.completedOrders}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Recent Orders and Vendors */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingBag className="h-5 w-5 mr-2" />
                Recent Orders
              </CardTitle>
              <CardDescription>Latest orders from customers</CardDescription>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                {recentOrders && recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {order.order_number}
                        </p>
                        <p className="text-sm text-gray-500">
                          {order.customer?.name || "Unknown Customer"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatCurrency(order.total_amount)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getStatusText(order.status)}
                        </span>
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No recent orders
                  </p>
                )}
              </div>
              <div className="mt-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => (window.location.href = "/admin/orders")}
                >
                  View All Orders
                </Button>
              </div>
            </CardBody>
          </Card>

          {/* Recent Vendors */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Store className="h-5 w-5 mr-2" />
                Recent Vendors
              </CardTitle>
              <CardDescription>Latest vendor registrations</CardDescription>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                {recentVendors && recentVendors.length > 0 ? (
                  recentVendors.map((vendor) => (
                    <div
                      key={vendor.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {vendor.business_name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {vendor.user?.name || "Unknown User"}
                        </p>
                        <p className="text-sm text-gray-500 capitalize">
                          {vendor.business_type?.replace("_", " ")}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            vendor.is_active
                              ? "text-green-600 bg-green-100"
                              : "text-red-600 bg-red-100"
                          }`}
                        >
                          {vendor.is_active ? "Active" : "Inactive"}
                        </span>
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No recent vendors
                  </p>
                )}
              </div>
              <div className="mt-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => (window.location.href = "/admin/vendors")}
                >
                  View All Vendors
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}

export default AdminDashboard;
