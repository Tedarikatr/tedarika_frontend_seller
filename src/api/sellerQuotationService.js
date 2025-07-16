import { apiRequest } from "./apiRequest";

// ✅ Satıcının tüm tekliflerini getir
export const getMySellerQuotations = () =>
  apiRequest("/SellerQuotation/my-requests", "GET", null, true);

// ✅ Belirli bir teklifin detayını getir
export const getSellerQuotationById = (id) =>
  apiRequest(`/SellerQuotation/${id}`, "GET", null, true);

// ✅ Teklife cevap ver (karşı teklif vs.)
export const respondToQuotation = (id, data) =>
  apiRequest(`/SellerQuotation/${id}/respond`, "POST", data, true);

// ✅ Teklifin durumunu güncelle (örnek: kabul, red)
export const updateQuotationStatus = (id, status) =>
  apiRequest(`/SellerQuotation/${id}/status`, "PUT", { status }, true);
