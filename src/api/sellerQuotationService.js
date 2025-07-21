import { apiRequest } from "./apiRequest";

// ✅ Teklif listesini getir
export const getMySellerQuotations = () =>
  apiRequest("/SellerQuotation/my-requests", "GET", null, true);

// ✅ Belirli teklif detayı
export const getSellerQuotationById = (id) =>
  apiRequest(`/SellerQuotation/${id}`, "GET", null, true);

// ✅ Karşı teklif gönder
export const respondToQuotation = (id, data) =>
  apiRequest(`/SellerQuotation/${id}/respond`, "POST", data, true);

// ✅ Teklifin durumunu güncelle
export const updateQuotationStatus = (id, data) =>
  apiRequest(`/SellerQuotation/${id}/status`, "PUT", data, true); // 🔧 düzeltildi
