import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import {
  Star,
  MapPin,
  ShoppingCart,
  Heart,
  Share2,
  MessageCircle,
  Calendar,
  Clock,
  Package,
  ArrowLeft,
} from "lucide-react";
import { formatCurrency, formatDate } from "../../utils/format";
import Card, { CardBody, CardHeader } from "../../components/UI/Card";
import Button from "../../components/UI/Button";

function ServiceDetailPage() {
  const { id } = useParams();
  const { addItem } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);

  // Mock data - replace with actual API call
  const service = {
    id: 1,
    name: "Paket Fotografi Prewedding Premium",
    description:
      "Paket fotografi prewedding lengkap dengan berbagai konsep dan lokasi menarik. Termasuk editing profesional dan album premium.",
    price: 2500000,
    price_type: "fixed",
    images: [
      "/api/placeholder/600/400",
      "/api/placeholder/600/400",
      "/api/placeholder/600/400",
      "/api/placeholder/600/400",
    ],
    category: {
      id: 1,
      name: "Fotografer",
    },
    vendor: {
      id: 1,
      business_name: "Studio Foto Indah",
      city: "Jakarta Selatan",
      province: "DKI Jakarta",
      rating: 4.8,
      total_reviews: 24,
    },
    features: [
      "Sesi foto 4-6 jam",
      "3-4 lokasi berbeda",
      "100+ foto hasil editing",
      "Album premium 20x30 cm",
      "1 photographer + 1 assistant",
      "Free konsultasi konsep",
      "Garansi hasil memuaskan",
    ],
    includes: [
      "Photographer profesional",
      "Lighting equipment",
      "Props photography",
      "Editing profesional",
      "Album premium",
      "Soft copy semua foto",
    ],
    duration: "4-6 jam",
    delivery_time: "14 hari kerja",
    revision: "3x revisi gratis",
  };

  const reviews = [
    {
      id: 1,
      customer_name: "Sarah & John",
      rating: 5,
      comment:
        "Hasil foto sangat memuaskan! Tim sangat profesional dan ramah. Highly recommended!",
      date: "2024-01-10",
      images: ["/api/placeholder/100/100", "/api/placeholder/100/100"],
    },
    {
      id: 2,
      customer_name: "Lisa & David",
      rating: 5,
      comment:
        "Konsep fotonya kreatif dan hasilnya beyond expectation. Worth it banget!",
      date: "2024-01-05",
      images: [],
    },
  ];

  const handleAddToCart = () => {
    addItem({
      id: service.id,
      type: "service",
      name: service.name,
      price: service.price,
      image: service.images[0],
      vendor_name: service.vendor.business_name,
      vendor_id: service.vendor.id,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link to="/" className="hover:text-primary-600">
            Beranda
          </Link>
          <span>/</span>
          <Link to="/marketplace" className="hover:text-primary-600">
            Marketplace
          </Link>
          <span>/</span>
          <Link
            to={`/vendor/${service.vendor.id}`}
            className="hover:text-primary-600"
          >
            {service.vendor.business_name}
          </Link>
          <span>/</span>
          <span className="text-gray-900">{service.name}</span>
        </div>

        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="inline-flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card>
              <CardBody className="p-0">
                <div className="aspect-w-16 aspect-h-10">
                  <img
                    src={service.images[selectedImage]}
                    alt={service.name}
                    className="w-full h-96 object-cover rounded-t-lg"
                  />
                </div>
                <div className="p-4">
                  <div className="flex space-x-2 overflow-x-auto">
                    {service.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                          selectedImage === index
                            ? "border-primary-500"
                            : "border-gray-200"
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${service.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Service Details */}
            <Card>
              <CardHeader>
                <h1 className="text-2xl font-bold text-gray-900">
                  {service.name}
                </h1>
                <div className="flex items-center space-x-4 mt-2">
                  <Link
                    to={`/vendor/${service.vendor.id}`}
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    {service.vendor.business_name}
                  </Link>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="font-medium">{service.vendor.rating}</span>
                    <span className="text-gray-600">
                      ({service.vendor.total_reviews} review)
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>
                      {service.vendor.city}, {service.vendor.province}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardBody>
                <p className="text-gray-700 leading-relaxed mb-6">
                  {service.description}
                </p>

                {/* Features */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Yang Anda Dapatkan:
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {service.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Service Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Durasi
                      </p>
                      <p className="text-sm text-gray-600">
                        {service.duration}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Waktu Pengerjaan
                      </p>
                      <p className="text-sm text-gray-600">
                        {service.delivery_time}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Package className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Revisi
                      </p>
                      <p className="text-sm text-gray-600">
                        {service.revision}
                      </p>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Reviews */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold text-gray-900">
                  Review Customer
                </h2>
              </CardHeader>
              <CardBody className="space-y-6">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="border-b border-gray-200 last:border-b-0 pb-6 last:pb-0"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {review.customer_name}
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
                        {formatDate(review.date)}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-3">{review.comment}</p>
                    {review.images.length > 0 && (
                      <div className="flex space-x-2">
                        {review.images.map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt={`Review ${index + 1}`}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </CardBody>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price & Order */}
            <Card className="sticky top-24">
              <CardBody className="p-6">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-primary-600 mb-2">
                    {formatCurrency(service.price)}
                  </div>
                  <p className="text-gray-600">Per paket</p>
                </div>

                <div className="space-y-3 mb-6">
                  <Button onClick={handleAddToCart} className="w-full">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Tambah ke Keranjang
                  </Button>
                  <Button variant="outline" className="w-full">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Chat Vendor
                  </Button>
                  <div className="flex space-x-2">
                    <Button variant="outline" className="flex-1">
                      <Heart className="w-4 h-4 mr-2" />
                      Wishlist
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h4 className="font-medium text-gray-900 mb-3">
                    Yang Termasuk:
                  </h4>
                  <ul className="space-y-2">
                    {service.includes.map((item, index) => (
                      <li
                        key={index}
                        className="flex items-center space-x-2 text-sm"
                      >
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardBody>
            </Card>

            {/* Vendor Info */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">
                  Tentang Vendor
                </h3>
              </CardHeader>
              <CardBody>
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl font-bold text-primary-600">
                      {service.vendor.business_name.charAt(0)}
                    </span>
                  </div>
                  <h4 className="font-semibold text-gray-900">
                    {service.vendor.business_name}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {service.vendor.city}, {service.vendor.province}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Rating</span>
                    <span className="font-medium">
                      {service.vendor.rating}/5
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Review</span>
                    <span className="font-medium">
                      {service.vendor.total_reviews}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Response Time</span>
                    <span className="font-medium">&lt; 1 jam</span>
                  </div>
                </div>

                <Link
                  to={`/vendor/${service.vendor.id}`}
                  className="block mt-4"
                >
                  <Button variant="outline" className="w-full">
                    Lihat Profil Vendor
                  </Button>
                </Link>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServiceDetailPage;
