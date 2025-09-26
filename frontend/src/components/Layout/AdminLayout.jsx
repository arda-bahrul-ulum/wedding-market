import React from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  LayoutDashboard,
  Users,
  Store,
  ShoppingBag,
  LogOut,
  Bell,
  Search,
  User,
  ChevronRight,
  BarChart3,
  TrendingUp,
  Tag,
} from "lucide-react";

function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

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
      name: "Categories",
      href: "/admin/categories",
      icon: Tag,
      color: "text-indigo-500",
    },
    {
      name: "Orders",
      href: "/admin/orders",
      icon: ShoppingBag,
      color: "text-orange-500",
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
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar removed - using BottomNavigation instead */}

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
        {/* Mobile menu button removed - using BottomNavigation instead */}

        {/* Mobile Menu removed - using BottomNavigation instead */}

        {/* Page content */}
        <main className="min-h-screen bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
