import { apiRequest } from "./apiRequest";

// Kargo firma ve takip bilgilerini güncelle (manuel kargo bilgisi)
export const updateOrderCarrierInfo = async (orderId, payload) => {
  return await apiRequest(`/SellerOrderCarrier/orders/${orderId}/carrier`, "PUT", payload, true);
};
