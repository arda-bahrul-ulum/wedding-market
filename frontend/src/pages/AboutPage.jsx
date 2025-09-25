import { Link } from "react-router-dom";
import {
  Users,
  Target,
  Award,
  Heart,
  CheckCircle,
  Star,
  UserCheck,
  Clock,
} from "lucide-react";
import Button from "../components/UI/Button";
import Card, { CardBody } from "../components/UI/Card";

function AboutPage() {
  const stats = [
    { number: "1000+", label: "Vendor Terdaftar" },
    { number: "5000+", label: "Pernikahan Berhasil" },
    { number: "4.9/5", label: "Rating Kepuasan" },
    { number: "24/7", label: "Customer Support" },
  ];

  const values = [
    {
      icon: Heart,
      title: "Passion untuk Pernikahan",
      description:
        "Kami memahami bahwa pernikahan adalah momen terpenting dalam hidup Anda, dan kami berkomitmen untuk membuatnya sempurna.",
    },
    {
      icon: UserCheck,
      title: "Keamanan & Kepercayaan",
      description:
        "Sistem escrow kami memastikan pembayaran aman dan vendor terpercaya untuk memberikan ketenangan pikiran.",
    },
    {
      icon: Star,
      title: "Kualitas Terbaik",
      description:
        "Kami hanya bekerja dengan vendor-vendor terbaik yang telah melalui proses verifikasi ketat.",
    },
    {
      icon: Users,
      title: "Komunitas yang Kuat",
      description:
        "Membangun komunitas yang saling mendukung antara customer dan vendor untuk pengalaman terbaik.",
    },
  ];

  const team = [
    {
      name: "Sarah Johnson",
      role: "CEO & Founder",
      image: "/api/placeholder/200/200",
      description:
        "Memiliki pengalaman 10 tahun di industri pernikahan dan teknologi.",
    },
    {
      name: "Michael Chen",
      role: "CTO",
      image: "/api/placeholder/200/200",
      description:
        "Ahli teknologi dengan passion untuk menciptakan solusi inovatif.",
    },
    {
      name: "Lisa Rodriguez",
      role: "Head of Operations",
      image: "/api/placeholder/200/200",
      description:
        "Mengelola operasional platform dengan fokus pada kepuasan customer.",
    },
    {
      name: "David Kim",
      role: "Head of Marketing",
      image: "/api/placeholder/200/200",
      description:
        "Membangun brand awareness dan strategi pemasaran yang efektif.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-accent-50">
        <div className="container-custom section-padding">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
              Tentang <span className="text-gradient">Wedding Dream</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              Kami adalah platform booking vendor jasa pernikahan terlengkap di
              Indonesia yang menghubungkan pasangan dengan vendor terbaik untuk
              mewujudkan pernikahan impian mereka.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register?tab=customer">
                <Button size="lg">Mulai Sekarang</Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="lg">
                  Hubungi Kami
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-primary-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Card>
              <CardBody className="p-8">
                <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mb-6">
                  <Target className="w-8 h-8 text-primary-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Misi Kami
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  Menjadi platform terdepan yang memudahkan setiap pasangan
                  untuk menemukan dan bekerja sama dengan vendor pernikahan
                  terbaik, sambil memastikan transparansi, keamanan, dan
                  kepuasan maksimal dalam setiap transaksi.
                </p>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="p-8">
                <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mb-6">
                  <Award className="w-8 h-8 text-primary-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Visi Kami
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  Menjadi ekosistem pernikahan digital yang paling terpercaya
                  dan komprehensif di Asia Tenggara, di mana setiap pernikahan
                  dapat diwujudkan dengan mudah, aman, dan memuaskan.
                </p>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Nilai-Nilai Kami
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Prinsip-prinsip yang menjadi fondasi dalam setiap layanan yang
              kami berikan
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center group stagger-animation">
                <Card
                  variant="elevated"
                  hover
                  className="card-hover-effect group-hover:shadow-xl group-hover:-translate-y-2 transition-all duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardBody className="p-8">
                    <div className="w-20 h-20 bg-primary-100 rounded-3xl flex items-center justify-center mx-auto mb-6 icon-bounce group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                      <value.icon className="w-10 h-10 text-primary-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {value.description}
                    </p>
                  </CardBody>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Cerita Kami
              </h2>
              <p className="text-xl text-gray-600">
                Perjalanan Wedding Dream dari ide hingga realitas
              </p>
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 leading-relaxed mb-6">
                Wedding Dream lahir dari pengalaman pribadi founder kami yang
                mengalami kesulitan dalam mencari vendor pernikahan yang tepat.
                Setelah melalui proses pernikahan yang rumit dan mahal, kami
                menyadari bahwa industri pernikahan di Indonesia membutuhkan
                platform yang dapat memudahkan pasangan untuk menemukan vendor
                terbaik.
              </p>

              <p className="text-gray-600 leading-relaxed mb-6">
                Dengan teknologi terdepan dan tim yang berpengalaman, kami
                membangun ekosistem yang menghubungkan customer dengan vendor
                terpercaya. Setiap fitur yang kami kembangkan didasarkan pada
                kebutuhan nyata dan feedback dari komunitas kami.
              </p>

              <p className="text-gray-600 leading-relaxed">
                Hari ini, Wedding Dream telah membantu ribuan pasangan
                mewujudkan pernikahan impian mereka, dan kami terus berkomitmen
                untuk memberikan pengalaman terbaik bagi setiap pengguna
                platform kami.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Tim Kami
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Orang-orang hebat di balik kesuksesan Wedding Dream
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="stagger-animation">
                <Card
                  variant="elevated"
                  hover
                  className="text-center group card-hover-effect group-hover:shadow-xl group-hover:-translate-y-2 transition-all duration-300 overflow-hidden"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardBody className="p-6">
                    <div className="relative w-28 h-28 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full mx-auto mb-6 overflow-hidden group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2 text-lg group-hover:text-primary-600 transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-sm font-semibold text-primary-600 mb-3 bg-primary-50 px-3 py-1 rounded-full inline-block">
                      {member.role}
                    </p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {member.description}
                    </p>
                  </CardBody>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-primary-600 via-primary-700 to-accent-600">
        <div className="container-custom text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Bergabunglah dengan Komunitas Kami
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Baik sebagai customer maupun vendor, mari bersama-sama membangun
              ekosistem pernikahan yang lebih baik
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register?tab=customer">
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full sm:w-auto"
                >
                  Daftar sebagai Customer
                </Button>
              </Link>
              <Link to="/register?tab=vendor">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-white text-white"
                >
                  Daftar sebagai Vendor
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;
