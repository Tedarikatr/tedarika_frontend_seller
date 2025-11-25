// src/api/sellerStoreProductPricesService.js
import { apiRequest } from "./apiRequest";

const BASE_URL = "/SellerStoreProductPrices";

/**
 * Ürün için para birimi bazlı fiyat ekleme
 * @param {string} storeProductId - Mağaza ürün ID'si (UUID)
 * @param {object} priceData - Fiyat verisi
 * @param {string} priceData.storeProductId - Mağaza ürün ID'si (UUID)
 * @param {string} priceData.currencyCode - Para birimi kodu (örn: "TRY", "USD", "EUR")
 * @param {number} priceData.unitPrice - Birim fiyat
 */
export const addProductPrice = async (storeProductId, priceData) => {
  return apiRequest(
    `${BASE_URL}/${storeProductId}/prices`,
    "POST",
    {
      storeProductId: storeProductId,
      currencyCode: priceData.currencyCode,
      unitPrice: priceData.unitPrice,
    },
    true
  );
};

/**
 * Belirli bir fiyat bilgisini getir
 * @param {string} storeProductId - Mağaza ürün ID'si (UUID)
 * @param {string} priceId - Fiyat ID'si (UUID)
 */
export const getProductPrice = async (storeProductId, priceId) => {
  return apiRequest(
    `${BASE_URL}/${storeProductId}/prices/${priceId}`,
    "GET",
    null,
    true
  );
};

/**
 * Para birimine göre fiyat getir
 * @param {string} storeProductId - Mağaza ürün ID'si (UUID)
 * @param {string} currencyCode - Para birimi kodu (örn: "TRY", "USD", "EUR")
 */
export const getProductPriceByCurrency = async (storeProductId, currencyCode) => {
  return apiRequest(
    `${BASE_URL}/${storeProductId}/prices/by-currency/${currencyCode}`,
    "GET",
    null,
    true
  );
};

/**
 * Ürünün tüm fiyatlarını listele (zaten product.prices'da geliyor)
 * @param {string} storeProductId - Mağaza ürün ID'si (UUID)
 */
export const getAllProductPrices = async (storeProductId) => {
  return apiRequest(
    `${BASE_URL}/${storeProductId}/prices`,
    "GET",
    null,
    true
  );
};

/**
 * Belirli bir para birimi için fiyat güncelle
 * @param {string} storeProductId - Mağaza ürün ID'si (UUID)
 * @param {string} priceId - Fiyat ID'si (UUID)
 * @param {object} priceData - Güncellenecek fiyat verisi
 * @param {string} priceData.storeProductId - Mağaza ürün ID'si
 * @param {string} priceData.currencyCode - Para birimi kodu
 * @param {number} priceData.unitPrice - Birim fiyat
 */
export const updateProductPrice = async (storeProductId, priceId, priceData) => {
  return apiRequest(
    `${BASE_URL}/${storeProductId}/prices/${priceId}`,
    "PUT",
    {
      storeProductId: priceData.storeProductId || storeProductId,
      currencyCode: priceData.currencyCode,
      unitPrice: priceData.unitPrice,
    },
    true
  );
};

/**
 * Belirli bir fiyatı sil
 * @param {string} storeProductId - Mağaza ürün ID'si (UUID)
 * @param {string} priceId - Fiyat ID'si (UUID)
 */
export const deleteProductPrice = async (storeProductId, priceId) => {
  return apiRequest(
    `${BASE_URL}/${storeProductId}/prices/${priceId}`,
    "DELETE",
    null,
    true
  );
};
