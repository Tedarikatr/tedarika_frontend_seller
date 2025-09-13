import { apiRequest } from "./apiRequest";

/** Profil bilgilerini getirir */
export const getPayoutProfile = () =>
  apiRequest("/SellerFinancePayoutProfile/get-profile", "GET", null, true);

/** Profil bilgilerini kaydeder */
export const savePayoutProfile = (data) =>
  apiRequest("/SellerFinancePayoutProfile/save-profile", "POST", data, true);

/** Doğrulama için gönderir (success:false geldiyse hata fırlatır) */
export const submitPayoutProfile = async () => {
  const res = await apiRequest("/SellerFinancePayoutProfile/submit", "POST", null, true);
  if (res && typeof res === "object" && res.success === false) {
    const err = new Error(res.errorMessage || "Gönderim başarısız");
    err.response = { data: res };
    throw err;
  }
  return res;
};

/** Doğrulama / durum bilgisini getirir */
export const getPayoutProfileStatus = () =>
  apiRequest("/SellerFinancePayoutProfile/status", "GET", null, true);
