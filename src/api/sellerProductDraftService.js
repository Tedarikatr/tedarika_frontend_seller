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
 * Returns: [{ id, draftId, storeId, name, brandName, categoryId, status, ... }]
 */
export const fetchDraftProducts = async (draftId) => {
  return await apiRequest(`/SellerProductDraft/draft/${draftId}/products`, "GET", null, true);
};

/**
 * Tek bir draft product detayını getir
 * @param {string} productDraftId - Product Draft UUID
 * Returns: { id, name, brandId, brandName, description, unitPrice, imageUrls, ... }
 */
export const fetchDraftProductDetail = async (productDraftId) => {
  return await apiRequest(`/SellerProductDraft/draft-product/${productDraftId}`, "GET", null, true);
};

/**
 * JSON formatında ürün ekle
 * @param {string} jsonString - JSON formatında ürün bilgisi
 */
export const addProductJson = async (jsonString) => {
  return await apiRequest("/SellerProductDraft/add-product-json", "POST", jsonString, true, {
    "Content-Type": "application/json"
  });
};

/**
 * Excel dosyası ile ürün ekle
 * @param {FormData} formData - ExcelFile, RowsJson, BatchId, UploadName, ParsedRows
 */
export const addProductExcel = async (formData) => {
  return await apiRequest("/SellerProductDraft/add-product-excel", "POST", formData, true);
};

/**
 * XML dosyası ile ürün ekle
 * @param {FormData} formData - XmlFile, UploadName
 */
export const addProductXml = async (formData) => {
  return await apiRequest("/SellerProductDraft/add-product-xml", "POST", formData, true);
};

/**
 * URL'den XML ile ürün ekle
 * @param {Object} data - { xmlUrl, uploadName }
 */
export const addProductXmlFromUrl = async (data) => {
  return await apiRequest("/SellerProductDraft/add-product-xml-from-url", "POST", data, true);
};
