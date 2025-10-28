import { apiRequest } from "./apiRequest";

// ✅ Tüm markalar (tek seferde hepsini çekiyoruz)
export async function getBrandList() {
  return await apiRequest("SellerBrand/list", "GET", null, true);
}

// ✅ Sahip olunan markalar
export async function getOwnedBrands() {
  return await apiRequest("SellerBrand", "GET", null, true);
}

// ✅ Başvurular
export async function getBrandOwnership() {
  return await apiRequest("SellerBrand/get-ownership", "GET", null, true);
}

// ✅ Başvuru oluşturma
export async function requestBrandOwnership(data) {
  return await apiRequest("SellerBrand/ownership-request", "POST", data, true);
}