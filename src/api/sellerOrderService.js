import { apiRequest } from "./apiRequest";

// 1. Mağazaya ait siparişlerin listesi
export const fetchStoreOrders = () =>
  apiRequest("/SellerOrder/store-orders", "GET", null, true);

// 2. Sayfalı sipariş listesi
export const fetchPagedOrders = (page = 1, size = 10) =>
  apiRequest(`/SellerOrder/paged?page=${page}&size=${size}`, "GET", null, true);

// 3. Sipariş detayı
export const fetchOrderDetail = (orderId) =>
  apiRequest(`/SellerOrder/detail/${orderId}`, "GET", null, true);

// 4. Sipariş durumu güncelle
export const updateOrderStatus = (orderId, newStatus) =>
  apiRequest(`/SellerOrder/update-status/${orderId}`, "PUT", { status: newStatus }, true);

// 5. Sipariş iptali
export const cancelOrder = (orderId) =>
  apiRequest(`/SellerOrder/cancel/${orderId}`, "PUT", null, true);
