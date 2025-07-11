import { apiRequest } from "./apiRequest";

// ✅ Region listesi
export const getAllRegions = () =>
    apiRequest("/Location/region", "GET", null, true);

// ✅ Seçilen bölgeye ait country listesi
export const getCountriesByRegionId = (regionId) =>
    apiRequest(`/Location/countries-by-region/${regionId}`, "GET", null, true);

// ✅ Mevcut kapsama bilgisi (coverage)
export const fetchMyStoreCoverage = () =>
    apiRequest("/SellerStoreCoverage/my-coverage", "GET", null, true);

// ✅ Kapsama alanı ekle
export const addStoreCoverage = (data) =>
    apiRequest("/SellerStoreCoverage/add", "POST", data, true);

// ✅ Kapsama alanı sil
export const deleteCoverage = (regionIds, countryIds) =>
  apiRequest("/SellerStoreCoverage/delete", "POST", { regionIds, countryIds }, true);
