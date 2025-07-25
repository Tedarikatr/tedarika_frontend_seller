import { apiRequest } from "./apiRequest";

// ✅ Tüm gelen teklifleri çek
export const getMySellerQuotations = () =>
  apiRequest("/SellerQuotation/my-requests", "GET", null, true);

// ✅ Tek teklif detayını getir
export const getSellerQuotationById = (id) =>
  apiRequest(`/SellerQuotation/${id}`, "GET", null, true);

// ✅ Alıcı teklifine yanıt ver (karşı teklif)
export const respondToQuotation = (id, data) =>
  apiRequest(`/SellerQuotation/${id}/respond`, "POST", data, true);

// ✅ Teklifin durumunu güncelle (1: Kabul, 2: Reddet)
// sellerQuotationService.js
export const updateQuotationStatus = (id, status) => {
  return apiRequest(`/SellerQuotation/${id}/status?status=${status}`, "PUT", null, true);
};


