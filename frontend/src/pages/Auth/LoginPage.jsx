import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../../contexts/AuthContext";
import { authAPI } from "../../services/api";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  Shield,
  CheckCircle,
  User,
  Store,
  Users,
  Building2,
} from "lucide-react";
import Button from "../../components/UI/Button";
import Input from "../../components/UI/Input";
import Card, {
  CardBody,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/UI/Card";
import toast from "react-hot-toast";

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loginType, setLoginType] = useState("customer"); // "customer" or "vendor"
  const [userRole, setUserRole] = useState(null); // Role dari database
  const [isCheckingRole, setIsCheckingRole] = useState(false);
  const [emailEntered, setEmailEntered] = useState(false); // Track if email has been entered
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const hasShownToast = useRef(false);
  const checkRoleTimeoutRef = useRef(null);

  const from = location.state?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  // Show success message from registration
  useEffect(() => {
    if (location.state?.message && !hasShownToast.current) {
      toast.success(location.state.message);
      hasShownToast.current = true;
      // Clear the message from state to prevent showing it again
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state?.message, location.pathname, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  // Reset form when login type changes
  useEffect(() => {
    reset({
      email: "",
      password: "",
      role: loginType, // Ensure role is set to current tab
    });
    setUserRole(null); // Reset user role when login type changes
    setEmailEntered(false); // Reset email entered state

    // Clear any pending timeout
    if (checkRoleTimeoutRef.current) {
      clearTimeout(checkRoleTimeoutRef.current);
    }
  }, [loginType, reset]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (checkRoleTimeoutRef.current) {
        clearTimeout(checkRoleTimeoutRef.current);
      }
    };
  }, []);

  // Function to check user role by email
  const checkUserRole = async (email) => {
    if (!email || !email.includes("@")) {
      setUserRole(null);
      setEmailEntered(false);
      return;
    }

    setIsCheckingRole(true);

    try {
      const response = await authAPI.checkRole(email);
      if (response.data.success) {
        const detectedRole = response.data.data.role;
        setUserRole(detectedRole);
        setEmailEntered(true);
        console.log("User role found:", detectedRole);

        // Show immediate feedback if role doesn't match selected tab
        if (detectedRole !== loginType) {
          toast.error(`Email tidak sesuai`);
        } else {
          // Clear any previous error messages when role matches
          toast.dismiss();
        }
      }
    } catch (error) {
      console.log(
        "User not found or error checking role:",
        error.response?.data?.message || error.message
      );
      setUserRole(null);
      setEmailEntered(true); // Still consider email as entered even if not found

      // Show toast error for email not found
      if (error.response?.status === 404) {
        toast.error(
          "Email tidak terdaftar. Silakan periksa email Anda atau daftar terlebih dahulu."
        );
      } else {
        toast.error("Gagal memeriksa role user. Silakan coba lagi.");
      }
    } finally {
      setIsCheckingRole(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      // Force role to match selected login type
      const loginData = {
        ...data,
        role: loginType, // Always use the selected tab role
      };

      // Check if user role matches selected login type
      if (userRole && userRole !== loginType) {
        toast.error(
          `Email ini terdaftar sebagai ${
            userRole === "customer" ? "Customer" : "Vendor"
          }. ` +
            `Silakan pilih tab ${
              userRole === "customer" ? "Customer" : "Vendor"
            } untuk login.`
        );
        return;
      }

      // If no role detected yet, show error and prevent login
      if (!userRole) {
        toast.error(
          `Email tidak terdaftar atau tidak valid. Pastikan email yang Anda masukkan terdaftar`
        );
        return;
      }

      console.log("Attempting login with role:", loginType);
      const result = await login(loginData);
      if (result.success) {
        navigate(from, { replace: true });
      }
    } catch (error) {
      // Error handling is done in AuthContext
      console.error("Login error:", error);
    }
  };

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex flex-col justify-center py-6 sm:px-6 lg:px-8 relative overflow-hidden">
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
        {/* Trust Indicators */}
        <div className="text-center mb-6">
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

        <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md">
          <Card>
            <CardHeader gradient>
              <CardTitle size="lg" className="text-center">
                Masuk ke Akun
              </CardTitle>
              <CardDescription className="text-center">
                Pilih jenis akun dan masukkan kredensial Anda
              </CardDescription>
            </CardHeader>

            <CardBody padding="lg">
              {/* Login Type Tabs */}
              <div className="mb-6">
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    type="button"
                    onClick={() => setLoginType("customer")}
                    className={`flex-1 flex items-center justify-center py-3 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                      loginType === "customer"
                        ? "bg-white text-primary-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Customer
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoginType("vendor")}
                    className={`flex-1 flex items-center justify-center py-3 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                      loginType === "vendor"
                        ? "bg-white text-primary-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <Store className="w-4 h-4 mr-2" />
                    Vendor
                  </button>
                </div>
              </div>

              {/* Login Type Description */}
              <div className="mb-6 text-center">
                {loginType === "customer" ? (
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>Masuk sebagai pelanggan untuk booking jasa</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                    <Building2 className="w-4 h-4" />
                    <span>Masuk sebagai vendor untuk mengelola bisnis</span>
                  </div>
                )}
              </div>

              <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                {/* Hidden input to ensure role is included in form data - always matches selected tab */}
                <input
                  type="hidden"
                  {...register("role")}
                  value={loginType}
                  readOnly
                />
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
                      onChange: (e) => {
                        // Check role when email changes
                        const email = e.target.value;
                        const isValidEmail = email && email.includes("@");
                        setEmailEntered(isValidEmail);

                        // Clear previous timeout
                        if (checkRoleTimeoutRef.current) {
                          clearTimeout(checkRoleTimeoutRef.current);
                        }

                        if (isValidEmail) {
                          // Debounce the API call with longer timeout
                          checkRoleTimeoutRef.current = setTimeout(() => {
                            checkUserRole(email);
                          }, 800);
                        } else {
                          setUserRole(null);
                          setEmailEntered(false);
                        }
                      },
                    })}
                  />
                  {isCheckingRole && (
                    <p className="text-sm text-gray-500 mt-1">
                      Memeriksa role user...
                    </p>
                  )}
                  {userRole && (
                    <div className="mt-2">
                      {userRole === loginType ? (
                        <div className="flex items-center space-x-2 text-sm text-green-600">
                          <span>✓ Email terdaftar</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2 text-sm text-red-600">
                          <span>⚠ Email tidak sesuai</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Show warning when email is entered but not found */}
                  {emailEntered && !userRole && !isCheckingRole && (
                    <div className="mt-2">
                      <div className="flex items-center space-x-2 text-sm text-red-600">
                        <span>
                          ⚠ Email tidak terdaftar. Silakan periksa email Anda
                          atau daftar terlebih dahulu.
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <Input
                    label="Password"
                    type="password"
                    autoComplete="current-password"
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
                    })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="remember-me"
                      className="ml-2 block text-sm font-medium text-gray-700"
                    >
                      Ingat saya
                    </label>
                  </div>

                  <div className="text-sm">
                    <a
                      href="#"
                      className="font-semibold text-primary-600 hover:text-primary-500 transition-colors duration-200"
                    >
                      Lupa password?
                    </a>
                  </div>
                </div>

                <div>
                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    gradient
                    glow
                    isLoading={isSubmitting || isCheckingRole}
                    disabled={
                      isSubmitting ||
                      isCheckingRole ||
                      (userRole && userRole !== loginType) ||
                      (emailEntered && !userRole)
                    }
                  >
                    {isSubmitting
                      ? "Memproses..."
                      : isCheckingRole
                      ? "Memeriksa role..."
                      : userRole && userRole !== loginType
                      ? "Email tidak sesuai"
                      : emailEntered && !userRole
                      ? "Email tidak terdaftar"
                      : `Masuk sebagai ${
                          loginType === "customer" ? "Customer" : "Vendor"
                        }`}
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
                      Atau lanjutkan dengan
                    </span>
                  </div>
                </div>

                <div className="mt-6 flex justify-center">
                  <button
                    type="button"
                    className="w-full max-w-xs inline-flex justify-center items-center py-3 px-6 border border-gray-200 rounded-xl shadow-sm bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 hover:scale-105"
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
                    <span className="ml-2">Lanjutkan dengan Google</span>
                  </button>
                </div>
              </div>

              <div className="mt-8 text-center">
                <p className="text-gray-600">
                  Belum punya akun?{" "}
                  <Link
                    to={`/register?tab=${loginType}`}
                    className="font-semibold text-primary-600 hover:text-primary-500 transition-colors duration-200 inline-flex items-center group"
                  >
                    Daftar sebagai{" "}
                    {loginType === "customer" ? "Customer" : "Vendor"}
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
                  </Link>
                </p>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
