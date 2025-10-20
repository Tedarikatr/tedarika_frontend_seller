// src/utils/auth.js
export function getDecodedSellerPayload() {
  const raw =
    localStorage.getItem("sellerToken") || sessionStorage.getItem("sellerToken");
  if (!raw) return null;

  try {
    const payload = JSON.parse(atob(raw.split(".")[1]));
    const now = Math.floor(Date.now() / 1000);

    // ⏰ Süresi dolmuşsa temizle
    if (payload.exp && payload.exp < now) {
      localStorage.removeItem("sellerToken");
      sessionStorage.removeItem("sellerToken");
      return null;
    }

    // 🧩 features içeriğini ana objeye merge et
    if (payload.features && typeof payload.features === "object") {
      Object.assign(payload, payload.features);
    }

    // 🔧 Normalize alan isimleri (bütün varyasyonları kapsa)
    payload.subscriptionActive =
      payload.subscriptionActive ??
      payload.SubscriptionActive ??
      payload.subscriptionactive ??
      false;

    payload.isSystemActive =
      payload.isSystemActive ??
      payload.isTheSystemActive ??
      payload.IsTheSystemActive ??
      payload.isthesystemactive ??
      false;

    // 🔁 Uyumluluk için eski isimleri de ata
    payload.isthesystemactive = payload.isSystemActive;
    payload.SubscriptionActive = payload.subscriptionActive;

    // 🔍 Log (görmek için)
    console.log("🧩 Decoded Seller Payload:", payload);

    return payload;
  } catch (err) {
    console.error("Token decode hatası:", err);
    return null;
  }
}
