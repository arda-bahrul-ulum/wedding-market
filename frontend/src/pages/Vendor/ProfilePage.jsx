import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "react-query";
import { vendorAPI } from "../../services/api";
import {
  Building,
  MapPin,
  Globe,
  Instagram,
  MessageCircle,
  Camera,
  Save,
  Upload,
} from "lucide-react";
import { formatDate } from "../../utils/format";
import Card, { CardBody, CardHeader } from "../../components/UI/Card";
import Button from "../../components/UI/Button";
import Input from "../../components/UI/Input";

function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: profileData, isLoading } = useQuery(
    "vendor-profile",
    vendorAPI.getProfile
  );

  const profile = profileData?.data;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      business_name: profile?.business_name || "",
      business_type: profile?.business_type || "",
      description: profile?.description || "",
      address: profile?.address || "",
      city: profile?.city || "",
      province: profile?.province || "",
      postal_code: profile?.postal_code || "",
      website: profile?.website || "",
      instagram: profile?.instagram || "",
      whatsapp: profile?.whatsapp || "",
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await vendorAPI.updateProfile(data);
      setIsEditing(false);
      alert("Profil berhasil diperbarui!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Terjadi kesalahan saat memperbarui profil. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Profil Vendor
          </h1>
          <p className="text-gray-600">
            Kelola informasi bisnis dan profil vendor Anda
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Informasi Bisnis
                  </h2>
                  {!isEditing && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit Profil
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardBody>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Business Logo */}
                  <div className="flex items-center space-x-6 mb-6">
                    <div className="relative">
                      <div className="w-24 h-24 bg-primary-100 rounded-xl flex items-center justify-center">
                        <Building className="w-12 h-12 text-primary-600" />
                      </div>
                      {isEditing && (
                        <button
                          type="button"
                          className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center hover:bg-primary-700 transition-colors"
                        >
                          <Camera className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {profile?.business_name}
                      </h3>
                      <p className="text-gray-600 capitalize">
                        {profile?.business_type?.replace("_", " ")}
                      </p>
                      <p className="text-sm text-gray-500">
                        Terdaftar sejak {formatDate(profile?.created_at)}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Nama Bisnis"
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

                    <div>
                      <label className="label">Tipe Bisnis</label>
                      <select
                        className="input"
                        disabled={!isEditing}
                        {...register("business_type", {
                          required: "Tipe bisnis wajib dipilih",
                        })}
                      >
                        <option value="personal">Personal</option>
                        <option value="company">Perusahaan</option>
                        <option value="wedding_organizer">
                          Wedding Organizer
                        </option>
                      </select>
                      {errors.business_type && (
                        <p className="text-sm text-red-600 mt-1">
                          {errors.business_type.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="label">Deskripsi Bisnis</label>
                    <textarea
                      className="input min-h-[120px] resize-none"
                      placeholder="Deskripsikan bisnis Anda..."
                      disabled={!isEditing}
                      {...register("description")}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Alamat"
                      disabled={!isEditing}
                      error={errors.address?.message}
                      {...register("address")}
                    />
                    <Input
                      label="Kota"
                      disabled={!isEditing}
                      error={errors.city?.message}
                      {...register("city")}
                    />
                    <Input
                      label="Provinsi"
                      disabled={!isEditing}
                      error={errors.province?.message}
                      {...register("province")}
                    />
                    <Input
                      label="Kode Pos"
                      disabled={!isEditing}
                      error={errors.postal_code?.message}
                      {...register("postal_code")}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                    <Input
                      label="Instagram"
                      placeholder="@username"
                      disabled={!isEditing}
                      error={errors.instagram?.message}
                      {...register("instagram")}
                    />
                    <Input
                      label="WhatsApp"
                      placeholder="08xxxxxxxxxx"
                      disabled={!isEditing}
                      error={errors.whatsapp?.message}
                      {...register("whatsapp", {
                        pattern: {
                          value: /^08\d{8,11}$/,
                          message: "Format nomor WhatsApp tidak valid",
                        },
                      })}
                    />
                  </div>

                  {isEditing && (
                    <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                        disabled={isSubmitting}
                      >
                        Batal
                      </Button>
                      <Button
                        type="submit"
                        isLoading={isSubmitting}
                        disabled={isSubmitting}
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Simpan Perubahan
                      </Button>
                    </div>
                  )}
                </form>
              </CardBody>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Business Status */}
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-gray-900">
                  Status Bisnis
                </h2>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Status</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      profile?.is_active
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {profile?.is_active ? "Aktif" : "Nonaktif"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Verifikasi</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      profile?.is_verified
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {profile?.is_verified
                      ? "Terverifikasi"
                      : "Belum Verifikasi"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Plan</span>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {profile?.subscription_plan || "Free"}
                  </span>
                </div>
              </CardBody>
            </Card>

            {/* Business Stats */}
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-gray-900">
                  Statistik Bisnis
                </h2>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Jasa</span>
                  <span className="font-semibold">8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Pesanan</span>
                  <span className="font-semibold">24</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Rating Rata-rata</span>
                  <span className="font-semibold">4.8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Review</span>
                  <span className="font-semibold">156</span>
                </div>
              </CardBody>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-gray-900">
                  Aksi Cepat
                </h2>
              </CardHeader>
              <CardBody className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Portfolio
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Globe className="w-4 h-4 mr-2" />
                  Preview Profil
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Chat Support
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
