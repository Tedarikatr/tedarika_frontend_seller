/**
 * Backend mağaza yok durumunda 404 + ErrorResponse (message: "Mağaza bulunamadı...") döner.
 * apiRequest bu mesajı Error olarak fırlatır; bu yardımcı ile "mağaza yok" senaryosunu tespit ederiz.
 */

/**
 * Hatanın "mağaza bulunamadı" (404) yanıtından geldiğini kontrol eder.
 * @param {Error|{ message?: string }} err - Yakalanan hata
 * @returns {boolean}
 */
export function isStoreNotFoundError(err) {
  if (!err) return false;
  const msg = typeof err?.message === "string" ? err.message : "";
  return msg.includes("Mağaza bulunamadı");
}

/** Mağaza oluşturma sayfası yolu (yönlendirme için) */
export const STORE_CREATE_PATH = "/seller/store/create";
