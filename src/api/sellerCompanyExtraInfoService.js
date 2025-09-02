import { apiRequest } from "./apiRequest";

// (Varsayılan) giriş yapan seller'ın ekstra bilgisi
export const getMyExtraInfo = () =>
  apiRequest("/SellerCompanyExtraInfo/my-extra-info", "GET", null, true);

export const addExtraInfo = (data) =>
  apiRequest("/SellerCompanyExtraInfo/add", "POST", data, true);

// İleride gerekirse (UI'da kullanmıyoruz)
export const updateExtraInfo = (id, data) =>
  apiRequest(`/SellerCompanyExtraInfo/update/${id}`, "PUT", data, true);
