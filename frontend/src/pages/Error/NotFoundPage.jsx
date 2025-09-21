import { Link } from "react-router-dom";
import { Home, Search, ArrowLeft } from "lucide-react";
import Button from "../../components/UI/Button";

function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          {/* 404 Illustration */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-32 h-32 bg-primary-100 rounded-full mb-6">
              <span className="text-6xl font-bold text-primary-600">404</span>
            </div>
          </div>

          {/* Error Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Halaman Tidak Ditemukan
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Maaf, halaman yang Anda cari tidak dapat ditemukan. Halaman mungkin
            telah dipindahkan atau tidak tersedia.
          </p>

          {/* Action Buttons */}
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <Link to="/">
              <Button size="lg" className="w-full sm:w-auto">
                <Home className="w-5 h-5 mr-2" />
                Kembali ke Beranda
              </Button>
            </Link>
            <Link to="/marketplace">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                <Search className="w-5 h-5 mr-2" />
                Booking Vendor
              </Button>
            </Link>
          </div>

          {/* Go Back Button */}
          <div className="mt-8">
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center text-primary-600 hover:text-primary-500 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Kembali ke halaman sebelumnya
            </button>
          </div>
        </div>
      </div>

      {/* Helpful Links */}
      <div className="mt-16">
        <div className="max-w-md mx-auto">
          <h2 className="text-lg font-semibold text-gray-900 text-center mb-6">
            Halaman Populer
          </h2>
          <div className="grid grid-cols-1 gap-4">
            <Link
              to="/marketplace"
              className="block p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all"
            >
              <h3 className="font-medium text-gray-900 mb-1">Booking Vendor</h3>
              <p className="text-sm text-gray-600">
                Temukan vendor pernikahan terbaik
              </p>
            </Link>
            <Link
              to="/about"
              className="block p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all"
            >
              <h3 className="font-medium text-gray-900 mb-1">Tentang Kami</h3>
              <p className="text-sm text-gray-600">
                Pelajari lebih lanjut tentang Wedding Dream
              </p>
            </Link>
            <Link
              to="/contact"
              className="block p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all"
            >
              <h3 className="font-medium text-gray-900 mb-1">Kontak</h3>
              <p className="text-sm text-gray-600">Hubungi tim support kami</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
