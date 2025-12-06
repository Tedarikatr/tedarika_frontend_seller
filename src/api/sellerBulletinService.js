import { apiRequest } from "./apiRequest";

/**
 * Satıcının bülten/bildirim tercihlerini getirir
 * @returns {Promise<Object>} { allowMail: boolean, allowSms: boolean, allowWp: boolean }
 */
export const getSellerBulletinPreferences = async () => {
  return await apiRequest("/SellerBulletin", "GET", null, true);
};

/**
 * Satıcının bülten/bildirim tercihlerini günceller
 * @param {Object} preferences - { allowMail: boolean, allowSms: boolean, allowWp: boolean }
 */
export const updateSellerBulletinPreferences = async (preferences) => {
  return await apiRequest("/SellerBulletin", "POST", preferences, true);
};
