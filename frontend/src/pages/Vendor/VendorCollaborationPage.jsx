import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import { marketplaceAPI } from "../../services/api";
import {
  Search,
  Filter,
  Users,
  Star,
  MapPin,
  Phone,
  Mail,
  UserPlus,
  Plus,
  CheckCircle,
  Clock,
  X,
} from "lucide-react";
import LoadingSpinner from "../../components/UI/LoadingSpinner";
import Button from "../../components/UI/Button";
import Card, { CardBody } from "../../components/UI/Card";
import Input from "../../components/UI/Input";
import toast from "react-hot-toast";

function VendorCollaborationPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [showFilters, setShowFilters] = useState(false);
  const [collaborationRequests, setCollaborationRequests] = useState([]);

  const { data: vendorsData, isLoading: vendorsLoading } = useQuery(
    [
      "vendors",
      {
        search: searchQuery,
        category: selectedCategory,
        location: selectedLocation,
        sort_by: sortBy,
      },
    ],
    () =>
      marketplaceAPI.getVendors({
        search: searchQuery,
        category: selectedCategory,
        location: selectedLocation,
        sort_by: sortBy,
        limit: 12,
      })
  );

  const { data: categoriesData } = useQuery(
    "categories",
    marketplaceAPI.getCategories
  );

  const vendors = vendorsData?.data?.vendors || [];
  const categories = Array.isArray(categoriesData?.data)
    ? categoriesData.data
    : [];

  const handleCollaborationRequest = async (vendorId, vendorName) => {
    try {
      // Simulate API call for collaboration request
      const newRequest = {
        id: Date.now(),
        vendorId,
        vendorName,
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      setCollaborationRequests((prev) => [...prev, newRequest]);
      toast.success(`Permintaan kerjasama ke ${vendorName} berhasil dikirim!`);
    } catch (error) {
      toast.error("Gagal mengirim permintaan kerjasama");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Search is handled by useQuery automatically
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedLocation("");
    setSortBy("rating");
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Menunggu
          </span>
        );
      case "accepted":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Diterima
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <X className="w-3 h-3 mr-1" />
            Ditolak
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-custom py-8">
          <div className="text-center">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Kerjasama Vendor
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Temukan vendor lain untuk berkolaborasi dan ciptakan paket
              pernikahan yang menarik
            </p>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardBody className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Filter
                  </h3>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden p-2 text-gray-400 hover:text-gray-600"
                  >
                    <Filter className="w-5 h-5" />
                  </button>
                </div>

                <div
                  className={`space-y-6 ${
                    showFilters ? "block" : "hidden lg:block"
                  }`}
                >
                  {/* Search */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cari Vendor
                    </label>
                    <form onSubmit={handleSearch}>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          type="text"
                          placeholder="Nama vendor..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </form>
                  </div>

                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kategori
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Semua Kategori</option>
                      {Array.isArray(categories) &&
                        categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* Location Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lokasi
                    </label>
                    <select
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Semua Lokasi</option>
                      <option value="jakarta">Jakarta</option>
                      <option value="bandung">Bandung</option>
                      <option value="surabaya">Surabaya</option>
                      <option value="yogyakarta">Yogyakarta</option>
                      <option value="bali">Bali</option>
                    </select>
                  </div>

                  {/* Sort By */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Urutkan
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="rating">Rating Tertinggi</option>
                      <option value="name">Nama A-Z</option>
                      <option value="created_at">Terbaru</option>
                    </select>
                  </div>

                  {/* Clear Filters */}
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="w-full"
                  >
                    Hapus Filter
                  </Button>
                </div>
              </CardBody>
            </Card>

            {/* Collaboration Requests */}
            {collaborationRequests.length > 0 && (
              <Card className="mt-6">
                <CardBody className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Permintaan Kerjasama
                  </h3>
                  <div className="space-y-3">
                    {collaborationRequests.map((request) => (
                      <div
                        key={request.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {request.vendorName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(request.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        {getStatusBadge(request.status)}
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {vendors.length} Vendor Ditemukan
                </h2>
                <p className="text-gray-600">
                  Pilih vendor untuk diajak kerjasama
                </p>
              </div>
            </div>

            {/* Loading State */}
            {vendorsLoading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : vendors.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Tidak ada vendor ditemukan
                </h3>
                <p className="text-gray-600">Coba ubah filter pencarian Anda</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {vendors.map((vendor) => (
                  <Card
                    key={vendor.id}
                    variant="elevated"
                    hover
                    className="group card-hover-effect group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-300"
                  >
                    <CardBody className="p-6">
                      {/* Vendor Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-lg">
                            <Users className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                              {vendor.business_name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {vendor.category?.name || "Vendor"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-semibold text-gray-700">
                            {vendor.rating || "4.8"}
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {vendor.description ||
                          "Vendor pernikahan profesional dengan pengalaman bertahun-tahun."}
                      </p>

                      {/* Location */}
                      <div className="flex items-center text-sm text-gray-500 mb-4">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>
                          {vendor.city}, {vendor.province}
                        </span>
                      </div>

                      {/* Contact Info */}
                      <div className="space-y-2 mb-6">
                        {vendor.phone && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone className="w-4 h-4 mr-2" />
                            <span>{vendor.phone}</span>
                          </div>
                        )}
                        {vendor.email && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Mail className="w-4 h-4 mr-2" />
                            <span className="truncate">{vendor.email}</span>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-3">
                        <Button
                          onClick={() =>
                            handleCollaborationRequest(
                              vendor.id,
                              vendor.business_name
                            )
                          }
                          className="flex-1"
                          size="sm"
                        >
                          <UserPlus className="w-4 h-4 mr-2" />
                          Ajak Kerjasama
                        </Button>
                        <Link to={`/vendor/${vendor.id}`}>
                          <Button variant="outline" size="sm">
                            <Plus className="w-4 h-4" />
                          </Button>
                        </Link>
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

export default VendorCollaborationPage;
