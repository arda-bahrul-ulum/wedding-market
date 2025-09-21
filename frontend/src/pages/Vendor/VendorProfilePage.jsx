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
import Card, {
  CardBody,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/UI/Card";
import Button from "../../components/UI/Button";
import Input from "../../components/UI/Input";
import toast from "react-hot-toast";

function VendorProfilePage() {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm();

  useEffect(() => {
    if (user?.vendor_profile) {
      setProfile(user.vendor_profile);
      reset({
        business_name: user.vendor_profile.business_name || "",
        business_type: user.vendor_profile.business_type || "",
        description: user.vendor_profile.description || "",
        address: user.vendor_profile.address || "",
        city: user.vendor_profile.city || "",
        province: user.vendor_profile.province || "",
        postal_code: user.vendor_profile.postal_code || "",
        website: user.vendor_profile.website || "",
        instagram: user.vendor_profile.instagram || "",
        whatsapp: user.vendor_profile.whatsapp || "",
      });
    }
  }, [user, reset]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await userAPI.updateProfile({
        ...data,
        profile_type: "vendor",
      });

      if (response.data.success) {
        setProfile(response.data.data.vendor_profile);
        updateUser({
          ...user,
          vendor_profile: response.data.data.vendor_profile,
        });
        setIsEditing(false);
        toast.success("Profil vendor berhasil diperbarui!");
      }
    } catch (error) {
      console.error("Update profile error:", error);
      toast.error("Gagal memperbarui profil vendor");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    reset();
  };

  if (!profile) {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container-custom py-8">
        {/* Header */}
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
                <CardTitle>Informasi Bisnis</CardTitle>
                <CardDescription>
                  Data bisnis dan verifikasi Anda
                </CardDescription>
              </CardHeader>
              <CardBody>
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Building2 className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {profile.business_name}
                  </h3>
                  <p className="text-gray-600 mb-4">{user?.email}</p>
                  <div className="flex items-center justify-center space-x-2">
                    <span className="inline-block px-3 py-1 text-xs font-semibold bg-primary-100 text-primary-800 rounded-full">
                      Vendor
                    </span>
                    <span
                      className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${
                        profile.is_verified
                          ? "bg-success-100 text-success-800"
                          : "bg-warning-100 text-warning-800"
                      }`}
                    >
                      {profile.is_verified ? (
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
                        profile.is_active
                          ? "bg-success-100 text-success-800"
                          : "bg-danger-100 text-danger-800"
                      }`}
                    >
                      {profile.is_active ? "Aktif" : "Nonaktif"}
                    </span>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="w-4 h-4 mr-3 text-primary-500" />
                    <span>{user?.email}</span>
                  </div>
                  {profile.phone && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="w-4 h-4 mr-3 text-primary-500" />
                      <span>{profile.phone}</span>
                    </div>
                  )}
                  {profile.city && (
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-3 text-primary-500" />
                      <span>
                        {profile.city}
                        {profile.province && `, ${profile.province}`}
                      </span>
                    </div>
                  )}
                  {profile.website && (
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
                  {profile.instagram && (
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
                  {profile.whatsapp && (
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
                      {profile.subscription_plan || "Free"}
                    </span>
                    {profile.subscription_expires_at && (
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
                    <CardTitle>Edit Profil Vendor</CardTitle>
                    <CardDescription>
                      Perbarui informasi bisnis Anda
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    {!isEditing ? (
                      <Button onClick={handleEdit} size="sm">
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
                          isLoading={isSubmitting || isLoading}
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
                        error={errors.business_name?.message}
                        disabled={!isEditing}
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
                        error={errors.city?.message}
                        disabled={!isEditing}
                        {...register("city")}
                      />
                    </div>

                    <div>
                      <Input
                        label="Provinsi"
                        placeholder="Masukkan provinsi"
                        error={errors.province?.message}
                        disabled={!isEditing}
                        {...register("province")}
                      />
                    </div>

                    <div>
                      <Input
                        label="Kode Pos"
                        placeholder="12345"
                        error={errors.postal_code?.message}
                        disabled={!isEditing}
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
                        error={errors.website?.message}
                        disabled={!isEditing}
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
                        error={errors.instagram?.message}
                        disabled={!isEditing}
                        {...register("instagram")}
                      />
                    </div>

                    <div>
                      <Input
                        label="WhatsApp"
                        placeholder="628xxxxxxxxxx"
                        error={errors.whatsapp?.message}
                        disabled={!isEditing}
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
                      error={errors.address?.message}
                      disabled={!isEditing}
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
        </div>
      </div>
    </div>
  );
}

export default VendorProfilePage;
