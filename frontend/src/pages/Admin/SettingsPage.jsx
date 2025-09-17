import { useState } from "react";
import { useQuery } from "react-query";
import { adminAPI } from "../../services/api";
import {
  Settings,
  Save,
  ToggleLeft,
  ToggleRight,
  DollarSign,
  Mail,
  Shield,
  Globe,
  Smartphone,
  Database,
} from "lucide-react";
import { formatCurrency } from "../../utils/format";
import LoadingSpinner from "../../components/UI/LoadingSpinner";
import Card, { CardBody, CardHeader } from "../../components/UI/Card";
import Button from "../../components/UI/Button";
import Input from "../../components/UI/Input";

function SettingsPage() {
  const [activeTab, setActiveTab] = useState("modules");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: moduleSettingsData, isLoading: moduleLoading } = useQuery(
    "admin-module-settings",
    adminAPI.getModuleSettings
  );

  const { data: systemSettingsData, isLoading: systemLoading } = useQuery(
    "admin-system-settings",
    adminAPI.getSystemSettings
  );

  const moduleSettings = moduleSettingsData?.data || [];
  const systemSettings = systemSettingsData?.data || [];

  const handleModuleToggle = async (moduleName, currentStatus) => {
    setIsSubmitting(true);
    try {
      await adminAPI.updateModuleSetting(moduleName, {
        is_enabled: !currentStatus,
        settings: "{}",
      });
      // Refetch data
      console.log("Module toggled:", moduleName, !currentStatus);
    } catch (error) {
      console.error("Error toggling module:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSystemSettingUpdate = async (key, value, type) => {
    setIsSubmitting(true);
    try {
      await adminAPI.updateSystemSetting(key, { value, type });
      console.log("System setting updated:", key, value);
    } catch (error) {
      console.error("Error updating system setting:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const tabs = [
    { id: "modules", name: "Modul", icon: Settings },
    { id: "system", name: "Sistem", icon: Database },
    { id: "payment", name: "Pembayaran", icon: DollarSign },
    { id: "notification", name: "Notifikasi", icon: Mail },
  ];

  const moduleCategories = {
    core: "Modul Inti",
    payment: "Pembayaran",
    communication: "Komunikasi",
    marketing: "Marketing",
    analytics: "Analytics",
  };

  const getModuleIcon = (moduleName) => {
    switch (moduleName) {
      case "subscription_vendor":
        return <DollarSign className="w-5 h-5 text-blue-600" />;
      case "chat_system":
        return <Mail className="w-5 h-5 text-green-600" />;
      case "wishlist":
        return <Shield className="w-5 h-5 text-red-600" />;
      case "seo_basic":
        return <Globe className="w-5 h-5 text-purple-600" />;
      case "mobile_app":
        return <Smartphone className="w-5 h-5 text-orange-600" />;
      default:
        return <Settings className="w-5 h-5 text-gray-600" />;
    }
  };

  if (moduleLoading || systemLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Pengaturan Sistem
          </h1>
          <p className="text-gray-600">Kelola konfigurasi dan modul platform</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <tab.icon className="w-5 h-5 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Modules Tab */}
        {activeTab === "modules" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-gray-900">
                  Modul Platform
                </h2>
                <p className="text-sm text-gray-600">
                  Aktifkan atau nonaktifkan modul sesuai kebutuhan bisnis
                </p>
              </CardHeader>
              <CardBody className="p-0">
                <div className="divide-y divide-gray-200">
                  {moduleSettings.map((module) => (
                    <div key={module.id} className="p-6 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            {getModuleIcon(module.module_name)}
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900 capitalize">
                              {module.module_name.replace("_", " ")}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {module.module_name === "subscription_vendor" &&
                                "Sistem berlangganan untuk vendor"}
                              {module.module_name === "chat_system" &&
                                "Sistem chat real-time"}
                              {module.module_name === "wishlist" &&
                                "Fitur wishlist untuk customer"}
                              {module.module_name === "seo_basic" &&
                                "Optimisasi SEO dasar"}
                              {module.module_name === "mobile_app" &&
                                "Aplikasi mobile"}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            handleModuleToggle(
                              module.module_name,
                              module.is_enabled
                            )
                          }
                          disabled={isSubmitting}
                          className={`p-1 rounded-full transition-colors ${
                            module.is_enabled
                              ? "text-green-600 hover:bg-green-100"
                              : "text-gray-400 hover:bg-gray-100"
                          }`}
                        >
                          {module.is_enabled ? (
                            <ToggleRight className="w-8 h-8" />
                          ) : (
                            <ToggleLeft className="w-8 h-8" />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>
        )}

        {/* System Tab */}
        {activeTab === "system" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-gray-900">
                  Pengaturan Sistem
                </h2>
                <p className="text-sm text-gray-600">
                  Konfigurasi dasar sistem dan platform
                </p>
              </CardHeader>
              <CardBody>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Nama Platform"
                      defaultValue="Wedding Commerce"
                    />
                    <Input
                      label="Email Support"
                      type="email"
                      defaultValue="support@weddingcommerce.com"
                    />
                    <Input
                      label="Nomor Telepon"
                      defaultValue="+62 812 3456 7890"
                    />
                    <Input
                      label="Alamat"
                      defaultValue="Jl. Sudirman No. 123, Jakarta"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Input
                      label="Komisi Platform (%)"
                      type="number"
                      defaultValue="10"
                      min="0"
                      max="100"
                    />
                    <Input
                      label="Minimal Penarikan"
                      type="number"
                      defaultValue="100000"
                    />
                    <Input
                      label="Maksimal Upload (MB)"
                      type="number"
                      defaultValue="10"
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button>
                      <Save className="w-4 h-4 mr-2" />
                      Simpan Pengaturan
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        )}

        {/* Payment Tab */}
        {activeTab === "payment" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-gray-900">
                  Gateway Pembayaran
                </h2>
                <p className="text-sm text-gray-600">
                  Konfigurasi metode pembayaran yang tersedia
                </p>
              </CardHeader>
              <CardBody>
                <div className="space-y-6">
                  {/* Manual Transfer */}
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        Manual Transfer
                      </h3>
                      <p className="text-sm text-gray-600">
                        Transfer bank manual
                      </p>
                    </div>
                    <ToggleRight className="w-8 h-8 text-green-600" />
                  </div>

                  {/* Xendit */}
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">Xendit</h3>
                      <p className="text-sm text-gray-600">
                        E-wallet, Virtual Account, QRIS
                      </p>
                    </div>
                    <ToggleLeft className="w-8 h-8 text-gray-400" />
                  </div>

                  {/* Midtrans */}
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">Midtrans</h3>
                      <p className="text-sm text-gray-600">
                        Credit Card, Virtual Account, QRIS
                      </p>
                    </div>
                    <ToggleLeft className="w-8 h-8 text-gray-400" />
                  </div>

                  {/* COD */}
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        Cash on Delivery
                      </h3>
                      <p className="text-sm text-gray-600">Bayar di tempat</p>
                    </div>
                    <ToggleLeft className="w-8 h-8 text-gray-400" />
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        )}

        {/* Notification Tab */}
        {activeTab === "notification" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-gray-900">
                  Pengaturan Notifikasi
                </h2>
                <p className="text-sm text-gray-600">
                  Konfigurasi notifikasi email dan SMS
                </p>
              </CardHeader>
              <CardBody>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input label="SMTP Host" defaultValue="smtp.gmail.com" />
                    <Input label="SMTP Port" defaultValue="587" />
                    <Input
                      label="SMTP Username"
                      defaultValue="noreply@weddingcommerce.com"
                    />
                    <Input
                      label="SMTP Password"
                      type="password"
                      defaultValue="********"
                    />
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="font-medium text-gray-900 mb-4">
                      Notifikasi Aktif
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Email Registrasi</span>
                        <ToggleRight className="w-8 h-8 text-green-600" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Email Order Baru</span>
                        <ToggleRight className="w-8 h-8 text-green-600" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Email Pembayaran</span>
                        <ToggleRight className="w-8 h-8 text-green-600" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">SMS Notifikasi</span>
                        <ToggleLeft className="w-8 h-8 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button>
                      <Save className="w-4 h-4 mr-2" />
                      Simpan Pengaturan
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

export default SettingsPage;

