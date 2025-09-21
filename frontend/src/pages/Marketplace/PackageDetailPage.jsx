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
  Check,
} from "lucide-react";
import { formatCurrency, formatDate } from "../../utils/format";
import Card, { CardBody, CardHeader } from "../../components/UI/Card";
import Button from "../../components/UI/Button";

function PackageDetailPage() {
  const { id } = useParams();
  const { addItem } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);

  // Mock data - replace with actual API call
  const packageData = {
    id: 1,
    name: "Paket Wedding Organizer Premium",
    description:
      "Paket lengkap wedding organizer untuk pernikahan impian Anda. Termasuk semua kebutuhan dari A-Z dengan kualitas premium dan pelayanan terbaik.",
    price: 15000000,
    original_price: 18000000,
    discount: 17,
    images: [
      "/api/placeholder/600/400",
      "/api/placeholder/600/400",
      "/api/placeholder/600/400",
      "/api/placeholder/600/400",
    ],
    vendor: {
      id: 1,
      business_name: "Dream Wedding Planner",
      city: "Jakarta Pusat",
      province: "DKI Jakarta",
      rating: 4.9,
      total_reviews: 45,
    },
    items: [
      {
        id: 1,
        name: "Wedding Organizer",
        description: "Koordinator pernikahan profesional",
        quantity: 1,
        price: 5000000,
      },
      {
        id: 2,
        name: "Dekorasi Premium",
        description: "Dekorasi pelaminan dan venue",
        quantity: 1,
        price: 4000000,
      },
      {
        id: 3,
        name: "Fotografer & Videografer",
        description: "Tim dokumentasi lengkap",
        quantity: 1,
        price: 3500000,
      },
      {
        id: 4,
        name: "Make Up Artist",
        description: "MUA untuk pengantin",
        quantity: 1,
        price: 2000000,
      },
      {
        id: 5,
        name: "Entertainment",
        description: "MC dan musik live",
        quantity: 1,
        price: 1500000,
      },
    ],
    features: [
      "Konsultasi unlimited",
      "Rundown acara detail",
      "Koordinasi vendor",
      "Setup & breakdown",
      "Emergency handling",
      "After party support",
    ],
    duration: "12 jam",
    preparation_time: "2-3 bulan",
    guarantee: "Garansi kepuasan 100%",
  };

  const reviews = [
    {
      id: 1,
      customer_name: "Andi & Sari",
      rating: 5,
      comment:
        "Paket yang sangat lengkap dan worth it! Tim Dream Wedding sangat profesional dan detail. Pernikahan kami berjalan sempurna!",
      date: "2024-01-15",
      images: ["/api/placeholder/100/100", "/api/placeholder/100/100"],
    },
    {
      id: 2,
      customer_name: "Budi & Maya",
      rating: 5,
      comment:
        "Highly recommended! Semua vendor yang disediakan berkualitas tinggi. Koordinasinya juga sangat baik.",
      date: "2024-01-08",
      images: [],
    },
  ];

  const handleAddToCart = () => {
    addItem({
      id: packageData.id,
      type: "package",
      name: packageData.name,
      price: packageData.price,
      image: packageData.images[0],
      vendor_name: packageData.vendor.business_name,
      vendor_id: packageData.vendor.id,
    });
  };

  const totalOriginalPrice = packageData.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const savings = totalOriginalPrice - packageData.price;

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
            Booking Vendor
          </Link>
          <span>/</span>
          <Link
            to={`/vendor/${packageData.vendor.id}`}
            className="hover:text-primary-600"
          >
            {packageData.vendor.business_name}
          </Link>
          <span>/</span>
          <span className="text-gray-900">{packageData.name}</span>
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
                <div className="aspect-w-16 aspect-h-10 relative">
                  <img
                    src={packageData.images[selectedImage]}
                    alt={packageData.name}
                    className="w-full h-96 object-cover rounded-t-lg"
                  />
                  {packageData.discount > 0 && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Hemat {packageData.discount}%
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex space-x-2 overflow-x-auto">
                    {packageData.images.map((image, index) => (
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
                          alt={`${packageData.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Package Details */}
            <Card>
              <CardHeader>
                <h1 className="text-2xl font-bold text-gray-900">
                  {packageData.name}
                </h1>
                <div className="flex items-center space-x-4 mt-2">
                  <Link
                    to={`/vendor/${packageData.vendor.id}`}
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    {packageData.vendor.business_name}
                  </Link>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="font-medium">
                      {packageData.vendor.rating}
                    </span>
                    <span className="text-gray-600">
                      ({packageData.vendor.total_reviews} review)
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>
                      {packageData.vendor.city}, {packageData.vendor.province}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardBody>
                <p className="text-gray-700 leading-relaxed mb-6">
                  {packageData.description}
                </p>

                {/* Package Items */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Yang Termasuk dalam Paket:
                  </h3>
                  <div className="space-y-4">
                    {packageData.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 text-green-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {item.name}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {item.description}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">
                            {formatCurrency(item.price)}
                          </p>
                          <p className="text-sm text-gray-500">
                            x{item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="mb-6 p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">
                    Rincian Harga:
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Harga Normal:</span>
                      <span className="line-through text-gray-500">
                        {formatCurrency(totalOriginalPrice)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Harga Paket:</span>
                      <span className="font-semibold text-green-600">
                        {formatCurrency(packageData.price)}
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-green-200 pt-2">
                      <span className="font-medium text-green-800">
                        Anda Hemat:
                      </span>
                      <span className="font-bold text-green-800">
                        {formatCurrency(savings)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Package Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Durasi
                      </p>
                      <p className="text-sm text-gray-600">
                        {packageData.duration}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Persiapan
                      </p>
                      <p className="text-sm text-gray-600">
                        {packageData.preparation_time}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Package className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Garansi
                      </p>
                      <p className="text-sm text-gray-600">
                        {packageData.guarantee}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Keunggulan Paket:
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {packageData.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
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
                  <div className="text-3xl font-bold text-primary-600 mb-1">
                    {formatCurrency(packageData.price)}
                  </div>
                  {packageData.original_price > packageData.price && (
                    <div className="text-lg text-gray-500 line-through mb-1">
                      {formatCurrency(packageData.original_price)}
                    </div>
                  )}
                  <p className="text-green-600 font-medium">
                    Hemat {formatCurrency(savings)}!
                  </p>
                </div>

                <div className="space-y-3 mb-6">
                  <Button onClick={handleAddToCart} className="w-full">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Pesan Paket
                  </Button>
                  <Button variant="outline" className="w-full">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Konsultasi Gratis
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
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2 text-green-600">
                      <Check className="w-4 h-4" />
                      <span>Konsultasi unlimited</span>
                    </div>
                    <div className="flex items-center space-x-2 text-green-600">
                      <Check className="w-4 h-4" />
                      <span>Garansi kepuasan 100%</span>
                    </div>
                    <div className="flex items-center space-x-2 text-green-600">
                      <Check className="w-4 h-4" />
                      <span>Tim profesional berpengalaman</span>
                    </div>
                  </div>
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
                      {packageData.vendor.business_name.charAt(0)}
                    </span>
                  </div>
                  <h4 className="font-semibold text-gray-900">
                    {packageData.vendor.business_name}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {packageData.vendor.city}, {packageData.vendor.province}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Rating</span>
                    <span className="font-medium">
                      {packageData.vendor.rating}/5
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Review</span>
                    <span className="font-medium">
                      {packageData.vendor.total_reviews}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Response Time</span>
                    <span className="font-medium">&lt; 30 menit</span>
                  </div>
                </div>

                <Link
                  to={`/vendor/${packageData.vendor.id}`}
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

export default PackageDetailPage;
