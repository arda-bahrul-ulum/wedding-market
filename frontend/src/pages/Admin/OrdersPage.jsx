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
import Input from "../../components/UI/Input";
import Select from "../../components/UI/Select";
import { adminAPI } from "../../services/api";
import {
  confirmDelete,
  confirmAction,
  showSuccess,
  showError,
  showLoading,
  closeLoading,
} from "../../utils/sweetAlert";
import {
  ShoppingBag,
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  DollarSign,
  Calendar,
  User,
  Store,
  Package,
  LogOut,
  ArrowRight,
  TrendingUp,
  Shield,
  X,
} from "lucide-react";

function AdminOrdersPage() {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [currentPage]);

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  const closeModal = () => {
    setShowOrderModal(false);
    setSelectedOrder(null);
  };

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, statusFilter, dateFilter]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await adminAPI.getOrders({
        page: currentPage,
        limit: 10,
      });

      if (response.data.success) {
        setOrders(response.data.data.orders || []);
        setTotalPages(response.data.data.pagination?.total_pages || 1);
      } else {
        showError(response.data.message || "Failed to fetch orders");
        setOrders([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      showError(
        "Failed to fetch orders. Please check your connection and try again."
      );
      setOrders([]);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = orders;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.id.toString().includes(searchTerm) ||
          order.customer?.name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          order.vendor?.business_name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    // Date filter
    if (dateFilter !== "all") {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const thisWeek = new Date(today);
      thisWeek.setDate(thisWeek.getDate() - 7);
      const thisMonth = new Date(today);
      thisMonth.setMonth(thisMonth.getMonth() - 1);

      filtered = filtered.filter((order) => {
        const orderDate = new Date(order.created_at);
        switch (dateFilter) {
          case "today":
            return orderDate >= today;
          case "yesterday":
            return orderDate >= yesterday && orderDate < today;
          case "this_week":
            return orderDate >= thisWeek;
          case "this_month":
            return orderDate >= thisMonth;
          default:
            return true;
        }
      });
    }

    setFilteredOrders(filtered);
  };

  const handleOrderAction = async (orderId, action) => {
    // Cari order yang akan diubah
    const order = orders.find((o) => o.id === orderId);
    if (!order) {
      showError("Order tidak ditemukan");
      return;
    }

    // Konfirmasi sebelum melakukan action
    let confirmMessage = "";
    let confirmTitle = "";

    switch (action) {
      case "approve":
        confirmTitle = "✅ Konfirmasi Persetujuan Order";
        confirmMessage = `Apakah Anda yakin ingin MENYETUJUI order #${
          order.order_number || order.id
        }?\n\n📋 Detail Order:\n• Customer: ${
          order.customer?.name || "N/A"
        }\n• Vendor: ${
          order.vendor?.business_name || "N/A"
        }\n• Total: ${formatCurrency(order.total_amount)}\n• Status: ${
          order.status
        }\n\n🔄 Perubahan:\n• Status akan berubah dari "${
          order.status
        }" menjadi "accepted"\n• Vendor dapat mulai mengerjakan order\n• Customer akan mendapat notifikasi persetujuan`;
        break;
      case "reject":
        confirmTitle = "❌ Konfirmasi Penolakan Order";
        confirmMessage = `Apakah Anda yakin ingin MENOLAK order #${
          order.order_number || order.id
        }?\n\n📋 Detail Order:\n• Customer: ${
          order.customer?.name || "N/A"
        }\n• Vendor: ${
          order.vendor?.business_name || "N/A"
        }\n• Total: ${formatCurrency(order.total_amount)}\n• Status: ${
          order.status
        }\n\n🔄 Perubahan:\n• Status akan berubah dari "${
          order.status
        }" menjadi "rejected"\n• Order akan dibatalkan\n• Customer akan mendapat notifikasi penolakan\n• Dana akan dikembalikan kepada customer\n\n⚠️ Tindakan ini tidak dapat dibatalkan!`;
        break;
      case "start_progress":
        confirmTitle = "🚀 Konfirmasi Mulai Pengerjaan";
        confirmMessage = `Apakah Anda yakin ingin memulai pengerjaan order #${
          order.order_number || order.id
        }?\n\n📋 Detail Order:\n• Customer: ${
          order.customer?.name || "N/A"
        }\n• Vendor: ${
          order.vendor?.business_name || "N/A"
        }\n• Total: ${formatCurrency(order.total_amount)}\n• Status: ${
          order.status
        }\n\n🔄 Perubahan:\n• Status akan berubah dari "${
          order.status
        }" menjadi "in_progress"\n• Vendor sedang mengerjakan order\n• Customer akan mendapat notifikasi bahwa order sedang dikerjakan`;
        break;
      case "complete":
        confirmTitle = "🎉 Konfirmasi Penyelesaian Order";
        confirmMessage = `Apakah Anda yakin ingin MENANDAI SELESAI order #${
          order.order_number || order.id
        }?\n\n📋 Detail Order:\n• Customer: ${
          order.customer?.name || "N/A"
        }\n• Vendor: ${
          order.vendor?.business_name || "N/A"
        }\n• Total: ${formatCurrency(order.total_amount)}\n• Status: ${
          order.status
        }\n\n🔄 Perubahan:\n• Status akan berubah dari "${
          order.status
        }" menjadi "completed"\n• Order dianggap telah selesai\n• Vendor dapat menerima pembayaran (${formatCurrency(
          order.vendor_amount
        )})\n• Customer dapat memberikan review\n• Commission platform: ${formatCurrency(
          order.commission
        )}`;
        break;
      case "cancel":
        confirmTitle = "🚫 Konfirmasi Pembatalan Order";
        confirmMessage = `Apakah Anda yakin ingin MEMBATALKAN order #${
          order.order_number || order.id
        }?\n\n📋 Detail Order:\n• Customer: ${
          order.customer?.name || "N/A"
        }\n• Vendor: ${
          order.vendor?.business_name || "N/A"
        }\n• Total: ${formatCurrency(order.total_amount)}\n• Status: ${
          order.status
        }\n\n🔄 Perubahan:\n• Status akan berubah dari "${
          order.status
        }" menjadi "cancelled"\n• Order akan dibatalkan\n• Dana akan dikembalikan kepada customer\n• Vendor tidak akan menerima pembayaran\n\n⚠️ Tindakan ini tidak dapat dibatalkan!`;
        break;
      case "refund":
        confirmTitle = "💰 Konfirmasi Refund Order";
        confirmMessage = `⚠️ PERINGATAN: Apakah Anda yakin ingin memproses REFUND untuk order #${
          order.order_number || order.id
        }?\n\n📋 Detail Order:\n• Customer: ${
          order.customer?.name || "N/A"
        }\n• Vendor: ${
          order.vendor?.business_name || "N/A"
        }\n• Total: ${formatCurrency(order.total_amount)}\n• Status: ${
          order.status
        }\n• Commission: ${formatCurrency(
          order.commission
        )}\n• Vendor Amount: ${formatCurrency(
          order.vendor_amount
        )}\n\n🔄 Perubahan:\n• Status akan berubah dari "${
          order.status
        }" menjadi "refunded"\n• Dana ${formatCurrency(
          order.total_amount
        )} akan dikembalikan kepada customer\n• Vendor tidak akan menerima pembayaran\n• Commission platform akan dikembalikan\n\n⚠️ Tindakan ini tidak dapat dibatalkan!\n\nPastikan Anda telah memverifikasi alasan refund sebelum melanjutkan.`;
        break;
      case "reopen":
        confirmTitle = "🔄 Konfirmasi Buka Kembali Order";
        confirmMessage = `Apakah Anda yakin ingin MEMBUKA KEMBALI order #${
          order.order_number || order.id
        }?\n\n📋 Detail Order:\n• Customer: ${
          order.customer?.name || "N/A"
        }\n• Vendor: ${
          order.vendor?.business_name || "N/A"
        }\n• Total: ${formatCurrency(order.total_amount)}\n• Status: ${
          order.status
        }\n\n🔄 Perubahan:\n• Status akan berubah dari "${
          order.status
        }" menjadi "pending"\n• Order akan kembali menunggu persetujuan\n• Customer dan vendor akan mendapat notifikasi\n• Order dapat diproses ulang`;
        break;
      default:
        return;
    }

    // Tampilkan konfirmasi
    const confirmed = await confirmAction(confirmTitle, confirmMessage);
    if (!confirmed) {
      return; // User membatalkan
    }

    // Konfirmasi tambahan untuk action refund
    if (action === "refund") {
      const secondConfirm = await confirmAction(
        "Konfirmasi Final Refund",
        "Apakah Anda benar-benar yakin ingin memproses refund?\n\nIni adalah konfirmasi terakhir sebelum dana dikembalikan kepada customer."
      );
      if (!secondConfirm) {
        return; // User membatalkan pada konfirmasi kedua
      }
    }

    // Tampilkan loading
    showLoading("Memproses permintaan...");

    try {
      let response;

      switch (action) {
        case "approve":
          response = await adminAPI.updateOrderStatus(orderId, {
            status: "accepted",
          });
          break;
        case "reject":
          response = await adminAPI.updateOrderStatus(orderId, {
            status: "rejected",
          });
          break;
        case "start_progress":
          response = await adminAPI.updateOrderStatus(orderId, {
            status: "in_progress",
          });
          break;
        case "complete":
          response = await adminAPI.updateOrderStatus(orderId, {
            status: "completed",
          });
          break;
        case "cancel":
          response = await adminAPI.updateOrderStatus(orderId, {
            status: "cancelled",
          });
          break;
        case "refund":
          response = await adminAPI.processRefund(orderId, {
            reason: "Admin refund",
          });
          break;
        case "reopen":
          response = await adminAPI.updateOrderStatus(orderId, {
            status: "pending",
          });
          break;
        default:
          return;
      }

      if (response.data.success) {
        showSuccess(response.data.message || "Order updated successfully");
        fetchOrders(); // Refresh the list
      } else {
        showError(response.data.message || "Failed to update order");
      }
    } catch (error) {
      console.error("Error performing order action:", error);

      // Handle axios error response
      if (error.response) {
        const errorMessage =
          error.response.data?.message ||
          `Failed to update order (${error.response.status})`;
        showError(errorMessage);
      } else if (error.request) {
        showError("Network error. Please check your connection and try again.");
      } else {
        showError("An unexpected error occurred. Please try again.");
      }
    } finally {
      // Tutup loading indicator
      closeLoading();
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

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-blue-100 text-blue-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "in_progress":
        return "bg-purple-100 text-purple-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "refunded":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "accepted":
        return <CheckCircle className="h-4 w-4" />;
      case "rejected":
        return <XCircle className="h-4 w-4" />;
      case "in_progress":
        return <Package className="h-4 w-4" />;
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
      case "refunded":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-700">
            Loading orders...
          </p>
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
                  Order Management
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Kelola semua pesanan dan transaksi
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
        {/* Filters */}
        <Card hover className="mb-6">
          <CardBody>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Cari order ID, customer, atau vendor..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full h-10"
                  />
                </div>
              </div>

              <div className="lg:col-span-1">
                <Select
                  label="Status"
                  placeholder="All Status"
                  value={statusFilter}
                  onChange={(value) => setStatusFilter(value?.value || "all")}
                  options={[
                    { value: "all", label: "All Status" },
                    { value: "pending", label: "Pending" },
                    { value: "accepted", label: "Accepted" },
                    { value: "rejected", label: "Rejected" },
                    { value: "in_progress", label: "In Progress" },
                    { value: "completed", label: "Completed" },
                    { value: "cancelled", label: "Cancelled" },
                    { value: "refunded", label: "Refunded" },
                  ]}
                />
              </div>

              <div className="lg:col-span-1">
                <Select
                  label="Date Range"
                  placeholder="All Time"
                  value={dateFilter}
                  onChange={(value) => setDateFilter(value?.value || "all")}
                  options={[
                    { value: "all", label: "All Time" },
                    { value: "today", label: "Today" },
                    { value: "yesterday", label: "Yesterday" },
                    { value: "this_week", label: "This Week" },
                    { value: "this_month", label: "This Month" },
                  ]}
                />
              </div>

              <div className="lg:col-span-1 flex items-end">
                <Button
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                    setDateFilter("all");
                  }}
                  variant="outline"
                  className="w-full"
                  icon={<X className="w-4 h-4" />}
                >
                  Reset Filters
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Order Detail Modal */}
        {showOrderModal && selectedOrder && (
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 animate-fadeIn"
            onClick={closeModal}
          >
            <div
              className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white animate-slideDown"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Order Details - #
                    {selectedOrder.order_number || `ORD-${selectedOrder.id}`}
                  </h3>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200 hover:bg-gray-100 rounded-full p-1"
                  >
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Order Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Status
                      </label>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(
                          selectedOrder.status
                        )}`}
                      >
                        {getStatusIcon(selectedOrder.status)}
                        <span className="ml-1">
                          {selectedOrder.status?.replace("_", " ")}
                        </span>
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Total Amount
                      </label>
                      <p className="text-sm text-gray-900">
                        {formatCurrency(selectedOrder.total_amount)}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Payment Method
                      </label>
                      <p className="text-sm text-gray-900">
                        {selectedOrder.payment_method?.replace("_", " ")}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Created At
                      </label>
                      <p className="text-sm text-gray-900">
                        {formatDate(selectedOrder.created_at)}
                      </p>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-2">
                      Customer Information
                    </h4>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <p className="text-sm font-medium text-gray-900">
                        {selectedOrder.customer?.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {selectedOrder.customer?.email}
                      </p>
                    </div>
                  </div>

                  {/* Vendor Info */}
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-2">
                      Vendor Information
                    </h4>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <p className="text-sm font-medium text-gray-900">
                        {selectedOrder.vendor?.business_name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {selectedOrder.vendor?.business_type?.replace("_", " ")}
                      </p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-2">
                      Order Items
                    </h4>
                    <div className="space-y-2">
                      {selectedOrder.order_items?.map((item, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded-md">
                          <p className="text-sm font-medium text-gray-900">
                            {item.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Orders Table */}
        <Card hover>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-primary-600" />
              Daftar Pesanan
            </CardTitle>
            <CardDescription>
              {filteredOrders.length} pesanan ditemukan
            </CardDescription>
          </CardHeader>
          <CardBody className="p-0">
            <div className="overflow-x-auto">
              <table
                className="min-w-full divide-y divide-gray-200"
                style={{ minWidth: "1200px" }}
              >
                <thead className="bg-gradient-to-r from-primary-50 to-blue-50">
                  <tr>
                    <th className="px-3 sm:px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[200px]">
                      Order
                    </th>
                    <th className="px-3 sm:px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[180px]">
                      Customer
                    </th>
                    <th className="px-3 sm:px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[180px]">
                      Vendor
                    </th>
                    <th className="px-3 sm:px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[150px]">
                      Amount
                    </th>
                    <th className="px-3 sm:px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[120px]">
                      Status
                    </th>
                    <th className="px-3 sm:px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[140px]">
                      Date
                    </th>
                    <th className="px-3 sm:px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[120px]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white/50 backdrop-blur-sm divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-white/80 transition-all duration-200"
                    >
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10">
                            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg">
                              <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                            </div>
                          </div>
                          <div className="ml-2 sm:ml-4">
                            <div className="text-xs sm:text-sm font-semibold text-gray-900">
                              #{order.order_number || `ORD-${order.id}`}
                            </div>
                            <div className="text-xs sm:text-sm text-gray-500">
                              {order.order_items?.length || 0} items
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-6 w-6 sm:h-8 sm:w-8">
                            <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-xl bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center shadow-lg">
                              <User className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                            </div>
                          </div>
                          <div className="ml-2 sm:ml-3">
                            <div className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                              {order.customer?.name}
                            </div>
                            <div className="text-xs sm:text-sm text-gray-500 truncate">
                              {order.customer?.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-6 w-6 sm:h-8 sm:w-8">
                            <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                              <Store className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                            </div>
                          </div>
                          <div className="ml-2 sm:ml-3">
                            <div className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                              {order.vendor?.business_name}
                            </div>
                            <div className="text-xs sm:text-sm text-gray-500 truncate">
                              {order.vendor?.business_type?.replace("_", " ")}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        <div className="text-xs sm:text-sm font-semibold text-gray-900">
                          {formatCurrency(order.total_amount)}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-500">
                          {order.payment_method?.replace("_", " ")}
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadgeColor(
                            order.status
                          )}`}
                        >
                          {getStatusIcon(order.status)}
                          <span className="ml-1">
                            {order.status?.replace("_", " ")}
                          </span>
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1 text-primary-600" />
                          {formatDate(order.created_at)}
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-right text-xs sm:text-sm font-medium">
                        <div className="flex items-center justify-end space-x-1 sm:space-x-2">
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowOrderModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900 p-1"
                            title="View Details"
                          >
                            <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                          </button>

                          {/* Action buttons berdasarkan status order */}
                          {order.status === "pending" && (
                            <>
                              <button
                                onClick={() =>
                                  handleOrderAction(order.id, "approve")
                                }
                                className="text-green-600 hover:text-green-900 p-1"
                                title="Approve Order"
                              >
                                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                              </button>
                              <button
                                onClick={() =>
                                  handleOrderAction(order.id, "reject")
                                }
                                className="text-red-600 hover:text-red-900 p-1"
                                title="Reject Order"
                              >
                                <XCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                              </button>
                              <button
                                onClick={() =>
                                  handleOrderAction(order.id, "cancel")
                                }
                                className="text-gray-600 hover:text-gray-900 p-1"
                                title="Cancel Order"
                              >
                                <XCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                              </button>
                            </>
                          )}

                          {order.status === "accepted" && (
                            <>
                              <button
                                onClick={() =>
                                  handleOrderAction(order.id, "start_progress")
                                }
                                className="text-blue-600 hover:text-blue-900 p-1"
                                title="Start Progress"
                              >
                                <Package className="h-3 w-3 sm:h-4 sm:w-4" />
                              </button>
                              <button
                                onClick={() =>
                                  handleOrderAction(order.id, "cancel")
                                }
                                className="text-gray-600 hover:text-gray-900 p-1"
                                title="Cancel Order"
                              >
                                <XCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                              </button>
                              <button
                                onClick={() =>
                                  handleOrderAction(order.id, "refund")
                                }
                                className="text-orange-600 hover:text-orange-900 p-1"
                                title="Process Refund"
                              >
                                <DollarSign className="h-3 w-3 sm:h-4 sm:w-4" />
                              </button>
                            </>
                          )}

                          {order.status === "in_progress" && (
                            <>
                              <button
                                onClick={() =>
                                  handleOrderAction(order.id, "complete")
                                }
                                className="text-green-600 hover:text-green-900 p-1"
                                title="Mark as Completed"
                              >
                                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                              </button>
                              <button
                                onClick={() =>
                                  handleOrderAction(order.id, "cancel")
                                }
                                className="text-gray-600 hover:text-gray-900 p-1"
                                title="Cancel Order"
                              >
                                <XCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                              </button>
                              <button
                                onClick={() =>
                                  handleOrderAction(order.id, "refund")
                                }
                                className="text-orange-600 hover:text-orange-900 p-1"
                                title="Process Refund"
                              >
                                <DollarSign className="h-3 w-3 sm:h-4 sm:w-4" />
                              </button>
                            </>
                          )}

                          {order.status === "completed" && (
                            <>
                              <button
                                onClick={() =>
                                  handleOrderAction(order.id, "refund")
                                }
                                className="text-orange-600 hover:text-orange-900 p-1"
                                title="Process Refund"
                              >
                                <DollarSign className="h-3 w-3 sm:h-4 sm:w-4" />
                              </button>
                              <button
                                onClick={() =>
                                  handleOrderAction(order.id, "reopen")
                                }
                                className="text-purple-600 hover:text-purple-900 p-1"
                                title="Reopen Order"
                              >
                                <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                              </button>
                            </>
                          )}

                          {order.status === "rejected" && (
                            <>
                              <button
                                onClick={() =>
                                  handleOrderAction(order.id, "reopen")
                                }
                                className="text-purple-600 hover:text-purple-900 p-1"
                                title="Reopen Order"
                              >
                                <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                              </button>
                            </>
                          )}

                          {order.status === "cancelled" && (
                            <>
                              <button
                                onClick={() =>
                                  handleOrderAction(order.id, "reopen")
                                }
                                className="text-purple-600 hover:text-purple-900 p-1"
                                title="Reopen Order"
                              >
                                <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                              </button>
                            </>
                          )}

                          {order.status === "refunded" && (
                            <>
                              <button
                                onClick={() =>
                                  handleOrderAction(order.id, "reopen")
                                }
                                className="text-purple-600 hover:text-purple-900 p-1"
                                title="Reopen Order"
                              >
                                <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-white/80 backdrop-blur-sm px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <Button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    variant="outline"
                    size="sm"
                    icon={<ArrowRight className="w-4 h-4" />}
                    className="rotate-180"
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    variant="outline"
                    size="sm"
                    icon={<ArrowRight className="w-4 h-4" />}
                  >
                    Next
                  </Button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing page{" "}
                      <span className="font-semibold text-primary-600">
                        {currentPage}
                      </span>{" "}
                      of{" "}
                      <span className="font-semibold text-primary-600">
                        {totalPages}
                      </span>
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-xl shadow-sm -space-x-px">
                      <Button
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                        variant="outline"
                        size="sm"
                        icon={<ArrowRight className="w-4 h-4" />}
                        className="rotate-180 rounded-r-none"
                      >
                        Previous
                      </Button>
                      <Button
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          )
                        }
                        disabled={currentPage === totalPages}
                        variant="outline"
                        size="sm"
                        icon={<ArrowRight className="w-4 h-4" />}
                        className="rounded-l-none"
                      >
                        Next
                      </Button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default AdminOrdersPage;
