import { useState } from "react";
import { useQuery } from "react-query";
import { vendorAPI, marketplaceAPI } from "../../services/api";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Star,
} from "lucide-react";
import { formatCurrency, formatDate } from "../../utils/format";
import LoadingSpinner from "../../components/UI/LoadingSpinner";
import Card, { CardBody, CardHeader } from "../../components/UI/Card";
import Button from "../../components/UI/Button";
import Input from "../../components/UI/Input";

function ServicesPage() {
  const [filters, setFilters] = useState({
    search: "",
    category_id: "",
    page: 1,
  });

  const { data: categoriesData, isLoading: categoriesLoading } = useQuery(
    "categories",
    marketplaceAPI.getCategories
  );
  const { data: servicesData, isLoading } = useQuery(
    ["vendor-services", filters],
    () => vendorAPI.getServices(filters)
  );

  const categories = categoriesData?.data || [];
  const services = servicesData?.data?.services || [];
  const pagination = servicesData?.data?.pagination || {};

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters({ ...filters, search: filters.search, page: 1 });
  };

  const handleToggleStatus = (serviceId, currentStatus) => {
    // Implement toggle status logic
    console.log("Toggle status:", serviceId, currentStatus);
  };

  const handleDelete = (serviceId) => {
    if (confirm("Apakah Anda yakin ingin menghapus jasa ini?")) {
      // Implement delete logic
      console.log("Delete service:", serviceId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Kelola Jasa
              </h1>
              <p className="text-gray-600">
                Kelola semua jasa yang Anda tawarkan
              </p>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Jasa Baru
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardBody className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <Input
                    placeholder="Cari jasa..."
                    value={filters.search}
                    onChange={(e) =>
                      setFilters({ ...filters, search: e.target.value })
                    }
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                </div>
              </form>

              <select
                className="input"
                value={filters.category_id}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    category_id: e.target.value,
                    page: 1,
                  })
                }
              >
                <option value="">Semua Kategori</option>
                {Array.isArray(categories) &&
                  categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
              </select>

              <Button variant="outline" className="w-full md:w-auto">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Services List */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : services.length === 0 ? (
          <Card>
            <CardBody className="text-center py-12">
              <Plus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Belum ada jasa
              </h3>
              <p className="text-gray-600 mb-4">
                Mulai tambahkan jasa pertama Anda
              </p>
              <Button>Tambah Jasa Baru</Button>
            </CardBody>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Card
                key={service.id}
                className="group hover:shadow-lg transition-shadow"
              >
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src="/api/placeholder/400/300"
                    alt={service.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                </div>
                <CardBody className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                      {service.name}
                    </h3>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() =>
                          handleToggleStatus(service.id, service.is_active)
                        }
                        className={`p-1 rounded ${
                          service.is_active
                            ? "text-green-600 hover:bg-green-100"
                            : "text-gray-400 hover:bg-gray-100"
                        }`}
                      >
                        {service.is_active ? (
                          <Eye className="w-4 h-4" />
                        ) : (
                          <EyeOff className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {service.description || "Tidak ada deskripsi"}
                  </p>

                  <div className="flex items-center space-x-1 mb-3">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-gray-600">
                      4.8
                    </span>
                    <span className="text-sm text-gray-500">(12 review)</span>
                  </div>

                  <div className="flex items-center justify-between text-sm mb-4">
                    <span className="text-gray-500">
                      {service.category?.name}
                    </span>
                    <span className="font-semibold text-primary-600">
                      {formatCurrency(service.price)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        service.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {service.is_active ? "Aktif" : "Nonaktif"}
                    </span>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDelete(service.id)}
                      >
                        <Trash2 className="w-4 h-4" />
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

export default ServicesPage;
