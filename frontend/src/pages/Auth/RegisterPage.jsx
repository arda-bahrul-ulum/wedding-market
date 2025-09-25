import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../../contexts/AuthContext";
import { authAPI } from "../../services/api";
import toast from "react-hot-toast";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  Phone,
  ArrowRight,
  UserCheck,
  CheckCircle,
  Users,
  Store,
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

function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registerType, setRegisterType] = useState("customer"); // "customer" or "vendor"
  const [emailStatus, setEmailStatus] = useState(null); // null, 'checking', 'available', 'taken'
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    hasUpper: false,
    hasLower: false,
    hasNumber: false,
    hasNoSpace: false,
    hasSpecialChar: false,
    isValid: false,
    hasInput: false, // Track if password field has any input
  });
  const [passwordMatch, setPasswordMatch] = useState({
    isMatching: false,
    isChecking: false,
  });
  const { register: registerUser, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const checkEmailTimeoutRef = useRef(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      agree_terms: false,
    },
  });

  const password = watch("password");
  const agreeTermsForm = watch("agree_terms");

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Set register type based on URL parameter
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get("tab");

    if (tab === "customer" || tab === "vendor") {
      setRegisterType(tab);
    }
  }, [location.search]);

  // Reset form when register type changes
  useEffect(() => {
    reset({
      name: "",
      email: "",
      phone: "",
      password: "",
      confirm_password: "",
      role: registerType, // Auto-set role based on selected tab
    });
    setEmailStatus(null);
    setPasswordStrength({
      hasUpper: false,
      hasLower: false,
      hasNumber: false,
      hasNoSpace: false,
      hasSpecialChar: false,
      isValid: false,
      hasInput: false,
    });
    setPasswordMatch({
      isMatching: false,
      isChecking: false,
    });

    // Clear any pending timeout
    if (checkEmailTimeoutRef.current) {
      clearTimeout(checkEmailTimeoutRef.current);
    }
  }, [registerType, reset]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (checkEmailTimeoutRef.current) {
        clearTimeout(checkEmailTimeoutRef.current);
      }
    };
  }, []);

  // Function to check if email is already registered
  const checkEmailAvailability = async (email) => {
    if (!email || !email.includes("@")) {
      setEmailStatus(null);
      return;
    }

    setIsCheckingEmail(true);
    setEmailStatus("checking");

    try {
      const response = await authAPI.checkRole(email);
      if (response.data.success) {
        // Email is registered
        setEmailStatus("taken");
        toast.error(
          "Email sudah terdaftar. Silakan gunakan email lain atau login dengan email ini."
        );
      }
    } catch (error) {
      if (error.response?.status === 404) {
        // Email is available for registration
        setEmailStatus("available");
        toast.success("Email tersedia untuk registrasi");
      } else {
        // Other error
        setEmailStatus("error");
        toast.error("Gagal memeriksa ketersediaan email. Silakan coba lagi.");
      }
    } finally {
      setIsCheckingEmail(false);
    }
  };

  // Function to check password strength
  const checkPasswordStrength = (password) => {
    const hasInput = password && password.length > 0;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasNoSpace = !/\s/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(
      password
    );
    const isValid =
      hasUpper &&
      hasLower &&
      hasNumber &&
      hasNoSpace &&
      hasSpecialChar &&
      password.length >= 8;

    setPasswordStrength({
      hasUpper,
      hasLower,
      hasNumber,
      hasNoSpace,
      hasSpecialChar,
      isValid,
      hasInput,
    });
  };

  // Function to check password match
  const checkPasswordMatch = (confirmPassword) => {
    if (!confirmPassword) {
      setPasswordMatch({
        isMatching: false,
        isChecking: false,
      });
      return;
    }

    setPasswordMatch({
      isMatching: confirmPassword === password,
      isChecking: false,
    });
  };

  const onSubmit = async (data) => {
    try {
      console.log("Form data:", data);
      console.log("agree_terms from form:", data.agree_terms);
      console.log("agreeTermsForm from watch:", agreeTermsForm);

      // Check if terms are agreed
      if (!data.agree_terms) {
        toast.error(
          "Anda harus menyetujui syarat dan ketentuan terlebih dahulu."
        );
        return;
      }

      // Check if email is already taken
      if (emailStatus === "taken") {
        toast.error("Email sudah terdaftar. Silakan gunakan email lain.");
        return;
      }

      // If email status is still checking, wait
      if (emailStatus === "checking") {
        toast.error("Tunggu sebentar, sedang memeriksa email...");
        return;
      }

      // If email status is error, prevent registration
      if (emailStatus === "error") {
        toast.error("Gagal memeriksa email. Silakan coba lagi.");
        return;
      }

      // Check password strength
      if (!passwordStrength.isValid) {
        toast.error(
          "Password tidak memenuhi kriteria keamanan. Pastikan password mengandung huruf kapital, huruf kecil, angka, karakter khusus, dan tidak ada spasi."
        );
        return;
      }

      // Check password match
      if (!passwordMatch.isMatching) {
        toast.error("Password dan konfirmasi password tidak sama.");
        return;
      }

      // Ensure role is properly set based on selected tab
      const registerData = {
        ...data,
        role: registerType, // Auto-set role based on selected tab
      };

      console.log("Attempting registration with role:", registerType);
      const result = await registerUser(registerData);
      if (result.success) {
        // Redirect to login page with success message
        navigate("/login", {
          state: {
            message: "Registrasi berhasil! Silakan login dengan akun Anda.",
          },
        });
      }
    } catch (error) {
      // Error handling is done in AuthContext
      console.error("Registration error:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 font-medium">Memuat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-6 sm:px-6 lg:px-8 relative overflow-hidden">
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
              <UserCheck className="w-4 h-4 text-success-500" />
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
                Buat Akun Baru
              </CardTitle>
              <CardDescription className="text-center">
                Pilih jenis akun dan isi informasi di bawah ini
              </CardDescription>
            </CardHeader>

            <CardBody padding="lg">
              {/* Register Type Tabs */}
              <div className="mb-6">
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    type="button"
                    onClick={() => setRegisterType("customer")}
                    className={`flex-1 flex items-center justify-center py-3 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                      registerType === "customer"
                        ? "bg-white text-primary-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Customer
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegisterType("vendor")}
                    className={`flex-1 flex items-center justify-center py-3 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                      registerType === "vendor"
                        ? "bg-white text-primary-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <Store className="w-4 h-4 mr-2" />
                    Vendor
                  </button>
                </div>
              </div>

              {/* Register Type Description */}
              <div className="mb-6 text-center">
                {registerType === "customer" ? (
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>Daftar sebagai pelanggan untuk booking jasa</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                    <Building2 className="w-4 h-4" />
                    <span>Daftar sebagai vendor untuk mengelola bisnis</span>
                  </div>
                )}
              </div>

              <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                {/* Hidden input to ensure role is included in form data - always matches selected tab */}
                <input
                  type="hidden"
                  {...register("role")}
                  value={registerType}
                  readOnly
                />
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
                      onChange: (e) => {
                        const email = e.target.value;

                        // Clear previous timeout
                        if (checkEmailTimeoutRef.current) {
                          clearTimeout(checkEmailTimeoutRef.current);
                        }

                        if (email && email.includes("@")) {
                          // Debounce the API call
                          checkEmailTimeoutRef.current = setTimeout(() => {
                            checkEmailAvailability(email);
                          }, 800);
                        } else {
                          setEmailStatus(null);
                        }
                      },
                    })}
                  />

                  {/* Email status indicators */}
                  {isCheckingEmail && (
                    <p className="text-sm text-gray-500 mt-1">
                      Memeriksa ketersediaan email...
                    </p>
                  )}

                  {emailStatus === "available" && (
                    <div className="mt-2">
                      <div className="flex items-center space-x-2 text-sm text-green-600">
                        <span>✓ Email tersedia untuk registrasi</span>
                      </div>
                    </div>
                  )}

                  {emailStatus === "taken" && (
                    <div className="mt-2">
                      <div className="flex items-center space-x-2 text-sm text-red-600">
                        <span>⚠ Email sudah terdaftar</span>
                      </div>
                    </div>
                  )}

                  {emailStatus === "error" && (
                    <div className="mt-2">
                      <div className="flex items-center space-x-2 text-sm text-red-600">
                        <span>⚠ Gagal memeriksa email</span>
                      </div>
                    </div>
                  )}
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
                        value:
                          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`])(?!.*\s)/,
                        message:
                          "Password harus mengandung huruf besar, huruf kecil, angka, karakter khusus, dan tidak boleh ada spasi",
                      },
                      onChange: (e) => {
                        checkPasswordStrength(e.target.value);
                      },
                    })}
                  />

                  {/* Password strength indicator */}
                  {password && (
                    <div className="mt-2 space-y-1">
                      <div className="text-sm text-gray-600">
                        Kekuatan password:
                      </div>
                      <div className="space-y-1">
                        <div
                          className={`flex items-center space-x-2 text-xs ${
                            passwordStrength.hasUpper
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          <span>{passwordStrength.hasUpper ? "✓" : "✗"}</span>
                          <span>Minimal 1 huruf kapital (A-Z)</span>
                        </div>
                        <div
                          className={`flex items-center space-x-2 text-xs ${
                            passwordStrength.hasLower
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          <span>{passwordStrength.hasLower ? "✓" : "✗"}</span>
                          <span>Minimal 1 huruf kecil (a-z)</span>
                        </div>
                        <div
                          className={`flex items-center space-x-2 text-xs ${
                            passwordStrength.hasNumber
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          <span>{passwordStrength.hasNumber ? "✓" : "✗"}</span>
                          <span>Minimal 1 angka (0-9)</span>
                        </div>
                        <div
                          className={`flex items-center space-x-2 text-xs ${
                            passwordStrength.hasNoSpace
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          <span>{passwordStrength.hasNoSpace ? "✓" : "✗"}</span>
                          <span>Tidak boleh ada spasi</span>
                        </div>
                        <div
                          className={`flex items-center space-x-2 text-xs ${
                            passwordStrength.hasSpecialChar
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          <span>
                            {passwordStrength.hasSpecialChar ? "✓" : "✗"}
                          </span>
                          <span>Minimal 1 karakter khusus (!@#$%^&*)</span>
                        </div>
                        <div
                          className={`flex items-center space-x-2 text-xs ${
                            password && password.length >= 8
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          <span>
                            {password && password.length >= 8 ? "✓" : "✗"}
                          </span>
                          <span>Minimal 8 karakter</span>
                        </div>
                      </div>
                    </div>
                  )}
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
                      onChange: (e) => {
                        checkPasswordMatch(e.target.value);
                      },
                    })}
                  />

                  {/* Password match indicator */}
                  {password && (
                    <div className="mt-2">
                      {passwordMatch.isMatching ? (
                        <div className="flex items-center space-x-2 text-sm text-green-600">
                          <span>✓ Password cocok</span>
                        </div>
                      ) : passwordMatch.isChecking ? (
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <span>Memeriksa password...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2 text-sm text-red-600">
                          <span>✗ Password tidak sama</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-start">
                  <input
                    id="agree-terms"
                    name="agree-terms"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1"
                    {...register("agree_terms", {
                      required: "Anda harus menyetujui syarat dan ketentuan",
                      onChange: (e) => {
                        // Clear any previous error messages when terms are agreed
                        if (e.target.checked) {
                          toast.dismiss();
                        }
                      },
                    })}
                  />
                  <label
                    htmlFor="agree-terms"
                    className="ml-3 block text-sm text-gray-700 cursor-pointer"
                    onClick={() => {
                      const checkbox = document.getElementById("agree-terms");
                      if (checkbox) {
                        checkbox.click();
                      }
                    }}
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
                    isLoading={isSubmitting || isCheckingEmail}
                    disabled={
                      isSubmitting ||
                      isCheckingEmail ||
                      emailStatus === "taken" ||
                      emailStatus === "error" ||
                      !agreeTermsForm ||
                      (passwordStrength.hasInput &&
                        !passwordStrength.isValid) ||
                      (passwordMatch.isMatching === false &&
                        password &&
                        password.length > 0)
                    }
                  >
                    {isSubmitting
                      ? "Memproses..."
                      : isCheckingEmail
                      ? "Memeriksa email..."
                      : emailStatus === "taken"
                      ? "Email sudah terdaftar"
                      : emailStatus === "error"
                      ? "Gagal memeriksa email"
                      : passwordStrength.hasInput && !passwordStrength.isValid
                      ? "Password tidak memenuhi kriteria"
                      : passwordMatch.isMatching === false &&
                        password &&
                        password.length > 0
                      ? "Password tidak sama"
                      : `Daftar sebagai ${
                          registerType === "customer" ? "Customer" : "Vendor"
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
                      Atau daftar dengan
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
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
