import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../../contexts/AuthContext";
import { authAPI } from "../../services/api";
import { UserCheck, AlertTriangle, ArrowRight } from "lucide-react";
import Button from "../../components/UI/Button";
import Input from "../../components/UI/Input";
import Card, {
  CardBody,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/UI/Card";
import toast from "react-hot-toast";

const SuperAdminLoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [userRole, setUserRole] = useState(null); // Role dari database
  const [isCheckingRole, setIsCheckingRole] = useState(false);
  const [emailEntered, setEmailEntered] = useState(false); // Track if email has been entered
  const { isAuthenticated, user, superAdminLogin } = useAuth();
  const navigate = useNavigate();
  const checkRoleTimeoutRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm();

  // Redirect if already logged in as superadmin
  useEffect(() => {
    if (isAuthenticated && user && user.role === "super_user") {
      navigate("/admin");
    }
  }, [isAuthenticated, user, navigate]);

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

        // Show immediate feedback if role is not super_user
        if (detectedRole !== "super_user") {
          toast.error(
            `Email ini terdaftar sebagai ${
              detectedRole === "customer" ? "Customer" : "Vendor"
            }. Hanya Super Administrator yang dapat mengakses halaman ini.`
          );
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
          "Email tidak terdaftar. Silakan periksa email Anda atau hubungi administrator."
        );
      } else {
        toast.error("Gagal memeriksa role user. Silakan coba lagi.");
      }
    } finally {
      setIsCheckingRole(false);
    }
  };

  const onSubmit = async (data) => {
    // Check if user role matches super_user
    if (userRole && userRole !== "super_user") {
      toast.error(
        `Email ini terdaftar sebagai ${
          userRole === "customer" ? "Customer" : "Vendor"
        }. Hanya Super Administrator yang dapat mengakses halaman ini.`
      );
      return;
    }

    // If no role detected yet, show error and prevent login
    if (!userRole) {
      toast.error(
        "Email tidak terdaftar atau tidak valid. Pastikan email yang Anda masukkan terdaftar sebagai Super Administrator."
      );
      return;
    }

    setIsLoading(true);

    try {
      const result = await superAdminLogin(data);
      if (result.success) {
        // Redirect to admin dashboard
        navigate("/admin");
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-red-50 to-red-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Memuat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-red-100 flex flex-col justify-center py-6 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 hero-pattern opacity-5"></div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-red-100 rounded-full opacity-20 animate-float"></div>
      <div
        className="absolute top-40 right-20 w-16 h-16 bg-red-200 rounded-full opacity-20 animate-float"
        style={{ animationDelay: "1s" }}
      ></div>
      <div
        className="absolute bottom-20 left-20 w-12 h-12 bg-red-300 rounded-full opacity-20 animate-float"
        style={{ animationDelay: "2s" }}
      ></div>

      <div className="relative z-10">
        {/* Trust Indicators */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <UserCheck className="w-4 h-4 text-red-500" />
              <span>Super Admin Only</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>High Security</span>
            </div>
          </div>
        </div>

        <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md">
          <Card>
            <CardHeader gradient>
              <div className="text-center">
                <div className="mx-auto h-12 w-12 bg-red-600 rounded-full flex items-center justify-center mb-4">
                  <UserCheck className="h-6 w-6 text-white" />
                </div>
                <CardTitle size="lg" className="text-center text-red-600">
                  Super Admin Login
                </CardTitle>
                <CardDescription className="text-center">
                  Halaman khusus untuk Super Administrator
                </CardDescription>
              </div>
            </CardHeader>

            <CardBody padding="lg">
              <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <div>
                  <Input
                    label="Email"
                    type="email"
                    autoComplete="email"
                    placeholder="superadmin@mail.com"
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
                          // Debounce the API call
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
                      {userRole === "super_user" ? (
                        <div className="flex items-center space-x-2 text-sm text-green-600">
                          <span>✓ Email terdaftar sebagai Super Admin</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2 text-sm text-red-600">
                          <span>
                            ⚠ Email terdaftar sebagai{" "}
                            {userRole === "customer" ? "Customer" : "Vendor"}
                          </span>
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
                          atau hubungi administrator.
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
                    placeholder="Masukkan password super admin"
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
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
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
                      className="font-semibold text-red-600 hover:text-red-500 transition-colors duration-200"
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
                    isLoading={isSubmitting || isLoading || isCheckingRole}
                    disabled={
                      isSubmitting ||
                      isLoading ||
                      isCheckingRole ||
                      (userRole && userRole !== "super_user") ||
                      (emailEntered && !userRole)
                    }
                  >
                    {isSubmitting || isLoading
                      ? "Memproses..."
                      : isCheckingRole
                      ? "Memeriksa role..."
                      : userRole && userRole !== "super_user"
                      ? "Email tidak memiliki akses Super Admin"
                      : emailEntered && !userRole
                      ? "Email tidak terdaftar"
                      : "Login sebagai Super Admin"}
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
                      Atau
                    </span>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <Link
                    to="/login"
                    className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200"
                  >
                    <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                    Kembali ke halaman login biasa
                  </Link>
                </div>
              </div>

              {/* Security Notice */}
              <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium text-yellow-800">
                      Keamanan Super Admin
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <ul className="list-disc list-inside space-y-1">
                        <li>Pastikan Anda menggunakan koneksi yang aman</li>
                        <li>Jangan bagikan kredensial login dengan siapapun</li>
                        <li>Logout setelah selesai menggunakan sistem</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminLoginPage;
