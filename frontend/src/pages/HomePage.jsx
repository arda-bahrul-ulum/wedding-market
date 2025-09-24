import { Link } from "react-router-dom";
import {
  Search,
  Star,
  Users,
  Shield,
  Heart,
  Camera,
  Palette,
  Utensils,
  Music,
  Car,
  Calendar,
  CheckCircle,
} from "lucide-react";
import { useQuery } from "react-query";
import { marketplaceAPI } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import Button from "../components/UI/Button";
import Card, { CardBody } from "../components/UI/Card";

function HomePage() {
  const { user, isAuthenticated } = useAuth();

  const { data: categoriesData, isLoading: categoriesLoading } = useQuery(
    "categories",
    marketplaceAPI.getCategories
  );

  const { data: vendorsData, isLoading: vendorsLoading } = useQuery(
    "featured-vendors",
    () =>
      marketplaceAPI.getVendors({
        limit: 6,
        sort_by: "rating",
        sort_order: "desc",
      })
  );

  const categories = categoriesData?.data || [];
  const vendors = vendorsData?.data?.vendors || [];

  const features = [
    {
      icon: Shield,
      title: "Sistem Escrow Aman",
      description: "Pembayaran terlindungi hingga pesanan selesai",
    },
    {
      icon: Star,
      title: "Vendor Terverifikasi",
      description: "Semua vendor telah diverifikasi dan berkualitas",
    },
    {
      icon: Users,
      title: "Review & Rating",
      description: "Baca ulasan dari customer lain sebelum memutuskan",
    },
    {
      icon: Heart,
      title: "Customer Support 24/7",
      description: "Tim support siap membantu kapan saja",
    },
  ];

  const serviceCategories = [
    { icon: Camera, name: "Fotografer", color: "bg-blue-100 text-blue-600" },
    {
      icon: Palette,
      name: "Make Up Artist",
      color: "bg-pink-100 text-pink-600",
    },
    { icon: Utensils, name: "Catering", color: "bg-green-100 text-green-600" },
    {
      icon: Music,
      name: "Entertainment",
      color: "bg-purple-100 text-purple-600",
    },
    { icon: Car, name: "Transportasi", color: "bg-orange-100 text-orange-600" },
    {
      icon: Calendar,
      name: "Wedding Organizer",
      color: "bg-indigo-100 text-indigo-600",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-accent-50 hero-pattern">
        <div className="container-custom section-padding">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Pernikahan Impian
                  <span className="block text-gradient">Dimulai dari Sini</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Temukan vendor pernikahan terbaik di Indonesia. Dari venue
                  hingga fotografer, semua ada di satu tempat.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/marketplace">
                    <Button size="lg" className="w-full sm:w-auto">
                      <Search className="w-5 h-5 mr-2" />
                      Booking Vendor
                    </Button>
                  </Link>
                  {/* Only show "Daftar sebagai Vendor" button if user is not logged in or not a customer */}
                  {(!isAuthenticated || user?.role !== "customer") && (
                    <Link to="/register?tab=vendor">
                      <Button
                        variant="outline"
                        size="lg"
                        className="w-full sm:w-auto"
                      >
                        Daftar sebagai Vendor
                      </Button>
                    </Link>
                  )}
                </div>
                <p className="text-sm text-gray-500 max-w-md">
                  {isAuthenticated && user?.role === "customer"
                    ? "Mulai jelajahi vendor terbaik untuk pernikahan impian Anda"
                    : "Temukan vendor terpercaya atau bergabunglah sebagai vendor"}
                </p>
              </div>

              <div className="flex items-center space-x-8 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-primary-600" />
                  <span>1000+ Vendor</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span>4.9/5 Rating</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>5000+ Pernikahan</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10 group hero-image-container">
                <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                  <img
                    src="https://picsum.photos/600/400"
                    alt="Wedding couple"
                    className="w-full transition-all duration-700 group-hover:scale-105 group-hover:rotate-1"
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  {/* Floating sparkle elements */}
                  <div className="absolute top-4 right-4 w-3 h-3 bg-white/80 rounded-full hero-sparkle"></div>
                  <div className="absolute bottom-4 left-4 w-2 h-2 bg-accent-400/80 rounded-full hero-sparkle"></div>
                  <div className="absolute top-1/2 left-4 w-1 h-1 bg-primary-400/80 rounded-full hero-sparkle"></div>
                  <div className="absolute top-1/4 right-1/4 w-1.5 h-1.5 bg-yellow-400/80 rounded-full hero-sparkle"></div>
                </div>
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-400/20 to-accent-400/20 blur-xl scale-110 opacity-0 group-hover:opacity-100 hero-image-glow transition-all duration-700 -z-10"></div>
              </div>

              {/* Floating decorative elements with enhanced animations */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-accent-200 rounded-full opacity-60 hero-floating-elements"></div>
              <div
                className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary-200 rounded-full opacity-40 hero-floating-elements"
                style={{ animationDelay: "1s" }}
              ></div>
              <div
                className="absolute top-1/2 -right-8 w-16 h-16 bg-gradient-to-br from-primary-300 to-accent-300 rounded-full opacity-30 hero-floating-elements"
                style={{ animationDelay: "2s" }}
              ></div>
              <div
                className="absolute -bottom-8 right-1/4 w-20 h-20 bg-gradient-to-br from-accent-300 to-primary-300 rounded-full opacity-25 hero-floating-elements"
                style={{ animationDelay: "0.5s" }}
              ></div>

              {/* Additional floating elements for more dynamic effect */}
              <div
                className="absolute top-1/3 -left-6 w-12 h-12 bg-gradient-to-br from-yellow-300 to-orange-300 rounded-full opacity-20 hero-floating-elements"
                style={{ animationDelay: "3s" }}
              ></div>
              <div
                className="absolute -top-8 left-1/3 w-8 h-8 bg-gradient-to-br from-pink-300 to-purple-300 rounded-full opacity-30 hero-floating-elements"
                style={{ animationDelay: "4s" }}
              ></div>

              {/* Animated border with gradient */}
              <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-primary-400/30 to-accent-400/30 bg-clip-border opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* Subtle background pattern */}
              <div className="absolute inset-0 rounded-2xl opacity-5">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-100/20 to-accent-100/20 rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Mengapa Memilih Kami?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Kami memberikan pengalaman terbaik untuk pernikahan impian Anda
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group stagger-animation">
                <Card
                  variant="gradient"
                  hover
                  className="card-hover-effect group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-300"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <CardBody className="p-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-accent-500 rounded-3xl flex items-center justify-center mx-auto mb-6 icon-bounce group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                      <feature.icon className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardBody>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="section-padding bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Kategori Jasa
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Temukan semua kebutuhan pernikahan Anda dalam berbagai kategori
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {serviceCategories.map((category, index) => (
              <Link
                key={index}
                to="/marketplace"
                className="group stagger-animation"
              >
                <Card
                  variant="elevated"
                  hover
                  className="text-center card-hover-effect group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardBody className="p-6">
                    <div
                      className={`w-16 h-16 ${category.color} rounded-2xl flex items-center justify-center mx-auto mb-4 icon-bounce group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}
                    >
                      <category.icon className="w-8 h-8" />
                    </div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors text-sm">
                      {category.name}
                    </h3>
                  </CardBody>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Vendors Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-16">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Vendor Terpopuler
              </h2>
              <p className="text-xl text-gray-600">
                Vendor terbaik dengan rating tertinggi
              </p>
            </div>
            <Link to="/marketplace">
              <Button variant="outline">Lihat Semua</Button>
            </Link>
          </div>

          {vendorsLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {vendors.map((vendor, index) => (
                <Link
                  key={vendor.id}
                  to={`/vendor/${vendor.id}`}
                  className="group stagger-animation"
                >
                  <Card
                    variant="elevated"
                    hover
                    className="card-hover-effect group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-300 overflow-hidden"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="relative overflow-hidden image-zoom">
                      <img
                        src="https://picsum.photos/400/300"
                        alt={vendor.business_name}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1 shadow-lg">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-semibold text-gray-700">
                          4.8
                        </span>
                      </div>
                    </div>
                    <CardBody className="p-6">
                      <div className="mb-3">
                        <h3 className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors text-lg mb-2">
                          {vendor.business_name}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                          {vendor.description ||
                            "Vendor pernikahan profesional dengan pengalaman bertahun-tahun."}
                        </p>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 flex items-center">
                          <span className="w-2 h-2 bg-primary-500 rounded-full mr-2"></span>
                          {vendor.city}, {vendor.province}
                        </span>
                        <span className="font-bold text-primary-600 text-lg">
                          Rp 2.5jt
                        </span>
                      </div>
                    </CardBody>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-primary-600 to-accent-600">
        <div className="container-custom text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Siap Memulai Pernikahan Impian?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Bergabunglah dengan ribuan pasangan yang telah mempercayai kami
            </p>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {/* Only show "Daftar Sekarang" button if user is not logged in */}
                {!isAuthenticated && (
                  <Link to="/register?tab=customer">
                    <Button
                      size="lg"
                      variant="secondary"
                      className="w-full sm:w-auto"
                    >
                      Daftar Sekarang
                    </Button>
                  </Link>
                )}
                <Link to="/marketplace">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-64 border-white text-white"
                  >
                    Booking Vendor
                  </Button>
                </Link>
              </div>
              <p className="text-sm text-primary-100 text-center max-w-md mx-auto">
                {isAuthenticated
                  ? "Jelajahi ribuan vendor terpercaya untuk pernikahan Anda"
                  : "Bergabunglah dengan ribuan pasangan yang telah mempercayai kami"}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
