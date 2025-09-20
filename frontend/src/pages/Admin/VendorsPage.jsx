import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Card, CardBody } from "../../components/UI/Card";
import Button from "../../components/UI/Button";
import Input from "../../components/UI/Input";
import Select from "../../components/UI/Select";
import {
  confirmDelete,
  confirmStatusChange,
  showSuccess,
  showError,
  showLoading,
  closeLoading,
} from "../../utils/sweetAlert";
import {
  Store,
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Star,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Award,
  AlertCircle,
  LogOut,
} from "lucide-react";

function AdminVendorsPage() {
  const { user, logout } = useAuth();
  const [vendors, setVendors] = useState([]);
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [verificationFilter, setVerificationFilter] = useState("all");
  const [businessTypeFilter, setBusinessTypeFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [showVendorModal, setShowVendorModal] = useState(false);

  useEffect(() => {
    fetchVendors();
  }, [currentPage]);

  useEffect(() => {
    filterVendors();
  }, [
    vendors,
    searchTerm,
    statusFilter,
    verificationFilter,
    businessTypeFilter,
  ]);

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  const fetchVendors = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/v1/admin/vendors?page=${currentPage}&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();

      if (data.success) {
        setVendors(data.data.vendors);
        setTotalPages(data.data.total_pages);
      } else {
        // Fallback data untuk testing
        const fallbackVendors = [
          {
            id: 1,
            business_name: "Wedding Organizer Pro",
            business_type: "wedding_organizer",
            is_active: true,
            is_verified: true,
            subscription_plan: "premium",
            city: "Jakarta",
            province: "DKI Jakarta",
            address: "Jl. Sudirman No. 123",
            created_at: "2024-01-15T10:30:00Z",
            user: {
              name: "John Doe",
              email: "john@weddingpro.com",
              phone: "081234567890",
            },
          },
          {
            id: 2,
            business_name: "Venue Elegant",
            business_type: "venue",
            is_active: true,
            is_verified: false,
            subscription_plan: "free",
            city: "Bandung",
            province: "Jawa Barat",
            address: "Jl. Dago No. 456",
            created_at: "2024-01-10T09:15:00Z",
            user: {
              name: "Jane Smith",
              email: "jane@venueelegant.com",
              phone: "081234567891",
            },
          },
          {
            id: 3,
            business_name: "Photo Studio",
            business_type: "photographer",
            is_active: false,
            is_verified: true,
            subscription_plan: "enterprise",
            city: "Surabaya",
            province: "Jawa Timur",
            address: "Jl. Tunjungan No. 789",
            created_at: "2024-01-05T14:20:00Z",
            user: {
              name: "Mike Johnson",
              email: "mike@photostudio.com",
              phone: "081234567892",
            },
          },
        ];
        setVendors(fallbackVendors);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Error fetching vendors:", error);
      // Fallback data untuk testing
      const fallbackVendors = [
        {
          id: 1,
          business_name: "Wedding Organizer Pro",
          business_type: "wedding_organizer",
          is_active: true,
          is_verified: true,
          subscription_plan: "premium",
          city: "Jakarta",
          province: "DKI Jakarta",
          address: "Jl. Sudirman No. 123",
          created_at: "2024-01-15T10:30:00Z",
          user: {
            name: "John Doe",
            email: "john@weddingpro.com",
            phone: "081234567890",
          },
        },
        {
          id: 2,
          business_name: "Venue Elegant",
          business_type: "venue",
          is_active: true,
          is_verified: false,
          subscription_plan: "free",
          city: "Bandung",
          province: "Jawa Barat",
          address: "Jl. Dago No. 456",
          created_at: "2024-01-10T09:15:00Z",
          user: {
            name: "Jane Smith",
            email: "jane@venueelegant.com",
            phone: "081234567891",
          },
        },
        {
          id: 3,
          business_name: "Photo Studio",
          business_type: "photographer",
          is_active: false,
          is_verified: true,
          subscription_plan: "enterprise",
          city: "Surabaya",
          province: "Jawa Timur",
          address: "Jl. Tunjungan No. 789",
          created_at: "2024-01-05T14:20:00Z",
          user: {
            name: "Mike Johnson",
            email: "mike@photostudio.com",
            phone: "081234567892",
          },
        },
      ];
      setVendors(fallbackVendors);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  };

  const filterVendors = () => {
    let filtered = vendors;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (vendor) =>
          vendor.business_name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          vendor.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vendor.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((vendor) =>
        statusFilter === "active" ? vendor.is_active : !vendor.is_active
      );
    }

    // Verification filter
    if (verificationFilter !== "all") {
      filtered = filtered.filter((vendor) =>
        verificationFilter === "verified"
          ? vendor.is_verified
          : !vendor.is_verified
      );
    }

    // Business type filter
    if (businessTypeFilter !== "all") {
      filtered = filtered.filter(
        (vendor) => vendor.business_type === businessTypeFilter
      );
    }

    setFilteredVendors(filtered);
  };

  const handleVendorAction = async (vendorId, action) => {
    try {
      let endpoint = "";
      let method = "PUT";
      let body = {};

      switch (action) {
        case "verify":
          endpoint = `/api/v1/admin/vendors/${vendorId}/status`;
          body = { is_verified: true };
          break;
        case "unverify":
          endpoint = `/api/v1/admin/vendors/${vendorId}/status`;
          body = { is_verified: false };
          break;
        case "activate":
          endpoint = `/api/v1/admin/vendors/${vendorId}/status`;
          body = { is_active: true };
          break;
        case "deactivate":
          endpoint = `/api/v1/admin/vendors/${vendorId}/status`;
          body = { is_active: false };
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
        fetchVendors(); // Refresh the list
      }
    } catch (error) {
      console.error("Error performing vendor action:", error);
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

  const getBusinessTypeBadgeColor = (type) => {
    switch (type) {
      case "wedding_organizer":
        return "bg-purple-100 text-purple-800";
      case "venue":
        return "bg-blue-100 text-blue-800";
      case "photographer":
        return "bg-green-100 text-green-800";
      case "makeup_artist":
        return "bg-pink-100 text-pink-800";
      case "catering":
        return "bg-orange-100 text-orange-800";
      case "decoration":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getSubscriptionBadgeColor = (plan) => {
    switch (plan) {
      case "premium":
        return "bg-gold-100 text-gold-800";
      case "enterprise":
        return "bg-purple-100 text-purple-800";
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
                Vendor Management
              </h1>
              <p className="text-gray-600 mt-1">
                Kelola semua vendor dan verifikasi
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="sm:col-span-2 lg:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Cari vendor..."
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
                    { value: "active", label: "Active" },
                    { value: "inactive", label: "Inactive" },
                  ]}
                />
              </div>

              <div>
                <Select
                  label="Verification"
                  placeholder="All"
                  value={verificationFilter}
                  onChange={(value) =>
                    setVerificationFilter(value?.value || "all")
                  }
                  options={[
                    { value: "all", label: "All" },
                    { value: "verified", label: "Verified" },
                    { value: "unverified", label: "Unverified" },
                  ]}
                />
              </div>

              <div>
                <Select
                  label="Business Type"
                  placeholder="All Types"
                  value={businessTypeFilter}
                  onChange={(value) =>
                    setBusinessTypeFilter(value?.value || "all")
                  }
                  options={[
                    { value: "all", label: "All Types" },
                    { value: "wedding_organizer", label: "Wedding Organizer" },
                    { value: "venue", label: "Venue" },
                    { value: "photographer", label: "Photographer" },
                    { value: "makeup_artist", label: "Makeup Artist" },
                    { value: "catering", label: "Catering" },
                    { value: "decoration", label: "Decoration" },
                  ]}
                />
              </div>

              <div className="flex items-end">
                <Button
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                    setVerificationFilter("all");
                    setBusinessTypeFilter("all");
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

        {/* Vendors Table */}
        <Card>
          <CardBody className="p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vendor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Business Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subscription
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredVendors.map((vendor) => (
                    <tr key={vendor.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            <div className="h-12 w-12 rounded-lg bg-primary-100 flex items-center justify-center">
                              <Store className="h-6 w-6 text-primary-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {vendor.business_name}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Mail className="h-3 w-3 mr-1" />
                              {vendor.user?.email}
                            </div>
                            {vendor.user?.phone && (
                              <div className="text-sm text-gray-500 flex items-center">
                                <Phone className="h-3 w-3 mr-1" />
                                {vendor.user.phone}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getBusinessTypeBadgeColor(
                            vendor.business_type
                          )}`}
                        >
                          {vendor.business_type?.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col space-y-1">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              vendor.is_active
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {vendor.is_active ? "Active" : "Inactive"}
                          </span>
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              vendor.is_verified
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {vendor.is_verified ? "Verified" : "Pending"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSubscriptionBadgeColor(
                            vendor.subscription_plan
                          )}`}
                        >
                          {vendor.subscription_plan?.toUpperCase() || "FREE"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {vendor.city}, {vendor.province}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {vendor.address}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(vendor.created_at)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => {
                              setSelectedVendor(vendor);
                              setShowVendorModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                          {!vendor.is_verified && (
                            <button
                              onClick={() =>
                                handleVendorAction(vendor.id, "verify")
                              }
                              className="text-green-600 hover:text-green-900"
                              title="Verify Vendor"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                          )}

                          {vendor.is_verified && (
                            <button
                              onClick={() =>
                                handleVendorAction(vendor.id, "unverify")
                              }
                              className="text-yellow-600 hover:text-yellow-900"
                              title="Unverify Vendor"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          )}

                          {vendor.is_active ? (
                            <button
                              onClick={() =>
                                handleVendorAction(vendor.id, "deactivate")
                              }
                              className="text-red-600 hover:text-red-900"
                              title="Deactivate Vendor"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                handleVendorAction(vendor.id, "activate")
                              }
                              className="text-green-600 hover:text-green-900"
                              title="Activate Vendor"
                            >
                              <CheckCircle className="h-4 w-4" />
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

export default AdminVendorsPage;
