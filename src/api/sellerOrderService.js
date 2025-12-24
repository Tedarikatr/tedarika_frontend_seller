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

// ✅ Ödeme detayını getir
export const fetchPaymentDetail = (orderId) =>
  apiRequest(`/SellerOrder/payment-detail/${orderId}`, "GET", null, true);

// ✅ Sipariş durumunu güncelle
export const updateOrderStatus = async (orderId, status) => {
  const token = localStorage.getItem("sellerToken");
  const BASE_URL = import.meta.env.VITE_API_URL;
  
  const response = await fetch(`${BASE_URL}/SellerOrder/update-status/${orderId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      "Accept": "*/*"
    },
    body: `"${status}"` // Send as JSON-encoded string: "Created", "Confirmed", etc.
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    console.error("Status update error:", response.status, errorText);
    throw new Error(errorText || "Status güncellenemedi");
  }

  return response.ok;
};

// ✅ Kargo bilgisi güncelle
export const updateCarrierInfo = async (orderId, carrierData) => {
  console.log("Kargo güncelleniyor:", orderId, carrierData);
  return await apiRequest(`/SellerOrder/update-carrier/${orderId}`, "PUT", carrierData, true);
};

// ✅ Siparişi iptal et
export const cancelOrder = (orderId) =>
  apiRequest(`/SellerOrder/cancel/${orderId}`, "PUT", null, true);

// ========== İADE İŞLEMLERİ ==========

/**
 * İade taleplerini listele
 * @returns {Promise<Array>} - İade talepleri listesi
 */
export const fetchRefundRequests = () =>
  apiRequest("/SellerOrder/refund-requests", "GET", null, true);

/**
 * İade talebini onayla veya reddet
 * @param {string} requestId - İade talebi ID
 * @param {Object} decision - Karar bilgisi
 * @param {boolean} decision.approve - Onay durumu (true/false)
 * @param {string} decision.sellerNote - Satıcı notu
 * @returns {Promise<Object>} - Güncellenmiş iade talebi
 */
export const decideRefundRequest = (requestId, decision) =>
  apiRequest(`/SellerOrder/refund-request/${requestId}/decision`, "PUT", decision, true);

/**
 * İade incelemesi yap (ürün geldiğinde)
 * @param {string} requestId - İade talebi ID
 * @param {Object} inspection - İnceleme bilgisi
 * @param {boolean} inspection.acceptReturn - İadeyi kabul et
 * @param {string} inspection.sellerNote - Satıcı notu
 * @returns {Promise<Object>} - Güncellenmiş iade talebi
 */
export const inspectRefundRequest = (requestId, inspection) =>
  apiRequest(`/SellerOrder/refund-request/${requestId}/inspection`, "PUT", inspection, true);
