import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/UI/Card";
import Button from "../../components/UI/Button";
import Input from "../../components/UI/Input";
import { adminAPI } from "../../services/api";
import {
  confirmResetSettings,
  confirmSaveSettings,
  confirmLeaveWithUnsavedChanges,
  showSuccess,
  showError,
  showWarning,
  showLoading,
  closeLoading,
} from "../../utils/sweetAlert";
import {
  Settings,
  Save,
  RefreshCw,
  Shield,
  DollarSign,
  Mail,
  Globe,
  Database,
  Bell,
  Lock,
  Users,
  Store,
  ShoppingBag,
  MessageSquare,
  Star,
  CreditCard,
  Search,
  FileText,
  Bot,
  ToggleLeft,
  ToggleRight,
  LogOut,
  ArrowRight,
  TrendingUp,
  X,
} from "lucide-react";

function AdminSettingsPage() {
  const { user, logout } = useAuth();
  const [settings, setSettings] = useState({
    // General Settings - from actual database
    siteName: "",
    siteDescription: "", // This should be loaded from database
    siteUrl: "",
    adminEmail: "",
    supportEmail: "",

    // Commission Settings - from actual database
    commissionRate: 0,
    minimumCommission: 0,
    maximumCommission: 0,

    // Payment Settings - from actual database
    paymentTimeout: 0,
    refundPeriod: 0,
    escrowPeriod: 0,

    // Subscription Settings - from actual database
    freePlanLimit: 5,
    premiumPlanPrice: 0,
    enterprisePlanPrice: 0,

    // Email Settings - from actual database
    smtpHost: "",
    smtpPort: 0,
    smtpUsername: "",
    smtpPassword: "",
    smtpEncryption: "",

    // SEO Settings - from actual database
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",

    // Security Settings - from actual database
    maxLoginAttempts: 5,
    lockoutDuration: 0,
    sessionTimeout: 0,
    requireEmailVerification: true,

    // Notification Settings - from actual database
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,

    // Feature Settings - from actual database
    enableRegistration: true,
    enableVendorRegistration: true,
    enableReviews: true,
    enableWishlist: true,
    enableChat: true,
    enableBlog: true,
    enableFaq: true,
    enableAiChatbot: false,
    enableVendorCollaboration: false,
    enableDpCicilan: false,
    enablePromoVoucher: false,

    // Payment Gateway Settings - from actual database
    enableXendit: true,
    enableMidtrans: false,
    enableManualTransfer: true,
    enableCod: false,

    // SEO Module Settings - from actual database
    enableSeoBasic: true,
    enableSeoAdvanced: false,
    enableSeoAutomation: false,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [errors, setErrors] = useState({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  // Warn user before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue =
          "Anda memiliki perubahan yang belum disimpan. Apakah Anda yakin ingin keluar?";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const handleLogout = async () => {
    if (hasUnsavedChanges) {
      const result = await confirmLeaveWithUnsavedChanges();
      if (!result.isConfirmed) {
        return;
      }
    }
    await logout();
    window.location.href = "/";
  };

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const response = await adminAPI.getSystemSettings();
      const data = response.data;

      if (data.success) {
        // Convert array of settings to object
        const settingsObj = {};
        data.data.forEach((setting) => {
          let value = setting.value;

          // Handle null or undefined values
          if (value === null || value === undefined) {
            value = "";
          }

          if (setting.type === "number") {
            value = parseFloat(value);
          } else if (setting.type === "boolean") {
            value = value === "true";
          } else if (setting.type === "json") {
            try {
              value = JSON.parse(value);
            } catch (e) {
              value = value;
            }
          }

          // Debug logging for all general settings
          if (
            [
              "siteName",
              "siteDescription",
              "siteUrl",
              "adminEmail",
              "supportEmail",
            ].includes(setting.key)
          ) {
            console.log(`Debug ${setting.key}:`, {
              key: setting.key,
              value: setting.value,
              type: setting.type,
              convertedValue: value,
              isString: typeof value === "string",
              length: value ? value.length : 0,
            });
          }

          settingsObj[setting.key] = value;
        });

        // Ensure all general settings are properly loaded
        const generalSettingsMap = {
          siteName: "site_name",
          siteDescription: "site_description",
          siteUrl: "site_url",
          adminEmail: "admin_email",
          supportEmail: "support_email",
        };

        // Check specifically for all general settings
        const generalSettings = [
          "siteName",
          "siteDescription",
          "siteUrl",
          "adminEmail",
          "supportEmail",
        ];
        generalSettings.forEach((key) => {
          const setting = data.data.find((s) => s.key === key);

          // If frontend key not found, try backend key
          if (!setting) {
            const backendKey = generalSettingsMap[key];
            const backendSetting = data.data.find((s) => s.key === backendKey);

            if (backendSetting) {
              // Add to settingsObj with frontend key
              settingsObj[key] = backendSetting.value;
            }
          }
        });

        // Simple solution: merge with existing state structure
        setSettings((prevSettings) => ({
          ...prevSettings,
          ...settingsObj,
        }));

        console.log("✅ Settings updated successfully:", settingsObj);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      // Show error message to user
      await showError(
        "Error Loading Settings!",
        "Gagal memuat pengaturan sistem. Silakan coba lagi."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const validateSettings = () => {
    const fieldErrors = {};

    // Validate email settings (only for fields that exist in database)
    if (
      settings.smtpPort &&
      (settings.smtpPort < 1 || settings.smtpPort > 65535)
    ) {
      fieldErrors.smtpPort = "SMTP Port must be between 1 and 65535";
    }

    // Validate commission settings (all exist in database)
    if (settings.commissionRate < 0 || settings.commissionRate > 100) {
      fieldErrors.commissionRate = "Commission rate must be between 0 and 100";
    }
    if (settings.minimumCommission < 0) {
      fieldErrors.minimumCommission = "Minimum commission cannot be negative";
    }
    if (settings.maximumCommission < settings.minimumCommission) {
      fieldErrors.maximumCommission =
        "Maximum commission must be greater than minimum commission";
    }

    // Validate security settings (only for fields that exist in database)
    if (settings.lockoutDuration < 1) {
      fieldErrors.lockoutDuration =
        "Lockout duration must be at least 1 minute";
    }
    if (settings.sessionTimeout < 1) {
      fieldErrors.sessionTimeout = "Session timeout must be at least 1 minute";
    }

    // Validate subscription settings (only for fields that exist in database)
    if (settings.premiumPlanPrice < 0) {
      fieldErrors.premiumPlanPrice = "Premium plan price cannot be negative";
    }
    if (settings.enterprisePlanPrice < 0) {
      fieldErrors.enterprisePlanPrice =
        "Enterprise plan price cannot be negative";
    }

    // Validate payment settings (all exist in database)
    if (settings.paymentTimeout < 1) {
      fieldErrors.paymentTimeout = "Payment timeout must be at least 1 hour";
    }
    if (settings.refundPeriod < 0) {
      fieldErrors.refundPeriod = "Refund period cannot be negative";
    }
    if (settings.escrowPeriod < 0) {
      fieldErrors.escrowPeriod = "Escrow period cannot be negative";
    }

    setErrors(fieldErrors);
    return Object.keys(fieldErrors).length === 0;
  };

  const handleSave = async () => {
    // Validate settings
    const isValid = validateSettings();
    if (!isValid) {
      const errorMessages = Object.values(errors).join("\n");
      await showWarning(
        "Validasi Gagal!",
        `Terdapat kesalahan dalam pengisian form:\n\n${errorMessages}`
      );
      return;
    }

    // Show confirmation dialog
    const result = await confirmSaveSettings();
    if (!result.isConfirmed) {
      return;
    }

    try {
      setIsSaving(true);
      showLoading("Menyimpan Settings...", "Mohon tunggu sebentar...");

      // Filter settings to only include those that exist in database
      const databaseSettings = {
        // General Settings - from actual database
        siteName: settings.siteName,
        siteDescription: settings.siteDescription,
        siteUrl: settings.siteUrl,
        adminEmail: settings.adminEmail,
        supportEmail: settings.supportEmail,

        // Commission Settings - from actual database
        commissionRate: settings.commissionRate,
        minimumCommission: settings.minimumCommission,
        maximumCommission: settings.maximumCommission,

        // Payment Settings - from actual database
        paymentTimeout: settings.paymentTimeout,
        refundPeriod: settings.refundPeriod,
        escrowPeriod: settings.escrowPeriod,

        // Subscription Settings - from actual database
        freePlanLimit: settings.freePlanLimit,
        premiumPlanPrice: settings.premiumPlanPrice,
        enterprisePlanPrice: settings.enterprisePlanPrice,

        // Email Settings - from actual database
        smtpHost: settings.smtpHost,
        smtpPort: settings.smtpPort,
        smtpUsername: settings.smtpUsername,
        smtpPassword: settings.smtpPassword,
        smtpEncryption: settings.smtpEncryption,

        // SEO Settings - from actual database
        metaTitle: settings.metaTitle,
        metaDescription: settings.metaDescription,
        metaKeywords: settings.metaKeywords,

        // Security Settings - from actual database
        maxLoginAttempts: settings.maxLoginAttempts,
        lockoutDuration: settings.lockoutDuration,
        sessionTimeout: settings.sessionTimeout,
        requireEmailVerification: settings.requireEmailVerification,

        // Notification Settings - from actual database
        emailNotifications: settings.emailNotifications,
        smsNotifications: settings.smsNotifications,
        pushNotifications: settings.pushNotifications,

        // Feature Settings - from actual database
        enableRegistration: settings.enableRegistration,
        enableVendorRegistration: settings.enableVendorRegistration,
        enableReviews: settings.enableReviews,
        enableWishlist: settings.enableWishlist,
        enableChat: settings.enableChat,
        enableBlog: settings.enableBlog,
        enableFaq: settings.enableFaq,
        enableAiChatbot: settings.enableAiChatbot,
        enableVendorCollaboration: settings.enableVendorCollaboration,
        enableDpCicilan: settings.enableDpCicilan,
        enablePromoVoucher: settings.enablePromoVoucher,

        // Payment Gateway Settings - from actual database
        enableXendit: settings.enableXendit,
        enableMidtrans: settings.enableMidtrans,
        enableManualTransfer: settings.enableManualTransfer,
        enableCod: settings.enableCod,

        // SEO Module Settings - from actual database
        enableSeoBasic: settings.enableSeoBasic,
        enableSeoAdvanced: settings.enableSeoAdvanced,
        enableSeoAutomation: settings.enableSeoAutomation,
      };

      const response = await adminAPI.bulkUpdateSystemSettings(
        databaseSettings
      );
      const data = response.data;
      closeLoading();

      if (data.success) {
        setHasUnsavedChanges(false);
        await showSuccess(
          "Settings Disimpan!",
          "Pengaturan sistem berhasil disimpan."
        );
      } else {
        await showError(
          "Gagal Menyimpan!",
          data.message || "Terjadi kesalahan saat menyimpan pengaturan."
        );
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      closeLoading();
      await showError(
        "Error Jaringan!",
        "Terjadi kesalahan jaringan. Silakan periksa koneksi internet Anda."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
    setHasUnsavedChanges(true);

    // Clear error for this field
    if (errors[key]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  };

  const handleToggle = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    setHasUnsavedChanges(true);
  };

  const renderFieldError = (fieldName) => {
    if (errors[fieldName]) {
      return <p className="mt-1 text-sm text-red-600">{errors[fieldName]}</p>;
    }
    return null;
  };

  const tabs = [
    { id: "general", name: "General", icon: Settings },
    { id: "commission", name: "Commission", icon: DollarSign },
    { id: "payment", name: "Payment", icon: CreditCard },
    { id: "subscription", name: "Subscription", icon: Users },
    { id: "email", name: "Email", icon: Mail },
    { id: "seo", name: "SEO", icon: Search },
    { id: "security", name: "Security", icon: Shield },
    { id: "notifications", name: "Notifications", icon: Bell },
    { id: "features", name: "Features", icon: ToggleLeft },
    { id: "gateways", name: "Payment Gateways", icon: CreditCard },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-700">
            Loading settings...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200/50">
        <div className="px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  System Settings
                  {hasUnsavedChanges && (
                    <span className="ml-2 text-sm text-orange-600 font-normal">
                      (Unsaved Changes)
                    </span>
                  )}
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Kelola konfigurasi sistem dan modul
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-gray-700">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {user?.role?.replace("_", " ")}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="group"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 py-6 sm:py-8">
        {/* Action Buttons */}
        <Card hover className="mb-6">
          <CardBody>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Settings className="h-5 w-5 text-primary-600" />
                <span className="text-sm font-medium text-gray-700">
                  System Configuration
                </span>
              </div>
              <div className="flex space-x-3">
                <Button
                  onClick={async () => {
                    const result = await confirmResetSettings();
                    if (result.isConfirmed) {
                      try {
                        showLoading(
                          "Mereset Settings...",
                          "Mohon tunggu sebentar..."
                        );
                        await fetchSettings();
                        setHasUnsavedChanges(false);
                        setErrors({});
                        closeLoading();
                        await showSuccess(
                          "Settings Direset!",
                          "Semua pengaturan telah dikembalikan ke nilai default."
                        );
                      } catch (error) {
                        closeLoading();
                        await showError(
                          "Gagal Reset!",
                          "Terjadi kesalahan saat mereset pengaturan."
                        );
                      }
                    }
                  }}
                  disabled={isSaving}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Reset to Default</span>
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isSaving || !hasUnsavedChanges}
                  className={`flex items-center space-x-2 ${
                    isSaving ? "opacity-50 cursor-not-allowed" : ""
                  } ${
                    !hasUnsavedChanges ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isSaving ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  <span>
                    {isSaving
                      ? "Saving..."
                      : hasUnsavedChanges
                      ? "Save Settings"
                      : "No Changes"}
                  </span>
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card hover>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-primary-600" />
                  Settings Menu
                </CardTitle>
                <CardDescription>Pilih kategori pengaturan</CardDescription>
              </CardHeader>
              <CardBody className="p-0">
                <nav className="space-y-1">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                          activeTab === tab.id
                            ? "bg-primary-100 text-primary-700 border-r-2 border-primary-500"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                      >
                        <Icon className="h-4 w-4 mr-3" />
                        {tab.name}
                      </button>
                    );
                  })}
                </nav>
              </CardBody>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card hover>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2 text-primary-600" />
                  {tabs.find((tab) => tab.id === activeTab)?.name || "Settings"}
                </CardTitle>
                <CardDescription>Konfigurasi pengaturan sistem</CardDescription>
              </CardHeader>
              <CardBody>
                {/* General Settings */}
                {activeTab === "general" && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900">
                      General Settings
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Site Name
                          <span className="text-xs text-green-600 ml-1">
                            (In database)
                          </span>
                        </label>
                        <Input
                          key={`siteName-${settings.siteName}`}
                          value={settings.siteName || ""}
                          onChange={(e) =>
                            handleInputChange("siteName", e.target.value)
                          }
                          placeholder="Wedding Dream"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Site URL
                          <span className="text-xs text-green-600 ml-1">
                            (In database)
                          </span>
                        </label>
                        <Input
                          key={`siteUrl-${settings.siteUrl}`}
                          value={settings.siteUrl || ""}
                          onChange={(e) =>
                            handleInputChange("siteUrl", e.target.value)
                          }
                          placeholder="https://weddingcommerce.com"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Site Description
                          <span className="text-xs text-green-600 ml-1">
                            (In database)
                          </span>
                        </label>
                        <textarea
                          key={`siteDescription-${settings.siteDescription}`}
                          value={settings.siteDescription || ""}
                          onChange={(e) =>
                            handleInputChange("siteDescription", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          rows={3}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Admin Email
                          <span className="text-xs text-green-600 ml-1">
                            (In database)
                          </span>
                        </label>
                        <Input
                          key={`adminEmail-${settings.adminEmail}`}
                          type="email"
                          value={settings.adminEmail || ""}
                          onChange={(e) =>
                            handleInputChange("adminEmail", e.target.value)
                          }
                          placeholder="admin@weddingcommerce.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Support Email
                          <span className="text-xs text-green-600 ml-1">
                            (In database)
                          </span>
                        </label>
                        <Input
                          key={`supportEmail-${settings.supportEmail}`}
                          type="email"
                          value={settings.supportEmail || ""}
                          onChange={(e) =>
                            handleInputChange("supportEmail", e.target.value)
                          }
                          placeholder="support@weddingcommerce.com"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Commission Settings */}
                {activeTab === "commission" && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Commission Settings
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Commission Rate (%)
                          <span className="text-xs text-green-600 ml-1">
                            (In database)
                          </span>
                        </label>
                        <Input
                          type="number"
                          step="0.1"
                          value={settings.commissionRate}
                          onChange={(e) =>
                            handleInputChange(
                              "commissionRate",
                              parseFloat(e.target.value)
                            )
                          }
                          placeholder="5.0"
                          className={
                            errors.commissionRate ? "border-red-500" : ""
                          }
                        />
                        {renderFieldError("commissionRate")}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Minimum Commission (IDR)
                          <span className="text-xs text-green-600 ml-1">
                            (In database)
                          </span>
                        </label>
                        <Input
                          type="number"
                          value={settings.minimumCommission}
                          onChange={(e) =>
                            handleInputChange(
                              "minimumCommission",
                              parseInt(e.target.value)
                            )
                          }
                          placeholder="10000"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Maximum Commission (IDR)
                          <span className="text-xs text-green-600 ml-1">
                            (In database)
                          </span>
                        </label>
                        <Input
                          type="number"
                          value={settings.maximumCommission}
                          onChange={(e) =>
                            handleInputChange(
                              "maximumCommission",
                              parseInt(e.target.value)
                            )
                          }
                          placeholder="1000000"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Payment Settings */}
                {activeTab === "payment" && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Payment Settings
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Payment Timeout (hours)
                          <span className="text-xs text-green-600 ml-1">
                            (In database)
                          </span>
                        </label>
                        <Input
                          type="number"
                          value={settings.paymentTimeout}
                          onChange={(e) =>
                            handleInputChange(
                              "paymentTimeout",
                              parseInt(e.target.value)
                            )
                          }
                          placeholder="24"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Refund Period (days)
                          <span className="text-xs text-green-600 ml-1">
                            (In database)
                          </span>
                        </label>
                        <Input
                          type="number"
                          value={settings.refundPeriod}
                          onChange={(e) =>
                            handleInputChange(
                              "refundPeriod",
                              parseInt(e.target.value)
                            )
                          }
                          placeholder="7"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Escrow Period (days)
                          <span className="text-xs text-green-600 ml-1">
                            (In database)
                          </span>
                        </label>
                        <Input
                          type="number"
                          value={settings.escrowPeriod}
                          onChange={(e) =>
                            handleInputChange(
                              "escrowPeriod",
                              parseInt(e.target.value)
                            )
                          }
                          placeholder="3"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Subscription Settings */}
                {activeTab === "subscription" && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Subscription Settings
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Free Plan Limit (services)
                          <span className="text-xs text-green-600 ml-1">
                            (In database)
                          </span>
                        </label>
                        <Input
                          type="number"
                          value={settings.freePlanLimit}
                          onChange={(e) =>
                            handleInputChange(
                              "freePlanLimit",
                              parseInt(e.target.value)
                            )
                          }
                          placeholder="5"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Premium Plan Price (IDR/month)
                          <span className="text-xs text-green-600 ml-1">
                            (In database)
                          </span>
                        </label>
                        <Input
                          type="number"
                          value={settings.premiumPlanPrice}
                          onChange={(e) =>
                            handleInputChange(
                              "premiumPlanPrice",
                              parseInt(e.target.value)
                            )
                          }
                          placeholder="500000"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Enterprise Plan Price (IDR/month)
                          <span className="text-xs text-green-600 ml-1">
                            (In database)
                          </span>
                        </label>
                        <Input
                          type="number"
                          value={settings.enterprisePlanPrice}
                          onChange={(e) =>
                            handleInputChange(
                              "enterprisePlanPrice",
                              parseInt(e.target.value)
                            )
                          }
                          placeholder="1500000"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Features Settings */}
                {activeTab === "features" && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Feature Control
                      <span className="text-xs text-green-600 ml-2">
                        (In database)
                      </span>
                    </h3>
                    <div className="space-y-4">
                      {[
                        {
                          key: "enableRegistration",
                          label: "Enable User Registration",
                          icon: Users,
                        },
                        {
                          key: "enableVendorRegistration",
                          label: "Enable Vendor Registration",
                          icon: Store,
                        },
                        {
                          key: "enableReviews",
                          label: "Enable Reviews & Ratings",
                          icon: Star,
                        },
                        {
                          key: "enableWishlist",
                          label: "Enable Wishlist",
                          icon: Star,
                        },
                        {
                          key: "enableChat",
                          label: "Enable Chat System",
                          icon: MessageSquare,
                        },
                        {
                          key: "enableBlog",
                          label: "Enable Blog",
                          icon: FileText,
                        },
                        {
                          key: "enableFaq",
                          label: "Enable FAQ",
                          icon: FileText,
                        },
                        {
                          key: "enableAiChatbot",
                          label: "Enable AI Chatbot",
                          icon: Bot,
                        },
                        {
                          key: "enableVendorCollaboration",
                          label: "Enable Vendor Collaboration",
                          icon: Users,
                        },
                        {
                          key: "enableDpCicilan",
                          label: "Enable DP & Cicilan",
                          icon: CreditCard,
                        },
                        {
                          key: "enablePromoVoucher",
                          label: "Enable Promo & Voucher",
                          icon: CreditCard,
                        },
                      ].map((feature) => {
                        const Icon = feature.icon;
                        return (
                          <div
                            key={feature.key}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center">
                              <Icon className="h-5 w-5 text-gray-400 mr-3" />
                              <span className="text-sm font-medium text-gray-700">
                                {feature.label}
                              </span>
                            </div>
                            <button
                              onClick={() => handleToggle(feature.key)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                settings[feature.key]
                                  ? "bg-primary-600"
                                  : "bg-gray-200"
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  settings[feature.key]
                                    ? "translate-x-6"
                                    : "translate-x-1"
                                }`}
                              />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Payment Gateways */}
                {activeTab === "gateways" && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Payment Gateways
                      <span className="text-xs text-green-600 ml-2">
                        (In database)
                      </span>
                    </h3>
                    <div className="space-y-4">
                      {[
                        {
                          key: "enableXendit",
                          label: "Xendit (eWallet, VA, QRIS)",
                          icon: CreditCard,
                        },
                        {
                          key: "enableMidtrans",
                          label: "Midtrans (CC, VA, QRIS, PayLater)",
                          icon: CreditCard,
                        },
                        {
                          key: "enableManualTransfer",
                          label: "Manual Transfer",
                          icon: CreditCard,
                        },
                        {
                          key: "enableCod",
                          label: "Cash on Delivery (COD)",
                          icon: CreditCard,
                        },
                      ].map((gateway) => {
                        const Icon = gateway.icon;
                        return (
                          <div
                            key={gateway.key}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center">
                              <Icon className="h-5 w-5 text-gray-400 mr-3" />
                              <span className="text-sm font-medium text-gray-700">
                                {gateway.label}
                              </span>
                            </div>
                            <button
                              onClick={() => handleToggle(gateway.key)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                settings[gateway.key]
                                  ? "bg-primary-600"
                                  : "bg-gray-200"
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  settings[gateway.key]
                                    ? "translate-x-6"
                                    : "translate-x-1"
                                }`}
                              />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* SEO Settings */}
                {activeTab === "seo" && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900">
                      SEO Settings
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Meta Title
                          <span className="text-xs text-green-600 ml-1">
                            (In database)
                          </span>
                        </label>
                        <Input
                          value={settings.metaTitle}
                          onChange={(e) =>
                            handleInputChange("metaTitle", e.target.value)
                          }
                          placeholder="Wedding Dream - Platform Pernikahan Terpercaya"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Meta Description
                          <span className="text-xs text-green-600 ml-1">
                            (In database)
                          </span>
                        </label>
                        <textarea
                          value={settings.metaDescription}
                          onChange={(e) =>
                            handleInputChange("metaDescription", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          rows={3}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Meta Keywords
                          <span className="text-xs text-green-600 ml-1">
                            (In database)
                          </span>
                        </label>
                        <Input
                          value={settings.metaKeywords}
                          onChange={(e) =>
                            handleInputChange("metaKeywords", e.target.value)
                          }
                          placeholder="wedding, pernikahan, vendor, venue, fotografer, makeup"
                        />
                      </div>
                      <div className="space-y-4">
                        <h4 className="text-md font-medium text-gray-900">
                          SEO Modules
                          <span className="text-xs text-green-600 ml-2">
                            (In database)
                          </span>
                        </h4>
                        {[
                          {
                            key: "enableSeoBasic",
                            label: "SEO Basic (Meta, Sitemap, Schema)",
                          },
                          {
                            key: "enableSeoAdvanced",
                            label: "SEO Advanced (GSC, GA4, GTM)",
                          },
                          {
                            key: "enableSeoAutomation",
                            label: "SEO Automation (AI Recommendation)",
                          },
                        ].map((seo) => (
                          <div
                            key={seo.key}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                          >
                            <span className="text-sm font-medium text-gray-700">
                              {seo.label}
                            </span>
                            <button
                              onClick={() => handleToggle(seo.key)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                settings[seo.key]
                                  ? "bg-primary-600"
                                  : "bg-gray-200"
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  settings[seo.key]
                                    ? "translate-x-6"
                                    : "translate-x-1"
                                }`}
                              />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Email Settings */}
                {activeTab === "email" && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Email Settings
                    </h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            SMTP Host
                            <span className="text-xs text-green-600 ml-1">
                              (In database)
                            </span>
                          </label>
                          <Input
                            value={settings.smtpHost}
                            onChange={(e) =>
                              handleInputChange("smtpHost", e.target.value)
                            }
                            placeholder="smtp.gmail.com"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            SMTP Port
                            <span className="text-xs text-green-600 ml-1">
                              (In database)
                            </span>
                          </label>
                          <Input
                            type="number"
                            value={settings.smtpPort}
                            onChange={(e) =>
                              handleInputChange(
                                "smtpPort",
                                parseInt(e.target.value)
                              )
                            }
                            placeholder="587"
                            className={errors.smtpPort ? "border-red-500" : ""}
                          />
                          {renderFieldError("smtpPort")}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            SMTP Username
                            <span className="text-xs text-green-600 ml-1">
                              (In database)
                            </span>
                          </label>
                          <Input
                            value={settings.smtpUsername}
                            onChange={(e) =>
                              handleInputChange("smtpUsername", e.target.value)
                            }
                            placeholder="your-email@gmail.com"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            SMTP Password
                            <span className="text-xs text-green-600 ml-1">
                              (In database)
                            </span>
                          </label>
                          <Input
                            type="password"
                            value={settings.smtpPassword}
                            onChange={(e) =>
                              handleInputChange("smtpPassword", e.target.value)
                            }
                            placeholder="Your app password"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            SMTP Encryption
                            <span className="text-xs text-green-600 ml-1">
                              (In database)
                            </span>
                          </label>
                          <select
                            value={settings.smtpEncryption}
                            onChange={(e) =>
                              handleInputChange(
                                "smtpEncryption",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          >
                            <option value="tls">TLS</option>
                            <option value="ssl">SSL</option>
                            <option value="none">None</option>
                          </select>
                        </div>
                      </div>
                      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <svg
                              className="h-5 w-5 text-yellow-400"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-yellow-800">
                              Security Notice
                            </h3>
                            <div className="mt-2 text-sm text-yellow-700">
                              <p>
                                For Gmail, use an App Password instead of your
                                regular password. Enable 2FA and generate an App
                                Password in your Google Account settings.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Security Settings */}
                {activeTab === "security" && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Security Settings
                    </h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Max Login Attempts
                            <span className="text-xs text-green-600 ml-1">
                              (In database)
                            </span>
                          </label>
                          <Input
                            type="number"
                            value={settings.maxLoginAttempts}
                            onChange={(e) =>
                              handleInputChange(
                                "maxLoginAttempts",
                                parseInt(e.target.value)
                              )
                            }
                            placeholder="5"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Lockout Duration (minutes)
                            <span className="text-xs text-green-600 ml-1">
                              (In database)
                            </span>
                          </label>
                          <Input
                            type="number"
                            value={settings.lockoutDuration}
                            onChange={(e) =>
                              handleInputChange(
                                "lockoutDuration",
                                parseInt(e.target.value)
                              )
                            }
                            placeholder="30"
                            className={
                              errors.lockoutDuration ? "border-red-500" : ""
                            }
                          />
                          {renderFieldError("lockoutDuration")}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Session Timeout (minutes)
                            <span className="text-xs text-green-600 ml-1">
                              (In database)
                            </span>
                          </label>
                          <Input
                            type="number"
                            value={settings.sessionTimeout}
                            onChange={(e) =>
                              handleInputChange(
                                "sessionTimeout",
                                parseInt(e.target.value)
                              )
                            }
                            placeholder="120"
                            className={
                              errors.sessionTimeout ? "border-red-500" : ""
                            }
                          />
                          {renderFieldError("sessionTimeout")}
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h4 className="text-md font-medium text-gray-900">
                          Security Features
                        </h4>
                        {[
                          {
                            key: "requireEmailVerification",
                            label: "Require Email Verification",
                            description:
                              "Users must verify their email before accessing the platform",
                            inDatabase: true,
                          },
                        ].map((security) => (
                          <div
                            key={security.key}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                          >
                            <div className="flex-1">
                              <span className="text-sm font-medium text-gray-700">
                                {security.label}
                                <span className="text-xs text-gray-500 ml-1">
                                  (
                                  {security.inDatabase
                                    ? "In database"
                                    : "Not in database yet"}
                                  )
                                </span>
                              </span>
                              <p className="text-xs text-gray-500 mt-1">
                                {security.description}
                              </p>
                            </div>
                            <button
                              onClick={() => handleToggle(security.key)}
                              disabled={!security.inDatabase}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                settings[security.key]
                                  ? "bg-primary-600"
                                  : "bg-gray-200"
                              } ${
                                !security.inDatabase
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  settings[security.key]
                                    ? "translate-x-6"
                                    : "translate-x-1"
                                }`}
                              />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Notifications Settings */}
                {activeTab === "notifications" && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Notification Settings
                      <span className="text-xs text-green-600 ml-2">
                        (In database)
                      </span>
                    </h3>
                    <div className="space-y-4">
                      <h4 className="text-md font-medium text-gray-900">
                        Notification Channels
                      </h4>
                      {[
                        {
                          key: "emailNotifications",
                          label: "Email Notifications",
                          description: "Send notifications via email",
                        },
                        {
                          key: "smsNotifications",
                          label: "SMS Notifications",
                          description:
                            "Send notifications via SMS (requires SMS gateway)",
                        },
                        {
                          key: "pushNotifications",
                          label: "Push Notifications",
                          description: "Send browser push notifications",
                        },
                      ].map((notification) => (
                        <div
                          key={notification.key}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                        >
                          <div className="flex-1">
                            <span className="text-sm font-medium text-gray-700">
                              {notification.label}
                            </span>
                            <p className="text-xs text-gray-500 mt-1">
                              {notification.description}
                            </p>
                          </div>
                          <button
                            onClick={() => handleToggle(notification.key)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              settings[notification.key]
                                ? "bg-primary-600"
                                : "bg-gray-200"
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                settings[notification.key]
                                  ? "translate-x-6"
                                  : "translate-x-1"
                              }`}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminSettingsPage;
