import { apiRequest } from "./apiRequest";

// 1️⃣ Abonelik oluşturma (POST + query parametreleri)
export const createSubscription = (packageId, period = "Yearly") =>
  apiRequest(
    `/SellerSubscription/create?packageId=${packageId}&period=${period}`,
    "POST",
    null,
    true
  );

// 2️⃣ Ödeme sayfası (iyzico checkout linki alma)
export const checkoutSubscription = (subscriptionId) =>
  apiRequest(
    `/SellerSubscription/checkout?subscriptionId=${subscriptionId}`,
    "POST",
    null,
    true
  );

// 3️⃣ Mevcut aktif abonelik kontrolü
export const getCurrentSubscription = () =>
  apiRequest("/SellerSubscription/current", "GET", null, true);

// 4️⃣ Kullanıcının tüm geçmiş aboneliklerini getir
export const getMySubscriptions = () =>
  apiRequest("/SellerSubscription/my-subscriptions", "GET", null, true);
