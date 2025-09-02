// src/api/sellerPayoutProfileService.js
import { apiRequest } from "./apiRequest";

/** Profil bilgilerini getirir */
export const getPayoutProfile = () =>
  apiRequest("/SellerFinancePayoutProfile/get-profile", "GET", null, true);

/** Profil bilgilerini kaydeder */
export const savePayoutProfile = (data) =>
  apiRequest("/SellerFinancePayoutProfile/save-profile", "POST", data, true);

/** Doğrulama için gönderir */
export const submitPayoutProfile = () =>
  apiRequest("/SellerFinancePayoutProfile/submit", "POST", null, true);

/** Doğrulama / durum bilgisini getirir */
export const getPayoutProfileStatus = () =>
  apiRequest("/SellerFinancePayoutProfile/status", "GET", null, true);
