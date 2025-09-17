import { useState } from "react";
import { Heart, Search, Trash2, ShoppingCart, Star } from "lucide-react";
import { formatCurrency, formatRating } from "../../utils/format";
import Card, { CardBody } from "../../components/UI/Card";
import Button from "../../components/UI/Button";
import Input from "../../components/UI/Input";

function WishlistPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data - replace with actual API call
  const wishlistItems = [
    {
      id: 1,
      type: "service",
      name: "Paket Fotografi Prewedding",
      vendor_name: "Studio Foto Indah",
      price: 2500000,
      rating: 4.8,
      review_count: 24,
      image: "/api/placeholder/300/200",
      location: "Jakarta Selatan",
    },
    {
      id: 2,
      type: "package",
      name: "Paket Wedding Organizer Premium",
      vendor_name: "Dream Wedding Planner",
      price: 15000000,
      rating: 4.9,
      review_count: 45,
      image: "/api/placeholder/300/200",
      location: "Jakarta Pusat",
    },
    {
      id: 3,
      type: "service",
      name: "Make Up Artist & Hair Stylist",
      vendor_name: "Beauty by Sarah",
      price: 1200000,
      rating: 4.7,
      review_count: 18,
      image: "/api/placeholder/300/200",
      location: "Bandung",
    },
  ];

  const filteredItems = wishlistItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.vendor_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRemoveFromWishlist = (id, type) => {
    // Implement remove from wishlist logic
    console.log("Remove from wishlist:", id, type);
  };

  const handleAddToCart = (item) => {
    // Implement add to cart logic
    console.log("Add to cart:", item);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Wishlist Saya
          </h1>
          <p className="text-gray-600">
            Simpan item favorit Anda untuk dipesan nanti
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Input
              placeholder="Cari di wishlist..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
        </div>

        {/* Wishlist Items */}
        {filteredItems.length === 0 ? (
          <Card>
            <CardBody className="text-center py-12">
              <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchQuery
                  ? "Tidak ada item yang ditemukan"
                  : "Wishlist kosong"}
              </h3>
              <p className="text-gray-600 mb-4">
                {searchQuery
                  ? "Coba ubah kata kunci pencarian Anda"
                  : "Mulai tambahkan item ke wishlist Anda"}
              </p>
              <Button>Jelajahi Marketplace</Button>
            </CardBody>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <Card
                key={`${item.id}-${item.type}`}
                className="group hover:shadow-lg transition-shadow"
              >
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                </div>
                <CardBody className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                      {item.name}
                    </h3>
                    <button
                      onClick={() =>
                        handleRemoveFromWishlist(item.id, item.type)
                      }
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </button>
                  </div>

                  <p className="text-gray-600 text-sm mb-3">
                    {item.vendor_name}
                  </p>

                  <div className="flex items-center space-x-1 mb-3">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-gray-600">
                      {formatRating(item.rating)}
                    </span>
                    <span className="text-sm text-gray-500">
                      ({item.review_count} review)
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm mb-4">
                    <span className="text-gray-500">{item.location}</span>
                    <span className="font-semibold text-primary-600">
                      {formatCurrency(item.price)}
                    </span>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => handleAddToCart(item)}
                    >
                      <ShoppingCart className="w-4 h-4 mr-1" />
                      Tambah ke Cart
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        handleRemoveFromWishlist(item.id, item.type)
                      }
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}

        {/* Bulk Actions */}
        {filteredItems.length > 0 && (
          <div className="mt-8 flex justify-between items-center">
            <p className="text-sm text-gray-600">
              {filteredItems.length} item di wishlist
            </p>
            <div className="flex space-x-2">
              <Button variant="outline">Tambah Semua ke Cart</Button>
              <Button variant="danger">Hapus Semua</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default WishlistPage;

