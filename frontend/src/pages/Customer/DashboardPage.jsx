import { useAuth } from "../../contexts/AuthContext";
import { useQuery } from "react-query";
import { orderAPI } from "../../services/api";
import {
  Package,
  Heart,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  Calendar,
  Lightbulb,
  ArrowRight,
  Plus,
  Eye,
  MessageCircle,
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

function DashboardPage() {
  const { user } = useAuth();

  const { data: ordersData, isLoading: ordersLoading } = useQuery(
    "customer-orders",
    () => orderAPI.getOrders({ limit: 5 })
  );

  const orders = ordersData?.data?.orders || [];

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "cancelled":
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-blue-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
      case "rejected":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-blue-100 text-blue-800";
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Dashboard Customer
          </h1>
          <p className="text-lg text-gray-600">Selamat datang, {user?.name}!</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardBody className="p-6">
              <div className="flex items-center">
                <div className="w-14 h-14 bg-primary-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                  <Package className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">
                    Total Pesanan
                  </p>
                  <p className="text-3xl font-bold text-gray-900">12</p>
                  <div className="flex items-center text-xs text-success-600 mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +2 dari bulan lalu
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6">
              <div className="flex items-center">
                <div className="w-14 h-14 bg-success-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                  <CheckCircle className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">
                    Pesanan Selesai
                  </p>
                  <p className="text-3xl font-bold text-gray-900">8</p>
                  <div className="flex items-center text-xs text-success-600 mt-1">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    67% completion rate
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6">
              <div className="flex items-center">
                <div className="w-14 h-14 bg-warning-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                  <Clock className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">
                    Dalam Proses
                  </p>
                  <p className="text-3xl font-bold text-gray-900">3</p>
                  <div className="flex items-center text-xs text-warning-600 mt-1">
                    <Clock className="w-3 h-3 mr-1" />
                    Aktif sekarang
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6">
              <div className="flex items-center">
                <div className="w-14 h-14 bg-danger-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                  <Heart className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Wishlist</p>
                  <p className="text-3xl font-bold text-gray-900">5</p>
                  <div className="flex items-center text-xs text-danger-600 mt-1">
                    <Heart className="w-3 h-3 mr-1" />
                    Favorit Anda
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
                    <CardDescription>Riwayat pesanan Anda</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="group">
                    Lihat Semua
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                  </Button>
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
                    <div className="w-20 h-20 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <Package className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Belum ada pesanan
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Mulai pesan layanan pernikahan impian Anda
                    </p>
                    <Button gradient glow>
                      <Plus className="w-4 h-4 mr-2" />
                      Mulai Pesan
                    </Button>
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
                            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                              {getStatusIcon(order.status)}
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors duration-200">
                                #{order.order_number}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {order.vendor?.business_name}
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
                            <Clock className="w-4 h-4 mr-2" />
                            <span>Event: {formatDate(order.event_date)}</span>
                          </div>
                        </div>

                        {order.items && order.items.length > 0 && (
                          <div className="bg-gray-50 rounded-xl p-4">
                            <p className="text-sm font-medium text-gray-700 mb-3">
                              Items:
                            </p>
                            <div className="space-y-2">
                              {order.items.slice(0, 2).map((item, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between text-sm"
                                >
                                  <span className="text-gray-600">
                                    • {item.item_name} x{item.quantity}
                                  </span>
                                  <span className="text-gray-500">
                                    #{index + 1}
                                  </span>
                                </div>
                              ))}
                              {order.items.length > 2 && (
                                <p className="text-sm text-gray-500 font-medium">
                                  +{order.items.length - 2} item lainnya
                                </p>
                              )}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-end mt-4 space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            Detail
                          </Button>
                          <Button variant="outline" size="sm">
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Chat
                          </Button>
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
                  Menu utama untuk aktivitas Anda
                </CardDescription>
              </CardHeader>
              <CardBody className="space-y-3">
                <Button className="w-full justify-start" gradient glow>
                  <Package className="w-4 h-4 mr-3" />
                  Buat Pesanan Baru
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start group"
                >
                  <Heart className="w-4 h-4 mr-3" />
                  Lihat Wishlist
                  <ArrowRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform duration-200" />
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start group"
                >
                  <Star className="w-4 h-4 mr-3" />
                  Beri Review
                  <ArrowRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform duration-200" />
                </Button>
              </CardBody>
            </Card>

            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle>Event Mendatang</CardTitle>
                <CardDescription>Jadwal pernikahan Anda</CardDescription>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-3 bg-primary-50 rounded-xl">
                    <div className="w-3 h-3 bg-primary-600 rounded-full animate-pulse"></div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">
                        Fotografi Prewedding
                      </p>
                      <p className="text-xs text-gray-600">15 Desember 2024</p>
                    </div>
                    <Calendar className="w-4 h-4 text-primary-600" />
                  </div>
                  <div className="flex items-center space-x-4 p-3 bg-accent-50 rounded-xl">
                    <div className="w-3 h-3 bg-accent-600 rounded-full animate-pulse"></div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">
                        Make Up Trial
                      </p>
                      <p className="text-xs text-gray-600">20 Desember 2024</p>
                    </div>
                    <Calendar className="w-4 h-4 text-accent-600" />
                  </div>
                  <div className="flex items-center space-x-4 p-3 bg-success-50 rounded-xl">
                    <div className="w-3 h-3 bg-success-600 rounded-full animate-pulse"></div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">
                        Hari H Pernikahan
                      </p>
                      <p className="text-xs text-gray-600">25 Desember 2024</p>
                    </div>
                    <Calendar className="w-4 h-4 text-success-600" />
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Tips */}
            <Card>
              <CardHeader>
                <CardTitle>Tips & Saran</CardTitle>
                <CardDescription>
                  Panduan untuk pernikahan sempurna
                </CardDescription>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  <div className="p-4 bg-primary-50 rounded-xl border border-primary-200">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Lightbulb className="w-4 h-4 text-white" />
                      </div>
                      <p className="text-sm text-primary-800 font-medium">
                        Pesan vendor minimal 3 bulan sebelum hari H untuk
                        mendapatkan harga terbaik
                      </p>
                    </div>
                  </div>
                  <div className="p-4 bg-success-50 rounded-xl border border-success-200">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-success-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                      <p className="text-sm text-success-800 font-medium">
                        Baca review dan rating vendor sebelum memesan
                      </p>
                    </div>
                  </div>
                  <div className="p-4 bg-warning-50 rounded-xl border border-warning-200">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-warning-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <AlertCircle className="w-4 h-4 text-white" />
                      </div>
                      <p className="text-sm text-warning-800 font-medium">
                        Pastikan detail pesanan sudah sesuai sebelum konfirmasi
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
