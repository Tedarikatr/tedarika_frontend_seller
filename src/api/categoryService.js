import { apiRequest } from "./apiRequest";

/**
 * Ana kategorileri getir (alt kategoriler olmadan)
 * @returns {Promise<Array>} Ana kategori listesi [{ id, name, imageUrl }]
 */
export const getMainCategories = async () => {
  return await apiRequest("/Category/main", "GET", null, false); // Public endpoint, auth gerekmez
};

/**
 * Ana kategorileri alt kategorileriyle birlikte getir
 * @returns {Promise<Array>} Ana kategori listesi alt kategorileriyle [{ id, name, imageUrl, subCategories: [{ id, name, imageUrl }] }]
 */
export const getCategoriesWithSubCategories = async () => {
  return await apiRequest("/Category/with-subcategories", "GET", null, false); // Public endpoint, auth gerekmez
};
