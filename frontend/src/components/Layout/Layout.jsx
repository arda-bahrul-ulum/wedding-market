import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import BottomNavigation from "./BottomNavigation";
import CartSidebar from "../Cart/CartSidebar";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";

function Layout() {
  const { isOpen, setCartOpen } = useCart();
  const { isLoading } = useAuth();

  // Show loading while auth is initializing
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Memuat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />

      <main className="flex-1 pb-20 lg:pb-0">
        <Outlet />
      </main>

      <Footer />

      {/* Bottom Navigation for Mobile */}
      <BottomNavigation />

      {/* Cart Sidebar */}
      <CartSidebar isOpen={isOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}

export default Layout;
