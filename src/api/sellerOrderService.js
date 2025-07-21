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

// Sipariş durumunu güncelle (sadece integer gönderiliyor)
export const updateOrderStatus = (orderId, newStatus) =>
  apiRequest(`/SellerOrder/update-status/${orderId}`, "PUT", newStatus, true);

// Siparişi iptal et
export const cancelOrder = (orderId) =>
  apiRequest(`/SellerOrder/cancel/${orderId}`, "PUT", null, true);
