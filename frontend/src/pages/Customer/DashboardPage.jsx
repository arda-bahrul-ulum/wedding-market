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
} from "lucide-react";
import { formatCurrency, formatDate } from "../../utils/format";
import LoadingSpinner from "../../components/UI/LoadingSpinner";
import Card, { CardBody, CardHeader } from "../../components/UI/Card";
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Selamat datang, {user?.name}!
          </h1>
          <p className="text-gray-600">
            Kelola pesanan dan aktivitas pernikahan Anda di sini
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardBody className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Pesanan</p>
                  <p className="text-2xl font-bold text-gray-900">12</p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Pesanan Selesai</p>
                  <p className="text-2xl font-bold text-gray-900">8</p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Dalam Proses</p>
                  <p className="text-2xl font-bold text-gray-900">3</p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                  <Heart className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Wishlist</p>
                  <p className="text-2xl font-bold text-gray-900">5</p>
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
                  <h2 className="text-lg font-semibold text-gray-900">
                    Pesanan Terbaru
                  </h2>
                  <Button variant="outline" size="sm">
                    Lihat Semua
                  </Button>
                </div>
              </CardHeader>
              <CardBody className="p-0">
                {ordersLoading ? (
                  <div className="flex justify-center py-8">
                    <LoadingSpinner />
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Belum ada pesanan</p>
                    <Button className="mt-4">Mulai Pesan</Button>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {orders.map((order) => (
                      <div key={order.id} className="p-6 hover:bg-gray-50">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            {getStatusIcon(order.status)}
                            <div>
                              <h3 className="font-medium text-gray-900">
                                #{order.order_number}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {order.vendor?.business_name}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">
                              {formatCurrency(order.total_amount)}
                            </p>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                order.status
                              )}`}
                            >
                              {getStatusText(order.status)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <p>Tanggal: {formatDate(order.created_at)}</p>
                          <p>Event: {formatDate(order.event_date)}</p>
                        </div>

                        {order.items && order.items.length > 0 && (
                          <div className="mt-3">
                            <p className="text-sm text-gray-600 mb-2">Items:</p>
                            <div className="space-y-1">
                              {order.items.slice(0, 2).map((item, index) => (
                                <p
                                  key={index}
                                  className="text-sm text-gray-600"
                                >
                                  • {item.item_name} x{item.quantity}
                                </p>
                              ))}
                              {order.items.length > 2 && (
                                <p className="text-sm text-gray-500">
                                  +{order.items.length - 2} item lainnya
                                </p>
                              )}
                            </div>
                          </div>
                        )}
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
                <h2 className="text-lg font-semibold text-gray-900">
                  Aksi Cepat
                </h2>
              </CardHeader>
              <CardBody className="space-y-3">
                <Button className="w-full justify-start">
                  <Package className="w-4 h-4 mr-2" />
                  Buat Pesanan Baru
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Heart className="w-4 h-4 mr-2" />
                  Lihat Wishlist
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Star className="w-4 h-4 mr-2" />
                  Beri Review
                </Button>
              </CardBody>
            </Card>

            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-gray-900">
                  Event Mendatang
                </h2>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Fotografi Prewedding
                      </p>
                      <p className="text-xs text-gray-600">15 Desember 2024</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-accent-600 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Make Up Trial
                      </p>
                      <p className="text-xs text-gray-600">20 Desember 2024</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Hari H Pernikahan
                      </p>
                      <p className="text-xs text-gray-600">25 Desember 2024</p>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Tips */}
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-gray-900">
                  Tips & Saran
                </h2>
              </CardHeader>
              <CardBody>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      💡 Pesan vendor minimal 3 bulan sebelum hari H untuk
                      mendapatkan harga terbaik
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-800">
                      ✅ Baca review dan rating vendor sebelum memesan
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      ⚠️ Pastikan detail pesanan sudah sesuai sebelum konfirmasi
                    </p>
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

