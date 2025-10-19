// src/utils/auth.js

export function getDecodedSellerPayload() {
  const raw =
    localStorage.getItem("sellerToken") || sessionStorage.getItem("sellerToken");
  if (!raw) return null;

  try {
    const payload = JSON.parse(atob(raw.split(".")[1]));
    const now = Math.floor(Date.now() / 1000);

    // Süresi dolmuşsa temizle
    if (payload.exp && payload.exp < now) {
      localStorage.removeItem("sellerToken");
      sessionStorage.removeItem("sellerToken");
      return null;
    }

    // ✅ Normalize alan isimleri (backend farklarını kapatır)
    payload.subscriptionActive =
      payload.subscriptionActive ??
      payload.SubscriptionActive ??
      payload.subscriptionactive ??
      false;

    payload.isSystemActive =
      payload.isTheSystemActive ??
      payload.IsTheSystemActive ??
      payload.isthesystemactive ??
      false;

    return payload;
  } catch (err) {
    console.error("Token decode hatası:", err);
    return null;
  }
}

// Basit doğrulama (ekstra kontrol için)
export function isSellerAuthenticated() {
  const payload = getDecodedSellerPayload();
  if (!payload) return false;
  return true;
}
