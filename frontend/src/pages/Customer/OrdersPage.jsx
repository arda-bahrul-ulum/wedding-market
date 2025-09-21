import { useState } from "react";
import { useQuery } from "react-query";
import { orderAPI } from "../../services/api";
import {
  Package,
  Search,
  Filter,
  Eye,
  XCircle,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { formatCurrency, formatDate } from "../../utils/format";
import LoadingSpinner from "../../components/UI/LoadingSpinner";
import Card, { CardBody } from "../../components/UI/Card";
import Button from "../../components/UI/Button";
import Input from "../../components/UI/Input";

function OrdersPage() {
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    page: 1,
  });

  const { data: ordersData, isLoading } = useQuery(
    ["customer-orders", filters],
    () => orderAPI.getOrders(filters)
  );

  const orders = ordersData?.data?.orders || [];
  const pagination = ordersData?.data?.pagination || {};

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Pesanan Saya
          </h1>
          <p className="text-gray-600">Kelola dan pantau semua pesanan Anda</p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardBody className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Input
                  placeholder="Cari pesanan..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters({ ...filters, search: e.target.value, page: 1 })
                  }
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>

              <select
                className="input"
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value, page: 1 })
                }
              >
                <option value="">Semua Status</option>
                <option value="pending">Menunggu Konfirmasi</option>
                <option value="accepted">Diterima</option>
                <option value="in_progress">Dalam Proses</option>
                <option value="completed">Selesai</option>
                <option value="cancelled">Dibatalkan</option>
                <option value="rejected">Ditolak</option>
              </select>

              <Button variant="outline" className="w-full md:w-auto">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Orders List */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : orders.length === 0 ? (
          <Card>
            <CardBody className="text-center py-12">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Belum ada pesanan
              </h3>
              <p className="text-gray-600 mb-4">
                Mulai pesan jasa pernikahan impian Anda
              </p>
              <Button>Booking Vendor</Button>
            </CardBody>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card
                key={order.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardBody className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(order.status)}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          #{order.order_number}
                        </h3>
                        <p className="text-gray-600">
                          {order.vendor?.business_name}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">
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

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Tanggal Pesan</p>
                      <p className="font-medium">
                        {formatDate(order.created_at)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Tanggal Event</p>
                      <p className="font-medium">
                        {formatDate(order.event_date)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Lokasi Event</p>
                      <p className="font-medium">
                        {order.event_location || "-"}
                      </p>
                    </div>
                  </div>

                  {order.items && order.items.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-900 mb-2">
                        Items:
                      </p>
                      <div className="space-y-1">
                        {order.items.map((item, index) => (
                          <div
                            key={index}
                            className="flex justify-between text-sm"
                          >
                            <span className="text-gray-600">
                              {item.item_name} x{item.quantity}
                            </span>
                            <span className="font-medium">
                              {formatCurrency(item.total_price)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-1" />
                        Detail
                      </Button>
                      {order.status === "pending" && (
                        <Button size="sm" variant="danger">
                          <XCircle className="w-4 h-4 mr-1" />
                          Batalkan
                        </Button>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      Payment: {order.payment_status}
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.total_pages > 1 && (
          <div className="mt-8 flex justify-center">
            <nav className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.current_page === 1}
                onClick={() =>
                  setFilters({ ...filters, page: pagination.current_page - 1 })
                }
              >
                Previous
              </Button>

              {Array.from(
                { length: pagination.total_pages },
                (_, i) => i + 1
              ).map((page) => (
                <Button
                  key={page}
                  variant={
                    page === pagination.current_page ? "primary" : "outline"
                  }
                  size="sm"
                  onClick={() => setFilters({ ...filters, page })}
                >
                  {page}
                </Button>
              ))}

              <Button
                variant="outline"
                size="sm"
                disabled={pagination.current_page === pagination.total_pages}
                onClick={() =>
                  setFilters({ ...filters, page: pagination.current_page + 1 })
                }
              >
                Next
              </Button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrdersPage;
