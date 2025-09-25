import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";
import {
  Home,
  Heart,
  ShoppingBag,
  LayoutDashboard,
  Package,
  Store,
  Users,
  Calendar,
  Contact,
} from "lucide-react";

function BottomNavigation() {
  const { user, isAuthenticated } = useAuth();
  const { itemCount } = useCart();
  const location = useLocation();

  const getNavigationItems = () => {
    if (!isAuthenticated) {
      return [
        { name: "Beranda", href: "/", icon: Home },
        { name: "Booking", href: "/marketplace", icon: Calendar },
        { name: "Tentang", href: "/about", icon: Users },
        { name: "Kontak", href: "/contact", icon: Contact },
      ];
    }

    if (user?.role === "customer") {
      return [
        { name: "Beranda", href: "/", icon: Home },
        { name: "Booking", href: "/marketplace", icon: Calendar },
        { name: "Wishlist", href: "/customer/wishlist", icon: Heart },
        { name: "Pesanan", href: "/customer/orders", icon: ShoppingBag },
      ];
    } else if (user?.role === "vendor") {
      return [
        { name: "Beranda", href: "/", icon: Home },
        { name: "Dashboard", href: "/vendor", icon: LayoutDashboard },
        { name: "Jasa", href: "/vendor/services", icon: Package },
        { name: "Pesanan", href: "/vendor/orders", icon: ShoppingBag },
      ];
    } else if (user?.role === "admin" || user?.role === "super_user") {
      return [
        { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { name: "Pengguna", href: "/admin/users", icon: Users },
        { name: "Vendor", href: "/admin/vendors", icon: Store },
      ];
    }

    return [];
  };

  const navigationItems = getNavigationItems();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 lg:hidden">
      <div className="flex items-center justify-around py-2">
        {navigationItems.map((item, index) => {
          const Icon = item.icon;
          const isActive =
            location.pathname === item.href ||
            (item.href === "/" && location.pathname === "/") ||
            (item.href !== "/" && location.pathname.startsWith(item.href));

          return (
            <Link
              key={index}
              to={item.href}
              className={`flex flex-col items-center justify-center py-2 px-3 min-w-0 flex-1 transition-colors duration-200 ${
                isActive
                  ? "text-primary-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5 mx-auto" />
                {(item.name === "Pesanan" || item.name === "Wishlist") &&
                  itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold text-[10px]">
                      {itemCount > 9 ? "9+" : itemCount}
                    </span>
                  )}
              </div>
              <span className="text-xs font-medium mt-1 text-center leading-tight">
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default BottomNavigation;
