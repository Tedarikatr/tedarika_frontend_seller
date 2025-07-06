// src/utils/auth.js
export function isSellerAuthenticated() {
    const token = localStorage.getItem("sellerToken");
    if (!token) return false;
  
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp && payload.exp > currentTime;
    } catch (err) {
      console.error("Token geçersiz:", err);
      return false;
    }
  }
  