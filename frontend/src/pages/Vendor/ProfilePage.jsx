import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../contexts/AuthContext";
import { userAPI } from "../../services/api";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  Instagram,
  MessageCircle,
  Edit3,
  Save,
  X,
  Camera,
  Upload,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { formatDate } from "../../utils/format";
import LoadingSpinner from "../../components/UI/LoadingSpinner";
import Card, { CardBody, CardHeader } from "../../components/UI/Card";
import Button from "../../components/UI/Button";
import Input from "../../components/UI/Input";
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
      const profileData = user.vendor_profile || {
        business_name: user.name || "",
        business_type: "",
        description: "",
        address: "",
        city: "",
        province: "",
        postal_code: "",
        website: "",
        instagram: "",
        whatsapp: "",
        is_verified: false,
        is_active: true,
        subscription_plan: "Free",
      };

      setProfile(profileData);
      reset({
        business_name: profileData.business_name || "",
        business_type: profileData.business_type || "",
        description: profileData.description || "",
        address: profileData.address || "",
        city: profileData.city || "",
        province: profileData.province || "",
        postal_code: profileData.postal_code || "",
        website: profileData.website || "",
        instagram: profileData.instagram || "",
        whatsapp: profileData.whatsapp || "",
      });
    }
  }, [user, reset]);

  // Show loading while auth is loading
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="text-gray-600 font-medium mt-4">
            Memuat profil vendor...
          </p>
        </div>
      </div>
    );
  }

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await userAPI.updateProfile({
        ...data,
        profile_type: "vendor",
      });

      if (response.data.success) {
        const updatedProfile =
          response.data.data.vendor_profile || response.data.data;
        setProfile(updatedProfile);
        updateUser({
          ...user,
          vendor_profile: updatedProfile,
        });
        setIsEditing(false);
        toast.success("Profil vendor berhasil diperbarui!");
      }
    } catch (error) {
      console.error("Update profile error:", error);
      toast.error("Gagal memperbarui profil vendor");
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
            Profil Vendor
          </h1>
          <p className="text-lg text-gray-600">
            Kelola informasi bisnis dan profil vendor Anda
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-1">
            <Card hover>
              <CardHeader>
                <h2 className="text-lg font-semibold text-gray-900">
                  Informasi Bisnis
                </h2>
                <p className="text-sm text-gray-600">
                  Data bisnis dan verifikasi Anda
                </p>
              </CardHeader>
              <CardBody>
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Building2 className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {profile?.business_name ||
                      user?.name ||
                      "Nama bisnis belum diisi"}
                  </h3>
                  <p className="text-gray-600 mb-4">{user?.email}</p>
                  <div className="flex items-center justify-center space-x-2">
                    <span className="inline-block px-3 py-1 text-xs font-semibold bg-primary-100 text-primary-800 rounded-full">
                      Vendor
                    </span>
                    <span
                      className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${
                        profile?.is_verified
                          ? "bg-success-100 text-success-800"
                          : "bg-warning-100 text-warning-800"
                      }`}
                    >
                      {profile?.is_verified ? (
                        <>
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Terverifikasi
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Belum Terverifikasi
                        </>
                      )}
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
                  {profile?.website && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Globe className="w-4 h-4 mr-3 text-primary-500" />
                      <a
                        href={profile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700"
                      >
                        {profile.website}
                      </a>
                    </div>
                  )}
                  {profile?.instagram && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Instagram className="w-4 h-4 mr-3 text-primary-500" />
                      <a
                        href={`https://instagram.com/${profile.instagram}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700"
                      >
                        @{profile.instagram}
                      </a>
                    </div>
                  )}
                  {profile?.whatsapp && (
                    <div className="flex items-center text-sm text-gray-600">
                      <MessageCircle className="w-4 h-4 mr-3 text-primary-500" />
                      <a
                        href={`https://wa.me/${profile.whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700"
                      >
                        {profile.whatsapp}
                      </a>
                    </div>
                  )}
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-primary-50 to-accent-50 rounded-xl">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">
                    Paket Berlangganan
                  </h4>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary-600 capitalize">
                      {profile?.subscription_plan || "Free"}
                    </span>
                    {profile?.subscription_expires_at && (
                      <span className="text-xs text-gray-500">
                        Berakhir: {formatDate(profile.subscription_expires_at)}
                      </span>
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Edit Form */}
          <div className="lg:col-span-2">
            <Card hover>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Edit Profil Vendor
                    </h2>
                    <p className="text-sm text-gray-600">
                      Perbarui informasi bisnis Anda
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
                        label="Nama Bisnis"
                        placeholder="Masukkan nama bisnis"
                        disabled={!isEditing}
                        error={errors.business_name?.message}
                        {...register("business_name", {
                          required: "Nama bisnis wajib diisi",
                          minLength: {
                            value: 3,
                            message: "Nama bisnis minimal 3 karakter",
                          },
                        })}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tipe Bisnis
                      </label>
                      <select
                        {...register("business_type", {
                          required: "Tipe bisnis wajib dipilih",
                        })}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      >
                        <option value="">Pilih tipe bisnis</option>
                        <option value="personal">Personal</option>
                        <option value="company">Perusahaan</option>
                        <option value="wedding_organizer">
                          Wedding Organizer
                        </option>
                      </select>
                      {errors.business_type && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.business_type.message}
                        </p>
                      )}
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

                    <div>
                      <Input
                        label="Website"
                        placeholder="https://example.com"
                        disabled={!isEditing}
                        error={errors.website?.message}
                        {...register("website", {
                          pattern: {
                            value: /^https?:\/\/.+/,
                            message: "Format website tidak valid",
                          },
                        })}
                      />
                    </div>

                    <div>
                      <Input
                        label="Instagram"
                        placeholder="username (tanpa @)"
                        disabled={!isEditing}
                        error={errors.instagram?.message}
                        {...register("instagram")}
                      />
                    </div>

                    <div>
                      <Input
                        label="WhatsApp"
                        placeholder="628xxxxxxxxxx"
                        disabled={!isEditing}
                        error={errors.whatsapp?.message}
                        {...register("whatsapp", {
                          pattern: {
                            value: /^62\d{9,13}$/,
                            message: "Format WhatsApp tidak valid",
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
                      Deskripsi Bisnis
                    </label>
                    <textarea
                      {...register("description")}
                      disabled={!isEditing}
                      rows={4}
                      placeholder="Ceritakan tentang bisnis Anda..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                </form>
              </CardBody>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Business Stats */}
            <Card hover>
              <CardHeader>
                <h2 className="text-lg font-semibold text-gray-900">
                  Statistik Bisnis
                </h2>
                <p className="text-sm text-gray-600">
                  Ringkasan aktivitas bisnis Anda
                </p>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Pesanan</span>
                  <span className="font-semibold text-primary-600">24</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pesanan Selesai</span>
                  <span className="font-semibold text-success-600">18</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Layanan Aktif</span>
                  <span className="font-semibold text-warning-600">8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Rating Rata-rata</span>
                  <span className="font-semibold text-info-600">4.8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Portfolio</span>
                  <span className="font-semibold text-purple-600">12</span>
                </div>
              </CardBody>
            </Card>

            {/* Business Preferences */}
            <Card hover>
              <CardHeader>
                <h2 className="text-lg font-semibold text-gray-900">
                  Preferensi Bisnis
                </h2>
                <p className="text-sm text-gray-600">
                  Pengaturan notifikasi dan bisnis
                </p>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Notifikasi Pesanan</span>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Notifikasi Review</span>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Newsletter Bisnis</span>
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Tampilkan di Pencarian</span>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                </div>
              </CardBody>
            </Card>

            {/* Business Tools */}
            <Card hover>
              <CardHeader>
                <h2 className="text-lg font-semibold text-gray-900">
                  Tools Bisnis
                </h2>
                <p className="text-sm text-gray-600">
                  Kelola bisnis dan layanan Anda
                </p>
              </CardHeader>
              <CardBody className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Building2 className="w-4 h-4 mr-2" />
                  Kelola Layanan
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Globe className="w-4 h-4 mr-2" />
                  Kelola Portfolio
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Kelola Pesanan
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Instagram className="w-4 h-4 mr-2" />
                  Verifikasi Akun
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
