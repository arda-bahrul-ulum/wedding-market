import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Card, CardBody } from "../../components/UI/Card";
import Button from "../../components/UI/Button";
import Input from "../../components/UI/Input";
import Select from "../../components/UI/Select";
import { adminAPI } from "../../services/api";
import {
  confirmDelete,
  confirmStatusChange,
  showSuccess,
  showError,
  showLoading,
  closeLoading,
} from "../../utils/sweetAlert";
import {
  Users,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  UserCheck,
  UserX,
  Mail,
  Phone,
  Calendar,
  LogOut,
} from "lucide-react";

function AdminUsersPage() {
  const { user, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [actionLoading, setActionLoading] = useState({});
  const [actionError, setActionError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, roleFilter, statusFilter]);

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  const closeModal = () => {
    setShowUserModal(false);
    setSelectedUser(null);
  };

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await adminAPI.getUsers({
        page: currentPage,
        limit: 10,
        role: roleFilter !== "all" ? roleFilter : "",
        search: searchTerm,
      });

      if (response.data && response.data.success) {
        setUsers(response.data.data.users);
        setTotalPages(response.data.data.pagination.total_pages);
      } else {
        // Fallback data untuk testing
        const fallbackUsers = [
          {
            id: 1,
            name: "John Doe",
            email: "john@example.com",
            phone: "081234567890",
            role: "customer",
            is_active: true,
            created_at: "2024-01-15T10:30:00Z",
            last_login_at: "2024-01-20T14:30:00Z",
          },
          {
            id: 2,
            name: "Jane Smith",
            email: "jane@example.com",
            phone: "081234567891",
            role: "vendor",
            is_active: true,
            created_at: "2024-01-10T09:15:00Z",
            last_login_at: "2024-01-19T16:45:00Z",
          },
          {
            id: 3,
            name: "Admin User",
            email: "admin@example.com",
            phone: "081234567892",
            role: "super_user",
            is_active: true,
            created_at: "2024-01-01T08:00:00Z",
            last_login_at: "2024-01-20T12:00:00Z",
          },
        ];
        setUsers(fallbackUsers);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      // Fallback data untuk testing
      const fallbackUsers = [
        {
          id: 1,
          name: "John Doe",
          email: "john@example.com",
          phone: "081234567890",
          role: "customer",
          is_active: true,
          created_at: "2024-01-15T10:30:00Z",
          last_login_at: "2024-01-20T14:30:00Z",
        },
        {
          id: 2,
          name: "Jane Smith",
          email: "jane@example.com",
          phone: "081234567891",
          role: "vendor",
          is_active: true,
          created_at: "2024-01-10T09:15:00Z",
          last_login_at: "2024-01-19T16:45:00Z",
        },
        {
          id: 3,
          name: "Admin User",
          email: "admin@example.com",
          phone: "081234567892",
          role: "super_user",
          is_active: true,
          created_at: "2024-01-01T08:00:00Z",
          last_login_at: "2024-01-20T12:00:00Z",
        },
      ];
      setUsers(fallbackUsers);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Role filter
    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((user) =>
        statusFilter === "active" ? user.is_active : !user.is_active
      );
    }

    setFilteredUsers(filtered);
  };

  const handleUserAction = async (userId, action) => {
    // Konfirmasi berdasarkan action
    let confirmed = false;

    if (action === "delete") {
      const result = await confirmDelete(
        "Konfirmasi Hapus User",
        "Apakah Anda yakin ingin menghapus user ini? Tindakan ini tidak dapat dibatalkan."
      );
      confirmed = result.isConfirmed;
    } else if (action === "activate" || action === "deactivate") {
      const user = users.find((u) => u.id === userId);
      const result = await confirmStatusChange(action, user?.name || "user");
      confirmed = result.isConfirmed;
    } else {
      confirmed = true; // Untuk action lain yang tidak perlu konfirmasi
    }

    if (!confirmed) return;

    // Set loading state
    setActionLoading((prev) => ({ ...prev, [`${userId}-${action}`]: true }));
    setActionError(null);

    // Show loading alert
    showLoading("Memproses...", "Mohon tunggu sebentar.");

    try {
      let response;

      switch (action) {
        case "activate":
          response = await adminAPI.updateUserStatus(userId, {
            is_active: true,
          });
          break;
        case "deactivate":
          response = await adminAPI.updateUserStatus(userId, {
            is_active: false,
          });
          break;
        case "delete":
          response = await adminAPI.deleteUser(userId);
          break;
        default:
          return;
      }

      if (response.data && response.data.success) {
        // Refresh the list
        await fetchUsers();

        // Close loading and show success
        closeLoading();

        const actionText =
          action === "activate"
            ? "diaktifkan"
            : action === "deactivate"
            ? "dinonaktifkan"
            : "dihapus";

        await showSuccess("Berhasil!", `User berhasil ${actionText}.`);
      } else {
        throw new Error(response.data?.message || `Gagal ${action} user`);
      }
    } catch (error) {
      console.error("Error performing user action:", error);
      setActionError(
        error.response?.data?.message || error.message || `Gagal ${action} user`
      );

      // Close loading and show error
      closeLoading();
      await showError(
        "Error!",
        error.response?.data?.message || error.message || `Gagal ${action} user`
      );
    } finally {
      // Clear loading state
      setActionLoading((prev) => ({ ...prev, [`${userId}-${action}`]: false }));
    }
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

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "super_user":
        return "bg-purple-100 text-purple-800";
      case "vendor":
        return "bg-blue-100 text-blue-800";
      case "customer":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
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
                User Management
              </h1>
              <p className="text-gray-600 mt-1">Kelola semua pengguna sistem</p>
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
                    placeholder="Cari nama atau email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Select
                  label="Role"
                  placeholder="All Roles"
                  value={roleFilter}
                  onChange={(value) => setRoleFilter(value?.value || "all")}
                  options={[
                    { value: "all", label: "All Roles" },
                    { value: "super_user", label: "Super User" },
                    { value: "vendor", label: "Vendor" },
                    { value: "customer", label: "Customer" },
                  ]}
                />
              </div>

              <div>
                <Select
                  label="Status"
                  placeholder="All Status"
                  value={statusFilter}
                  onChange={(value) => setStatusFilter(value?.value || "all")}
                  options={[
                    { value: "all", label: "All Status" },
                    { value: "active", label: "Active" },
                    { value: "inactive", label: "Inactive" },
                  ]}
                />
              </div>

              <div className="flex items-end">
                <Button
                  onClick={() => {
                    setSearchTerm("");
                    setRoleFilter("all");
                    setStatusFilter("all");
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

        {/* Error Message */}
        {actionError && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{actionError}</p>
                </div>
                <div className="mt-4">
                  <div className="-mx-2 -my-1.5 flex">
                    <button
                      type="button"
                      onClick={() => setActionError(null)}
                      className="bg-red-50 px-2 py-1.5 rounded-md text-sm font-medium text-red-800 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-50 focus:ring-red-600"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Table */}
        <Card>
          <CardBody className="p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Login
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                              <span className="text-sm font-medium text-primary-600">
                                {user.name?.charAt(0)?.toUpperCase() || "U"}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.name}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Mail className="h-3 w-3 mr-1" />
                              {user.email}
                            </div>
                            {user.phone && (
                              <div className="text-sm text-gray-500 flex items-center">
                                <Phone className="h-3 w-3 mr-1" />
                                {user.phone}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(
                            user.role
                          )}`}
                        >
                          {user.role?.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.is_active
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {user.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(user.created_at)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.last_login_at
                          ? formatDate(user.last_login_at)
                          : "Never"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setShowUserModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-all duration-200 hover:scale-110"
                            title="Lihat Detail"
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                          {user.is_active ? (
                            <button
                              onClick={() =>
                                handleUserAction(user.id, "deactivate")
                              }
                              disabled={actionLoading[`${user.id}-deactivate`]}
                              className={`text-yellow-600 hover:text-yellow-900 p-1 rounded hover:bg-yellow-50 transition-all duration-200 hover:scale-110 ${
                                actionLoading[`${user.id}-deactivate`]
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                              title="Nonaktifkan User"
                            >
                              {actionLoading[`${user.id}-deactivate`] ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600"></div>
                              ) : (
                                <UserX className="h-4 w-4" />
                              )}
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                handleUserAction(user.id, "activate")
                              }
                              disabled={actionLoading[`${user.id}-activate`]}
                              className={`text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 transition-all duration-200 hover:scale-110 ${
                                actionLoading[`${user.id}-activate`]
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                              title="Aktifkan User"
                            >
                              {actionLoading[`${user.id}-activate`] ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                              ) : (
                                <UserCheck className="h-4 w-4" />
                              )}
                            </button>
                          )}

                          {user.role !== "super_user" && (
                            <button
                              onClick={() =>
                                handleUserAction(user.id, "delete")
                              }
                              disabled={actionLoading[`${user.id}-delete`]}
                              className={`text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-all duration-200 hover:scale-110 ${
                                actionLoading[`${user.id}-delete`]
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                              title="Hapus User"
                            >
                              {actionLoading[`${user.id}-delete`] ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
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

      {/* User Detail Modal */}
      {showUserModal && selectedUser && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 animate-fadeIn"
          onClick={closeModal}
        >
          <div
            className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white animate-slideDown"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Detail User
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
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 h-16 w-16">
                    <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-xl font-medium text-primary-600">
                        {selectedUser.name?.charAt(0)?.toUpperCase() || "U"}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">
                      {selectedUser.name}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {selectedUser.email}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Role
                    </label>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(
                        selectedUser.role
                      )}`}
                    >
                      {selectedUser.role?.replace("_", " ")}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        selectedUser.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {selectedUser.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                {selectedUser.phone && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Phone
                    </label>
                    <p className="text-sm text-gray-900">
                      {selectedUser.phone}
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Joined
                  </label>
                  <p className="text-sm text-gray-900">
                    {formatDate(selectedUser.created_at)}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Last Login
                  </label>
                  <p className="text-sm text-gray-900">
                    {selectedUser.last_login_at
                      ? formatDate(selectedUser.last_login_at)
                      : "Never"}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200"
                >
                  Close
                </button>
                {selectedUser.role !== "super_user" && (
                  <button
                    onClick={() => {
                      closeModal();
                      handleUserAction(
                        selectedUser.id,
                        selectedUser.is_active ? "deactivate" : "activate"
                      );
                    }}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      selectedUser.is_active
                        ? "text-yellow-700 bg-yellow-100 hover:bg-yellow-200"
                        : "text-green-700 bg-green-100 hover:bg-green-200"
                    }`}
                  >
                    {selectedUser.is_active ? "Deactivate" : "Activate"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminUsersPage;
