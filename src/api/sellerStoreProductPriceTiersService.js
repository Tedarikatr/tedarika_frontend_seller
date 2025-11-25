// =============================
// sellerStoreProductPriceTiersService.js (fetch versiyonu)
// =============================
import { apiRequest } from "./apiRequest";

const BASE_URL = "/SellerStoreProductPriceTiers";

/**
 * Belirli bir para birimi fiyatı için fiyat merdivenleri ekle/güncelle
 * @param {string} storeProductId - Mağaza ürün ID'si (UUID)
 * @param {string} storeProductPriceId - Ürün fiyat ID'si (UUID) - Para birimi bazlı
 * @param {Array} tiers - Fiyat merdivenleri array'i (max 4 adet)
 */
export const upsertPriceTiers = async (storeProductId, storeProductPriceId, tiers) => {
  return await apiRequest(
    `${BASE_URL}/${storeProductId}/prices/${storeProductPriceId}/tiers`,
    "POST",
    tiers,
    true
  );
};

/**
 * Belirli bir para birimi için fiyat merdivenlerini getir
 * @param {string} storeProductId - Mağaza ürün ID'si (UUID)
 * @param {string} storeProductPriceId - Ürün fiyat ID'si (UUID)
 */
export const getPriceTiers = async (storeProductId, storeProductPriceId) => {
  return await apiRequest(
    `${BASE_URL}/${storeProductId}/prices/${storeProductPriceId}/tiers`,
    "GET",
    null,
    true
  );
};

/**
 * Tek bir fiyat merdivenini güncelle
 * @param {string} storeProductId - Mağaza ürün ID'si (UUID)
 * @param {string} storeProductPriceId - Ürün fiyat ID'si (UUID)
 * @param {string} tierId - Fiyat merdiveni ID'si (UUID)
 * @param {object} body - Güncellenecek fiyat merdiveni verisi
 */
export const updatePriceTier = async (storeProductId, storeProductPriceId, tierId, body) => {
  return await apiRequest(
    `${BASE_URL}/${storeProductId}/prices/${storeProductPriceId}/tiers/${tierId}`,
    "PUT",
    body,
    true
  );
};

/**
 * Bir fiyat merdivenini pasif hale getir/sil
 * @param {string} storeProductId - Mağaza ürün ID'si (UUID)
 * @param {string} storeProductPriceId - Ürün fiyat ID'si (UUID)
 * @param {string} tierId - Fiyat merdiveni ID'si (UUID)
 */
export const deactivatePriceTier = async (storeProductId, storeProductPriceId, tierId) => {
  return await apiRequest(
    `${BASE_URL}/${storeProductId}/prices/${storeProductPriceId}/tiers/${tierId}`,
    "DELETE",
    null,
    true
  );
};
