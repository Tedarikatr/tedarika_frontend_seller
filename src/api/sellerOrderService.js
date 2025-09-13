import { apiRequest } from "./apiRequest";

// Mağazaya ait siparişleri getir
export const fetchStoreOrders = () =>
  apiRequest("/SellerOrder/store-orders", "GET", null, true);

// Sayfalı sipariş listesi
export const fetchPagedOrders = (page = 1, size = 10) =>
  apiRequest(`/SellerOrder/paged?page=${page}&size=${size}`, "GET", null, true);

// Sipariş detayını getir
export const fetchOrderDetail = (orderId) =>
  apiRequest(`/SellerOrder/detail/${orderId}`, "GET", null, true);

// (KALDIRILDI: durum güncelle/iptal kullanılmıyor)
// export const updateOrderStatus = ...
// export const cancelOrder = ...

// ✅ Ödeme detayını getir
export const fetchPaymentDetail = (orderId) =>
  apiRequest(`/SellerOrder/payment-detail/${orderId}`, "GET", null, true);
