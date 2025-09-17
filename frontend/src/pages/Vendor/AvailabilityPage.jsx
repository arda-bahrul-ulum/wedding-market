import { useState } from "react";
import {
  Calendar,
  Plus,
  Edit,
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { formatDate } from "../../utils/format";
import Card, { CardBody, CardHeader } from "../../components/UI/Card";
import Button from "../../components/UI/Button";
import Input from "../../components/UI/Input";

function AvailabilityPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isAddingAvailability, setIsAddingAvailability] = useState(false);

  // Mock data - replace with actual API call
  const availabilities = [
    {
      id: 1,
      date: "2024-12-25",
      start_time: "09:00",
      end_time: "17:00",
      is_available: true,
      max_bookings: 2,
      current_bookings: 1,
    },
    {
      id: 2,
      date: "2024-12-26",
      start_time: "10:00",
      end_time: "18:00",
      is_available: true,
      max_bookings: 1,
      current_bookings: 0,
    },
    {
      id: 3,
      date: "2024-12-27",
      start_time: "09:00",
      end_time: "17:00",
      is_available: false,
      max_bookings: 0,
      current_bookings: 0,
    },
  ];

  const handleToggleAvailability = (availabilityId, currentStatus) => {
    // Implement toggle availability logic
    console.log("Toggle availability:", availabilityId, currentStatus);
  };

  const handleDelete = (availabilityId) => {
    if (confirm("Apakah Anda yakin ingin menghapus ketersediaan ini?")) {
      // Implement delete logic
      console.log("Delete availability:", availabilityId);
    }
  };

  const handleAddAvailability = () => {
    setIsAddingAvailability(true);
    // Implement add availability logic
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Ketersediaan
              </h1>
              <p className="text-gray-600">
                Kelola jadwal dan ketersediaan Anda
              </p>
            </div>
            <Button onClick={handleAddAvailability}>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Ketersediaan
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-gray-900">
                  Kalender Ketersediaan
                </h2>
              </CardHeader>
              <CardBody>
                <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
                  <div className="text-center">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">
                      Kalender akan ditampilkan di sini
                    </p>
                    <p className="text-sm text-gray-500">
                      Integrasi dengan calendar component
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            {/* Add Availability Form */}
            {isAddingAvailability && (
              <Card>
                <CardHeader>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Tambah Ketersediaan
                  </h2>
                </CardHeader>
                <CardBody className="space-y-4">
                  <Input
                    label="Tanggal"
                    type="date"
                    value={selectedDate.toISOString().split("T")[0]}
                    onChange={(e) => setSelectedDate(new Date(e.target.value))}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Waktu Mulai" type="time" />
                    <Input label="Waktu Selesai" type="time" />
                  </div>
                  <Input
                    label="Maksimal Booking"
                    type="number"
                    min="1"
                    defaultValue="1"
                  />
                  <div className="flex space-x-2">
                    <Button size="sm" className="flex-1">
                      Simpan
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsAddingAvailability(false)}
                    >
                      Batal
                    </Button>
                  </div>
                </CardBody>
              </Card>
            )}

            {/* Availability List */}
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-gray-900">
                  Daftar Ketersediaan
                </h2>
              </CardHeader>
              <CardBody className="p-0">
                {availabilities.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Belum ada ketersediaan</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {availabilities.map((availability) => (
                      <div
                        key={availability.id}
                        className="p-4 hover:bg-gray-50"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            {availability.is_available ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-500" />
                            )}
                            <span className="font-medium text-gray-900">
                              {formatDate(availability.date)}
                            </span>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() =>
                                handleToggleAvailability(
                                  availability.id,
                                  availability.is_available
                                )
                              }
                              className={`p-1 rounded ${
                                availability.is_available
                                  ? "text-green-600 hover:bg-green-100"
                                  : "text-red-600 hover:bg-red-100"
                              }`}
                            >
                              {availability.is_available ? (
                                <CheckCircle className="w-4 h-4" />
                              ) : (
                                <XCircle className="w-4 h-4" />
                              )}
                            </button>
                            <button className="p-1 text-gray-400 hover:text-gray-600">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(availability.id)}
                              className="p-1 text-red-400 hover:text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <div className="flex items-center space-x-4">
                            <span className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {availability.start_time} -{" "}
                              {availability.end_time}
                            </span>
                            <span>
                              {availability.current_bookings}/
                              {availability.max_bookings} booking
                            </span>
                          </div>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              availability.is_available
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {availability.is_available
                              ? "Tersedia"
                              : "Tidak Tersedia"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardBody>
            </Card>

            {/* Stats */}
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-gray-900">
                  Statistik
                </h2>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Hari</span>
                  <span className="font-semibold">{availabilities.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tersedia</span>
                  <span className="font-semibold text-green-600">
                    {availabilities.filter((a) => a.is_available).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tidak Tersedia</span>
                  <span className="font-semibold text-red-600">
                    {availabilities.filter((a) => !a.is_available).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Booking</span>
                  <span className="font-semibold">
                    {availabilities.reduce(
                      (sum, a) => sum + a.current_bookings,
                      0
                    )}
                  </span>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AvailabilityPage;

