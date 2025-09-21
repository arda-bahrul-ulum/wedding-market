import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  LayoutDashboard,
  Users,
  Store,
  ShoppingBag,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  User,
  ChevronRight,
  BarChart3,
  TrendingUp,
} from "lucide-react";

function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      color: "text-blue-500",
    },
    {
      name: "Users",
      href: "/admin/users",
      icon: Users,
      color: "text-green-500",
    },
    {
      name: "Vendors",
      href: "/admin/vendors",
      icon: Store,
      color: "text-purple-500",
    },
    {
      name: "Orders",
      href: "/admin/orders",
      icon: ShoppingBag,
      color: "text-orange-500",
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: Settings,
      color: "text-gray-500",
    },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const isCurrentPath = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-opacity duration-300 ${
          sidebarOpen ? "block opacity-100" : "hidden opacity-0"
        }`}
      >
        <div
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white/95 backdrop-blur-md shadow-2xl">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-xl bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-300"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="flex-1 h-0 pt-8 pb-4 overflow-y-auto scrollbar-thin">
            <div className="flex-shrink-0 flex items-center px-6">
              <div className="flex items-center space-x-3">
                <div>
                  <span className="text-xl font-bold text-gradient">
                    Admin Panel
                  </span>
                  <p className="text-xs text-gray-500 -mt-1">Wedding Dream</p>
                </div>
              </div>
            </div>
            <nav className="mt-8 px-4 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-4 py-3 text-base font-semibold rounded-xl transition-all duration-300 hover:scale-105 ${
                      isCurrentPath(item.href)
                        ? "bg-primary-50 text-primary-700 shadow-sm border border-primary-200"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon
                      className={`mr-4 h-6 w-6 ${
                        isCurrentPath(item.href)
                          ? item.color
                          : "text-gray-400 group-hover:text-gray-600"
                      }`}
                    />
                    {item.name}
                    {isCurrentPath(item.href) && (
                      <ChevronRight className="ml-auto h-4 w-4 text-primary-500" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex-shrink-0 border-t border-gray-200 p-6">
            <div className="text-center">
              <p className="text-xs text-gray-500">© 2025 Wedding Dream</p>
              <p className="text-xs text-gray-400 mt-1">Admin Panel v2.0</p>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar - Fixed */}
      <div className="hidden lg:block fixed inset-y-0 left-0 z-30 w-72 bg-white/80 backdrop-blur-md border-r border-gray-200/50 shadow-lg">
        <div className="flex flex-col h-full">
          <div className="flex-1 flex flex-col pt-8 pb-4">
            <div className="flex items-center flex-shrink-0 px-6">
              <div className="flex items-center space-x-3">
                <div>
                  <span className="text-2xl font-bold text-gradient">
                    Admin Panel
                  </span>
                  <p className="text-xs text-gray-500 -mt-1">Wedding Dream</p>
                </div>
              </div>
            </div>
            <nav className="mt-8 flex-1 px-4 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-300 hover:scale-105 ${
                      isCurrentPath(item.href)
                        ? "bg-primary-50 text-primary-700 shadow-sm border border-primary-200"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <Icon
                      className={`mr-4 h-5 w-5 ${
                        isCurrentPath(item.href)
                          ? item.color
                          : "text-gray-400 group-hover:text-gray-600"
                      }`}
                    />
                    {item.name}
                    {isCurrentPath(item.href) && (
                      <ChevronRight className="ml-auto h-4 w-4 text-primary-500" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
          {/* Footer */}
          <div className="flex-shrink-0 border-t border-gray-200 p-6">
            <div className="text-center">
              <p className="text-xs text-gray-500">© 2025 Wedding Dream</p>
              <p className="text-xs text-gray-400 mt-1">Admin Panel v2.0</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content area - with left margin for desktop sidebar */}
      <div className="lg:ml-72">
        {/* Mobile menu button */}
        <div className="lg:hidden">
          <button
            type="button"
            className="fixed top-6 left-6 z-50 p-3 rounded-xl bg-white/80 backdrop-blur-sm text-gray-600 hover:text-primary-600 hover:bg-white shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Page content */}
        <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
