import { Link } from "react-router-dom";
import {
  Heart,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  ArrowRight,
  Shield,
  Award,
  Users,
} from "lucide-react";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 hero-pattern opacity-5"></div>

      <div className="container-custom relative">
        {/* Main Footer Content */}
        <div className="py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-6 lg:col-span-1">
            <div className="flex items-center space-x-3">
              <div>
                <span className="text-2xl font-bold text-gradient">
                  Wedding Dream
                </span>
                <p className="text-xs text-gray-400 -mt-1">
                  Platform Terpercaya
                </p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Platform booking vendor jasa pernikahan terlengkap di Indonesia.
              Temukan vendor terbaik untuk pernikahan impian Anda dengan
              kepercayaan penuh.
            </p>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-success-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Shield className="w-6 h-6 text-success-600" />
                </div>
                <p className="text-xs text-gray-400 font-semibold">
                  Terpercaya
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-warning-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Award className="w-6 h-6 text-warning-600" />
                </div>
                <p className="text-xs text-gray-400 font-semibold">
                  Berkualitas
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Users className="w-6 h-6 text-primary-600" />
                </div>
                <p className="text-xs text-gray-400 font-semibold">Komunitas</p>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex space-x-4 pt-4">
              <a
                href="#"
                className="w-10 h-10 bg-gray-700 hover:bg-primary-600 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-700 hover:bg-primary-600 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-700 hover:bg-primary-600 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-700 hover:bg-primary-600 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white">Tautan Cepat</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/marketplace"
                  className="flex items-center text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium group"
                >
                  <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  Booking Vendor
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="flex items-center text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium group"
                >
                  <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="flex items-center text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium group"
                >
                  <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  Kontak
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium group"
                >
                  <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  Syarat & Ketentuan
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium group"
                >
                  <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  Kebijakan Privasi
                </a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white">Kategori Jasa</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="flex items-center text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium group"
                >
                  <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  Venue Pernikahan
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium group"
                >
                  <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  Make Up Artist
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium group"
                >
                  <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  Dekorasi & Bunga
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium group"
                >
                  <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  Fotografer
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium group"
                >
                  <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  Wedding Organizer
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white">Hubungi Kami</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-4 p-4 bg-gray-800/50 rounded-2xl hover:bg-gray-700/50 transition-all duration-300">
                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Email</p>
                  <p className="text-gray-300 text-sm">
                    support@weddingdream.com
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-gray-800/50 rounded-2xl hover:bg-gray-700/50 transition-all duration-300">
                <div className="w-10 h-10 bg-success-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-success-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Telepon</p>
                  <p className="text-gray-300 text-sm">+62 812 3456 7890</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-gray-800/50 rounded-2xl hover:bg-gray-700/50 transition-all duration-300">
                <div className="w-10 h-10 bg-warning-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-warning-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Alamat</p>
                  <p className="text-gray-300 text-sm">
                    Jl. Raya Surabaya No. 123
                    <br />
                    Surabaya, Jawa Timur
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="py-12 border-t border-gray-700">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              Dapatkan Update Terbaru
            </h3>
            <p className="text-gray-300 mb-8">
              Berlangganan newsletter kami untuk mendapatkan tips pernikahan dan
              penawaran khusus.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Masukkan email Anda"
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button className="btn btn-primary px-8 py-3 whitespace-nowrap">
                Berlangganan
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © {currentYear} Wedding Dream. Semua hak dilindungi.
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span>Dibuat dengan</span>
              <Heart className="w-4 h-4 text-red-500 animate-pulse" />
              <span>di Indonesia</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
