import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Card, CardBody } from "../../components/UI/Card";
import Button from "../../components/UI/Button";
import Input from "../../components/UI/Input";
import Select from "../../components/UI/Select";
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

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, statusFilter, dateFilter]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/v1/admin/orders?page=${currentPage}&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();

      if (data.success) {
        setOrders(data.data.orders);
        setTotalPages(data.data.total_pages);
      } else {
        // Fallback data for testing
        const mockOrders = [
          {
            id: "ORD-001",
            total_amount: 2500000,
            status: "pending",
            created_at: "2024-01-15T10:30:00Z",
            payment_method: "bank_transfer",
            order_items: [
              { id: 1, name: "Wedding Photography Package" },
              { id: 2, name: "Videography Service" },
            ],
            customer: {
              name: "John Doe",
              email: "john.doe@example.com",
            },
            vendor: {
              business_name: "Elegant Photography",
              business_type: "photography",
            },
          },
          {
            id: "ORD-002",
            total_amount: 1800000,
            status: "confirmed",
            created_at: "2024-01-14T14:20:00Z",
            payment_method: "credit_card",
            order_items: [{ id: 3, name: "Wedding Decoration" }],
            customer: {
              name: "Jane Smith",
              email: "jane.smith@example.com",
            },
            vendor: {
              business_name: "Flower Garden",
              business_type: "florist",
            },
          },
          {
            id: "ORD-003",
            total_amount: 3200000,
            status: "completed",
            created_at: "2024-01-13T09:15:00Z",
            payment_method: "bank_transfer",
            order_items: [
              { id: 4, name: "Wedding Planning Service" },
              { id: 5, name: "Catering Package" },
            ],
            customer: {
              name: "Mike Johnson",
              email: "mike.johnson@example.com",
            },
            vendor: {
              business_name: "Wedding Planner Pro",
              business_type: "wedding_planner",
            },
          },
          {
            id: "ORD-004",
            total_amount: 1200000,
            status: "in_progress",
            created_at: "2024-01-12T16:45:00Z",
            payment_method: "e_wallet",
            order_items: [{ id: 6, name: "Makeup Artist Service" }],
            customer: {
              name: "Sarah Wilson",
              email: "sarah.wilson@example.com",
            },
            vendor: {
              business_name: "Beauty Studio",
              business_type: "beauty",
            },
          },
          {
            id: "ORD-005",
            total_amount: 950000,
            status: "cancelled",
            created_at: "2024-01-11T11:30:00Z",
            payment_method: "bank_transfer",
            order_items: [{ id: 7, name: "DJ Service" }],
            customer: {
              name: "David Brown",
              email: "david.brown@example.com",
            },
            vendor: {
              business_name: "Music Entertainment",
              business_type: "entertainment",
            },
          },
        ];
        setOrders(mockOrders);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
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
    try {
      let endpoint = "";
      let method = "PUT";
      let body = {};

      switch (action) {
        case "approve":
          endpoint = `/api/v1/admin/orders/${orderId}/status`;
          body = { status: "confirmed" };
          break;
        case "reject":
          endpoint = `/api/v1/admin/orders/${orderId}/status`;
          body = { status: "cancelled" };
          break;
        case "complete":
          endpoint = `/api/v1/admin/orders/${orderId}/status`;
          body = { status: "completed" };
          break;
        case "refund":
          endpoint = `/api/v1/admin/orders/${orderId}/refund`;
          body = { reason: "Admin refund" };
          break;
        default:
          return;
      }

      const response = await fetch(`/api/v1${endpoint}`, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        fetchOrders(); // Refresh the list
      }
    } catch (error) {
      console.error("Error performing order action:", error);
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
      case "confirmed":
        return "bg-blue-100 text-blue-800";
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
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />;
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
                Order Management
              </h1>
              <p className="text-gray-600 mt-1">
                Kelola semua pesanan dan transaksi
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
        {/* Filters */}
        <Card className="mb-6">
          <CardBody className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="sm:col-span-2 lg:col-span-1">
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
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Select
                  label="Status"
                  placeholder="All Status"
                  value={statusFilter}
                  onChange={(value) => setStatusFilter(value?.value || "all")}
                  options={[
                    { value: "all", label: "All Status" },
                    { value: "pending", label: "Pending" },
                    { value: "confirmed", label: "Confirmed" },
                    { value: "in_progress", label: "In Progress" },
                    { value: "completed", label: "Completed" },
                    { value: "cancelled", label: "Cancelled" },
                    { value: "refunded", label: "Refunded" },
                  ]}
                />
              </div>

              <div>
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

              <div className="flex items-end">
                <Button
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                    setDateFilter("all");
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Reset Filters
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Orders Table */}
        <Card>
          <CardBody className="p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vendor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center">
                              <ShoppingBag className="h-5 w-5 text-primary-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              #{order.id}
                            </div>
                            <div className="text-sm text-gray-500">
                              {order.order_items?.length || 0} items
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8">
                            <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                              <User className="h-4 w-4 text-gray-600" />
                            </div>
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {order.customer?.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {order.customer?.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8">
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                              <Store className="h-4 w-4 text-blue-600" />
                            </div>
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {order.vendor?.business_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {order.vendor?.business_type?.replace("_", " ")}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(order.total_amount)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.payment_method?.replace("_", " ")}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(
                            order.status
                          )}`}
                        >
                          {getStatusIcon(order.status)}
                          <span className="ml-1">
                            {order.status?.replace("_", " ")}
                          </span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(order.created_at)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowOrderModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                          {order.status === "pending" && (
                            <>
                              <button
                                onClick={() =>
                                  handleOrderAction(order.id, "approve")
                                }
                                className="text-green-600 hover:text-green-900"
                                title="Approve Order"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() =>
                                  handleOrderAction(order.id, "reject")
                                }
                                className="text-red-600 hover:text-red-900"
                                title="Reject Order"
                              >
                                <XCircle className="h-4 w-4" />
                              </button>
                            </>
                          )}

                          {order.status === "in_progress" && (
                            <button
                              onClick={() =>
                                handleOrderAction(order.id, "complete")
                              }
                              className="text-green-600 hover:text-green-900"
                              title="Mark as Completed"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                          )}

                          {(order.status === "completed" ||
                            order.status === "confirmed") && (
                            <button
                              onClick={() =>
                                handleOrderAction(order.id, "refund")
                              }
                              className="text-orange-600 hover:text-orange-900"
                              title="Process Refund"
                            >
                              <DollarSign className="h-4 w-4" />
                            </button>
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
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing page{" "}
                      <span className="font-medium">{currentPage}</span> of{" "}
                      <span className="font-medium">{totalPages}</span>
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <button
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          )
                        }
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Next
                      </button>
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
