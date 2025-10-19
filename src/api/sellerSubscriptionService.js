import { apiRequest } from "./apiRequest";

// 1️⃣ Abonelik oluşturma
export const createSubscription = (packageId, period = "Yearly") =>
  apiRequest(
    `/SellerSubscription/create?packageId=${packageId}&period=${period}`,
    "POST",
    null,
    true
  );

// 2️⃣ Ödeme sayfası (iyzico)
export const checkoutSubscription = (subscriptionId) =>
  apiRequest(
    `/SellerSubscription/checkout?subscriptionId=${subscriptionId}`,
    "POST",
    null,
    true
  );

// 3️⃣ Aktif abonelik kontrolü
export const getCurrentSubscription = () =>
  apiRequest("/SellerSubscription/current", "GET", null, true);

// 4️⃣ Tüm geçmiş abonelikler
export const getMySubscriptions = () =>
  apiRequest("/SellerSubscription/my-subscriptions", "GET", null, true);

// 5️⃣ 📦 Abonelik paketleri (dinamik plans)
export const getSubscriptionPackages = () =>
  apiRequest("/SellerSubscription/packages", "GET", null, true);
