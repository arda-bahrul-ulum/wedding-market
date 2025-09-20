import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Card, CardBody } from "../../components/UI/Card";
import Button from "../../components/UI/Button";
import Input from "../../components/UI/Input";
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
} from "lucide-react";

function AdminSettingsPage() {
  const { user, logout } = useAuth();
  const [settings, setSettings] = useState({
    // General Settings
    siteName: "Wedding Market",
    siteDescription: "Platform pernikahan terpercaya",
    siteUrl: "https://weddingcommerce.com",
    adminEmail: "admin@weddingcommerce.com",
    supportEmail: "support@weddingcommerce.com",

    // Commission Settings
    commissionRate: 5.0,
    minimumCommission: 10000,
    maximumCommission: 1000000,

    // Payment Settings
    paymentTimeout: 24,
    refundPeriod: 7,
    escrowPeriod: 3,

    // Subscription Settings
    freePlanLimit: 5,
    premiumPlanPrice: 500000,
    enterprisePlanPrice: 1500000,

    // Email Settings
    smtpHost: "",
    smtpPort: 587,
    smtpUsername: "",
    smtpPassword: "",
    smtpEncryption: "tls",

    // SEO Settings
    metaTitle: "Wedding Market - Platform Pernikahan Terpercaya",
    metaDescription:
      "Temukan vendor pernikahan terbaik dengan harga terjangkau",
    metaKeywords: "wedding, pernikahan, vendor, venue, fotografer, makeup",

    // Security Settings
    maxLoginAttempts: 5,
    lockoutDuration: 30,
    sessionTimeout: 120,
    requireEmailVerification: true,

    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,

    // Feature Flags
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

    // Payment Gateways
    enableXendit: true,
    enableMidtrans: false,
    enableManualTransfer: true,
    enableCod: false,

    // SEO Modules
    enableSeoBasic: true,
    enableSeoAdvanced: false,
    enableSeoAutomation: false,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/v1/admin/system-settings", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();

      if (data.success) {
        setSettings({ ...settings, ...data.data });
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const response = await fetch("/api/v1/admin/system-settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        alert("Settings saved successfully!");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Error saving settings!");
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleToggle = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                System Settings
              </h1>
              <p className="text-gray-600 mt-1">
                Kelola konfigurasi sistem dan modul
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-700">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {user?.role?.replace("_", " ")}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-8">
        {/* Save Button */}
        <div className="mb-6 flex justify-end">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>{isSaving ? "Saving..." : "Save Settings"}</span>
          </Button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
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
            <Card>
              <CardBody className="p-6">
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
                        </label>
                        <Input
                          value={settings.siteName}
                          onChange={(e) =>
                            handleInputChange("siteName", e.target.value)
                          }
                          placeholder="Wedding Market"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Site URL
                        </label>
                        <Input
                          value={settings.siteUrl}
                          onChange={(e) =>
                            handleInputChange("siteUrl", e.target.value)
                          }
                          placeholder="https://weddingcommerce.com"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Site Description
                        </label>
                        <textarea
                          value={settings.siteDescription}
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
                        </label>
                        <Input
                          type="email"
                          value={settings.adminEmail}
                          onChange={(e) =>
                            handleInputChange("adminEmail", e.target.value)
                          }
                          placeholder="admin@weddingcommerce.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Support Email
                        </label>
                        <Input
                          type="email"
                          value={settings.supportEmail}
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
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Minimum Commission (IDR)
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
                        </label>
                        <Input
                          value={settings.metaTitle}
                          onChange={(e) =>
                            handleInputChange("metaTitle", e.target.value)
                          }
                          placeholder="Wedding Market - Platform Pernikahan Terpercaya"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Meta Description
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
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminSettingsPage;
