import { useState } from "react";
import { useQuery } from "react-query";
import { adminAPI } from "../../services/api";
import {
  Search,
  Filter,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  Building,
  MapPin,
  Star,
  Phone,
  Globe,
} from "lucide-react";
import { formatDate } from "../../utils/format";
import LoadingSpinner from "../../components/UI/LoadingSpinner";
import Card, { CardBody } from "../../components/UI/Card";
import Button from "../../components/UI/Button";
import Input from "../../components/UI/Input";

function VendorsPage() {
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    page: 1,
  });

  const { data: vendorsData, isLoading } = useQuery(
    ["admin-vendors", filters],
    () => adminAPI.getVendors(filters)
  );

  const vendors = vendorsData?.data?.vendors || [];
  const pagination = vendorsData?.data?.pagination || {};

  const getStatusColor = (isActive, isVerified) => {
    if (isVerified && isActive) return "bg-green-100 text-green-800";
    if (isActive) return "bg-blue-100 text-blue-800";
    return "bg-red-100 text-red-800";
  };

  const getStatusText = (isActive, isVerified) => {
    if (isVerified && isActive) return "Aktif & Verified";
    if (isActive) return "Aktif";
    return "Nonaktif";
  };

  const getBusinessTypeText = (type) => {
    switch (type) {
      case "personal":
        return "Personal";
      case "company":
        return "Perusahaan";
      case "wedding_organizer":
        return "Wedding Organizer";
      default:
        return type;
    }
  };

  const handleToggleStatus = (vendorId, field, currentValue) => {
    // Implement toggle status logic
    console.log("Toggle status:", vendorId, field, currentValue);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Kelola Vendors
          </h1>
          <p className="text-gray-600">
            Kelola semua vendor yang terdaftar di platform
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardBody className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Input
                  placeholder="Cari vendor..."
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
                <option value="active">Aktif</option>
                <option value="inactive">Nonaktif</option>
                <option value="verified">Verified</option>
                <option value="unverified">Belum Verified</option>
              </select>

              <Button variant="outline" className="w-full md:w-auto">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Vendors List */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : vendors.length === 0 ? (
          <Card>
            <CardBody className="text-center py-12">
              <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Tidak ada vendor
              </h3>
              <p className="text-gray-600">
                Vendor akan muncul di sini ketika ada yang mendaftar
              </p>
            </CardBody>
          </Card>
        ) : (
          <div className="space-y-4">
            {vendors.map((vendor) => (
              <Card
                key={vendor.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardBody className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center">
                        <Building className="w-8 h-8 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {vendor.business_name}
                        </h3>
                        <p className="text-gray-600">{vendor.user?.name}</p>
                        <p className="text-sm text-gray-500">
                          {vendor.user?.email}
                        </p>
                        <p className="text-sm text-primary-600">
                          {getBusinessTypeText(vendor.business_type)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          vendor.is_active,
                          vendor.is_verified
                        )}`}
                      >
                        {getStatusText(vendor.is_active, vendor.is_verified)}
                      </span>
                      <p className="text-sm text-gray-500 mt-1">
                        Bergabung {formatDate(vendor.created_at)}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>
                        {vendor.city}, {vendor.province}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="w-4 h-4 mr-2" />
                      <span>
                        {vendor.whatsapp || vendor.user?.phone || "Tidak ada"}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Star className="w-4 h-4 mr-2" />
                      <span>Rating: 4.8 (156 review)</span>
                    </div>
                  </div>

                  {vendor.description && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {vendor.description}
                      </p>
                    </div>
                  )}

                  {vendor.website && (
                    <div className="mb-4">
                      <a
                        href={vendor.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                      >
                        <Globe className="w-4 h-4 mr-2" />
                        {vendor.website}
                      </a>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-600">
                        Plan:{" "}
                        <span className="font-medium">
                          {vendor.subscription_plan || "Free"}
                        </span>
                      </span>
                      <span className="text-sm text-gray-600">
                        Services: <span className="font-medium">8</span>
                      </span>
                      <span className="text-sm text-gray-600">
                        Orders: <span className="font-medium">24</span>
                      </span>
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-1" />
                        Detail
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant={vendor.is_verified ? "danger" : "primary"}
                        onClick={() =>
                          handleToggleStatus(
                            vendor.id,
                            "is_verified",
                            vendor.is_verified
                          )
                        }
                      >
                        {vendor.is_verified ? (
                          <>
                            <XCircle className="w-4 h-4 mr-1" />
                            Unverify
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Verify
                          </>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant={vendor.is_active ? "danger" : "primary"}
                        onClick={() =>
                          handleToggleStatus(
                            vendor.id,
                            "is_active",
                            vendor.is_active
                          )
                        }
                      >
                        {vendor.is_active ? "Deactivate" : "Activate"}
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

export default VendorsPage;

