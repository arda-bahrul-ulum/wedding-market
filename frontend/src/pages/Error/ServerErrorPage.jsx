import { Link } from "react-router-dom";
import { AlertTriangle, Home, RefreshCw, Mail } from "lucide-react";
import Button from "../../components/UI/Button";

function ServerErrorPage() {
  const handleRefresh = () => {
    window.location.reload();
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Error Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-12 h-12 text-red-500" />
          </div>
          <h1 className="text-6xl font-bold text-gray-900 mb-2">500</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Server Error
          </h2>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <p className="text-gray-600 leading-relaxed mb-4">
            Maaf, terjadi kesalahan pada server kami. Tim teknis kami telah
            diberitahu dan sedang bekerja untuk memperbaikinya.
          </p>
          <p className="text-sm text-gray-500">
            Silakan coba lagi dalam beberapa menit atau hubungi customer support
            jika masalah berlanjut.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 mb-8">
          <Button onClick={handleRefresh} className="w-full">
            <RefreshCw className="w-4 h-4 mr-2" />
            Coba Lagi
          </Button>
          <Button variant="outline" onClick={handleGoBack} className="w-full">
            Kembali ke Halaman Sebelumnya
          </Button>
          <Link to="/" className="block">
            <Button variant="outline" className="w-full">
              <Home className="w-4 h-4 mr-2" />
              Kembali ke Beranda
            </Button>
          </Link>
        </div>

        {/* Support Contact */}
        <div className="border-t border-gray-200 pt-6">
          <p className="text-sm text-gray-600 mb-3">
            Butuh bantuan lebih lanjut?
          </p>
          <a
            href="mailto:support@weddingcommerce.com"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            <Mail className="w-4 h-4 mr-2" />
            support@weddingcommerce.com
          </a>
        </div>

        {/* Error Code */}
        <div className="mt-8 text-xs text-gray-400">
          Error Code: 500 | Server Internal Error
        </div>
      </div>
    </div>
  );
}

export default ServerErrorPage;

