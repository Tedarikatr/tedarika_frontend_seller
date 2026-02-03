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

/**
 * Toplu fiyat güncelleme
 * @param {object} body - bulk-update istek gövdesi
 * @param {string} body.currencyCode - Para birimi (TRY, EUR, USD vb.)
 * @param {string[]} [body.storeProductIds] - Güncellenecek mağaza ürün ID'leri (opsiyonel)
 * @param {number} [body.newUnitPrice] - Yeni sabit birim fiyat (percentageChange ile birlikte kullanılamaz)
 * @param {number} [body.percentageChange] - Yüzde değişim (örn. 10 = %10 artış, -5 = %5 indirim)
 */
export const bulkUpdatePrices = (body) =>
  apiRequest(`${BASE_URL}/prices/bulk-update`, "PUT", body, true);

/**
 * TRY fiyatlarını hedef para birimine kur çevirimi
 * @param {object} body - convert-from-try istek gövdesi
 * @param {string} body.targetCurrencyCode - Hedef para birimi (TRY olamaz)
 * @param {number} body.rateTryPerUnitTarget - 1 hedef birim = X TRY (örn. 1 EUR = 35 TRY → 35)
 * @param {string[]} [body.storeProductIds] - Dönüştürülecek mağaza ürün ID'leri (opsiyonel)
 */
export const convertFromTry = (body) =>
  apiRequest(`${BASE_URL}/prices/convert-from-try`, "POST", body, true);
