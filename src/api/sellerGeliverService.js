import { apiRequest } from "./apiRequest";

export const createGeliverIntegrationRequest = async () => {
  return await apiRequest("/SellerGeliver/integration-request", "POST", null, true);
};

export const getGeliverIntegrationDetails = async () => {
  return await apiRequest("/SellerGeliver/integration-details", "GET", null, true);
};

export const autoRegisterGeliver = async () => {
  return await apiRequest("/SellerGeliver/auto-register", "POST", null, true);
};

export const saveGeliverIntegrationDetails = async (payload) => {
  return await apiRequest("/SellerGeliver/integration-details", "POST", payload, true);
};

export const uploadGeliverAgreement = async (formData) => {
  return await apiRequest("/SellerGeliver/agreements", "POST", formData, true);
};

export const getGeliverOrderTracking = async (orderId) => {
  return await apiRequest(`/SellerGeliver/orders/${orderId}/tracking`, "GET", null, true);
};

export const createGeliverOrderLabel = async (orderId, payload) => {
  return await apiRequest(`/SellerGeliver/orders/${orderId}/geliver-label`, "POST", payload, true);
};

export const uploadGeliverOrderLabel = async (orderId, formData) => {
  return await apiRequest(`/SellerGeliver/orders/${orderId}/label`, "POST", formData, true);
};

export const downloadGeliverOrderLabel = async (orderId) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/SellerGeliver/orders/${orderId}/label`,
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

export const updateGeliverTracking = async (payload) => {
  return await apiRequest("/SellerGeliver/tracking", "POST", payload, true);
};
