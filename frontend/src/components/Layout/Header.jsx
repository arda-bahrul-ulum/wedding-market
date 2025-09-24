import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";
import {
  Search,
  ShoppingCart,
  User,
  Heart,
  Bell,
  Settings,
  LogOut,
} from "lucide-react";

function Header() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount, toggleCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isSearchModalOpen) {
        closeSearchModal();
      }
    };

    if (isSearchModalOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isSearchModalOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      closeSearchModal();
    }
  };

  const handleLogout = async () => {
    await logout();
    setIsProfileOpen(false);
    navigate("/");
  };

  // Removed unused search focus handlers

  const openSearchModal = () => {
    setIsSearchModalOpen(true);
  };

  const closeSearchModal = () => {
    setIsSearchModalOpen(false);
    setSearchQuery("");
  };

  const getNavigationItems = () => {
    if (!isAuthenticated) {
      return [
        { name: "Beranda", href: "/" },
        { name: "Booking Vendor", href: "/marketplace" },
        { name: "Tentang", href: "/about" },
        { name: "Kontak", href: "/contact" },
      ];
    }

    if (user?.role === "customer") {
      return [
        { name: "Beranda", href: "/" },
        { name: "Booking Vendor", href: "/marketplace" },
        { name: "Pesanan", href: "/customer/orders" },
        { name: "Wishlist", href: "/customer/wishlist" },
      ];
    } else if (user?.role === "vendor") {
      return [
        { name: "Beranda", href: "/" },
        { name: "Kerjasama", href: "/vendor/collaboration" },
        { name: "Jasa", href: "/vendor/services" },
        { name: "Pesanan", href: "/vendor/orders" },
      ];
    } else if (user?.role === "admin" || user?.role === "super_user") {
      return [
        { name: "Beranda", href: "/" },
        { name: "Booking Vendor", href: "/marketplace" },
        { name: "Dashboard", href: "/admin" },
        { name: "Pengguna", href: "/admin/users" },
        { name: "Vendor", href: "/admin/vendors" },
      ];
    }

    // Fallback for unknown roles
    return [
      { name: "Beranda", href: "/" },
      { name: "Booking Vendor", href: "/marketplace" },
    ];
  };

  const navigationItems = getNavigationItems();

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/50"
          : "bg-transparent"
      }`}
    >
      <div className="container-custom px-4 lg:px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <div className="flex items-center space-x-3">
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-gradient">
                  Wedding Dream
                </span>
                <span className="text-xs text-gray-500 -mt-1">
                  Platform Terpercaya
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-2 ml-12">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-5 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 hover:scale-105 ${
                  location.pathname === item.href
                    ? "text-primary-600 bg-primary-50 shadow-sm"
                    : "text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="hidden xl:flex flex-1 max-w-md mx-8">
            <div className="w-full">
              <div
                className="relative group cursor-pointer"
                onClick={openSearchModal}
              >
                <div className="w-full pl-10 pr-4 py-2.5 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 text-sm font-medium text-gray-500 flex items-center">
                  <span>Cari vendor...</span>
                </div>
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 group-hover:text-primary-500 transition-colors duration-300" />
              </div>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {/* Search Button for Mobile */}
            <button
              onClick={() => navigate("/search")}
              className="xl:hidden p-3 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-xl transition-all duration-300"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Cart */}
            {isAuthenticated && user?.role === "customer" && (
              <button
                onClick={toggleCart}
                className="relative p-3 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-xl transition-all duration-300 group"
              >
                <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold shadow-lg animate-pulse">
                    {itemCount}
                  </span>
                )}
              </button>
            )}

            {/* Notifications */}
            {isAuthenticated && (
              <button className="relative p-3 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-xl transition-all duration-300 group">
                <Bell className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
              </button>
            )}

            {/* Profile Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-3 p-2 text-gray-700 hover:text-primary-600 hover:bg-gray-100 rounded-xl transition-all duration-300 group"
                >
                  <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-semibold">{user?.name}</p>
                    <p className="text-xs text-gray-500 capitalize">
                      {user?.role}
                    </p>
                  </div>
                </button>

                {/* Profile Dropdown */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-4 w-72 bg-white/95 backdrop-blur-md rounded-2xl shadow-large border border-gray-200/50 py-3 z-50 animate-slideDown">
                    <div className="px-6 py-5 border-b border-gray-100">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center shadow-lg">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">
                            {user?.name}
                          </p>
                          <p className="text-xs text-gray-500">{user?.email}</p>
                          <span className="inline-block mt-1 px-2 py-1 text-xs font-semibold bg-primary-100 text-primary-800 rounded-full capitalize">
                            {user?.role}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="py-3">
                      {user?.role === "customer" && (
                        <>
                          <Link
                            to="/customer"
                            className="flex items-center px-6 py-3.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <User className="w-4 h-4 mr-3 text-primary-500" />
                            Dashboard
                          </Link>
                          <Link
                            to="/customer/profile"
                            className="flex items-center px-6 py-3.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <Settings className="w-4 h-4 mr-3 text-gray-500" />
                            Profil
                          </Link>
                          <Link
                            to="/customer/wishlist"
                            className="flex items-center px-6 py-3.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <Heart className="w-4 h-4 mr-3 text-red-500" />
                            Wishlist
                          </Link>
                        </>
                      )}

                      {user?.role === "vendor" && (
                        <>
                          <Link
                            to="/vendor"
                            className="flex items-center px-6 py-3.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <User className="w-4 h-4 mr-3 text-primary-500" />
                            Dashboard
                          </Link>
                          <Link
                            to="/vendor/profile"
                            className="flex items-center px-6 py-3.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <Settings className="w-4 h-4 mr-3 text-gray-500" />
                            Profil
                          </Link>
                        </>
                      )}

                      {(user?.role === "admin" ||
                        user?.role === "super_user") && (
                        <Link
                          to="/admin"
                          className="flex items-center px-6 py-3.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <Settings className="w-4 h-4 mr-3 text-primary-500" />
                          Admin Panel
                        </Link>
                      )}

                      <div className="border-t border-gray-100 my-3"></div>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-6 py-3.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors duration-200"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-gray-700 hover:text-primary-600 transition-colors duration-300 px-5 py-2.5 rounded-xl hover:bg-gray-100"
                >
                  Masuk
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary btn-sm px-6 py-2.5"
                >
                  Daftar
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu removed - using BottomNavigation instead */}
      </div>

      {/* Search Modal */}
      {isSearchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeSearchModal}
          ></div>

          {/* Modal Content */}
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-200 animate-slideDown">
            <form onSubmit={handleSearch} className="p-6">
              <div className="relative group">
                <div className="flex items-center px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
                  {/* Search Icon */}
                  <Search className="w-5 h-5 text-gray-400 mr-3" />

                  {/* Input Area */}
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Cari vendor, jasa, atau paket..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-transparent text-gray-700 placeholder-gray-400 text-base font-medium focus:outline-none"
                      autoFocus
                    />
                  </div>
                </div>
              </div>

              {/* Search Suggestions */}
              <div className="mt-4 space-y-2">
                <p className="text-sm text-gray-500 font-medium">
                  Pencarian Populer:
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Fotografer",
                    "Venue",
                    "Catering",
                    "Dekorasi",
                    "Makeup",
                    "Gaun Pengantin",
                  ].map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => {
                        setSearchQuery(suggestion);
                        navigate(`/search?q=${encodeURIComponent(suggestion)}`);
                        closeSearchModal();
                      }}
                      className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-primary-100 text-gray-700 hover:text-primary-700 rounded-lg transition-colors duration-200"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search Button */}
              <div className="mt-6 flex items-center justify-between">
                <div className="text-xs text-gray-400">
                  <span>Tekan Enter untuk mencari</span>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={closeSearchModal}
                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors duration-200"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors duration-200"
                  >
                    Cari
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
