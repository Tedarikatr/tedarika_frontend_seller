/**
 * Güvenli çıkış hook'u.
 * Çıkış sırasında tüm kullanıcıya ait verileri bellek ve depolamadan temizler.
 * Bu, kullanıcı değişiminde veri sızıntısını önlemek için kritiktir.
 */
import { useCallback } from "react";
import { useProductCache } from "@/contexts/ProductCacheContext";
import { useNotification } from "@/contexts/NotificationContext";

export function useLogout() {
  const { clearCache } = useProductCache();
  const { clearAll: clearNotifications } = useNotification();

  const performLogout = useCallback(() => {
    // 1. Bellekteki ürün cache'ini temizle (ProductCacheContext)
    //    - Önceki kullanıcının ürünleri yeni kullanıcıya gösterilmesin
    clearCache();

    // 2. Bildirim state'ini temizle (NotificationContext)
    clearNotifications();

    // 3. localStorage ve sessionStorage temizle
    localStorage.clear();
    sessionStorage.clear();

    // 4. Tam sayfa yenileme ile tüm React state'ini sıfırla
    //    - Ek güvenlik: Bellekte kalan tüm verilerin temizlenmesini garanti eder
    window.location.replace("/seller/login");
  }, [clearCache, clearNotifications]);

  return performLogout;
}
