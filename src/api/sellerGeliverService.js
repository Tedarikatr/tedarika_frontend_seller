import { apiRequest } from "./apiRequest";

export const createGeliverIntegrationRequest = async () => {
  // Manuel entegrasyon talebi (yeni isim)
  return await apiRequest("/SellerGeliver/manuel-register", "POST", null, true);
};

export const getGeliverIntegrationDetails = async () => {
  // Entegrasyon durumu (yeni isim)
  return await apiRequest("/SellerGeliver/integration-status", "GET", null, true);
};

export const autoRegisterGeliver = async () => {
  return await apiRequest("/SellerGeliver/auto-register", "POST", null, true);
};

export const matchExistingGeliverAccount = async (payload) => {
  return await apiRequest("/SellerGeliver/match-existing-account", "POST", payload, true);
};

export const saveGeliverIntegrationDetails = async (payload) => {
  // Manuel kayıt detayları (yeni isim)
  return await apiRequest("/SellerGeliver/manuel-register/details", "POST", payload, true);
};

export const uploadGeliverAgreement = async (formData) => {
  return await apiRequest("/SellerGeliver/agreements", "POST", formData, true);
};
