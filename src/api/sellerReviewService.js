import { apiRequest } from "./apiRequest";

// Mağazaya gelen yorumları getir
export const fetchStoreReviews = () =>
  apiRequest("/SellerReview/store-reviews", "GET", null, true);

// Mağaza yorumu yanıtla
export const replyToStoreReview = (reviewId, reply) =>
  apiRequest(`/SellerReview/store-reviews/${reviewId}/reply`, "POST", { reply }, true);

export const fetchProductReviews = (productId) =>
    apiRequest(`/SellerReview/product-reviews?productId=${productId}`, "GET", null, true);
  
  // Ürün yorumuna yanıt ver
  export const replyToProductReview = (reviewId, reply) =>
    apiRequest(`/SellerReview/product-reviews/${reviewId}/reply`, "POST", { reply }, true);