import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../contexts/AuthContext";
import { userAPI } from "../../services/api";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit3,
  Save,
  X,
  Camera,
  Upload,
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

function CustomerProfilePage() {
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
    if (user?.customer_profile) {
      setProfile(user.customer_profile);
      reset({
        full_name: user.customer_profile.full_name || "",
        phone: user.customer_profile.phone || "",
        address: user.customer_profile.address || "",
        city: user.customer_profile.city || "",
        province: user.customer_profile.province || "",
        postal_code: user.customer_profile.postal_code || "",
        birth_date: user.customer_profile.birth_date
          ? new Date(user.customer_profile.birth_date)
              .toISOString()
              .split("T")[0]
          : "",
        gender: user.customer_profile.gender || "",
        bio: user.customer_profile.bio || "",
      });
    }
  }, [user, reset]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await userAPI.updateProfile({
        ...data,
        profile_type: "customer",
      });

      if (response.data.success) {
        setProfile(response.data.data.customer_profile);
        updateUser({
          ...user,
          customer_profile: response.data.data.customer_profile,
        });
        setIsEditing(false);
        toast.success("Profil berhasil diperbarui!");
      }
    } catch (error) {
      console.error("Update profile error:", error);
      toast.error("Gagal memperbarui profil");
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
          <p className="text-gray-600 font-medium mt-4">Memuat profil...</p>
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
            Profil Customer
          </h1>
          <p className="text-lg text-gray-600">Kelola informasi profil Anda</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-1">
            <Card hover>
              <CardHeader>
                <CardTitle>Informasi Profil</CardTitle>
                <CardDescription>Data pribadi dan kontak Anda</CardDescription>
              </CardHeader>
              <CardBody>
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <User className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {profile.full_name || user?.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{user?.email}</p>
                  <div className="flex items-center justify-center space-x-2">
                    <span className="inline-block px-3 py-1 text-xs font-semibold bg-primary-100 text-primary-800 rounded-full">
                      Customer
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
                  {profile.birth_date && (
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
            <Card hover>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Edit Profil</CardTitle>
                    <CardDescription>
                      Perbarui informasi profil Anda
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
                        label="Nama Lengkap"
                        placeholder="Masukkan nama lengkap"
                        error={errors.full_name?.message}
                        disabled={!isEditing}
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
                        error={errors.phone?.message}
                        disabled={!isEditing}
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
                        error={errors.birth_date?.message}
                        disabled={!isEditing}
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
        </div>
      </div>
    </div>
  );
}

export default CustomerProfilePage;
