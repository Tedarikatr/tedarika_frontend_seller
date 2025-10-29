// =============================
// sellerStoreProductPriceTiersService.js (fetch versiyonu)
// =============================
import { apiRequest } from "./apiRequest";

const BASE_URL = "/SellerStoreProductPriceTiers";

export const getPriceTiers = async (storeProductId, channel = "Domestic") => {
  return await apiRequest(
    `${BASE_URL}/getPriceTiers-${storeProductId}?channel=${channel}`,
    "GET",
    null,
    true
  );
};

export const upsertPriceTiers = async (storeProductId, tiers) => {
  return await apiRequest(
    `${BASE_URL}/upsertPriceTiers-${storeProductId}`,
    "POST",
    tiers,
    true
  );
};

export const updatePriceTier = async (storeProductId, tierId, body) => {
  return await apiRequest(
    `${BASE_URL}/updateTier-${storeProductId}/${tierId}`,
    "PUT",
    body,
    true
  );
};

export const deactivatePriceTier = async (storeProductId, tierId) => {
  return await apiRequest(
    `${BASE_URL}/deactivateTier-${storeProductId}/${tierId}`,
    "DELETE",
    null,
    true
  );
};
