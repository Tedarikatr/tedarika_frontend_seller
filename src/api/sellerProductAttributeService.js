import { apiRequest } from "./apiRequest";

/**
 * Ürün özelliklerini getir
 * @param {string} productId - Ürün ID'si
 * @returns {Promise<Array>} Özellik setleri array'i
 */
export const getProductAttributes = (productId) => {
  return apiRequest(
    `/SellerProductAttribute?productId=${encodeURIComponent(productId)}`,
    "GET",
    null,
    true // Bearer JWT auth required
  );
};
