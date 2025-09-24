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
    }
  }, [user, reset]);

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
                  <span className="font-semibold text-primary-600">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pesanan Selesai</span>
                  <span className="font-semibold text-success-600">8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Item di Wishlist</span>
                  <span className="font-semibold text-warning-600">5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Review Diberikan</span>
                  <span className="font-semibold text-info-600">3</span>
                </div>
              </CardBody>
            </Card>

            {/* Preferences */}
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-gray-900">
                  Preferensi
                </h2>
                <p className="text-sm text-gray-600">Pengaturan notifikasi</p>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Notifikasi Email</span>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Notifikasi SMS</span>
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Newsletter</span>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
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
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="w-4 h-4 mr-2" />
                  Ubah Email
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Phone className="w-4 h-4 mr-2" />
                  Ubah Password
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MapPin className="w-4 h-4 mr-2" />
                  Aktivitas Login
                </Button>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
