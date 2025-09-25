import { useAuth } from "../../contexts/AuthContext";
import { useQuery } from "react-query";
import { vendorAPI } from "../../services/api";
import {
  Package,
  Users,
  Star,
  TrendingUp,
  Eye,
  MessageCircle,
  Calendar,
  DollarSign,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Plus,
  BarChart3,
  Settings,
  Search,
  UserPlus,
} from "lucide-react";
import { formatCurrency, formatDate } from "../../utils/format";
import LoadingSpinner from "../../components/UI/LoadingSpinner";
import Card, {
  CardBody,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/UI/Card";
import Button from "../../components/UI/Button";
import { Link } from "react-router-dom";

function DashboardPage() {
  const { user } = useAuth();

  const { data: profileData, isLoading: profileLoading } = useQuery(
    "vendor-profile",
    vendorAPI.getProfile
  );

  const { data: ordersData, isLoading: ordersLoading } = useQuery(
    "vendor-orders",
    () => vendorAPI.getOrders({ limit: 5 })
  );

  const { data: servicesData, isLoading: servicesLoading } = useQuery(
    "vendor-services",
    () => vendorAPI.getServices({ limit: 5 })
  );

  const profile = profileData?.data;
  const orders = Array.isArray(ordersData?.data?.orders)
    ? ordersData.data.orders
    : [];
  const services = Array.isArray(servicesData?.data?.services)
    ? servicesData.data.services
    : [];

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Menunggu Konfirmasi";
      case "accepted":
        return "Diterima";
      case "in_progress":
        return "Dalam Proses";
      case "completed":
        return "Selesai";
      case "cancelled":
        return "Dibatalkan";
      case "rejected":
        return "Ditolak";
      default:
        return status;
    }
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 font-medium">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Dashboard Vendor
          </h1>
          <p className="text-lg text-gray-600">
            Selamat datang, {profile?.business_name || user?.name}!
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardBody className="p-6">
              <div className="flex items-center">
                <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                  <Package className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">
                    Total Pesanan
                  </p>
                  <p className="text-3xl font-bold text-gray-900">24</p>
                  <div className="flex items-center text-xs text-success-600 mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +3 dari bulan lalu
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6">
              <div className="flex items-center">
                <div className="w-14 h-14 bg-gradient-to-br from-success-500 to-success-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                  <DollarSign className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">
                    Pendapatan Bulan Ini
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {formatCurrency(15000000)}
                  </p>
                  <div className="flex items-center text-xs text-success-600 mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +12% dari bulan lalu
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6">
              <div className="flex items-center">
                <div className="w-14 h-14 bg-gradient-to-br from-warning-500 to-warning-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                  <Star className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">
                    Rating Rata-rata
                  </p>
                  <p className="text-3xl font-bold text-gray-900">4.8</p>
                  <div className="flex items-center text-xs text-warning-600 mt-1">
                    <Star className="w-3 h-3 mr-1" />
                    Excellent rating
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6">
              <div className="flex items-center">
                <div className="w-14 h-14 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">
                    Total Review
                  </p>
                  <p className="text-3xl font-bold text-gray-900">156</p>
                  <div className="flex items-center text-xs text-accent-600 mt-1">
                    <Users className="w-3 h-3 mr-1" />
                    Customer reviews
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Pesanan Terbaru</CardTitle>
                    <CardDescription>
                      Kelola pesanan dari customer
                    </CardDescription>
                  </div>
                  <Link to="/vendor/orders">
                    <Button variant="outline" size="sm" className="group">
                      Lihat Semua
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardBody className="p-0">
                {ordersLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="text-center">
                      <p className="text-gray-600 font-medium">
                        Memuat pesanan...
                      </p>
                    </div>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <Package className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Belum ada pesanan
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Pesanan akan muncul di sini
                    </p>
                    <Link to="/vendor/services">
                      <Button gradient glow>
                        <Plus className="w-4 h-4 mr-2" />
                        Tambah Jasa
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="p-6 hover:bg-gray-50/50 transition-colors duration-200 group"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center">
                              <Package className="w-6 h-6 text-primary-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                                #{order.order_number}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {order.customer?.name}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-gray-900">
                              {formatCurrency(order.total_amount)}
                            </p>
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                                order.status
                              )}`}
                            >
                              {getStatusText(order.status)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span>Tanggal: {formatDate(order.created_at)}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span>Event: {formatDate(order.event_date)}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4 mr-2" />
                              Detail
                            </Button>
                            <Button size="sm" variant="outline">
                              <MessageCircle className="w-4 h-4 mr-2" />
                              Chat
                            </Button>
                          </div>
                          {order.status === "pending" && (
                            <div className="flex space-x-2">
                              <Button size="sm" variant="primary" gradient>
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Terima
                              </Button>
                              <Button size="sm" variant="danger" gradient>
                                <AlertCircle className="w-4 h-4 mr-2" />
                                Tolak
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardBody>
            </Card>
          </div>

          {/* Quick Actions & Info */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Aksi Cepat</CardTitle>
                <CardDescription>
                  Menu utama untuk aktivitas vendor
                </CardDescription>
              </CardHeader>
              <CardBody className="space-y-4">
                <Link to="/vendor/services">
                  <Button className="w-full justify-start" gradient glow>
                    <Plus className="w-4 h-4 mr-3" />
                    Tambah Jasa Baru
                  </Button>
                </Link>
                <Link to="/vendor/orders">
                  <Button
                    variant="outline"
                    className="w-full justify-start group"
                  >
                    <Users className="w-4 h-4 mr-3" />
                    Kelola Pesanan
                    <ArrowRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform duration-200" />
                  </Button>
                </Link>
                <Link to="/vendor/availability">
                  <Button
                    variant="outline"
                    className="w-full justify-start group"
                  >
                    <Calendar className="w-4 h-4 mr-3" />
                    Atur Ketersediaan
                    <ArrowRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform duration-200" />
                  </Button>
                </Link>
                <Link to="/vendor/analytics">
                  <Button
                    variant="outline"
                    className="w-full justify-start group"
                  >
                    <BarChart3 className="w-4 h-4 mr-3" />
                    Lihat Analitik
                    <ArrowRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform duration-200" />
                  </Button>
                </Link>
              </CardBody>
            </Card>

            {/* Recent Services */}
            <Card>
              <CardHeader>
                <CardTitle>Jasa Terbaru</CardTitle>
                <CardDescription>
                  Daftar jasa yang Anda tawarkan
                </CardDescription>
              </CardHeader>
              <CardBody>
                {servicesLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="text-center">
                      <p className="text-gray-600 text-sm">Memuat jasa...</p>
                    </div>
                  </div>
                ) : services.length === 0 ? (
                  <div className="text-center py-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Package className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-600 text-sm mb-4">Belum ada jasa</p>
                    <Link to="/vendor/services">
                      <Button size="sm" gradient>
                        <Plus className="w-4 h-4 mr-2" />
                        Tambah Jasa
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {services.map((service) => (
                      <div
                        key={service.id}
                        className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:from-gray-100 hover:to-gray-200 transition-all duration-200"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900 mb-1">
                            {service.name}
                          </p>
                          <p className="text-xs text-gray-600">
                            {service.category?.name}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-gray-900">
                            {formatCurrency(service.price)}
                          </p>
                          <span
                            className={`text-xs px-2 py-1 rounded-full font-semibold ${
                              service.is_active
                                ? "bg-success-100 text-success-800"
                                : "bg-danger-100 text-danger-800"
                            }`}
                          >
                            {service.is_active ? "Aktif" : "Nonaktif"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardBody>
            </Card>

            {/* Performance Tips */}
            <Card>
              <CardHeader>
                <CardTitle>Tips Performa</CardTitle>
                <CardDescription>
                  Panduan untuk meningkatkan bisnis
                </CardDescription>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl border border-primary-200">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Lightbulb className="w-4 h-4 text-white" />
                      </div>
                      <p className="text-sm text-primary-800 font-medium">
                        Update foto portfolio secara berkala untuk menarik lebih
                        banyak customer
                      </p>
                    </div>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-success-50 to-success-100 rounded-xl border border-success-200">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-success-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                      <p className="text-sm text-success-800 font-medium">
                        Balas pesanan dalam 24 jam untuk meningkatkan rating
                      </p>
                    </div>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-warning-50 to-warning-100 rounded-xl border border-warning-200">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-warning-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <AlertCircle className="w-4 h-4 text-white" />
                      </div>
                      <p className="text-sm text-warning-800 font-medium">
                        Pastikan deskripsi jasa lengkap dan akurat
                      </p>
                    </div>
                  </div>
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
