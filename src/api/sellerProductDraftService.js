import { apiRequest } from "./apiRequest";

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

/**
 * Excel dosyası ile ürün ekle
 * @param {FormData} formData - ExcelFile, UploadName (opsiyonel)
 */
export const addProductExcel = async (formData) => {
  return await apiRequest("/SellerProductDraft/add-product-excel", "POST", formData, true, {
    timeoutMs: 10 * 60 * 1000,
  });
};

/**
 * XML dosyası ile ürün ekle
 * @param {FormData} formData - XmlFile, UploadName
 */
export const addProductXml = async (formData) => {
  return await apiRequest("/SellerProductDraft/add-product-xml", "POST", formData, true, {
    timeoutMs: 10 * 60 * 1000,
  });
};

/**
 * URL'den XML ile ürün ekle
 * @param {Object} data - { xmlUrl, uploadName }
 */
export const addProductXmlFromUrl = async (data) => {
  return await apiRequest("/SellerProductDraft/add-product-xml-from-url", "POST", data, true, {
    timeoutMs: 10 * 60 * 1000,
  });
};
