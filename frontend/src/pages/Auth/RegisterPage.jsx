import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../../contexts/AuthContext";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  Phone,
  ArrowRight,
  Shield,
  CheckCircle,
  Users,
  Store,
} from "lucide-react";
import Button from "../../components/UI/Button";
import Input from "../../components/UI/Input";
import Select from "../../components/UI/Select";
import Card, {
  CardBody,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/UI/Card";

function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register: registerUser, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const password = watch("password");

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data) => {
    const result = await registerUser(data);
    if (result.success) {
      // Redirect to login page with success message
      navigate("/login", {
        state: {
          message: "Registrasi berhasil! Silakan login dengan akun Anda.",
        },
      });
    }
  };

  const roleOptions = [
    { value: "customer", label: "Customer", icon: Users },
    { value: "vendor", label: "Vendor", icon: Store },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <p className="text-gray-600 font-medium">Memuat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 hero-pattern opacity-5"></div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary-100 rounded-full opacity-20 animate-float"></div>
      <div
        className="absolute top-40 right-20 w-16 h-16 bg-accent-100 rounded-full opacity-20 animate-float"
        style={{ animationDelay: "1s" }}
      ></div>
      <div
        className="absolute bottom-20 left-20 w-12 h-12 bg-primary-200 rounded-full opacity-20 animate-float"
        style={{ animationDelay: "2s" }}
      ></div>

      <div className="relative z-10">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-3">
              <div className="text-left">
                <h1 className="text-3xl font-bold text-gradient">
                  Wedding Dream
                </h1>
                <p className="text-sm text-gray-500 -mt-1">
                  Platform Terpercaya
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="heading-lg text-gray-900 mb-4">
              Bergabung dengan Kami
            </h2>
            <p className="text-gray-600 text-lg">
              Daftar akun baru untuk memulai perjalanan pernikahan impian Anda
            </p>
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <Card hover glow>
            <CardHeader gradient>
              <CardTitle size="lg" className="text-center">
                Buat Akun Baru
              </CardTitle>
              <CardDescription className="text-center">
                Isi informasi di bawah ini untuk membuat akun
              </CardDescription>
            </CardHeader>

            <CardBody padding="lg">
              <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <div>
                  <Input
                    label="Nama Lengkap"
                    type="text"
                    autoComplete="name"
                    placeholder="Masukkan nama lengkap"
                    error={errors.name?.message}
                    required
                    {...register("name", {
                      required: "Nama wajib diisi",
                      minLength: {
                        value: 3,
                        message: "Nama minimal 3 karakter",
                      },
                    })}
                  />
                </div>

                <div>
                  <Input
                    label="Email"
                    type="email"
                    autoComplete="email"
                    placeholder="nama@email.com"
                    error={errors.email?.message}
                    required
                    {...register("email", {
                      required: "Email wajib diisi",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Format email tidak valid",
                      },
                    })}
                  />
                </div>

                <div>
                  <Input
                    label="Nomor Telepon"
                    type="tel"
                    autoComplete="tel"
                    placeholder="08xxxxxxxxxx"
                    error={errors.phone?.message}
                    {...register("phone", {
                      pattern: {
                        value: /^08\d{8,11}$/,
                        message: "Format nomor telepon tidak valid",
                      },
                    })}
                  />
                </div>

                <div>
                  <Select
                    label="Pilih Role"
                    options={roleOptions}
                    placeholder="Pilih role Anda"
                    error={errors.role?.message}
                    required
                    {...register("role", {
                      required: "Role wajib dipilih",
                    })}
                  />
                </div>

                <div>
                  <Input
                    label="Password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Masukkan password"
                    error={errors.password?.message}
                    showPasswordToggle
                    required
                    {...register("password", {
                      required: "Password wajib diisi",
                      minLength: {
                        value: 8,
                        message: "Password minimal 8 karakter",
                      },
                      pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                        message:
                          "Password harus mengandung huruf besar, huruf kecil, dan angka",
                      },
                    })}
                  />
                </div>

                <div>
                  <Input
                    label="Konfirmasi Password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Konfirmasi password"
                    error={errors.confirm_password?.message}
                    showPasswordToggle
                    required
                    {...register("confirm_password", {
                      required: "Konfirmasi password wajib diisi",
                      validate: (value) =>
                        value === password || "Password tidak sama",
                    })}
                  />
                </div>

                <div className="flex items-start">
                  <input
                    id="agree-terms"
                    name="agree-terms"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1"
                    {...register("agree_terms", {
                      required: "Anda harus menyetujui syarat dan ketentuan",
                    })}
                  />
                  <label
                    htmlFor="agree-terms"
                    className="ml-3 block text-sm text-gray-700"
                  >
                    Saya menyetujui{" "}
                    <a
                      href="#"
                      className="text-primary-600 hover:text-primary-500 font-semibold"
                    >
                      Syarat dan Ketentuan
                    </a>{" "}
                    dan{" "}
                    <a
                      href="#"
                      className="text-primary-600 hover:text-primary-500 font-semibold"
                    >
                      Kebijakan Privasi
                    </a>
                  </label>
                </div>
                {errors.agree_terms && (
                  <p className="text-sm text-danger-600 font-medium flex items-center">
                    <span className="w-1 h-1 bg-danger-500 rounded-full mr-2"></span>
                    {errors.agree_terms.message}
                  </p>
                )}

                <div>
                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    gradient
                    glow
                    isLoading={isSubmitting}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Memproses..." : "Daftar Sekarang"}
                  </Button>
                </div>
              </form>

              <div className="mt-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500 font-medium">
                      Atau daftar dengan
                    </span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center items-center py-3 px-4 border border-gray-200 rounded-xl shadow-sm bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 hover:scale-105"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    <span className="ml-2">Google</span>
                  </button>

                  <button
                    type="button"
                    className="w-full inline-flex justify-center items-center py-3 px-4 border border-gray-200 rounded-xl shadow-sm bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 hover:scale-105"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    <span className="ml-2">Facebook</span>
                  </button>
                </div>
              </div>

              <div className="mt-8 text-center">
                <p className="text-gray-600">
                  Sudah punya akun?{" "}
                  <Link
                    to="/login"
                    className="font-semibold text-primary-600 hover:text-primary-500 transition-colors duration-200 inline-flex items-center group"
                  >
                    Masuk sekarang
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
                  </Link>
                </p>
              </div>
            </CardBody>
          </Card>

          {/* Trust Indicators */}
          <div className="mt-8 text-center">
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-success-500" />
                <span>100% Aman</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-success-500" />
                <span>Terpercaya</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
