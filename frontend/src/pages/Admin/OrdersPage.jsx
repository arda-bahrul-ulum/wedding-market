import { useState } from "react";
import { useQuery } from "react-query";
import { adminAPI } from "../../services/api";
import {
  Search,
  Filter,
  Eye,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  Building,
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
    payment_status: "",
    page: 1,
  });

  const { data: ordersData, isLoading } = useQuery(
    ["admin-orders", filters],
    () => adminAPI.getOrders(filters)
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
      case "accepted":
        return "bg-blue-100 text-blue-800";
      case "in_progress":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "partial":
        return "bg-blue-100 text-blue-800";
      case "refunded":
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

  const getPaymentStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Menunggu Pembayaran";
      case "paid":
        return "Sudah Dibayar";
      case "partial":
        return "Dibayar Sebagian";
      case "refunded":
        return "Dikembalikan";
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Kelola Orders
          </h1>
          <p className="text-gray-600">Kelola semua pesanan di platform</p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardBody className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Input
                  placeholder="Cari order..."
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

              <select
                className="input"
                value={filters.payment_status}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    payment_status: e.target.value,
                    page: 1,
                  })
                }
              >
                <option value="">Semua Pembayaran</option>
                <option value="pending">Menunggu</option>
                <option value="paid">Sudah Dibayar</option>
                <option value="partial">Sebagian</option>
                <option value="refunded">Dikembalikan</option>
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
                Tidak ada order
              </h3>
              <p className="text-gray-600">
                Order akan muncul di sini ketika ada transaksi
              </p>
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
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-1" />
                            <span>{order.customer?.name}</span>
                          </div>
                          <div className="flex items-center">
                            <Building className="w-4 h-4 mr-1" />
                            <span>{order.vendor?.business_name}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">
                        {formatCurrency(order.total_amount)}
                      </p>
                      <div className="flex flex-col space-y-1 mt-1">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getStatusText(order.status)}
                        </span>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(
                            order.payment_status
                          )}`}
                        >
                          {getPaymentStatusText(order.payment_status)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
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
                    <div>
                      <p className="text-sm text-gray-600">Payment Method</p>
                      <p className="font-medium">
                        {order.payment_method || "-"}
                      </p>
                    </div>
                  </div>

                  {order.items && order.items.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-900 mb-2">
                        Items:
                      </p>
                      <div className="space-y-1">
                        {order.items.slice(0, 3).map((item, index) => (
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
                        {order.items.length > 3 && (
                          <p className="text-sm text-gray-500">
                            +{order.items.length - 3} item lainnya
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>
                        Komisi:{" "}
                        <span className="font-medium">
                          {formatCurrency(order.commission)}
                        </span>
                      </span>
                      <span>
                        Vendor:{" "}
                        <span className="font-medium">
                          {formatCurrency(order.vendor_amount)}
                        </span>
                      </span>
                      {order.is_escrow && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                          Escrow {order.escrow_released ? "Released" : "Held"}
                        </span>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-1" />
                        Detail
                      </Button>
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

