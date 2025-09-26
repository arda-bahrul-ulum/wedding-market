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
  Tag,
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
  Plus,
  RefreshCw,
  CheckCircle,
  XCircle,
} from "lucide-react";

function CategoryManagementPage() {
  const { user, logout } = useAuth();
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: "",
    description: "",
    icon: "",
    color: "#1976d2",
    is_active: true,
  });
  const [actionLoading, setActionLoading] = useState({});
  const [actionError, setActionError] = useState(null);
  const [stats, setStats] = useState({
    totalCategories: 0,
    activeCategories: 0,
    inactiveCategories: 0,
  });

  useEffect(() => {
    fetchCategories();
  }, [currentPage]);

  useEffect(() => {
    filterCategories();
  }, [categories, searchTerm, statusFilter]);

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  const closeModal = () => {
    setShowCategoryModal(false);
    setSelectedCategory(null);
  };

  const openEditModal = (category) => {
    setSelectedCategory(category);
    setEditFormData({
      name: category.name || "",
      description: category.description || "",
      icon: category.icon || "",
      color: category.color || "#1976d2",
      is_active: category.is_active !== undefined ? category.is_active : true,
    });
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setSelectedCategory(null);
    setEditFormData({
      name: "",
      description: "",
      icon: "",
      color: "#1976d2",
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

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await adminAPI.getCategories({
        page: currentPage,
        limit: 10,
        is_active: statusFilter !== "all" ? statusFilter : "",
        name: searchTerm,
      });

      if (response.data && response.data.success) {
        setCategories(response.data.data.categories);
        setTotalPages(response.data.data.pagination.total_pages);
        setStats({
          totalCategories: response.data.data.pagination.total,
          activeCategories: response.data.data.categories.filter(
            (cat) => cat.is_active
          ).length,
          inactiveCategories: response.data.data.categories.filter(
            (cat) => !cat.is_active
          ).length,
        });
      } else {
        // Fallback data untuk testing
        const fallbackCategories = [
          {
            id: 1,
            name: "Dekorasi",
            description: "Kategori untuk jasa dekorasi pernikahan",
            icon: "🎨",
            color: "#1976d2",
            is_active: true,
            created_at: "2024-01-15T10:30:00Z",
          },
          {
            id: 2,
            name: "Fotografi",
            description: "Kategori untuk jasa fotografi pernikahan",
            icon: "📸",
            color: "#4caf50",
            is_active: true,
            created_at: "2024-01-10T09:15:00Z",
          },
          {
            id: 3,
            name: "Catering",
            description: "Kategori untuk jasa catering pernikahan",
            icon: "🍽️",
            color: "#ff9800",
            is_active: false,
            created_at: "2024-01-01T08:00:00Z",
          },
        ];
        setCategories(fallbackCategories);
        setTotalPages(1);
        setStats({
          totalCategories: 3,
          activeCategories: 2,
          inactiveCategories: 1,
        });
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      // Fallback data untuk testing
      const fallbackCategories = [
        {
          id: 1,
          name: "Dekorasi",
          description: "Kategori untuk jasa dekorasi pernikahan",
          icon: "🎨",
          color: "#1976d2",
          is_active: true,
          created_at: "2024-01-15T10:30:00Z",
        },
        {
          id: 2,
          name: "Fotografi",
          description: "Kategori untuk jasa fotografi pernikahan",
          icon: "📸",
          color: "#4caf50",
          is_active: true,
          created_at: "2024-01-10T09:15:00Z",
        },
        {
          id: 3,
          name: "Catering",
          description: "Kategori untuk jasa catering pernikahan",
          icon: "🍽️",
          color: "#ff9800",
          is_active: false,
          created_at: "2024-01-01T08:00:00Z",
        },
      ];
      setCategories(fallbackCategories);
      setTotalPages(1);
      setStats({
        totalCategories: 3,
        activeCategories: 2,
        inactiveCategories: 1,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterCategories = () => {
    let filtered = categories;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (category) =>
          category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (category.description &&
            category.description
              .toLowerCase()
              .includes(searchTerm.toLowerCase()))
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((category) =>
        statusFilter === "active" ? category.is_active : !category.is_active
      );
    }

    setFilteredCategories(filtered);
  };

  const handleUpdateCategory = async () => {
    if (!selectedCategory) return;

    // Validasi form
    if (!editFormData.name) {
      showError("Error!", "Mohon lengkapi nama kategori.");
      return;
    }

    // Konfirmasi sebelum update
    const confirmResult = await confirmAction(
      "Konfirmasi Update Kategori",
      `Apakah Anda yakin ingin mengupdate kategori "${editFormData.name}"?`
    );

    if (!confirmResult.isConfirmed) {
      return;
    }

    try {
      showLoading("Mengupdate kategori...", "Mohon tunggu sebentar...");

      const response = await adminAPI.updateCategory(
        selectedCategory.id,
        editFormData
      );

      if (response.data && response.data.success) {
        // Refresh the list
        await fetchCategories();

        // Close loading and show success
        closeLoading();

        await showSuccess("Berhasil!", `Kategori berhasil diupdate.`);

        // Close modal after success
        closeEditModal();
      } else {
        closeLoading();
        showError(response.data?.message || "Gagal mengupdate kategori");
      }
    } catch (error) {
      console.error("Error updating category:", error);
      closeLoading();

      // Show more specific error message
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Terjadi kesalahan saat mengupdate kategori";

      showError("Error!", errorMessage);
    }
  };

  const handleCategoryAction = async (categoryId, action) => {
    // Konfirmasi berdasarkan action
    let confirmed = false;

    if (action === "delete") {
      const result = await confirmDelete(
        "Konfirmasi Hapus Kategori",
        "Apakah Anda yakin ingin menghapus kategori ini? Tindakan ini tidak dapat dibatalkan."
      );
      confirmed = result.isConfirmed;
    } else if (action === "activate" || action === "deactivate") {
      const category = categories.find((c) => c.id === categoryId);
      const result = await confirmStatusChange(
        action,
        category?.name || "kategori"
      );
      confirmed = result.isConfirmed;
    } else {
      confirmed = true; // Untuk action lain yang tidak perlu konfirmasi
    }

    if (!confirmed) return;

    // Set loading state
    setActionLoading((prev) => ({
      ...prev,
      [`${categoryId}-${action}`]: true,
    }));
    setActionError(null);

    // Show loading alert
    showLoading("Memproses...", "Mohon tunggu sebentar.");

    try {
      let response;

      switch (action) {
        case "activate":
          response = await adminAPI.activateCategory(categoryId);
          break;
        case "deactivate":
          response = await adminAPI.deactivateCategory(categoryId);
          break;
        case "delete":
          response = await adminAPI.deleteCategory(categoryId);
          break;
        default:
          return;
      }

      if (response.data && response.data.success) {
        // Refresh the list
        await fetchCategories();

        // Close loading and show success
        closeLoading();

        const actionText =
          action === "activate"
            ? "diaktifkan"
            : action === "deactivate"
            ? "dinonaktifkan"
            : "dihapus";

        await showSuccess("Berhasil!", `Kategori berhasil ${actionText}.`);
      } else {
        throw new Error(response.data?.message || `Gagal ${action} kategori`);
      }
    } catch (error) {
      console.error("Error performing category action:", error);
      setActionError(
        error.response?.data?.message ||
          error.message ||
          `Gagal ${action} kategori`
      );

      // Close loading and show error
      closeLoading();
      await showError(
        "Error!",
        error.response?.data?.message ||
          error.message ||
          `Gagal ${action} kategori`
      );
    } finally {
      // Clear loading state
      setActionLoading((prev) => ({
        ...prev,
        [`${categoryId}-${action}`]: false,
      }));
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

  const getStatusBadgeColor = (isActive) => {
    return isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-700">
            Loading categories...
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
                  Master Kategori
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Kelola semua kategori jasa pernikahan
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
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Kategori
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.totalCategories}
                  </p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Tag className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Kategori Aktif
                  </p>
                  <p className="text-3xl font-bold text-green-600">
                    {stats.activeCategories}
                  </p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Kategori Nonaktif
                  </p>
                  <p className="text-3xl font-bold text-red-600">
                    {stats.inactiveCategories}
                  </p>
                </div>
                <div className="h-12 w-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Halaman</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {currentPage} / {totalPages}
                  </p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
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
                    placeholder="Cari nama kategori..."
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
                    { value: "active", label: "Active" },
                    { value: "inactive", label: "Inactive" },
                  ]}
                />
              </div>

              <div className="lg:col-span-2 flex items-end space-x-2">
                <Button
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                  }}
                  variant="outline"
                  className="flex-1"
                  icon={<X className="w-4 h-4" />}
                >
                  Reset Filters
                </Button>
                <Button
                  onClick={() => fetchCategories()}
                  variant="outline"
                  icon={<RefreshCw className="w-4 h-4" />}
                >
                  Refresh
                </Button>
                <Button
                  onClick={() => openEditModal(null)}
                  className="flex-1"
                  icon={<Plus className="w-4 h-4" />}
                >
                  Tambah Kategori
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

        {/* Categories Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-primary-600" />
              Daftar Kategori
            </CardTitle>
            <CardDescription>
              {filteredCategories.length} kategori ditemukan
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
                      Kategori
                    </th>
                    <th className="px-3 sm:px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[120px]">
                      Icon
                    </th>
                    <th className="px-3 sm:px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[120px]">
                      Warna
                    </th>
                    <th className="px-3 sm:px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[120px]">
                      Status
                    </th>
                    <th className="px-3 sm:px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[140px]">
                      Dibuat
                    </th>
                    <th className="px-3 sm:px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[120px]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white/50 backdrop-blur-sm divide-y divide-gray-200">
                  {filteredCategories.map((category) => (
                    <tr
                      key={category.id}
                      className="hover:bg-white/80 transition-all duration-200"
                    >
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10">
                            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg">
                              <Tag className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                            </div>
                          </div>
                          <div className="ml-2 sm:ml-4">
                            <div className="text-xs sm:text-sm font-semibold text-gray-900">
                              {category.name}
                            </div>
                            <div className="text-xs sm:text-sm text-gray-500">
                              {category.description || "Tidak ada deskripsi"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        <div className="text-2xl">{category.icon || "📁"}</div>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div
                            className="w-6 h-6 rounded border border-gray-300"
                            style={{
                              backgroundColor: category.color || "#1976d2",
                            }}
                          ></div>
                          <span className="ml-2 text-xs text-gray-500">
                            {category.color || "#1976d2"}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadgeColor(
                            category.is_active
                          )}`}
                        >
                          {category.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1 text-primary-600" />
                          {formatDate(category.created_at)}
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-right text-xs sm:text-sm font-medium">
                        <div className="flex items-center justify-end space-x-1 sm:space-x-2">
                          <button
                            onClick={() => {
                              setSelectedCategory(category);
                              setShowCategoryModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900 p-1"
                            title="Lihat Detail"
                          >
                            <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                          </button>

                          <button
                            onClick={() => openEditModal(category)}
                            className="text-indigo-600 hover:text-indigo-900 p-1"
                            title="Edit Kategori"
                          >
                            <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                          </button>

                          {category.is_active ? (
                            <button
                              onClick={() =>
                                handleCategoryAction(category.id, "deactivate")
                              }
                              disabled={
                                actionLoading[`${category.id}-deactivate`]
                              }
                              className={`text-yellow-600 hover:text-yellow-900 p-1 ${
                                actionLoading[`${category.id}-deactivate`]
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                              title="Nonaktifkan Kategori"
                            >
                              {actionLoading[`${category.id}-deactivate`] ? (
                                <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-yellow-600"></div>
                              ) : (
                                <UserX className="h-3 w-3 sm:h-4 sm:w-4" />
                              )}
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                handleCategoryAction(category.id, "activate")
                              }
                              disabled={
                                actionLoading[`${category.id}-activate`]
                              }
                              className={`text-green-600 hover:text-green-900 p-1 ${
                                actionLoading[`${category.id}-activate`]
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                              title="Aktifkan Kategori"
                            >
                              {actionLoading[`${category.id}-activate`] ? (
                                <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-green-600"></div>
                              ) : (
                                <UserCheck className="h-3 w-3 sm:h-4 sm:w-4" />
                              )}
                            </button>
                          )}

                          <button
                            onClick={() =>
                              handleCategoryAction(category.id, "delete")
                            }
                            disabled={actionLoading[`${category.id}-delete`]}
                            className={`text-red-600 hover:text-red-900 p-1 ${
                              actionLoading[`${category.id}-delete`]
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                            title="Hapus Kategori"
                          >
                            {actionLoading[`${category.id}-delete`] ? (
                              <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-red-600"></div>
                            ) : (
                              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                            )}
                          </button>
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

      {/* Category Detail Modal */}
      {showCategoryModal && selectedCategory && (
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
                  Detail Kategori
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
                      <span className="text-2xl">
                        {selectedCategory.icon || "📁"}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">
                      {selectedCategory.name}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {selectedCategory.description || "Tidak ada deskripsi"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Warna
                    </label>
                    <div className="flex items-center mt-1">
                      <div
                        className="w-6 h-6 rounded border border-gray-300"
                        style={{
                          backgroundColor: selectedCategory.color || "#1976d2",
                        }}
                      ></div>
                      <span className="ml-2 text-sm text-gray-600">
                        {selectedCategory.color || "#1976d2"}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(
                        selectedCategory.is_active
                      )}`}
                    >
                      {selectedCategory.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Dibuat
                  </label>
                  <p className="text-sm text-gray-900">
                    {formatDate(selectedCategory.created_at)}
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
                <button
                  onClick={() => {
                    closeModal();
                    handleCategoryAction(
                      selectedCategory.id,
                      selectedCategory.is_active ? "deactivate" : "activate"
                    );
                  }}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    selectedCategory.is_active
                      ? "text-yellow-700 bg-yellow-100 hover:bg-yellow-200"
                      : "text-green-700 bg-green-100 hover:bg-green-200"
                  }`}
                >
                  {selectedCategory.is_active ? "Deactivate" : "Activate"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {showEditModal && selectedCategory && (
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
                <h3 className="text-lg font-medium text-gray-900">
                  Edit Kategori
                </h3>
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
                  <label className="label">Nama Kategori</label>
                  <Input
                    type="text"
                    name="name"
                    value={editFormData.name}
                    onChange={handleEditFormChange}
                    placeholder="Masukkan nama kategori"
                  />
                </div>

                <div>
                  <label className="label">Deskripsi</label>
                  <textarea
                    name="description"
                    value={editFormData.description}
                    onChange={handleEditFormChange}
                    placeholder="Masukkan deskripsi kategori"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Icon</label>
                    <Input
                      type="text"
                      name="icon"
                      value={editFormData.icon}
                      onChange={handleEditFormChange}
                      placeholder="🎉"
                    />
                  </div>
                  <div>
                    <label className="label">Warna</label>
                    <Input
                      type="color"
                      name="color"
                      value={editFormData.color}
                      onChange={handleEditFormChange}
                    />
                  </div>
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
                    Kategori Aktif
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
                  onClick={handleUpdateCategory}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md transition-colors duration-200"
                >
                  Update Kategori
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

export default CategoryManagementPage;
