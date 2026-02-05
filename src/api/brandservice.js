import { apiRequest } from "./apiRequest";

/**
 * SellerBrandController API (api/SellerBrand)
 * Raporda belirtilen endpoint'ler; satıcı marka listesi, yetkiler, başvurular ve yeni marka oluşturma.
 */

/** GET api/SellerBrand/list — Sistemdeki tüm markalar (id, name, imageUrl). Ürün/marka seçiminde kullanılır. */
export async function getBrandList() {
  return await apiRequest("SellerBrand/list", "GET", null, true);
}

/** GET api/SellerBrand — Mağazanın onaylı marka yetkilerini (ownership) listeler. */
export async function getOwnedBrands() {
  return await apiRequest("SellerBrand", "GET", null, true);
}

/** GET api/SellerBrand/get-ownership — Mağazanın marka sahiplik başvuru durumlarını listeler (Pending, Approved, Rejected, Revoked, Expired). */
export async function getBrandOwnership() {
  return await apiRequest("SellerBrand/get-ownership", "GET", null, true);
}

/** POST api/SellerBrand/ownership-request — Belirtilen marka için sahiplik/yetkili satıcı talebi. Body: { brandId, ownershipType, expiryDate?, notes? }. */
export async function requestBrandOwnership(data) {
  return await apiRequest("SellerBrand/ownership-request", "POST", data, true);
}

/** POST api/SellerBrand/create — Yeni marka oluşturur. FormData: Name (zorunlu), Image (opsiyonel). */
export async function createBrand(formData) {
  return await apiRequest("SellerBrand/create", "POST", formData, true);
}