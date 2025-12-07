import { apiRequest } from "./apiRequest";

/**
 * Ürün başvuru taslak listesini getir
 */
export const fetchProductDrafts = async () => {
  return await apiRequest("/SellerProductDraft/list-drafts", "GET", null, true);
};

/**
 * JSON formatında ürün ekle
 * @param {string} jsonString - JSON formatında ürün bilgisi
 */
export const addProductJson = async (jsonString) => {
  return await apiRequest("/SellerProductDraft/add-product-json", "POST", jsonString, true);
};

/**
 * Excel dosyası ile ürün ekle
 * @param {FormData} formData - Excel file + metadata
 */
export const addProductExcel = async (formData) => {
  return await apiRequest("/SellerProductDraft/add-product-excel", "POST", formData, true);
};

/**
 * XML dosyası ile ürün ekle
 * @param {FormData} formData - XML file + uploadName
 */
export const addProductXml = async (formData) => {
  return await apiRequest("/SellerProductDraft/add-product-xml", "POST", formData, true);
};

/**
 * URL'den XML ile ürün ekle
 * @param {Object} data - { xmlUrl, uploadName, username?, password? }
 */
export const addProductXmlFromUrl = async (data) => {
  return await apiRequest("/SellerProductDraft/add-product-xml-from-url", "POST", data, true);
};
