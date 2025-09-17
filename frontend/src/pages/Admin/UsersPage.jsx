import { useState } from "react";
import { useQuery } from "react-query";
import { adminAPI } from "../../services/api";
import {
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  UserCheck,
  UserX,
} from "lucide-react";
import { formatDate } from "../../utils/format";
import LoadingSpinner from "../../components/UI/LoadingSpinner";
import Card, { CardBody } from "../../components/UI/Card";
import Button from "../../components/UI/Button";
import Input from "../../components/UI/Input";

function UsersPage() {
  const [filters, setFilters] = useState({
    search: "",
    role: "",
    page: 1,
  });

  const { data: usersData, isLoading } = useQuery(
    ["admin-users", filters],
    () => adminAPI.getUsers(filters)
  );

  const users = usersData?.data?.users || [];
  const pagination = usersData?.data?.pagination || {};

  const getRoleColor = (role) => {
    switch (role) {
      case "super_user":
        return "bg-purple-100 text-purple-800";
      case "admin":
        return "bg-red-100 text-red-800";
      case "vendor":
        return "bg-blue-100 text-blue-800";
      case "customer":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleText = (role) => {
    switch (role) {
      case "super_user":
        return "Super User";
      case "admin":
        return "Admin";
      case "vendor":
        return "Vendor";
      case "customer":
        return "Customer";
      default:
        return role;
    }
  };

  const handleToggleStatus = (userId, currentStatus) => {
    // Implement toggle status logic
    console.log("Toggle status:", userId, currentStatus);
  };

  const handleDelete = (userId) => {
    if (confirm("Apakah Anda yakin ingin menghapus user ini?")) {
      // Implement delete logic
      console.log("Delete user:", userId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Kelola Users
          </h1>
          <p className="text-gray-600">Kelola semua pengguna platform</p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardBody className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Input
                  placeholder="Cari user..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters({ ...filters, search: e.target.value, page: 1 })
                  }
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>

              <select
                className="input"
                value={filters.role}
                onChange={(e) =>
                  setFilters({ ...filters, role: e.target.value, page: 1 })
                }
              >
                <option value="">Semua Role</option>
                <option value="customer">Customer</option>
                <option value="vendor">Vendor</option>
                <option value="admin">Admin</option>
                <option value="super_user">Super User</option>
              </select>

              <Button variant="outline" className="w-full md:w-auto">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Users List */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : users.length === 0 ? (
          <Card>
            <CardBody className="text-center py-12">
              <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Tidak ada user
              </h3>
              <p className="text-gray-600">
                User akan muncul di sini ketika ada yang mendaftar
              </p>
            </CardBody>
          </Card>
        ) : (
          <div className="space-y-4">
            {users.map((user) => (
              <Card key={user.id} className="hover:shadow-lg transition-shadow">
                <CardBody className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {user.name}
                        </h3>
                        <p className="text-gray-600">{user.email}</p>
                        <p className="text-sm text-gray-500">
                          {user.phone || "Tidak ada telepon"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(
                          user.role
                        )}`}
                      >
                        {getRoleText(user.role)}
                      </span>
                      <p className="text-sm text-gray-500 mt-1">
                        {formatDate(user.created_at)}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="w-4 h-4 mr-2" />
                      <span>{user.email}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="w-4 h-4 mr-2" />
                      <span>{user.phone || "Tidak ada"}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>Bergabung {formatDate(user.created_at)}</span>
                    </div>
                  </div>

                  {user.vendor_profile && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-blue-900 mb-1">
                        Profil Vendor:
                      </p>
                      <p className="text-sm text-blue-800">
                        {user.vendor_profile.business_name} -{" "}
                        {user.vendor_profile.business_type}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.is_active ? "Aktif" : "Nonaktif"}
                      </span>
                      {user.email_verified_at && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Verified
                        </span>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-1" />
                        Detail
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant={user.is_active ? "danger" : "primary"}
                        onClick={() =>
                          handleToggleStatus(user.id, user.is_active)
                        }
                      >
                        {user.is_active ? (
                          <>
                            <UserX className="w-4 h-4 mr-1" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <UserCheck className="w-4 h-4 mr-1" />
                            Activate
                          </>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDelete(user.id)}
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

        {/* Pagination */}
        {pagination.total_pages > 1 && (
          <div className="mt-8 flex justify-center">
            <nav className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.current_page === 1}
                onClick={() =>
                  setFilters({ ...filters, page: pagination.current_page - 1 })
                }
              >
                Previous
              </Button>

              {Array.from(
                { length: pagination.total_pages },
                (_, i) => i + 1
              ).map((page) => (
                <Button
                  key={page}
                  variant={
                    page === pagination.current_page ? "primary" : "outline"
                  }
                  size="sm"
                  onClick={() => setFilters({ ...filters, page })}
                >
                  {page}
                </Button>
              ))}

              <Button
                variant="outline"
                size="sm"
                disabled={pagination.current_page === pagination.total_pages}
                onClick={() =>
                  setFilters({ ...filters, page: pagination.current_page + 1 })
                }
              >
                Next
              </Button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}

export default UsersPage;

