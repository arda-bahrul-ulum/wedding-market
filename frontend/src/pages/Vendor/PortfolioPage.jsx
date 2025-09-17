import { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Star,
  Image,
  Video,
} from "lucide-react";
import { formatDate } from "../../utils/format";
import Card, { CardBody, CardHeader } from "../../components/UI/Card";
import Button from "../../components/UI/Button";
import Input from "../../components/UI/Input";

function PortfolioPage() {
  const [filters, setFilters] = useState({
    search: "",
    type: "",
    page: 1,
  });

  // Mock data - replace with actual API call
  const portfolioItems = [
    {
      id: 1,
      title: "Prewedding di Bali",
      description: "Sesi prewedding dengan latar pantai yang indah",
      image_url: "/api/placeholder/400/300",
      image_type: "image",
      is_featured: true,
      sort_order: 1,
      created_at: "2024-01-15",
    },
    {
      id: 2,
      title: "Wedding di Jakarta",
      description: "Pernikahan mewah di hotel bintang 5",
      image_url: "/api/placeholder/400/300",
      image_type: "image",
      is_featured: false,
      sort_order: 2,
      created_at: "2024-01-10",
    },
    {
      id: 3,
      title: "Video Highlight Pernikahan",
      description: "Video highlight pernikahan yang romantis",
      image_url: "/api/placeholder/400/300",
      image_type: "video",
      is_featured: true,
      sort_order: 3,
      created_at: "2024-01-05",
    },
  ];

  const filteredItems = portfolioItems.filter(
    (item) =>
      item.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      item.description.toLowerCase().includes(filters.search.toLowerCase())
  );

  const handleToggleFeatured = (itemId, currentStatus) => {
    // Implement toggle featured logic
    console.log("Toggle featured:", itemId, currentStatus);
  };

  const handleDelete = (itemId) => {
    if (confirm("Apakah Anda yakin ingin menghapus item ini?")) {
      // Implement delete logic
      console.log("Delete item:", itemId);
    }
  };

  const handleReorder = (itemId, direction) => {
    // Implement reorder logic
    console.log("Reorder item:", itemId, direction);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Portfolio
              </h1>
              <p className="text-gray-600">
                Kelola portfolio dan galeri karya Anda
              </p>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Portfolio
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardBody className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Input
                  placeholder="Cari portfolio..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters({ ...filters, search: e.target.value, page: 1 })
                  }
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>

              <select
                className="input"
                value={filters.type}
                onChange={(e) =>
                  setFilters({ ...filters, type: e.target.value, page: 1 })
                }
              >
                <option value="">Semua Tipe</option>
                <option value="image">Gambar</option>
                <option value="video">Video</option>
                <option value="featured">Featured</option>
              </select>

              <Button variant="outline" className="w-full md:w-auto">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Portfolio Items */}
        {filteredItems.length === 0 ? (
          <Card>
            <CardBody className="text-center py-12">
              <Image className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Belum ada portfolio
              </h3>
              <p className="text-gray-600 mb-4">
                Mulai tambahkan karya terbaik Anda
              </p>
              <Button>Tambah Portfolio</Button>
            </CardBody>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <Card
                key={item.id}
                className="group hover:shadow-lg transition-shadow"
              >
                <div className="aspect-w-16 aspect-h-9 relative">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  {item.is_featured && (
                    <div className="absolute top-2 left-2">
                      <span className="bg-yellow-500 text-white text-xs font-medium px-2 py-1 rounded-full flex items-center">
                        <Star className="w-3 h-3 mr-1" />
                        Featured
                      </span>
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.image_type === "video"
                          ? "bg-red-500 text-white"
                          : "bg-blue-500 text-white"
                      }`}
                    >
                      {item.image_type === "video" ? (
                        <Video className="w-3 h-3 inline mr-1" />
                      ) : (
                        <Image className="w-3 h-3 inline mr-1" />
                      )}
                      {item.image_type}
                    </span>
                  </div>
                </div>
                <CardBody className="p-6">
                  <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2 mb-2">
                    {item.title}
                  </h3>

                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>Urutan: {item.sort_order}</span>
                    <span>{formatDate(item.created_at)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleReorder(item.id, "up")}
                        className="p-1 text-gray-400 hover:text-gray-600"
                        title="Pindah ke atas"
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => handleReorder(item.id, "down")}
                        className="p-1 text-gray-400 hover:text-gray-600"
                        title="Pindah ke bawah"
                      >
                        ↓
                      </button>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() =>
                          handleToggleFeatured(item.id, item.is_featured)
                        }
                        className={`p-1 rounded ${
                          item.is_featured
                            ? "text-yellow-600 hover:bg-yellow-100"
                            : "text-gray-400 hover:bg-gray-100"
                        }`}
                        title={
                          item.is_featured
                            ? "Hapus dari featured"
                            : "Jadikan featured"
                        }
                      >
                        <Star
                          className={`w-4 h-4 ${
                            item.is_featured ? "fill-current" : ""
                          }`}
                        />
                      </button>
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardBody className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">
                {portfolioItems.length}
              </div>
              <div className="text-sm text-gray-600">Total Portfolio</div>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {portfolioItems.filter((p) => p.image_type === "image").length}
              </div>
              <div className="text-sm text-gray-600">Gambar</div>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">
                {portfolioItems.filter((p) => p.image_type === "video").length}
              </div>
              <div className="text-sm text-gray-600">Video</div>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {portfolioItems.filter((p) => p.is_featured).length}
              </div>
              <div className="text-sm text-gray-600">Featured</div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default PortfolioPage;

