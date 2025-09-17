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
} from "lucide-react";
import { formatCurrency, formatDate } from "../../utils/format";
import LoadingSpinner from "../../components/UI/LoadingSpinner";
import Card, { CardBody, CardHeader } from "../../components/UI/Card";
import Button from "../../components/UI/Button";

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
  const orders = ordersData?.data?.orders || [];
  const services = servicesData?.data?.services || [];

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
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dashboard Vendor
          </h1>
          <p className="text-gray-600">
            Selamat datang, {profile?.business_name || user?.name}!
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
                  <p className="text-2xl font-bold text-gray-900">24</p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Pendapatan Bulan Ini</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(15000000)}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                  <Star className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Rating Rata-rata</p>
                  <p className="text-2xl font-bold text-gray-900">4.8</p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Review</p>
                  <p className="text-2xl font-bold text-gray-900">156</p>
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
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {orders.map((order) => (
                      <div key={order.id} className="p-6 hover:bg-gray-50">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="font-medium text-gray-900">
                              #{order.order_number}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {order.customer?.name}
                            </p>
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

                        <div className="flex items-center justify-between mt-4">
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4 mr-1" />
                              Detail
                            </Button>
                            <Button size="sm" variant="outline">
                              <MessageCircle className="w-4 h-4 mr-1" />
                              Chat
                            </Button>
                          </div>
                          {order.status === "pending" && (
                            <div className="flex space-x-2">
                              <Button size="sm" variant="primary">
                                Terima
                              </Button>
                              <Button size="sm" variant="danger">
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
                <h2 className="text-lg font-semibold text-gray-900">
                  Aksi Cepat
                </h2>
              </CardHeader>
              <CardBody className="space-y-3">
                <Button className="w-full justify-start">
                  <Package className="w-4 h-4 mr-2" />
                  Tambah Jasa Baru
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Kelola Pesanan
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="w-4 h-4 mr-2" />
                  Atur Ketersediaan
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Lihat Analitik
                </Button>
              </CardBody>
            </Card>

            {/* Recent Services */}
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-gray-900">
                  Jasa Terbaru
                </h2>
              </CardHeader>
              <CardBody>
                {servicesLoading ? (
                  <div className="flex justify-center py-4">
                    <LoadingSpinner size="sm" />
                  </div>
                ) : services.length === 0 ? (
                  <p className="text-gray-600 text-sm">Belum ada jasa</p>
                ) : (
                  <div className="space-y-3">
                    {services.map((service) => (
                      <div
                        key={service.id}
                        className="flex items-center justify-between"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {service.name}
                          </p>
                          <p className="text-xs text-gray-600">
                            {service.category?.name}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            {formatCurrency(service.price)}
                          </p>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              service.is_active
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
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
                <h2 className="text-lg font-semibold text-gray-900">
                  Tips Performa
                </h2>
              </CardHeader>
              <CardBody>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      💡 Update foto portfolio secara berkala untuk menarik
                      lebih banyak customer
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-800">
                      ✅ Balas pesanan dalam 24 jam untuk meningkatkan rating
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      ⚠️ Pastikan deskripsi jasa lengkap dan akurat
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

