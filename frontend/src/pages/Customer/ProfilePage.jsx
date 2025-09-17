import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../contexts/AuthContext";
import { User, Mail, Phone, MapPin, Camera, Save } from "lucide-react";
import { formatDate } from "../../utils/format";
import Card, { CardBody, CardHeader } from "../../components/UI/Card";
import Button from "../../components/UI/Button";
import Input from "../../components/UI/Input";

function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.address || "",
      city: user?.city || "",
      province: user?.province || "",
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      updateUser(data);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profil Saya</h1>
          <p className="text-gray-600">
            Kelola informasi profil dan preferensi Anda
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Informasi Profil
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
                  <div className="flex items-center space-x-6 mb-6">
                    <div className="relative">
                      <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
                        <User className="w-10 h-10 text-primary-600" />
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
                        {user?.name}
                      </h3>
                      <p className="text-gray-600">{user?.email}</p>
                      <p className="text-sm text-gray-500">
                        Member sejak {formatDate(user?.created_at)}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Nama Lengkap"
                      disabled={!isEditing}
                      error={errors.name?.message}
                      {...register("name", {
                        required: "Nama wajib diisi",
                        minLength: {
                          value: 3,
                          message: "Nama minimal 3 karakter",
                        },
                      })}
                    />
                    <Input
                      label="Email"
                      type="email"
                      disabled={!isEditing}
                      error={errors.email?.message}
                      {...register("email", {
                        required: "Email wajib diisi",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Format email tidak valid",
                        },
                      })}
                    />
                    <Input
                      label="Nomor Telepon"
                      disabled={!isEditing}
                      error={errors.phone?.message}
                      {...register("phone", {
                        pattern: {
                          value: /^08\d{8,11}$/,
                          message: "Format nomor telepon tidak valid",
                        },
                      })}
                    />
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
            {/* Account Stats */}
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-gray-900">
                  Statistik Akun
                </h2>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Pesanan</span>
                  <span className="font-semibold">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pesanan Selesai</span>
                  <span className="font-semibold">8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Item di Wishlist</span>
                  <span className="font-semibold">5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Review Diberikan</span>
                  <span className="font-semibold">3</span>
                </div>
              </CardBody>
            </Card>

            {/* Preferences */}
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-gray-900">
                  Preferensi
                </h2>
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

