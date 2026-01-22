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

/** Şifremi unuttum – Adım 1: E-posta ile kod talep. */
export function requestForgetPasswordReset(email) {
  return apiRequest("/SellerUser/request-forget-password-reset", "POST", { email });
}

/** Şifremi unuttum – Adım 2: Kodu doğrula ve şifre sıfırla. */
export function forgetPassword({ email, code, newPassword, newPasswordConfirm }) {
  return apiRequest("/SellerUser/forget-password", "POST", {
    email,
    code,
    newPassword,
    newPasswordConfirm,
  });
}