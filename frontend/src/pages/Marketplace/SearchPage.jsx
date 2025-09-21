import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, Filter, MapPin, Star, Heart, X } from "lucide-react";
import { formatCurrency, formatRating } from "../../utils/format";
import Card, { CardBody } from "../../components/UI/Card";
import Button from "../../components/UI/Button";
import Input from "../../components/UI/Input";

function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    q: searchParams.get("q") || "",
    category: searchParams.get("category") || "",
    location: searchParams.get("location") || "",
    min_price: searchParams.get("min_price") || "",
    max_price: searchParams.get("max_price") || "",
    rating: searchParams.get("rating") || "",
    sort: searchParams.get("sort") || "relevance",
  });

  // Mock data - replace with actual API call
  const searchResults = [
    {
      id: 1,
      type: "vendor",
      name: "Studio Foto Indah",
      description:
        "Jasa fotografi pernikahan profesional dengan pengalaman 10 tahun",
      image: "/api/placeholder/300/200",
      rating: 4.8,
      review_count: 24,
      location: "Jakarta Selatan",
      price_start: 2500000,
      categories: ["Fotografer"],
    },
    {
      id: 2,
      type: "service",
      name: "Paket Fotografi Prewedding",
      description: "Paket foto prewedding dengan berbagai lokasi menarik",
      image: "/api/placeholder/300/200",
      rating: 4.9,
      review_count: 18,
      location: "Bandung",
      price: 1500000,
      vendor_name: "Capture Moments",
      categories: ["Fotografer"],
    },
    {
      id: 3,
      type: "package",
      name: "Paket Wedding Organizer Premium",
      description:
        "Paket lengkap wedding organizer dengan semua kebutuhan pernikahan",
      image: "/api/placeholder/300/200",
      rating: 4.7,
      review_count: 32,
      location: "Jakarta Pusat",
      price: 15000000,
      vendor_name: "Dream Wedding Planner",
      categories: ["Wedding Organizer"],
    },
  ];

  const categories = [
    "Fotografer",
    "Videografer",
    "Make Up Artist",
    "Wedding Organizer",
    "Venue",
    "Dekorasi",
    "Catering",
    "Entertainment",
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
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
    handleFilterChange("q", filters.q);
  };

  const clearFilters = () => {
    const clearedFilters = {
      q: filters.q, // Keep search query
      category: "",
      location: "",
      min_price: "",
      max_price: "",
      rating: "",
      sort: "relevance",
    };
    setFilters(clearedFilters);

    const params = new URLSearchParams();
    if (clearedFilters.q) params.set("q", clearedFilters.q);
    params.set("sort", "relevance");
    setSearchParams(params);
  };

  const getResultTypeIcon = (type) => {
    switch (type) {
      case "vendor":
        return "🏢";
      case "service":
        return "⚡";
      case "package":
        return "📦";
      default:
        return "🔍";
    }
  };

  const getResultTypeText = (type) => {
    switch (type) {
      case "vendor":
        return "Vendor";
      case "service":
        return "Jasa";
      case "package":
        return "Paket";
      default:
        return type;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="container-custom py-4">
          <form onSubmit={handleSearch} className="flex space-x-4">
            <div className="flex-1 relative">
              <Input
                placeholder="Cari vendor, jasa, atau paket pernikahan..."
                value={filters.q}
                onChange={(e) => setFilters({ ...filters, q: e.target.value })}
                className="pr-10"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
            <Button type="submit">Cari</Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="relative"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filter
              {Object.values(filters).some(
                (v) => v && v !== "relevance" && v !== filters.q
              ) && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary-600 rounded-full"></span>
              )}
            </Button>
          </form>
        </div>
      </div>

      <div className="container-custom py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className={`lg:block ${isFilterOpen ? "block" : "hidden"}`}>
            <Card className="sticky top-32">
              <CardBody className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Filter
                  </h3>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    Reset
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Category Filter */}
                  <div>
                    <label className="label">Kategori</label>
                    <select
                      className="input"
                      value={filters.category}
                      onChange={(e) =>
                        handleFilterChange("category", e.target.value)
                      }
                    >
                      <option value="">Semua Kategori</option>
                      {Array.isArray(categories) &&
                        categories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* Location Filter */}
                  <div>
                    <label className="label">Lokasi</label>
                    <Input
                      placeholder="Kota atau provinsi"
                      value={filters.location}
                      onChange={(e) =>
                        handleFilterChange("location", e.target.value)
                      }
                    />
                  </div>

                  {/* Price Range */}
                  <div>
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

                  {/* Rating Filter */}
                  <div>
                    <label className="label">Rating Minimum</label>
                    <select
                      className="input"
                      value={filters.rating}
                      onChange={(e) =>
                        handleFilterChange("rating", e.target.value)
                      }
                    >
                      <option value="">Semua Rating</option>
                      <option value="4.5">4.5+ ⭐</option>
                      <option value="4.0">4.0+ ⭐</option>
                      <option value="3.5">3.5+ ⭐</option>
                      <option value="3.0">3.0+ ⭐</option>
                    </select>
                  </div>

                  {/* Sort */}
                  <div>
                    <label className="label">Urutkan</label>
                    <select
                      className="input"
                      value={filters.sort}
                      onChange={(e) =>
                        handleFilterChange("sort", e.target.value)
                      }
                    >
                      <option value="relevance">Relevansi</option>
                      <option value="rating">Rating Tertinggi</option>
                      <option value="price_low">Harga Terendah</option>
                      <option value="price_high">Harga Tertinggi</option>
                      <option value="newest">Terbaru</option>
                    </select>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Search Results */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Hasil Pencarian
                  {filters.q && (
                    <span className="text-gray-600 font-normal">
                      {" "}
                      untuk "{filters.q}"
                    </span>
                  )}
                </h2>
                <p className="text-gray-600 text-sm">
                  {searchResults.length} hasil ditemukan
                </p>
              </div>

              {/* Mobile Filter Toggle */}
              <Button
                variant="outline"
                size="sm"
                className="lg:hidden"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>

            {/* Active Filters */}
            {Object.entries(filters).some(
              ([key, value]) => value && key !== "q" && key !== "sort"
            ) && (
              <div className="flex flex-wrap gap-2 mb-6">
                {Object.entries(filters).map(([key, value]) => {
                  if (!value || key === "q" || key === "sort") return null;

                  const filterLabels = {
                    category: "Kategori",
                    location: "Lokasi",
                    min_price: "Min Harga",
                    max_price: "Max Harga",
                    rating: "Rating Min",
                  };

                  return (
                    <span
                      key={key}
                      className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-800 text-sm rounded-full"
                    >
                      {filterLabels[key]}: {value}
                      <button
                        onClick={() => handleFilterChange(key, "")}
                        className="ml-2 hover:text-primary-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  );
                })}
              </div>
            )}

            {/* Results Grid */}
            {searchResults.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Tidak ada hasil ditemukan
                </h3>
                <p className="text-gray-600 mb-4">
                  Coba ubah kata kunci atau filter pencarian Anda
                </p>
                <Button onClick={clearFilters}>Reset Filter</Button>
              </div>
            ) : (
              <div className="space-y-6">
                {searchResults.map((result) => (
                  <Card
                    key={`${result.type}-${result.id}`}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardBody className="p-6">
                      <div className="flex space-x-4">
                        <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={result.image}
                            alt={result.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="text-lg">
                                  {getResultTypeIcon(result.type)}
                                </span>
                                <span className="text-sm text-gray-500">
                                  {getResultTypeText(result.type)}
                                </span>
                                {result.vendor_name && (
                                  <>
                                    <span className="text-gray-400">•</span>
                                    <span className="text-sm text-gray-500">
                                      {result.vendor_name}
                                    </span>
                                  </>
                                )}
                              </div>
                              <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600">
                                <Link to={`/${result.type}/${result.id}`}>
                                  {result.name}
                                </Link>
                              </h3>
                            </div>
                            <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                              <Heart className="w-5 h-5" />
                            </button>
                          </div>

                          <p className="text-gray-600 mb-3 line-clamp-2">
                            {result.description}
                          </p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span className="font-medium">
                                  {formatRating(result.rating)}
                                </span>
                                <span>({result.review_count} review)</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <MapPin className="w-4 h-4" />
                                <span>{result.location}</span>
                              </div>
                            </div>

                            <div className="text-right">
                              <div className="text-lg font-semibold text-primary-600">
                                {result.price
                                  ? formatCurrency(result.price)
                                  : result.price_start
                                  ? `Mulai ${formatCurrency(
                                      result.price_start
                                    )}`
                                  : "Hubungi untuk harga"}
                              </div>
                              <div className="flex space-x-2 mt-2">
                                <Link to={`/${result.type}/${result.id}`}>
                                  <Button size="sm">Lihat Detail</Button>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchPage;
