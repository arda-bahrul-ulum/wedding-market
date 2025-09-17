import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "react-query";
import { marketplaceAPI } from "../../services/api";
import { useCart } from "../../contexts/CartContext";
import {
  MapPin,
  Star,
  Phone,
  Globe,
  Instagram,
  MessageCircle,
  Heart,
  Share2,
  Calendar,
  Package,
  ShoppingCart,
  Eye,
  Filter,
} from "lucide-react";
import { formatCurrency, formatRating } from "../../utils/format";
import LoadingSpinner from "../../components/UI/LoadingSpinner";
import Card, { CardBody, CardHeader } from "../../components/UI/Card";
import Button from "../../components/UI/Button";

function VendorDetailPage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("services");
  const [selectedCategory, setSelectedCategory] = useState("");
  const { addItem } = useCart();

  const { data: vendorData, isLoading } = useQuery(["vendor-detail", id], () =>
    marketplaceAPI.getVendorDetail(id)
  );

  const vendor = vendorData?.data?.vendor;
  const services = vendorData?.data?.services || [];
  const packages = vendorData?.data?.packages || [];
  const portfolios = vendorData?.data?.portfolios || [];
  const reviews = vendorData?.data?.reviews || [];
  const reviewStats = vendorData?.data?.review_stats || {};

  const handleAddToCart = (item, type) => {
    addItem({
      id: item.id,
      type: type,
      name: item.name,
      price: item.price,
      image: item.images?.[0] || "/api/placeholder/100/100",
      vendor_name: vendor?.business_name,
      vendor_id: vendor?.id,
    });
  };

  const tabs = [
    { id: "services", name: "Jasa", count: services.length },
    { id: "packages", name: "Paket", count: packages.length },
    { id: "portfolio", name: "Portfolio", count: portfolios.length },
    { id: "reviews", name: "Review", count: reviews.length },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Vendor tidak ditemukan
          </h2>
          <p className="text-gray-600 mb-4">
            Vendor yang Anda cari tidak tersedia
          </p>
          <Link to="/marketplace">
            <Button>Kembali ke Marketplace</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-custom py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Vendor Info */}
            <div className="lg:col-span-2">
              <div className="flex items-start space-x-6 mb-6">
                <div className="w-24 h-24 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-bold text-primary-600">
                    {vendor.business_name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {vendor.business_name}
                  </h1>
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center space-x-1">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="font-medium text-gray-900">
                        {formatRating(reviewStats.average_rating || 4.8)}
                      </span>
                      <span className="text-gray-600">
                        ({reviewStats.total_reviews || 0} review)
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>
                        {vendor.city}, {vendor.province}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">
                    {vendor.description ||
                      "Vendor pernikahan profesional dengan pengalaman bertahun-tahun."}
                  </p>
                  <div className="flex items-center space-x-4">
                    {vendor.whatsapp && (
                      <a
                        href={`https://wa.me/${vendor.whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-green-600 hover:text-green-700"
                      >
                        <Phone className="w-4 h-4 mr-1" />
                        WhatsApp
                      </a>
                    )}
                    {vendor.website && (
                      <a
                        href={vendor.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-600 hover:text-blue-700"
                      >
                        <Globe className="w-4 h-4 mr-1" />
                        Website
                      </a>
                    )}
                    {vendor.instagram && (
                      <a
                        href={`https://instagram.com/${vendor.instagram}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-pink-600 hover:text-pink-700"
                      >
                        <Instagram className="w-4 h-4 mr-1" />
                        Instagram
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <Button className="w-full">
                <MessageCircle className="w-4 h-4 mr-2" />
                Chat Sekarang
              </Button>
              <Button variant="outline" className="w-full">
                <Heart className="w-4 h-4 mr-2" />
                Tambah ke Wishlist
              </Button>
              <Button variant="outline" className="w-full">
                <Share2 className="w-4 h-4 mr-2" />
                Bagikan
              </Button>
              <Button variant="outline" className="w-full">
                <Calendar className="w-4 h-4 mr-2" />
                Cek Ketersediaan
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="-mb-px flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? "border-primary-500 text-primary-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {tab.name}
                    <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs">
                      {tab.count}
                    </span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Services Tab */}
            {activeTab === "services" && (
              <div>
                {services.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Belum ada jasa tersedia</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service) => (
                      <Card
                        key={service.id}
                        className="group hover:shadow-lg transition-shadow"
                      >
                        <div className="aspect-w-16 aspect-h-9">
                          <img
                            src="/api/placeholder/300/200"
                            alt={service.name}
                            className="w-full h-40 object-cover rounded-t-lg"
                          />
                        </div>
                        <CardBody className="p-4">
                          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                            {service.name}
                          </h3>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {service.description}
                          </p>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-primary-600 font-semibold">
                              {formatCurrency(service.price)}
                            </span>
                            <span className="text-sm text-gray-500">
                              {service.category?.name}
                            </span>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              className="flex-1"
                              onClick={() =>
                                handleAddToCart(service, "service")
                              }
                            >
                              <ShoppingCart className="w-4 h-4 mr-1" />
                              Pesan
                            </Button>
                            <Link to={`/service/${service.id}`}>
                              <Button size="sm" variant="outline">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </Link>
                          </div>
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Packages Tab */}
            {activeTab === "packages" && (
              <div>
                {packages.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Belum ada paket tersedia</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {packages.map((pkg) => (
                      <Card
                        key={pkg.id}
                        className="group hover:shadow-lg transition-shadow"
                      >
                        <div className="aspect-w-16 aspect-h-9">
                          <img
                            src="/api/placeholder/400/250"
                            alt={pkg.name}
                            className="w-full h-48 object-cover rounded-t-lg"
                          />
                        </div>
                        <CardBody className="p-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {pkg.name}
                          </h3>
                          <p className="text-gray-600 mb-4 line-clamp-3">
                            {pkg.description}
                          </p>
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-xl font-bold text-primary-600">
                              {formatCurrency(pkg.price)}
                            </span>
                            <span className="text-sm text-gray-500">
                              {pkg.items?.length || 0} items
                            </span>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              className="flex-1"
                              onClick={() => handleAddToCart(pkg, "package")}
                            >
                              <ShoppingCart className="w-4 h-4 mr-2" />
                              Pesan Paket
                            </Button>
                            <Link to={`/package/${pkg.id}`}>
                              <Button variant="outline">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </Link>
                          </div>
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Portfolio Tab */}
            {activeTab === "portfolio" && (
              <div>
                {portfolios.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">
                      Belum ada portfolio tersedia
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {portfolios.map((item) => (
                      <div key={item.id} className="group cursor-pointer">
                        <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                          <img
                            src="/api/placeholder/300/300"
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="mt-2">
                          <h4 className="font-medium text-gray-900">
                            {item.title}
                          </h4>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === "reviews" && (
              <div>
                {/* Review Stats */}
                <Card className="mb-6">
                  <CardBody className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-gray-900 mb-2">
                          {formatRating(reviewStats.average_rating || 4.8)}
                        </div>
                        <div className="flex items-center justify-center mb-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-5 h-5 ${
                                star <= (reviewStats.average_rating || 4.8)
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-gray-600">
                          {reviewStats.total_reviews || 0} review
                        </p>
                      </div>
                      <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map((rating) => (
                          <div
                            key={rating}
                            className="flex items-center space-x-2"
                          >
                            <span className="text-sm text-gray-600 w-8">
                              {rating}
                            </span>
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-yellow-400 h-2 rounded-full"
                                style={{
                                  width: `${
                                    ((reviewStats.rating_counts?.[rating] ||
                                      0) /
                                      (reviewStats.total_reviews || 1)) *
                                    100
                                  }%`,
                                }}
                              />
                            </div>
                            <span className="text-sm text-gray-600 w-8">
                              {reviewStats.rating_counts?.[rating] || 0}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardBody>
                </Card>

                {/* Reviews List */}
                {reviews.length === 0 ? (
                  <div className="text-center py-12">
                    <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Belum ada review</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <Card key={review.id}>
                        <CardBody className="p-6">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {review.customer?.name}
                              </h4>
                              <div className="flex items-center space-x-1 mt-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`w-4 h-4 ${
                                      star <= review.rating
                                        ? "text-yellow-400 fill-current"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <span className="text-sm text-gray-500">
                              {formatDate(review.created_at)}
                            </span>
                          </div>
                          <p className="text-gray-700 mb-3">{review.comment}</p>
                          {review.vendor_reply && (
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <p className="text-sm font-medium text-gray-900 mb-1">
                                Balasan dari {vendor.business_name}:
                              </p>
                              <p className="text-sm text-gray-700">
                                {review.vendor_reply}
                              </p>
                            </div>
                          )}
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">
                  Kontak Vendor
                </h3>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Alamat</p>
                    <p className="text-sm text-gray-600">
                      {vendor.address || `${vendor.city}, ${vendor.province}`}
                    </p>
                  </div>
                </div>
                {vendor.whatsapp && (
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        WhatsApp
                      </p>
                      <p className="text-sm text-gray-600">{vendor.whatsapp}</p>
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">
                  Statistik
                </h3>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Jasa</span>
                  <span className="font-semibold">{services.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Paket</span>
                  <span className="font-semibold">{packages.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Portfolio</span>
                  <span className="font-semibold">{portfolios.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Rating</span>
                  <span className="font-semibold">
                    {formatRating(reviewStats.average_rating || 4.8)}
                  </span>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VendorDetailPage;

