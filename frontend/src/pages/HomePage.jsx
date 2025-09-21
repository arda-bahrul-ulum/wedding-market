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
import LoadingSpinner from "../components/UI/LoadingSpinner";
import Button from "../components/UI/Button";
import Card, { CardBody } from "../components/UI/Card";

function HomePage() {
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

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/marketplace">
                  <Button size="lg" className="w-full sm:w-auto">
                    <Search className="w-5 h-5 mr-2" />
                    Booking Vendor
                  </Button>
                </Link>
                <Link to="/register?tab=vendor">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    Daftar sebagai Vendor
                  </Button>
                </Link>
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
              <div className="relative z-10">
                <img
                  src="https://picsum.photos/600/400"
                  alt="Wedding couple"
                  className="rounded-2xl shadow-2xl w-full"
                />
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-accent-200 rounded-full opacity-60 animate-bounce-gentle"></div>
              <div
                className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary-200 rounded-full opacity-40 animate-bounce-gentle"
                style={{ animationDelay: "1s" }}
              ></div>
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
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-200 transition-colors">
                  <feature.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="section-padding bg-gray-50">
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
              <Link key={index} to="/marketplace" className="group">
                <Card className="text-center hover:shadow-lg transition-shadow">
                  <CardBody className="p-6">
                    <div
                      className={`w-12 h-12 ${category.color} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}
                    >
                      <category.icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors">
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
              {vendors.map((vendor) => (
                <Link key={vendor.id} to={`/vendor/${vendor.id}`}>
                  <Card className="group hover:shadow-lg transition-shadow">
                    <div className="aspect-w-16 aspect-h-9">
                      <img
                        src="https://picsum.photos/400/300"
                        alt={vendor.business_name}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                    </div>
                    <CardBody className="p-6">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                          {vendor.business_name}
                        </h3>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium text-gray-600">
                            4.8
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {vendor.description ||
                          "Vendor pernikahan profesional dengan pengalaman bertahun-tahun."}
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>
                          {vendor.city}, {vendor.province}
                        </span>
                        <span className="font-medium text-primary-600">
                          Mulai dari Rp 2.5jt
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
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register?tab=customer">
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full sm:w-auto"
                >
                  Daftar Sekarang
                </Button>
              </Link>
              <Link to="/marketplace">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-white text-white"
                >
                  Booking Vendor
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
