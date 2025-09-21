import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, LogIn } from "lucide-react";
import Button from "./Button";

function SessionExpiredModal({ isOpen, onClose }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleLoginRedirect = () => {
    onClose();
    navigate("/login");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
        <div className="p-8 text-center">
          {/* Icon */}
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8 text-amber-600" />
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Sesi Login Berakhir
          </h3>

          {/* Message */}
          <p className="text-gray-600 mb-8 leading-relaxed">
            Sesi login Anda telah berakhir. Silakan login kembali untuk
            melanjutkan menggunakan aplikasi.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Tutup
            </Button>
            <Button
              onClick={handleLoginRedirect}
              className="flex-1 gradient glow"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Login Ulang
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SessionExpiredModal;
