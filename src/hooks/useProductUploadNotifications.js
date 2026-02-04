/**
 * Ürün yükleme bildirimleri için merkezi hook
 * Tüm hata, başarı ve bilgi bildirimleri hem toast (anlık) hem bildirim merkezine (kalıcı) gönderilir.
 * İleride yeni bildirim tipleri eklenebilir.
 */
import { useCallback } from "react";
import { useToast } from "@/contexts/ToastContext";
import { useNotification, NOTIFICATION_TYPES, NOTIFICATION_SOURCES } from "@/contexts/NotificationContext";

const UPLOAD_TYPE_LABELS = {
  excel: "Excel",
  json: "JSON",
  xml: "XML Dosya",
  "xml-url": "XML URL",
  manual: "Manuel",
};

export function useProductUploadNotifications() {
  const toast = useToast();
  const { addNotification } = useNotification();

  /**
   * Başarılı yükleme - bildirim merkezi + toast
   */
  const notifySuccess = useCallback(
    ({ message, productCount, draftId, uploadType }) => {
      const typeLabel = UPLOAD_TYPE_LABELS[uploadType] || "Ürün";
      const title = `${typeLabel} Yüklemesi Tamamlandı`;
      const displayMessage = message || `${productCount ?? 0} ürün başarıyla yüklendi.`;

      addNotification({
        type: NOTIFICATION_TYPES.SUCCESS,
        title,
        message: `${displayMessage} Ürünleriniz onaya gönderildi.`,
        actionLabel: "Taslakları Görüntüle",
        actionUrl: "/seller/products/drafts",
        source: NOTIFICATION_SOURCES.PRODUCT_UPLOAD,
        metadata: { productCount, draftId, uploadType },
      });

      toast.success(displayMessage, 5000);
      toast.info("Ürünleriniz onaya gönderildi. İnceleme sonrası onaylandıktan sonra otomatik olarak mağazanıza aktarılacaktır.", 6000);
    },
    [addNotification, toast]
  );

  /**
   * Yükleme hatası (API/sunucu) - bildirim merkezi + toast
   */
  const notifyError = useCallback(
    ({ message, uploadType, errorDetail }) => {
      const typeLabel = UPLOAD_TYPE_LABELS[uploadType] || "Ürün";
      const title = `${typeLabel} Yüklemesi Başarısız`;

      addNotification({
        type: NOTIFICATION_TYPES.ERROR,
        title,
        message: message || "Yükleme sırasında bir hata oluştu.",
        actionLabel: "Tekrar Dene",
        actionUrl: "/seller/products/draft/upload",
        source: NOTIFICATION_SOURCES.PRODUCT_UPLOAD,
        metadata: { uploadType, errorDetail },
      });

      toast.error(message || "Yükleme başarısız.", 6000);
    },
    [addNotification, toast]
  );

  /**
   * Validasyon hatası (client-side) - bildirim merkezi + toast
   */
  const notifyValidationError = useCallback(
    ({ message, uploadType, field }) => {
      const typeLabel = UPLOAD_TYPE_LABELS[uploadType] || "Ürün";
      const title = `${typeLabel} - Geçersiz Giriş`;

      addNotification({
        type: NOTIFICATION_TYPES.ERROR,
        title,
        message: message || "Lütfen gerekli alanları kontrol edin.",
        actionLabel: "Düzelt",
        actionUrl: "/seller/products/draft/upload",
        source: NOTIFICATION_SOURCES.PRODUCT_UPLOAD,
        metadata: { uploadType, field },
      });

      toast.error(message || "Geçersiz giriş.", 5000);
    },
    [addNotification, toast]
  );

  /**
   * Bilgi mesajı (örn. arka plan yükleme uyarısı) - toast + opsiyonel bildirim merkezi
   */
  const notifyInfo = useCallback(
    ({ message, addToCenter = false }) => {
      if (addToCenter) {
        addNotification({
          type: NOTIFICATION_TYPES.INFO,
          title: "Ürün Yükleme",
          message: message || "İşlem devam ediyor.",
          source: NOTIFICATION_SOURCES.PRODUCT_UPLOAD,
          metadata: {},
        });
      }
      toast.info(message || "Bilgi", 8000);
    },
    [addNotification, toast]
  );

  /**
   * Manuel yükleme sonucu (kısmi başarı/başarısızlık)
   */
  const notifyManualResult = useCallback(
    ({ successCount, errorCount, message }) => {
      const title = successCount > 0 ? "Manuel Yükleme Tamamlandı" : "Manuel Yükleme Başarısız";

      addNotification({
        type: successCount > 0 ? NOTIFICATION_TYPES.SUCCESS : NOTIFICATION_TYPES.ERROR,
        title,
        message: message || (successCount > 0
          ? `${successCount} ürün yüklendi.${errorCount > 0 ? ` ${errorCount} ürün yüklenemedi.` : ""}`
          : "Hiçbir ürün yüklenemedi."),
        actionLabel: successCount > 0 ? "Taslakları Görüntüle" : "Tekrar Dene",
        actionUrl: successCount > 0 ? "/seller/products/drafts" : "/seller/products/draft/upload",
        source: NOTIFICATION_SOURCES.PRODUCT_UPLOAD,
        metadata: { successCount, errorCount, uploadType: "manual" },
      });

      if (successCount > 0) {
        toast.success(message || `${successCount} ürün başarıyla yüklendi!${errorCount > 0 ? ` ${errorCount} ürün yüklenemedi.` : ""}`, 5000);
        toast.info("Ürünleriniz onaya gönderildi.", 6000);
      } else {
        toast.error(message || "Hiçbir ürün yüklenemedi.", 6000);
      }
    },
    [addNotification, toast]
  );

  /**
   * Tek ürün yükleme hatası (manuel toplu yüklemede)
   */
  const notifySingleProductError = useCallback(
    ({ productName, message }) => {
      toast.error(`Ürün "${productName}" yüklenemedi: ${message || "Bilinmeyen hata"}`, 5000);
      // Tek tek ürün hatalarını merkeze ekleme (çok fazla bildirim olur), sadece toast
    },
    [toast]
  );

  return {
    notifySuccess,
    notifyError,
    notifyValidationError,
    notifyInfo,
    notifyManualResult,
    notifySingleProductError,
  };
}
