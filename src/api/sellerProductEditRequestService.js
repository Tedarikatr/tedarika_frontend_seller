// src/api/sellerProductEditRequestService.js
// SellerProductEditRequest API - Ürün düzenleme talepleri
import { apiRequest } from "./apiRequest";

const BASE = "/SellerProductEditRequest";

/**
 * Ürün orijinal bilgisini getir (talep oluşturmadan önce)
 * @param {string} productId - Ürün ID'si (Guid)
 */
export const getProductOriginalInfo = (productId) =>
  apiRequest(`${BASE}/products/${productId}/original`, "GET", null, true);

/**
 * Ürün güncelleme talebi oluştur
 * @param {Object} payload - { productId, name?, description?, brandId?, productNumber?, ean?, sku?, categoryId?, categorySubId?, isActive?, requiresManualReview?, gtipCode? }
 */
export const createEditRequest = (payload) =>
  apiRequest(`${BASE}/requests`, "POST", payload, true);

/**
 * Talepleri listele (status: 0=Pending, 1=Approved, 2=Rejected)
 * @param {number|null} status - Opsiyonel filtre
 */
export const getEditRequests = (status = null) => {
  const qs = status != null ? `?status=${status}` : "";
  return apiRequest(`${BASE}/requests${qs}`, "GET", null, true);
};

/**
 * Talep detayı getir
 * @param {string} requestId - Talep ID'si (Guid)
 */
export const getEditRequestDetail = (requestId) =>
  apiRequest(`${BASE}/requests/${requestId}`, "GET", null, true);
