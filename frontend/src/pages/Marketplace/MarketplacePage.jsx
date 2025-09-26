import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useQuery } from "react-query";
import {
  Search,
  Filter,
  MapPin,
  Star,
  Heart,
  ArrowRight,
  TrendingUp,
  Award,
  Users,
  Clock,
  ChevronDown,
  X,
} from "lucide-react";
import { marketplaceAPI } from "../../services/api";
import { formatCurrency, formatRating } from "../../utils/format";
import {
  provinces,
  getCitiesByProvince,
} from "../../utils/indonesia-locations";
import LoadingSpinner from "../../components/UI/LoadingSpinner";
import Button from "../../components/UI/Button";
import Card, {
  CardBody,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/UI/Card";
import Input from "../../components/UI/Input";
import Select from "../../components/UI/Select";

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

  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useQuery("categories", marketplaceAPI.getCategories);

  const { data: vendorsData, isLoading: vendorsLoading } = useQuery(
    ["vendors", filters],
    () => marketplaceAPI.getVendors(filters),
    { keepPreviousData: true }
  );

  const categories = Array.isArray(categoriesData?.data)
    ? categoriesData.data
    : [];

  const vendors = Array.isArray(vendorsData?.data?.vendors)
    ? vendorsData.data.vendors
    : [];

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
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 hero-pattern opacity-5"></div>
        <div className="container-custom py-8 relative z-10">
          <div className="text-center">
            {/* Trust Indicators */}
            <div className="flex items-center justify-center space-x-8">
              <div className="flex items-center space-x-2 text-gray-600">
                <Users className="w-5 h-5 text-primary-600" />
                <span className="font-semibold">1000+ Vendor</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Award className="w-5 h-5 text-success-600" />
                <span className="font-semibold">Terpercaya</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <TrendingUp className="w-5 h-5 text-accent-600" />
                <span className="font-semibold">Rating Tinggi</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Filter Pencarian</CardTitle>
                <CardDescription>Temukan vendor yang tepat</CardDescription>
              </CardHeader>
              <CardBody className="space-y-6">
                {/* Search */}
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <Input
                      placeholder="Cari vendor..."
                      value={filters.search}
                      onChange={(e) =>
                        setFilters({ ...filters, search: e.target.value })
                      }
                      icon={<Search className="w-4 h-4" />}
                    />
                  </div>
                </form>

                {/* Categories */}
                <div>
                  <label className="label">Kategori</label>
                  {categoriesLoading ? (
                    <div className="flex items-center justify-center py-3">
                      <LoadingSpinner size="sm" />
                      <span className="ml-2 text-sm text-gray-500">
                        Memuat kategori...
                      </span>
                    </div>
                  ) : categoriesError ? (
                    <div className="text-red-500 text-sm py-2">
                      Error memuat kategori
                    </div>
                  ) : (
                    <Select
                      options={[
                        { value: "", label: "Semua Kategori" },
                        ...(Array.isArray(categories)
                          ? categories.map((category) => ({
                              value: category.id,
                              label: category.name,
                            }))
                          : []),
                      ]}
                      value={filters.category_id}
                      onChange={(option) =>
                        handleFilterChange("category_id", option?.value || "")
                      }
                      placeholder="Pilih kategori"
                    />
                  )}
                </div>

                {/* Location */}
                <div>
                  <label className="label">Lokasi</label>
                  <div className="space-y-3">
                    <Select
                      options={[
                        { value: "", label: "Semua Provinsi" },
                        ...provinces,
                      ]}
                      value={filters.province}
                      onChange={(option) => {
                        handleFilterChange("province", option?.value || "");
                        handleFilterChange("city", ""); // Reset city when province changes
                      }}
                      placeholder="Pilih Provinsi"
                    />
                    <Select
                      options={[
                        { value: "", label: "Semua Kota" },
                        ...getCitiesByProvince(filters.province).map(
                          (city) => ({
                            value: city,
                            label: city,
                          })
                        ),
                      ]}
                      value={filters.city}
                      onChange={(option) =>
                        handleFilterChange("city", option?.value || "")
                      }
                      placeholder="Pilih Kota"
                      disabled={!filters.province}
                    />
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <label className="label">Rentang Harga</label>
                  <div className="grid grid-cols-2 gap-3">
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

                {/* Clear Filters - Only show when filters are applied */}
                {(filters.search ||
                  filters.category_id ||
                  filters.city ||
                  filters.province ||
                  filters.min_price ||
                  filters.max_price) && (
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
                    <X className="w-4 h-4 mr-2" />
                    Reset Filter
                  </Button>
                )}
              </CardBody>
            </Card>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {/* Sort and Results Count */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl shadow-sm">
                  <TrendingUp className="w-4 h-4 text-primary-600" />
                  <span className="text-sm font-semibold text-gray-700">
                    {pagination.total || 0} vendor ditemukan
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-600">
                  Urutkan:
                </span>
                <Select
                  options={[
                    { value: "created_at-desc", label: "Terbaru" },
                    { value: "created_at-asc", label: "Terlama" },
                    { value: "rating-desc", label: "Rating Tertinggi" },
                    { value: "rating-asc", label: "Rating Terendah" },
                    { value: "price-asc", label: "Harga Terendah" },
                    { value: "price-desc", label: "Harga Tertinggi" },
                  ]}
                  value={`${filters.sort_by}-${filters.sort_order}`}
                  onChange={(option) => {
                    const [sortBy, sortOrder] = option.value.split("-");
                    handleSort(sortBy);
                  }}
                  className="min-w-[180px]"
                />
              </div>
            </div>

            {/* Vendors Grid */}
            {vendorsLoading ? (
              <div className="flex justify-center py-16">
                <div className="text-center">
                  <p className="text-gray-600 font-medium">Memuat vendor...</p>
                </div>
              </div>
            ) : vendors.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-8">
                  <Search className="w-16 h-16 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Tidak ada vendor ditemukan
                </h3>
                <p className="text-gray-600 mb-8 text-lg">
                  Coba ubah filter atau kata kunci pencarian Anda
                </p>
                <Button
                  gradient
                  glow
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
                  <X className="w-4 h-4 mr-2" />
                  Reset Filter
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {Array.isArray(vendors) &&
                  vendors.map((vendor) => (
                    <Link key={vendor.id} to={`/vendor/${vendor.id}`}>
                      <Card className="group overflow-hidden">
                        <div className="relative">
                          <img
                            src={
                              vendor.featured_portfolio?.image_url ||
                              "https://picsum.photos/400/300"
                            }
                            alt={vendor.business_name}
                            className="w-full h-56 object-cover"
                          />
                          <div className="absolute top-4 right-4">
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                // Add to wishlist logic
                              }}
                              className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center text-gray-400 shadow-lg"
                            >
                              <Heart className="w-5 h-5" />
                            </button>
                          </div>
                          <div className="absolute bottom-4 left-4">
                            <div className="flex items-center space-x-1 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm font-semibold text-gray-700">
                                {formatRating(vendor.average_rating || 0)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <CardBody className="p-6">
                          <div className="mb-4">
                            <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
                              {vendor.business_name}
                            </h3>
                            <p className="text-gray-600 text-sm line-clamp-2">
                              {vendor.description ||
                                "Vendor pernikahan profesional dengan pengalaman bertahun-tahun."}
                            </p>
                          </div>

                          <div className="flex items-center justify-between text-sm mb-4">
                            <div className="flex items-center text-gray-500">
                              <MapPin className="w-4 h-4 mr-2" />
                              <span className="font-medium">
                                {vendor.city}, {vendor.province}
                              </span>
                            </div>
                            <div className="flex items-center text-gray-500">
                              <Clock className="w-4 h-4 mr-1" />
                              <span>{vendor.total_reviews || 0} review</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-2xl font-bold text-primary-600">
                                {vendor.services_count || 0} Jasa Tersedia
                              </span>
                            </div>
                            <Button size="sm">
                              Lihat Detail
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          </div>
                        </CardBody>
                      </Card>
                    </Link>
                  ))}
              </div>
            )}

            {/* Pagination */}
            {pagination.total_pages > 1 && (
              <div className="mt-12 flex justify-center">
                <nav className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pagination.current_page === 1}
                    onClick={() =>
                      handlePageChange(pagination.current_page - 1)
                    }
                  >
                    <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                    Previous
                  </Button>

                  <div className="flex items-center space-x-2">
                    {Array.from(
                      { length: Math.min(5, pagination.total_pages) },
                      (_, i) => {
                        const page = i + 1;
                        return (
                          <Button
                            key={page}
                            variant={
                              page === pagination.current_page
                                ? "primary"
                                : "outline"
                            }
                            size="sm"
                            onClick={() => handlePageChange(page)}
                            className={
                              page === pagination.current_page
                                ? "gradient glow"
                                : ""
                            }
                          >
                            {page}
                          </Button>
                        );
                      }
                    )}
                    {pagination.total_pages > 5 && (
                      <>
                        <span className="text-gray-400">...</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handlePageChange(pagination.total_pages)
                          }
                        >
                          {pagination.total_pages}
                        </Button>
                      </>
                    )}
                  </div>

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
                    <ArrowRight className="w-4 h-4 ml-2" />
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
