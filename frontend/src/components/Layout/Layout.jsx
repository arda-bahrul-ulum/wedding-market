import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import CartSidebar from "../Cart/CartSidebar";
import { useCart } from "../../contexts/CartContext";

function Layout() {
  const { isOpen, setCartOpen } = useCart();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />

      {/* Cart Sidebar */}
      <CartSidebar isOpen={isOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}

export default Layout;

