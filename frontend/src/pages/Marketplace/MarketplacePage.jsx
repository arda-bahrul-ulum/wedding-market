import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useQuery } from "react-query";
import { Search, Filter, MapPin, Star, Heart } from "lucide-react";
import { marketplaceAPI } from "../../services/api";
import { formatCurrency, formatRating } from "../../utils/format";
import LoadingSpinner from "../../components/UI/LoadingSpinner";
import Button from "../../components/UI/Button";
import Card, { CardBody } from "../../components/UI/Card";
import Input from "../../components/UI/Input";

function MarketplacePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    search: searchParams.get("q") || "",
    category_id: searchParams.get("category") || "",
    city: searchParams.get("city") || "",
    province: searchParams.get("province") || "",
    min_price: searchParams.get("min_price") || "",
    max_price: searchParams.get("max_price") || "",
    sort_by: searchParams.get("sort_by") || "created_at",
    sort_order: searchParams.get("sort_order") || "desc",
    page: 1,
  });

  const { data: categoriesData } = useQuery(
    "categories",
    marketplaceAPI.getCategories
  );
  const { data: vendorsData, isLoading: vendorsLoading } = useQuery(
    ["vendors", filters],
    () => marketplaceAPI.getVendors(filters),
    { keepPreviousData: true }
  );

  const categories = categoriesData?.data || [];
  const vendors = vendorsData?.data?.vendors || [];
  const pagination = vendorsData?.data?.pagination || {};

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value, page: 1 };
    setFilters(newFilters);

    // Update URL params
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    setSearchParams(params);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    handleFilterChange("search", filters.search);
  };

  const handleSort = (sortBy) => {
    const sortOrder =
      filters.sort_by === sortBy && filters.sort_order === "desc"
        ? "asc"
        : "desc";
    handleFilterChange("sort_by", sortBy);
    handleFilterChange("sort_order", sortOrder);
  };

  const handlePageChange = (page) => {
    handleFilterChange("page", page);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-custom py-8">
          <div className="text-center">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Marketplace Jasa Pernikahan
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Temukan vendor pernikahan terbaik untuk hari istimewa Anda
            </p>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardBody className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Filter
                </h3>

                {/* Search */}
                <form onSubmit={handleSearch} className="mb-6">
                  <div className="relative">
                    <Input
                      placeholder="Cari vendor..."
                      value={filters.search}
                      onChange={(e) =>
                        setFilters({ ...filters, search: e.target.value })
                      }
                    />
                    <button
                      type="submit"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary-600"
                    >
                      <Search className="w-4 h-4" />
                    </button>
                  </div>
                </form>

                {/* Categories */}
                <div className="mb-6">
                  <label className="label">Kategori</label>
                  <select
                    className="input"
                    value={filters.category_id}
                    onChange={(e) =>
                      handleFilterChange("category_id", e.target.value)
                    }
                  >
                    <option value="">Semua Kategori</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Location */}
                <div className="mb-6">
                  <label className="label">Kota</label>
                  <Input
                    placeholder="Masukkan kota"
                    value={filters.city}
                    onChange={(e) => handleFilterChange("city", e.target.value)}
                  />
                </div>

                <div className="mb-6">
                  <label className="label">Provinsi</label>
                  <Input
                    placeholder="Masukkan provinsi"
                    value={filters.province}
                    onChange={(e) =>
                      handleFilterChange("province", e.target.value)
                    }
                  />
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <label className="label">Rentang Harga</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Min"
                      type="number"
                      value={filters.min_price}
                      onChange={(e) =>
                        handleFilterChange("min_price", e.target.value)
                      }
                    />
                    <Input
                      placeholder="Max"
                      type="number"
                      value={filters.max_price}
                      onChange={(e) =>
                        handleFilterChange("max_price", e.target.value)
                      }
                    />
                  </div>
                </div>

                {/* Clear Filters */}
                <Button
                  variant="outline"
                  onClick={() => {
                    setFilters({
                      search: "",
                      category_id: "",
                      city: "",
                      province: "",
                      min_price: "",
                      max_price: "",
                      sort_by: "created_at",
                      sort_order: "desc",
                      page: 1,
                    });
                    setSearchParams({});
                  }}
                  className="w-full"
                >
                  Reset Filter
                </Button>
              </CardBody>
            </Card>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {/* Sort and Results Count */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  {pagination.total || 0} vendor ditemukan
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Urutkan:</span>
                <select
                  className="input text-sm"
                  value={`${filters.sort_by}-${filters.sort_order}`}
                  onChange={(e) => {
                    const [sortBy, sortOrder] = e.target.value.split("-");
                    handleSort(sortBy);
                  }}
                >
                  <option value="created_at-desc">Terbaru</option>
                  <option value="created_at-asc">Terlama</option>
                  <option value="rating-desc">Rating Tertinggi</option>
                  <option value="rating-asc">Rating Terendah</option>
                  <option value="price-asc">Harga Terendah</option>
                  <option value="price-desc">Harga Tertinggi</option>
                </select>
              </div>
            </div>

            {/* Vendors Grid */}
            {vendorsLoading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : vendors.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Tidak ada vendor ditemukan
                </h3>
                <p className="text-gray-600 mb-4">
                  Coba ubah filter atau kata kunci pencarian Anda
                </p>
                <Button
                  onClick={() => {
                    setFilters({
                      search: "",
                      category_id: "",
                      city: "",
                      province: "",
                      min_price: "",
                      max_price: "",
                      sort_by: "created_at",
                      sort_order: "desc",
                      page: 1,
                    });
                    setSearchParams({});
                  }}
                >
                  Reset Filter
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {vendors.map((vendor) => (
                  <Link key={vendor.id} to={`/vendor/${vendor.id}`}>
                    <Card className="group hover:shadow-lg transition-shadow">
                      <div className="aspect-w-16 aspect-h-9">
                        <img
                          src="/api/placeholder/400/300"
                          alt={vendor.business_name}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                      </div>
                      <CardBody className="p-6">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1">
                            {vendor.business_name}
                          </h3>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              // Add to wishlist logic
                            }}
                            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Heart className="w-4 h-4" />
                          </button>
                        </div>

                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {vendor.description ||
                            "Vendor pernikahan profesional dengan pengalaman bertahun-tahun."}
                        </p>

                        <div className="flex items-center space-x-1 mb-3">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium text-gray-600">
                            {formatRating(vendor.average_rating || 4.8)}
                          </span>
                          <span className="text-sm text-gray-500">
                            ({vendor.total_reviews || 0} review)
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center text-gray-500">
                            <MapPin className="w-4 h-4 mr-1" />
                            <span>
                              {vendor.city}, {vendor.province}
                            </span>
                          </div>
                          <span className="font-medium text-primary-600">
                            Mulai dari {formatCurrency(2500000)}
                          </span>
                        </div>
                      </CardBody>
                    </Card>
                  </Link>
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
                      handlePageChange(pagination.current_page - 1)
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
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </Button>
                  ))}

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={
                      pagination.current_page === pagination.total_pages
                    }
                    onClick={() =>
                      handlePageChange(pagination.current_page + 1)
                    }
                  >
                    Next
                  </Button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MarketplacePage;

