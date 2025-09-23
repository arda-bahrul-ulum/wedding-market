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
import BottomNavigation from "../../components/Layout/BottomNavigation";
import { adminAPI } from "../../services/api";
import {
  confirmDelete,
  confirmAction,
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
  ArrowRight,
  TrendingUp,
  Shield,
  X,
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
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    role: "",
    is_active: true,
  });
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

  const openEditModal = (user) => {
    setSelectedUser(user);
    setEditFormData({
      name: user.name || "",
      email: user.email || "",
      role: user.role || "",
      is_active: user.is_active !== undefined ? user.is_active : true,
    });
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setSelectedUser(null);
    setEditFormData({
      name: "",
      email: "",
      role: "",
      is_active: true,
    });
  };

  const handleEditFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    // Validasi form
    if (!editFormData.name || !editFormData.email || !editFormData.role) {
      showError("Error!", "Mohon lengkapi semua field yang diperlukan.");
      return;
    }

    // Validasi email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editFormData.email)) {
      showError("Error!", "Format email tidak valid.");
      return;
    }

    // Konfirmasi sebelum update
    const confirmResult = await confirmAction(
      "Konfirmasi Update User",
      `Apakah Anda yakin ingin mengupdate user "${editFormData.name}"?`
    );

    if (!confirmResult.isConfirmed) {
      return;
    }

    try {
      showLoading("Mengupdate user...", "Mohon tunggu sebentar...");

      const response = await adminAPI.updateUser(selectedUser.id, editFormData);

      if (response.data && response.data.success) {
        // Refresh the list
        await fetchUsers();

        // Close loading and show success
        closeLoading();

        await showSuccess("Berhasil!", `User berhasil diupdate.`);

        // Close modal after success
        closeEditModal();
      } else {
        closeLoading();
        showError(response.data?.message || "Gagal mengupdate user");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      closeLoading();

      // Show more specific error message
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Terjadi kesalahan saat mengupdate user";

      showError("Error!", errorMessage);
    }
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-700">
            Loading users...
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
                  User Management
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Kelola semua pengguna sistem
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
                    placeholder="Cari nama atau email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full h-10"
                  />
                </div>
              </div>

              <div className="lg:col-span-1">
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

              <div className="lg:col-span-1">
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

              <div className="lg:col-span-1 flex items-end">
                <Button
                  onClick={() => {
                    setSearchTerm("");
                    setRoleFilter("all");
                    setStatusFilter("all");
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
        <Card hover>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-primary-600" />
              Daftar Pengguna
            </CardTitle>
            <CardDescription>
              {filteredUsers.length} pengguna ditemukan
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
                      User
                    </th>
                    <th className="px-3 sm:px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[120px]">
                      Role
                    </th>
                    <th className="px-3 sm:px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[120px]">
                      Status
                    </th>
                    <th className="px-3 sm:px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[140px]">
                      Joined
                    </th>
                    <th className="px-3 sm:px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[140px]">
                      Last Login
                    </th>
                    <th className="px-3 sm:px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[120px]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white/50 backdrop-blur-sm divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-white/80 transition-all duration-200"
                    >
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10">
                            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg">
                              <Users className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                            </div>
                          </div>
                          <div className="ml-2 sm:ml-4">
                            <div className="text-xs sm:text-sm font-semibold text-gray-900">
                              {user.name}
                            </div>
                            <div className="text-xs sm:text-sm text-gray-500 flex items-center">
                              <Mail className="h-3 w-3 mr-1" />
                              {user.email}
                            </div>
                            {user.phone && (
                              <div className="text-xs sm:text-sm text-gray-500 flex items-center">
                                <Phone className="h-3 w-3 mr-1" />
                                {user.phone}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getRoleBadgeColor(
                            user.role
                          )}`}
                        >
                          {user.role?.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
                            user.is_active
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {user.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1 text-primary-600" />
                          {formatDate(user.created_at)}
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                        {user.last_login_at
                          ? formatDate(user.last_login_at)
                          : "Never"}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-right text-xs sm:text-sm font-medium">
                        <div className="flex items-center justify-end space-x-1 sm:space-x-2">
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setShowUserModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900 p-1"
                            title="Lihat Detail"
                          >
                            <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                          </button>

                          <button
                            onClick={() => openEditModal(user)}
                            className="text-indigo-600 hover:text-indigo-900 p-1"
                            title="Edit User"
                          >
                            <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                          </button>

                          {user.is_active ? (
                            <button
                              onClick={() =>
                                handleUserAction(user.id, "deactivate")
                              }
                              disabled={actionLoading[`${user.id}-deactivate`]}
                              className={`text-yellow-600 hover:text-yellow-900 p-1 ${
                                actionLoading[`${user.id}-deactivate`]
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                              title="Nonaktifkan User"
                            >
                              {actionLoading[`${user.id}-deactivate`] ? (
                                <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-yellow-600"></div>
                              ) : (
                                <UserX className="h-3 w-3 sm:h-4 sm:w-4" />
                              )}
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                handleUserAction(user.id, "activate")
                              }
                              disabled={actionLoading[`${user.id}-activate`]}
                              className={`text-green-600 hover:text-green-900 p-1 ${
                                actionLoading[`${user.id}-activate`]
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                              title="Aktifkan User"
                            >
                              {actionLoading[`${user.id}-activate`] ? (
                                <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-green-600"></div>
                              ) : (
                                <UserCheck className="h-3 w-3 sm:h-4 sm:w-4" />
                              )}
                            </button>
                          )}

                          {user.role !== "super_user" && (
                            <button
                              onClick={() =>
                                handleUserAction(user.id, "delete")
                              }
                              disabled={actionLoading[`${user.id}-delete`]}
                              className={`text-red-600 hover:text-red-900 p-1 ${
                                actionLoading[`${user.id}-delete`]
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                              title="Hapus User"
                            >
                              {actionLoading[`${user.id}-delete`] ? (
                                <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-red-600"></div>
                              ) : (
                                <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
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

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 animate-fadeIn"
          onClick={closeEditModal}
        >
          <div
            className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white animate-slideDown"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Edit User</h3>
                <button
                  onClick={closeEditModal}
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
                <div>
                  <label className="label">Nama</label>
                  <Input
                    type="text"
                    name="name"
                    value={editFormData.name}
                    onChange={handleEditFormChange}
                    placeholder="Masukkan nama user"
                  />
                </div>

                <div>
                  <label className="label">Email</label>
                  <Input
                    type="email"
                    name="email"
                    value={editFormData.email}
                    onChange={handleEditFormChange}
                    placeholder="Masukkan email user"
                  />
                </div>

                <div>
                  <label className="label">Role</label>
                  <Select
                    name="role"
                    value={editFormData.role}
                    onChange={handleEditFormChange}
                    options={[
                      { value: "customer", label: "Customer" },
                      { value: "vendor", label: "Vendor" },
                      { value: "admin", label: "Admin" },
                      { value: "super_user", label: "Super User" },
                    ]}
                    placeholder="Pilih role"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={editFormData.is_active}
                    onChange={handleEditFormChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    User Aktif
                  </label>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={closeEditModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200"
                >
                  Batal
                </button>
                <button
                  onClick={handleUpdateUser}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md transition-colors duration-200"
                >
                  Update User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}

export default AdminUsersPage;
