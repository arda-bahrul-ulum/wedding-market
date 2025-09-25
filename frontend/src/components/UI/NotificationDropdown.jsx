import { useState, useEffect } from "react";
import {
  Bell,
  Check,
  X,
  Clock,
  Star,
  Package,
  MessageCircle,
} from "lucide-react";
import Button from "./Button";

function NotificationDropdown({ isOpen, onClose }) {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "order",
      title: "Pesanan Baru",
      message: "Anda mendapat pesanan baru dari Sarah & John",
      time: "5 menit yang lalu",
      isRead: false,
      icon: Package,
    },
    {
      id: 2,
      type: "review",
      title: "Review Baru",
      message: "Sarah memberikan review 5 bintang untuk jasa Anda",
      time: "1 jam yang lalu",
      isRead: false,
      icon: Star,
    },
    {
      id: 3,
      type: "message",
      title: "Pesan Baru",
      message: "John mengirim pesan tentang detail pesanan",
      time: "2 jam yang lalu",
      isRead: true,
      icon: MessageCircle,
    },
    {
      id: 4,
      type: "system",
      title: "Pembayaran Diterima",
      message: "Pembayaran untuk pesanan #WD001 telah diterima",
      time: "3 jam yang lalu",
      isRead: true,
      icon: Check,
    },
  ]);

  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const unread = notifications.filter((notif) => !notif.isRead).length;
    setUnreadCount(unread);
  }, [notifications]);

  const handleMarkAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, isRead: true }))
    );
  };

  const handleDelete = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "order":
        return Package;
      case "review":
        return Star;
      case "message":
        return MessageCircle;
      case "system":
        return Check;
      default:
        return Bell;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case "order":
        return "text-blue-600 bg-blue-100";
      case "review":
        return "text-yellow-600 bg-yellow-100";
      case "message":
        return "text-green-600 bg-green-100";
      case "system":
        return "text-purple-600 bg-purple-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Notifikasi</h3>
          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
                Tandai Semua Dibaca
              </Button>
            )}
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-6 text-center">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Tidak ada notifikasi</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map((notification) => {
              const IconComponent = getNotificationIcon(notification.type);
              return (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 transition-colors ${
                    !notification.isRead ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${getNotificationColor(
                        notification.type
                      )}`}
                    >
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900">
                            {notification.title}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-1 flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {notification.time}
                          </p>
                        </div>
                        <div className="flex items-center space-x-1 ml-2">
                          {!notification.isRead && (
                            <button
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="p-1 text-gray-400 hover:text-blue-600"
                              title="Tandai sebagai dibaca"
                            >
                              <Check className="w-3 h-3" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(notification.id)}
                            className="p-1 text-gray-400 hover:text-red-600"
                            title="Hapus notifikasi"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="p-4 border-t border-gray-200">
          <Button variant="outline" className="w-full">
            Lihat Semua Notifikasi
          </Button>
        </div>
      )}
    </div>
  );
}

export default NotificationDropdown;
