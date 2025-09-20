import { useState } from "react";
import { Plus, Search, Filter, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { formatCurrency } from "../../utils/format";
import Card, { CardBody, CardHeader } from "../../components/UI/Card";
import Button from "../../components/UI/Button";
import Input from "../../components/UI/Input";

function PackagesPage() {
  const [filters, setFilters] = useState({
    search: "",
    page: 1,
  });

  // Mock data - replace with actual API call
  const packages = [
    {
      id: 1,
      name: "Paket Wedding Organizer Premium",
      description: "Paket lengkap untuk pernikahan impian Anda",
      price: 15000000,
      is_active: true,
      is_featured: true,
      items_count: 5,
      image: "/api/placeholder/400/300",
    },
    {
      id: 2,
      name: "Paket Fotografi & Videografi",
      description: "Paket fotografi dan videografi untuk pernikahan",
      price: 8000000,
      is_active: true,
      is_featured: false,
      items_count: 3,
      image: "/api/placeholder/400/300",
    },
    {
      id: 3,
      name: "Paket Dekorasi & Bunga",
      description: "Paket dekorasi dan bunga untuk pernikahan",
      price: 5000000,
      is_active: false,
      is_featured: false,
      items_count: 4,
      image: "/api/placeholder/400/300",
    },
  ];

  const filteredPackages = packages.filter(
    (pkg) =>
      pkg.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      pkg.description.toLowerCase().includes(filters.search.toLowerCase())
  );

  const handleToggleStatus = (packageId, currentStatus) => {
    // Implement toggle status logic
    console.log("Toggle status:", packageId, currentStatus);
  };

  const handleDelete = (packageId) => {
    if (confirm("Apakah Anda yakin ingin menghapus paket ini?")) {
      // Implement delete logic
      console.log("Delete package:", packageId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Kelola Paket
              </h1>
              <p className="text-gray-600">
                Kelola semua paket jasa yang Anda tawarkan
              </p>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Paket Baru
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardBody className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Input
                  placeholder="Cari paket..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters({ ...filters, search: e.target.value, page: 1 })
                  }
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>

              <select className="input">
                <option value="">Semua Status</option>
                <option value="active">Aktif</option>
                <option value="inactive">Nonaktif</option>
                <option value="featured">Featured</option>
              </select>

              <Button variant="outline" className="w-full md:w-auto">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Packages List */}
        {filteredPackages.length === 0 ? (
          <Card>
            <CardBody className="text-center py-12">
              <Plus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Belum ada paket
              </h3>
              <p className="text-gray-600 mb-4">
                Mulai tambahkan paket pertama Anda
              </p>
              <Button>Tambah Paket Baru</Button>
            </CardBody>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPackages.map((pkg) => (
              <Card
                key={pkg.id}
                className="group hover:shadow-lg transition-shadow"
              >
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={pkg.image}
                    alt={pkg.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  {pkg.is_featured && (
                    <div className="absolute top-2 left-2">
                      <span className="bg-yellow-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                        Featured
                      </span>
                    </div>
                  )}
                </div>
                <CardBody className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                      {pkg.name}
                    </h3>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() =>
                          handleToggleStatus(pkg.id, pkg.is_active)
                        }
                        className={`p-1 rounded ${
                          pkg.is_active
                            ? "text-green-600 hover:bg-green-100"
                            : "text-gray-400 hover:bg-gray-100"
                        }`}
                      >
                        {pkg.is_active ? (
                          <Eye className="w-4 h-4" />
                        ) : (
                          <EyeOff className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {pkg.description}
                  </p>

                  <div className="flex items-center justify-between text-sm mb-4">
                    <span className="text-gray-500">
                      {pkg.items_count} items
                    </span>
                    <span className="font-semibold text-primary-600">
                      {formatCurrency(pkg.price)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        pkg.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {pkg.is_active ? "Aktif" : "Nonaktif"}
                    </span>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDelete(pkg.id)}
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
                {packages.length}
              </div>
              <div className="text-sm text-gray-600">Total Paket</div>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {packages.filter((p) => p.is_active).length}
              </div>
              <div className="text-sm text-gray-600">Aktif</div>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {packages.filter((p) => p.is_featured).length}
              </div>
              <div className="text-sm text-gray-600">Featured</div>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {packages.reduce((sum, p) => sum + p.items_count, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Items</div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default PackagesPage;
