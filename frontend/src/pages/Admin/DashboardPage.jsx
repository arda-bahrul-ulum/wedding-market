import { useQuery } from "react-query";
import { adminAPI } from "../../services/api";
import {
  Users,
  Building,
  Package,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { formatCurrency, formatDate } from "../../utils/format";
import LoadingSpinner from "../../components/UI/LoadingSpinner";
import Card, { CardBody, CardHeader } from "../../components/UI/Card";
import Button from "../../components/UI/Button";

function DashboardPage() {
  const { data: dashboardData, isLoading } = useQuery(
    "admin-dashboard",
    adminAPI.getDashboard
  );

  const stats = dashboardData?.data || {
    total_users: 0,
    total_vendors: 0,
    total_orders: 0,
    total_revenue: 0,
    pending_orders: 0,
    active_vendors: 0,
    new_users_today: 0,
    new_orders_today: 0,
  };

  const recentActivities = [
    {
      id: 1,
      type: "user_registration",
      message: "User baru mendaftar: John Doe",
      timestamp: "2024-01-15T10:30:00Z",
      status: "success",
    },
    {
      id: 2,
      type: "vendor_approval",
      message: 'Vendor "Studio Foto Indah" menunggu persetujuan',
      timestamp: "2024-01-15T09:15:00Z",
      status: "pending",
    },
    {
      id: 3,
      type: "order_completed",
      message: "Order #12345 telah selesai",
      timestamp: "2024-01-15T08:45:00Z",
      status: "success",
    },
    {
      id: 4,
      type: "payment_received",
      message: "Pembayaran Rp 2.500.000 diterima",
      timestamp: "2024-01-15T07:20:00Z",
      status: "success",
    },
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case "user_registration":
        return <Users className="w-4 h-4 text-blue-500" />;
      case "vendor_approval":
        return <Building className="w-4 h-4 text-yellow-500" />;
      case "order_completed":
        return <Package className="w-4 h-4 text-green-500" />;
      case "payment_received":
        return <DollarSign className="w-4 h-4 text-green-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getActivityStatus = (status) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "error":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dashboard Admin
          </h1>
          <p className="text-gray-600">
            Selamat datang di panel administrasi Wedding Commerce
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardBody className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.total_users}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <Building className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Vendors</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.total_vendors}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                  <Package className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.total_orders}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                  <DollarSign className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(stats.total_revenue)}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activities */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Aktivitas Terbaru
                  </h2>
                  <Button variant="outline" size="sm">
                    Lihat Semua
                  </Button>
                </div>
              </CardHeader>
              <CardBody className="p-0">
                <div className="divide-y divide-gray-200">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="p-6 hover:bg-gray-50">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">
                            {activity.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDate(activity.timestamp)}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getActivityStatus(activity.status)}
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Quick Actions & Stats */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-gray-900">
                  Aksi Cepat
                </h2>
              </CardHeader>
              <CardBody className="space-y-3">
                <Button className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Kelola Users
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Building className="w-4 h-4 mr-2" />
                  Kelola Vendors
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Package className="w-4 h-4 mr-2" />
                  Kelola Orders
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Lihat Analitik
                </Button>
              </CardBody>
            </Card>

            {/* Today's Stats */}
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-gray-900">
                  Hari Ini
                </h2>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">User Baru</span>
                  <span className="font-semibold text-green-600">
                    +{stats.new_users_today}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Order Baru</span>
                  <span className="font-semibold text-blue-600">
                    +{stats.new_orders_today}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Pending Orders</span>
                  <span className="font-semibold text-yellow-600">
                    {stats.pending_orders}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Active Vendors</span>
                  <span className="font-semibold text-green-600">
                    {stats.active_vendors}
                  </span>
                </div>
              </CardBody>
            </Card>

            {/* System Health */}
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-gray-900">
                  Status Sistem
                </h2>
              </CardHeader>
              <CardBody className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Database</span>
                  <span className="flex items-center text-green-600">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Healthy
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">API Status</span>
                  <span className="flex items-center text-green-600">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Online
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Payment Gateway</span>
                  <span className="flex items-center text-green-600">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Storage</span>
                  <span className="flex items-center text-yellow-600">
                    <Clock className="w-4 h-4 mr-1" />
                    75% Used
                  </span>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;

