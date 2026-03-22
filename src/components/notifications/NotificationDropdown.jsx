import { useState, useRef, useEffect } from "react";
import { Bell, X, CheckCheck, AlertTriangle, Info, AlertCircle, CheckCircle2, ExternalLink } from "lucide-react";
import { useNotification, NOTIFICATION_TYPES } from "@/contexts/NotificationContext";
import { useNavigate } from "react-router-dom";

export default function NotificationDropdown() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
  } = useNotification();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Dışarı tıklanınca kapat
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case NOTIFICATION_TYPES.WARNING:
        return <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />;
      case NOTIFICATION_TYPES.ERROR:
        return <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />;
      case NOTIFICATION_TYPES.SUCCESS:
        return <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />;
      default:
        return <Info className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />;
    }
  };

  const getNotificationBgColor = (type) => {
    switch (type) {
      case NOTIFICATION_TYPES.WARNING:
        return "bg-amber-50 border-amber-200";
      case NOTIFICATION_TYPES.ERROR:
        return "bg-red-50 border-red-200";
      case NOTIFICATION_TYPES.SUCCESS:
        return "bg-green-50 border-green-200";
      default:
        return "bg-blue-50 border-blue-200";
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
      setIsOpen(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return "Az önce";
      if (diffMins < 60) return `${diffMins} dakika önce`;
      if (diffHours < 24) return `${diffHours} saat önce`;
      if (diffDays < 7) return `${diffDays} gün önce`;
      return date.toLocaleDateString("tr-TR", { day: "numeric", month: "short" });
    } catch {
      return "";
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bildirim İkonu */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative min-h-[44px] min-w-[44px] inline-flex items-center justify-center p-1.5 sm:p-2 rounded-lg sm:rounded-xl text-white/90 hover:text-white hover:bg-white/15 transition-all duration-300 hover:scale-110 flex-shrink-0 touch-manipulation"
        aria-label="Bildirimler"
      >
        <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-r from-red-500 to-red-600 text-white text-[10px] sm:text-xs font-extrabold rounded-full flex items-center justify-center shadow-lg border-2 border-[#003131] animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menü */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-[min(calc(100vw-1rem),24rem)] sm:w-80 md:w-96 max-w-[calc(100vw-1rem)] bg-white rounded-xl sm:rounded-2xl shadow-2xl border-2 border-gray-200 overflow-hidden z-50 animate-slide-down">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-4 sm:px-5 py-3 sm:py-4 flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-white flex-shrink-0" />
              <h3 className="text-white font-bold text-sm sm:text-base md:text-lg truncate">Bildirimler</h3>
              {unreadCount > 0 && (
                <span className="px-1.5 sm:px-2 py-0.5 bg-white/20 rounded-full text-white text-[10px] sm:text-xs font-bold flex-shrink-0">
                  {unreadCount} yeni
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="p-1 sm:p-1.5 rounded-lg hover:bg-white/20 transition-colors"
                  title="Tümünü okundu işaretle"
                >
                  <CheckCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 sm:p-1.5 rounded-lg hover:bg-white/20 transition-colors"
              >
                <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
              </button>
            </div>
          </div>

          {/* Bildirim Listesi */}
          <div className="max-h-80 sm:max-h-96 overflow-y-auto custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="p-6 sm:p-8 text-center">
                <Bell className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-2 sm:mb-3" />
                <p className="text-gray-500 font-medium text-sm sm:text-base">Henüz bildirim yok</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`group p-3 sm:p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                      !notification.read ? "bg-blue-50/50" : ""
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start gap-2 sm:gap-3">
                      {/* İkon */}
                      <div
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 border-2 ${getNotificationBgColor(
                          notification.type
                        )}`}
                      >
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* İçerik */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4
                            className={`font-bold text-xs sm:text-sm ${
                              !notification.read ? "text-gray-900" : "text-gray-700"
                            }`}
                          >
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                          )}
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 mb-1.5 sm:mb-2 line-clamp-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] sm:text-xs text-gray-400">
                            {formatDate(notification.createdAt)}
                          </span>
                          {notification.actionLabel && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleNotificationClick(notification);
                              }}
                              className="text-[10px] sm:text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-0.5 sm:gap-1 whitespace-nowrap"
                            >
                              {notification.actionLabel}
                              <ExternalLink className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Kapat Butonu */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeNotification(notification.id);
                        }}
                        className="p-0.5 sm:p-1 rounded-lg hover:bg-gray-200 transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100"
                      >
                        <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 border-t border-gray-200">
              <button
                onClick={() => {
                  setIsOpen(false);
                }}
                className="w-full text-center text-xs sm:text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                Tümünü Görüntüle
              </button>
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-down {
          animation: slide-down 0.2s ease-out;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </div>
  );
}
