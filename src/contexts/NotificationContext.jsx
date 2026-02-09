import { createContext, useContext, useState, useEffect, useCallback } from "react";

const NotificationContext = createContext(null);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within NotificationProvider");
  }
  return context;
};

const STORAGE_KEY = "seller_notifications";

// Bildirim tipleri
export const NOTIFICATION_TYPES = {
  WARNING: "warning",
  ERROR: "error",
  INFO: "info",
  SUCCESS: "success",
};

// Bildirim kaynakları (ileride filtreleme için)
export const NOTIFICATION_SOURCES = {
  GENERAL: "general",
  PRODUCT_UPLOAD: "product_upload",
  PAYMENT_INFO: "payment_info",
  // İleride: ORDER, QUOTATION, REFUND, vb.
};

// Ödeme bilgisi eksik bildirimi sabit id (eklenince kaldırılıp doğrulama bildirimi gönderilir)
export const PAYMENT_INFO_MISSING_ID = "payment-info-missing";

// Varsayılan bildirimler
const getDefaultNotifications = () => [
  {
    id: "extra-info-missing",
    type: NOTIFICATION_TYPES.WARNING,
    title: "Ekstra Bilgiler Eksik",
    message: "KEP adresi, yetkili kişi ve yetkili telefon bilgilerini eklemeniz gerekir.",
    actionLabel: "Bilgileri Ekle",
    actionUrl: "/seller/profile/extra-info",
    read: false,
    createdAt: new Date().toISOString(),
    source: NOTIFICATION_SOURCES.GENERAL,
    metadata: {},
  },
  {
    id: "required-documents-missing",
    type: NOTIFICATION_TYPES.ERROR,
    title: "Zorunlu Belgeler Eksik",
    message: "Eksikler: Vergi Levhası, Ticaret Sicil Kaydı, Kuruluş Sicil Gazetesi",
    actionLabel: "Belge Yükle",
    actionUrl: "/seller/profile",
    read: false,
    createdAt: new Date().toISOString(),
    source: NOTIFICATION_SOURCES.GENERAL,
    metadata: {},
  },
];

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // localStorage'dan bildirimleri yükle
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setNotifications(parsed);
      } else {
        // İlk yüklemede varsayılan bildirimleri ekle
        setNotifications(getDefaultNotifications());
        localStorage.setItem(STORAGE_KEY, JSON.stringify(getDefaultNotifications()));
      }
    } catch (error) {
      console.error("Bildirimler yüklenirken hata:", error);
      setNotifications(getDefaultNotifications());
    } finally {
      setIsLoading(false);
    }
  }, []);

  // localStorage'a kaydet
  const saveToStorage = useCallback((newNotifications) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newNotifications));
    } catch (error) {
      console.error("Bildirimler kaydedilirken hata:", error);
    }
  }, []);

  // Bildirim ekle (source, metadata ile genişletilebilir)
  const addNotification = useCallback(
    (notification) => {
      const newNotification = {
        id: notification.id || `notif-${Date.now()}-${Math.random()}`,
        type: notification.type || NOTIFICATION_TYPES.INFO,
        title: notification.title,
        message: notification.message,
        actionLabel: notification.actionLabel,
        actionUrl: notification.actionUrl,
        read: false,
        createdAt: notification.createdAt || new Date().toISOString(),
        source: notification.source || NOTIFICATION_SOURCES.GENERAL,
        metadata: notification.metadata || {},
      };

      setNotifications((prev) => {
        const updated = [newNotification, ...prev];
        saveToStorage(updated);
        return updated;
      });

      return newNotification.id;
    },
    [saveToStorage]
  );

  // Bildirimi okundu olarak işaretle
  const markAsRead = useCallback(
    (id) => {
      setNotifications((prev) => {
        const updated = prev.map((notif) =>
          notif.id === id ? { ...notif, read: true } : notif
        );
        saveToStorage(updated);
        return updated;
      });
    },
    [saveToStorage]
  );

  // Tüm bildirimleri okundu olarak işaretle
  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => {
      const updated = prev.map((notif) => ({ ...notif, read: true }));
      saveToStorage(updated);
      return updated;
    });
  }, [saveToStorage]);

  // Bildirimi sil
  const removeNotification = useCallback(
    (id) => {
      setNotifications((prev) => {
        const updated = prev.filter((notif) => notif.id !== id);
        saveToStorage(updated);
        return updated;
      });
    },
    [saveToStorage]
  );

  // Tüm bildirimleri temizle
  const clearAll = useCallback(() => {
    setNotifications([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // Ödeme bilgisi eksikse merkeze tek bir "eksik ödeme bilgisi" bildirimi ekler (zaten varsa eklemez)
  const ensurePaymentInfoMissingNotification = useCallback(() => {
    setNotifications((prev) => {
      if (prev.some((n) => n.id === PAYMENT_INFO_MISSING_ID)) return prev;
      const newNotif = {
        id: PAYMENT_INFO_MISSING_ID,
        type: NOTIFICATION_TYPES.WARNING,
        title: "Ödeme Bilgileri Eksik",
        message: "Ödemelerin alınabilmesi için Ayarlar > Ödeme sekmesinden banka adı, IBAN ve hesap sahibi bilgilerinizi eklemeniz gerekir.",
        actionLabel: "Ödeme Bilgilerini Ekle",
        actionUrl: "/seller/profile#finance",
        read: false,
        createdAt: new Date().toISOString(),
        source: NOTIFICATION_SOURCES.PAYMENT_INFO,
        metadata: {},
      };
      const updated = [newNotif, ...prev];
      saveToStorage(updated);
      return updated;
    });
  }, [saveToStorage]);

  // Ödeme bilgisi eklendikten / doğrulandıktan sonra: eksik bildirimini kaldırır ve "doğrulandı, hatırlatmalar kesildi" bildirimi ekler
  const clearPaymentInfoMissingAndNotifyVerified = useCallback(() => {
    setNotifications((prev) => {
      let updated = prev.filter((n) => n.id !== PAYMENT_INFO_MISSING_ID);
      const verifiedNotif = {
        id: `payment-info-verified-${Date.now()}`,
        type: NOTIFICATION_TYPES.SUCCESS,
        title: "Ödeme Bilgileri Kaydedildi",
        message: "Ödeme bilgileriniz kaydedildi ve doğrulandı. Bu konudaki hatırlatma bildirimleri artık gönderilmeyecek.",
        actionLabel: "Profil",
        actionUrl: "/seller/profile#finance",
        read: false,
        createdAt: new Date().toISOString(),
        source: NOTIFICATION_SOURCES.PAYMENT_INFO,
        metadata: { verified: true },
      };
      updated = [verifiedNotif, ...updated];
      saveToStorage(updated);
      return updated;
    });
  }, [saveToStorage]);

  // Okunmamış bildirim sayısı
  const unreadCount = notifications.filter((n) => !n.read).length;

  const value = {
    notifications,
    isLoading,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    ensurePaymentInfoMissingNotification,
    clearPaymentInfoMissingAndNotifyVerified,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
