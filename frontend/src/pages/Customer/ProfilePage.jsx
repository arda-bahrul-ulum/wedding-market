import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../contexts/AuthContext";
import { userAPI } from "../../services/api";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Save,
  Calendar,
  Edit3,
  X,
  Lock,
  UserCheck,
  Eye,
  EyeOff,
} from "lucide-react";
import { formatDate } from "../../utils/format";
import Card, { CardBody, CardHeader } from "../../components/UI/Card";
import Button from "../../components/UI/Button";
import Input from "../../components/UI/Input";
import LoadingSpinner from "../../components/UI/LoadingSpinner";
import toast from "react-hot-toast";

function ProfilePage() {
  const { user, updateUser, isLoading: authLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profile, setProfile] = useState(null);
  const [showChangeEmail, setShowChangeEmail] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showLoginActivity, setShowLoginActivity] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [stats, setStats] = useState({
    total_orders: 0,
    completed_orders: 0,
    wishlist_items: 0,
    reviews_given: 0,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting: formSubmitting },
    reset,
  } = useForm();

  useEffect(() => {
    if (user) {
      // Set profile data if exists, otherwise create empty profile
      const profileData = user.customer_profile || {
        full_name: user.name || "",
        phone: "",
        address: "",
        city: "",
        province: "",
        postal_code: "",
        birth_date: "",
        gender: "",
        bio: "",
        is_active: true,
      };

      setProfile(profileData);
      reset({
        full_name: profileData.full_name || "",
        phone: profileData.phone || "",
        address: profileData.address || "",
        city: profileData.city || "",
        province: profileData.province || "",
        postal_code: profileData.postal_code || "",
        birth_date: profileData.birth_date
          ? new Date(profileData.birth_date).toISOString().split("T")[0]
          : "",
        gender: profileData.gender || "",
        bio: profileData.bio || "",
      });

      // Load user statistics
      loadUserStats();
    }
  }, [user, reset]);

  const loadUserStats = async () => {
    try {
      // Mock data for now - in real app, this would come from API
      setStats({
        total_orders: 12,
        completed_orders: 8,
        wishlist_items: 5,
        reviews_given: 3,
      });
    } catch (error) {
      console.error("Error loading user stats:", error);
    }
  };

  // Show loading while auth is loading
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="text-gray-600 font-medium mt-4">Memuat profil...</p>
        </div>
      </div>
    );
  }

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await userAPI.updateProfile({
        ...data,
        profile_type: "customer",
      });

      if (response.data.success) {
        const updatedProfile =
          response.data.data.customer_profile || response.data.data;
        setProfile(updatedProfile);
        updateUser({
          ...user,
          customer_profile: updatedProfile,
        });
        setIsEditing(false);
        toast.success("Profil berhasil diperbarui!");
      }
    } catch (error) {
      console.error("Update profile error:", error);
      toast.error("Gagal memperbarui profil");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  const handleChangeEmail = async (data) => {
    try {
      // Mock implementation - in real app, this would call API
      toast.success("Email berhasil diubah!");
      setShowChangeEmail(false);
    } catch (error) {
      toast.error("Gagal mengubah email");
    }
  };

  const handleChangePassword = async (data) => {
    try {
      // Mock implementation - in real app, this would call API
      toast.success("Password berhasil diubah!");
      setShowChangePassword(false);
    } catch (error) {
      toast.error("Gagal mengubah password");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container-custom py-8">
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Profil Saya
          </h1>
          <p className="text-lg text-gray-600">
            Kelola informasi profil dan preferensi Anda
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-gray-900">
                  Informasi Profil
                </h2>
                <p className="text-sm text-gray-600">
                  Data pribadi dan kontak Anda
                </p>
              </CardHeader>
              <CardBody>
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <User className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {profile?.full_name || user?.name || "Nama belum diisi"}
                  </h3>
                  <p className="text-gray-600 mb-4">{user?.email}</p>
                  <div className="flex items-center justify-center space-x-2">
                    <span className="inline-block px-3 py-1 text-xs font-semibold bg-primary-100 text-primary-800 rounded-full">
                      Customer
                    </span>
                    <span
                      className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                        profile?.is_active !== false
                          ? "bg-success-100 text-success-800"
                          : "bg-danger-100 text-danger-800"
                      }`}
                    >
                      {profile?.is_active !== false ? "Aktif" : "Nonaktif"}
                    </span>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="w-4 h-4 mr-3 text-primary-500" />
                    <span>{user?.email}</span>
                  </div>
                  {profile?.phone && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="w-4 h-4 mr-3 text-primary-500" />
                      <span>{profile.phone}</span>
                    </div>
                  )}
                  {profile?.city && (
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-3 text-primary-500" />
                      <span>
                        {profile.city}
                        {profile.province && `, ${profile.province}`}
                      </span>
                    </div>
                  )}
                  {profile?.birth_date && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-3 text-primary-500" />
                      <span>{formatDate(profile.birth_date)}</span>
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Edit Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Edit Profil
                    </h2>
                    <p className="text-sm text-gray-600">
                      Perbarui informasi profil Anda
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    {!isEditing ? (
                      <Button onClick={() => setIsEditing(true)} size="sm">
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    ) : (
                      <>
                        <Button
                          onClick={handleCancel}
                          variant="outline"
                          size="sm"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Batal
                        </Button>
                        <Button
                          onClick={handleSubmit(onSubmit)}
                          size="sm"
                          isLoading={formSubmitting || isSubmitting}
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Simpan
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardBody>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Input
                        label="Nama Lengkap"
                        placeholder="Masukkan nama lengkap"
                        disabled={!isEditing}
                        error={errors.full_name?.message}
                        {...register("full_name", {
                          required: "Nama lengkap wajib diisi",
                          minLength: {
                            value: 3,
                            message: "Nama minimal 3 karakter",
                          },
                        })}
                      />
                    </div>

                    <div>
                      <Input
                        label="Nomor Telepon"
                        placeholder="08xxxxxxxxxx"
                        disabled={!isEditing}
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
                        label="Tanggal Lahir"
                        type="date"
                        disabled={!isEditing}
                        error={errors.birth_date?.message}
                        {...register("birth_date")}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Jenis Kelamin
                      </label>
                      <select
                        {...register("gender")}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      >
                        <option value="">Pilih jenis kelamin</option>
                        <option value="male">Laki-laki</option>
                        <option value="female">Perempuan</option>
                        <option value="other">Lainnya</option>
                      </select>
                    </div>

                    <div>
                      <Input
                        label="Kota"
                        placeholder="Masukkan kota"
                        disabled={!isEditing}
                        error={errors.city?.message}
                        {...register("city")}
                      />
                    </div>

                    <div>
                      <Input
                        label="Provinsi"
                        placeholder="Masukkan provinsi"
                        disabled={!isEditing}
                        error={errors.province?.message}
                        {...register("province")}
                      />
                    </div>

                    <div>
                      <Input
                        label="Kode Pos"
                        placeholder="12345"
                        disabled={!isEditing}
                        error={errors.postal_code?.message}
                        {...register("postal_code", {
                          pattern: {
                            value: /^\d{5}$/,
                            message: "Kode pos harus 5 digit",
                          },
                        })}
                      />
                    </div>
                  </div>

                  <div>
                    <Input
                      label="Alamat Lengkap"
                      placeholder="Masukkan alamat lengkap"
                      disabled={!isEditing}
                      error={errors.address?.message}
                      {...register("address")}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      {...register("bio")}
                      disabled={!isEditing}
                      rows={4}
                      placeholder="Ceritakan tentang diri Anda..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                </form>
              </CardBody>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Stats */}
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-gray-900">
                  Statistik Akun
                </h2>
                <p className="text-sm text-gray-600">
                  Ringkasan aktivitas Anda
                </p>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Pesanan</span>
                  <span className="font-semibold text-primary-600">
                    {stats.total_orders}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pesanan Selesai</span>
                  <span className="font-semibold text-success-600">
                    {stats.completed_orders}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Item di Wishlist</span>
                  <span className="font-semibold text-warning-600">
                    {stats.wishlist_items}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Review Diberikan</span>
                  <span className="font-semibold text-info-600">
                    {stats.reviews_given}
                  </span>
                </div>
              </CardBody>
            </Card>

            {/* Security */}
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-gray-900">
                  Keamanan
                </h2>
                <p className="text-sm text-gray-600">Kelola keamanan akun</p>
              </CardHeader>
              <CardBody className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setShowChangeEmail(true)}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Ubah Email
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setShowChangePassword(true)}
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Ubah Password
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setShowLoginActivity(true)}
                >
                  <UserCheck className="w-4 h-4 mr-2" />
                  Aktivitas Login
                </Button>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>

      {/* Change Email Modal */}
      {showChangeEmail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Ubah Email
            </h3>
            <form
              onSubmit={handleSubmit(handleChangeEmail)}
              className="space-y-4"
            >
              <Input
                label="Email Baru"
                type="email"
                placeholder="Masukkan email baru"
                {...register("new_email", {
                  required: "Email baru wajib diisi",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Format email tidak valid",
                  },
                })}
                error={errors.new_email?.message}
              />
              <div className="flex space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowChangeEmail(false)}
                >
                  Batal
                </Button>
                <Button type="submit" className="flex-1">
                  Simpan
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showChangePassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Ubah Password
            </h3>
            <form
              onSubmit={handleSubmit(handleChangePassword)}
              className="space-y-4"
            >
              <div>
                <Input
                  label="Password Lama"
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan password lama"
                  {...register("old_password", {
                    required: "Password lama wajib diisi",
                  })}
                  error={errors.old_password?.message}
                />
              </div>
              <div>
                <Input
                  label="Password Baru"
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan password baru"
                  {...register("new_password", {
                    required: "Password baru wajib diisi",
                    minLength: {
                      value: 8,
                      message: "Password minimal 8 karakter",
                    },
                  })}
                  error={errors.new_password?.message}
                />
              </div>
              <div>
                <Input
                  label="Konfirmasi Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Konfirmasi password baru"
                  {...register("confirm_password", {
                    required: "Konfirmasi password wajib diisi",
                    validate: (value) => {
                      const newPassword = document.querySelector(
                        'input[name="new_password"]'
                      ).value;
                      return value === newPassword || "Password tidak cocok";
                    },
                  })}
                  error={errors.confirm_password?.message}
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="showPassword"
                  checked={showPassword}
                  onChange={(e) => setShowPassword(e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mr-2"
                />
                <label htmlFor="showPassword" className="text-sm text-gray-600">
                  Tampilkan password
                </label>
              </div>
              <div className="flex space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowChangePassword(false)}
                >
                  Batal
                </Button>
                <Button type="submit" className="flex-1">
                  Simpan
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Login Activity Modal */}
      {showLoginActivity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Aktivitas Login
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowLoginActivity(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Login Berhasil
                    </p>
                    <p className="text-xs text-gray-500">
                      Chrome di Windows 10
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-900">Sekarang</p>
                  <p className="text-xs text-gray-500">192.168.1.1</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Login Berhasil
                    </p>
                    <p className="text-xs text-gray-500">Safari di iPhone</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-900">2 jam yang lalu</p>
                  <p className="text-xs text-gray-500">192.168.1.2</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Login Gagal
                    </p>
                    <p className="text-xs text-gray-500">Password salah</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-900">1 hari yang lalu</p>
                  <p className="text-xs text-gray-500">192.168.1.3</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;
