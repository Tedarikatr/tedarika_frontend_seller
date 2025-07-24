import { apiRequest } from "./apiRequest";

// 1. Abonelik oluşturma (query string üzerinden packageId ve period)
export const createSubscription = (packageId, period = "Monthly") =>
  apiRequest(`/SellerSubscription/create?packageId=${packageId}&period=${period}`, "POST", null, true);

// 2. Ödeme sayfası (iyzico checkout linki alma)
export const checkoutSubscription = (subscriptionId) =>
  apiRequest(`/SellerSubscription/checkout?subscriptionId=${subscriptionId}`, "POST", null, true);

// 3. Mevcut aboneliği kontrol etme (isActive vs)
export const getCurrentSubscription = () =>
  apiRequest("/SellerSubscription/current", "GET", null, true);


export const getMySubscriptions = () =>
  apiRequest("/SellerSubscription/my-subscriptions", "GET", null, true);