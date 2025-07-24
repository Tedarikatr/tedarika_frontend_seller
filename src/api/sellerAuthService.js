import { apiRequest } from "./apiRequest";

export function registerSeller(data) {
  return apiRequest("/SellerUser/seller-register", "POST", data);
}

export function loginSeller(data) {
  return apiRequest("/SellerUser/seller-login", "POST", data);
}
export function fetchSellerProfile() {
    return apiRequest("/SellerUser/profile", "GET");
  }
  export function refreshToken(data) {
    return apiRequest("/SellerUser/refresh-token", "POST", data);
  }

  export function getSellerProfile() {
    return apiRequest("/SellerUser/profile", "GET", null, true); // <== useAuth: true
  }