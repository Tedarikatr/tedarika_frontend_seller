import { apiRequest, apiRequestWithUploadProgress } from "./apiRequest";

/**
 * Draft listesini getir (yeni yapı)
 * Returns: [{ id, storeId, name, productCount, createdAt }]
 */
export const fetchProductDrafts = async () => {
  return await apiRequest("/SellerProductDraft/list-drafts", "GET", null, true);
};

/**
 * Belirli bir draft'ın ürünlerini getir
 * @param {string} draftId - Draft UUID
 * Returns: [{ id, draftId, storeId, name, brandName, sku, ean, status, createdAt }]
 */
export const fetchDraftProducts = async (draftId) => {
  return await apiRequest(`/SellerProductDraft/draft/${draftId}/products`, "GET", null, true);
};

/**
 * Tek bir draft product detayını getir
 * @param {string} productDraftId - Product Draft UUID
 * Returns: { id, draftId, storeId, name, sku, ean, brandName, gtip, description, stores, imageUrls, status, rejectReason, createdAt }
 */
export const fetchDraftProductDetail = async (productDraftId) => {
  return await apiRequest(`/SellerProductDraft/draft-product/${productDraftId}`, "GET", null, true);
};

/**
 * JSON formatında ürün ekle
 * @param {Object|Array} jsonData - JSON formatında ürün bilgisi
 */
export const addProductJson = async (jsonData) => {
  return await apiRequest("/SellerProductDraft/add-product-json", "POST", jsonData, true);
};

// Arka plan yükleme için uzun timeout (30 dk + buffer)
const LONG_UPLOAD_TIMEOUT_MS = 45 * 60 * 1000; // 45 dakika

/**
 * Excel dosyası ile ürün ekle (arka planda, uzun sürebilir)
 * @param {FormData} formData - ExcelFile, UploadName (opsiyonel)
 */
export const addProductExcel = async (formData) => {
  return await apiRequest("/SellerProductDraft/add-product-excel", "POST", formData, true, {
    timeoutMs: LONG_UPLOAD_TIMEOUT_MS,
  });
};

/**
 * Excel dosyası ile ürün ekle - upload progress callback ile
 * @param {FormData} formData - ExcelFile, UploadName (opsiyonel)
 * @param {function(number): void} onUploadProgress - 0-100 yüzde callback
 */
export const addProductExcelWithProgress = async (formData, onUploadProgress) => {
  return await apiRequestWithUploadProgress(
    "/SellerProductDraft/add-product-excel",
    formData,
    onUploadProgress,
    LONG_UPLOAD_TIMEOUT_MS
  );
};

/**
 * XML dosyası ile ürün ekle (arka planda, uzun sürebilir)
 * @param {FormData} formData - XmlFile, UploadName
 */
export const addProductXml = async (formData) => {
  return await apiRequest("/SellerProductDraft/add-product-xml", "POST", formData, true, {
    timeoutMs: LONG_UPLOAD_TIMEOUT_MS,
  });
};

/**
 * XML dosyası ile ürün ekle - upload progress callback ile
 * @param {FormData} formData - XmlFile, UploadName
 * @param {function(number): void} onUploadProgress - 0-100 yüzde callback
 */
export const addProductXmlWithProgress = async (formData, onUploadProgress) => {
  return await apiRequestWithUploadProgress(
    "/SellerProductDraft/add-product-xml",
    formData,
    onUploadProgress,
    LONG_UPLOAD_TIMEOUT_MS
  );
};

/**
 * URL'den XML ile ürün ekle (arka planda, uzun sürebilir)
 * @param {Object} data - { xmlUrl, uploadName }
 */
export const addProductXmlFromUrl = async (data) => {
  return await apiRequest("/SellerProductDraft/add-product-xml-from-url", "POST", data, true, {
    timeoutMs: LONG_UPLOAD_TIMEOUT_MS,
  });
};

/**
 * Manuel olarak ürün taslakları oluştur (Excel, JSON, XML gerektirmez)
 * @param {FormData} formData - FormData object containing products and images
 * @returns {Promise<Array>} Oluşturulan draft product'ların listesi
 */
export const addProductManual = async (formData) => {
  return await apiRequest("/SellerProductDraft/add-product-manual", "POST", formData, true, {
    timeoutMs: LONG_UPLOAD_TIMEOUT_MS, // Görsel yükleme için uzun timeout
  });
};
