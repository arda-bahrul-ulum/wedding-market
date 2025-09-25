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
  UserCheck,
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
                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Telepon</p>
                  <p className="text-gray-300 text-sm">+62 812 3456 7890</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-gray-800/50 rounded-2xl hover:bg-gray-700/50 transition-all duration-300">
                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-primary-600" />
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

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 py-8">
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} Wedding Dream. Semua hak dilindungi.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
