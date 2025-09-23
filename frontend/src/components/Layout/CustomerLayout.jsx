import React from "react";
import { Outlet } from "react-router-dom";
import {
  Bell,
  Search,
  ShoppingCart,
  User,
  Heart,
  Home,
  Store,
  ShoppingBag,
  Calendar,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";

function CustomerLayout() {
  const { user } = useAuth();
  const { itemCount } = useCart();

  const navigation = [
    {
      name: "Dashboard",
      href: "/customer",
      icon: Home,
      color: "text-blue-500",
    },
    {
      name: "Pesanan",
      href: "/customer/orders",
      icon: ShoppingBag,
      color: "text-green-500",
    },
    {
      name: "Wishlist",
      href: "/customer/wishlist",
      icon: Heart,
      color: "text-red-500",
    },
    {
      name: "Profil",
      href: "/customer/profile",
      icon: User,
      color: "text-purple-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Mobile menu button removed - using BottomNavigation instead */}

      {/* Mobile Menu removed - using BottomNavigation instead */}

      {/* Desktop sidebar - Fixed */}
      <div className="hidden lg:block fixed inset-y-0 left-0 z-30 w-72 bg-white/80 backdrop-blur-md border-r border-gray-200/50 shadow-lg">
        <div className="flex flex-col h-full">
          <div className="flex-1 flex flex-col pt-8 pb-4">
            <div className="flex items-center flex-shrink-0 px-6">
              <div className="flex items-center space-x-3">
                <div>
                  <span className="text-2xl font-bold text-gradient">
                    Customer Panel
                  </span>
                  <p className="text-xs text-gray-500 -mt-1">Wedding Dream</p>
                </div>
              </div>
            </div>
            <nav className="mt-8 flex-1 px-4 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className="group flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-300 hover:scale-105 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  >
                    <Icon className={`mr-4 h-5 w-5 ${item.color}`} />
                    {item.name}
                  </a>
                );
              })}
            </nav>
          </div>
          {/* Footer */}
          <div className="flex-shrink-0 border-t border-gray-200 p-6">
            <div className="text-center">
              <p className="text-xs text-gray-500">© 2025 Wedding Dream</p>
              <p className="text-xs text-gray-400 mt-1">Customer Panel v2.0</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content area - with left margin for desktop sidebar */}
      <div className="lg:ml-72">
        {/* Page content */}
        <main className="min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default CustomerLayout;
