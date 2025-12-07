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
