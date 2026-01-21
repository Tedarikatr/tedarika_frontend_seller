import { apiRequest } from "./apiRequest";

// Kargo takip bilgilerini getir
export const getOrderCarrierTracking = async (orderId) => {
  return await apiRequest(`/SellerOrderCarrier/orders/${orderId}/tracking`, "GET", null, true);
};

// Kargo etiketini indir (PDF/blob)
export const downloadOrderCarrierLabel = async (orderId) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/SellerOrderCarrier/orders/${orderId}/label`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("sellerToken")}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Kargo etiketi indirilemedi.");
  }

  return await response.blob();
};

// Manuel kargo etiketi yükle
export const uploadOrderCarrierLabel = async (orderId, formData) => {
  return await apiRequest(`/SellerOrderCarrier/orders/${orderId}/label`, "POST", formData, true);
};

// Kargo firma ve takip bilgilerini güncelle
export const updateOrderCarrierInfo = async (orderId, payload) => {
  return await apiRequest(`/SellerOrderCarrier/orders/${orderId}/carrier`, "PUT", payload, true);
};

// Kargo etiket bilgilerini getir (opsiyonel kullanım)
export const getOrderShippingLabel = async (orderId) => {
  return await apiRequest(`/SellerOrderCarrier/orders/${orderId}/shipping-label`, "GET", null, true);
};
