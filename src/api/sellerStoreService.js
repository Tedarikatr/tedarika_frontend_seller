import { apiRequest } from "./apiRequest";

// 🔹 Mağaza Bilgileri
export const getMyStore = () =>
  apiRequest("/SellerStore/my-store", "GET", null, true);

// 🔹 Mağaza Oluştur
export const createStore = (form) => {
  const formData = new FormData();
  formData.append("StoreName", form.storeName);
  formData.append("StoreDescription", form.storeDescription || "");
  formData.append("LogoUrl", form.logoFile); // zorunlu dosya

  if (form.bannerFile) {
    formData.append("BannerImageUrl", form.bannerFile);
  }

  form.categoryIds.forEach((id) => {
    formData.append("CategoryIds", id);
  });

  return apiRequest("/SellerStore/create-store", "POST", formData, true, true);
};

// 🔹 Mağaza Güncelle
export const updateStore = (form) => {
  const formData = new FormData();
  formData.append("StoreName", form.storeName);
  formData.append("StoreDescription", form.storeDescription || "");

  if (form.logoFile) {
    formData.append("LogoUrl", form.logoFile);
  }

  if (form.bannerFile) {
    formData.append("BannerImageUrl", form.bannerFile);
  }

  form.categoryIds.forEach((id) => {
    formData.append("CategoryIds", id);
  });

  return apiRequest("/SellerStore/update-store", "PUT", formData, true, true); // ✅ id kaldırıldı!
};

// 🔹 Kategoriler
export const getAllCategories = () =>
  apiRequest("/AdminCategory/all", "GET", null, true);

export const getSubCategoriesByCategoryId = (categoryId) =>
  apiRequest(`/AdminCategorySub/by-category?categoryId=${categoryId}`, "GET", null, true);

// 🔹 Mağaza Ürünleri
export const fetchMyStoreProducts = () =>
  apiRequest("/SellerStoreProduct/my-products", "GET", null, true);

export const fetchProductDatabase = () =>
  apiRequest("/SellerStoreProduct/product-database-list-all", "GET", null, true);

export const addProductToStore = (productId) =>
  apiRequest(`/SellerStoreProduct/${productId}/add`, "POST", null, true);

export const updateProductPrice = (storeProductId, price) =>
  apiRequest(
    `/SellerStoreProduct/update-price-storeProductId=${storeProductId}&price=${price}`,
    "PUT",
    null,
    true
  );

export const toggleProductOnSale = (storeProductId, isOnSale) =>
  apiRequest("/SellerStoreProduct/set-on-sale", "PUT", { storeProductId, isOnSale }, true);

export const updateProductQuantityLimits = (storeProductId, minQty, maxQty) =>
  apiRequest(
    `/SellerStoreProduct/set-quantity-limits-storeProductId=${storeProductId}&minQty=${minQty}&maxQty=${maxQty}`,
    "PUT",
    null,
    true
  );

export const uploadProductImage = (storeProductId, file) => {
  const formData = new FormData();
  formData.append("file", file);
  return apiRequest(
    `/SellerStoreProduct/upload-image?storeProductId=${storeProductId}`,
    "POST",
    formData,
    true
  );
};

export const updateProductStock = (storeProductId, stock) =>
  apiRequest(
    `/SellerStoreProduct/update-stock-storeProductId=${storeProductId}&stock=${stock}`,
    "PUT",
    null,
    true
  );

// 🔹 Ürün İstekleri
export const createProductRequest = (formData) =>
  apiRequest("/SellerStoreProductRequest/create", "POST", formData, true);

export const fetchProductRequests = () =>
  apiRequest("/SellerStoreProductRequest/my-requests", "GET", null, true);

export const fetchProductRequestDetail = (requestId) =>
  apiRequest(`/SellerStoreProductRequest/request-detail/${requestId}`, "GET", null, true);

export const fetchProductRequestSummary = () =>
  apiRequest("/SellerStoreProductRequest/request-summary", "GET", null, true);

// 🔹 Hizmet Bölgeleri
export const getStoreCoverage = () =>
  apiRequest("/SellerStoreCoverage/my-coverage", "GET", null, true);
