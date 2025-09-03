import { apiRequest } from "./apiRequest";

/* ── Mağaza Bilgileri ─────────────────────────────────────────────── */
export const getMyStore = () =>
  apiRequest("/SellerStore/my-store", "GET", null, true);

export const createStore = (form) => {
  const formData = new FormData();
  formData.append("StoreName", form.storeName);
  formData.append("StoreDescription", form.storeDescription || "");
  formData.append("LogoUrl", form.logoFile);
  if (form.bannerFile) formData.append("BannerImageUrl", form.bannerFile);
  (form.categoryIds || []).forEach((id) => formData.append("CategoryIds", id));
  return apiRequest("/SellerStore/create-store", "POST", formData, true, true);
};

export const updateStore = (form) => {
  const formData = new FormData();
  formData.append("StoreName", form.storeName);
  formData.append("StoreDescription", form.storeDescription || "");
  if (form.logoFile) formData.append("LogoUrl", form.logoFile);
  if (form.bannerFile) formData.append("BannerImageUrl", form.bannerFile);
  (form.categoryIds || []).forEach((id) => formData.append("CategoryIds", id));
  return apiRequest("/SellerStore/update-store", "PUT", formData, true, true);
};

/* ── Kategoriler ──────────────────────────────────────────────────── */
export const getAllCategories = () =>
  apiRequest("/AdminCategory/all", "GET", null, true);

export const getSubCategoriesByCategoryId = (categoryId) =>
  apiRequest(
    `/AdminCategorySub/by-category?categoryId=${categoryId}`,
    "GET",
    null,
    true
  );

/* ── Mağaza Ürünleri ──────────────────────────────────────────────── */
export const fetchMyStoreProducts = () =>
  apiRequest("/SellerStoreProduct/my-products", "GET", null, true);

export const fetchProductDatabase = () =>
  apiRequest(
    "/SellerStoreProduct/product-database-list-all",
    "GET",
    null,
    true
  );

export const addProductToStore = (productId) =>
  apiRequest(`/SellerStoreProduct/${productId}/add`, "POST", null, true);

export const updateProductPrice = (storeProductId, price) =>
  apiRequest(
    "/SellerStoreProduct/update-price",
    "PUT",
    { storeProductId, price },
    true
  );

export const toggleProductOnSale = (storeProductId, isOnSale) =>
  apiRequest(
    "/SellerStoreProduct/set-on-sale",
    "PUT",
    { storeProductId, isOnSale },
    true
  );

export const updateProductQuantityLimits = (storeProductId, minQty, maxQty) =>
  apiRequest(
    "/SellerStoreProduct/set-quantity-limits",
    "PUT",
    { storeProductId, minQty, maxQty },
    true
  );

export const updateProductStock = (storeProductId, stock) =>
  apiRequest(
    "/SellerStoreProduct/update-stock",
    "PUT",
    { storeProductId, stock },
    true
  );

/* ── Görseller ───────────────────────────────────────────────────── */
/** Tek dosya yükleme — dönüyorsa URL yakalıyoruz */
export const uploadProductImage = async (storeProductId, file) => {
  const formData = new FormData();
  formData.append("file", file); // Swagger: field = 'file'
  const res = await apiRequest(
    `/SellerStoreProduct/upload-image?storeProductId=${storeProductId}`,
    "POST",
    formData,
    true,
    true
  );
  // API'nin döndürebileceği muhtemel alanlar:
  const url = res?.url || res?.imageUrl || res?.path || res?.Location || null;
  const id = res?.id || res?.imageId || res?.guid || null;
  return { id, url, raw: res };
};

/** Çoklu yükleme: tek tek çağırır, dönen URL’leri toplar */
export const uploadProductImages = async (storeProductId, filesOrArray) => {
  const list = Array.isArray(filesOrArray)
    ? filesOrArray
    : Array.from(filesOrArray || []);
  const results = [];
  for (const f of list) {
    try {
      const r = await uploadProductImage(storeProductId, f);
      results.push({ file: f.name, ok: true, ...r });
    } catch (e) {
      console.error("Yükleme hatası:", f.name, e);
      results.push({ file: f.name, ok: false, error: e });
    }
  }
  return results;
};

/** (Opsiyonel) sunucu imageId ile silmeyi destekliyorsa */
export const deleteProductImage = (imageId) =>
  apiRequest(`/SellerStoreProduct/image/${imageId}`, "DELETE", null, true);

/* ── Ürün İstekleri ──────────────────────────────────────────────── */
export const createProductRequest = (formData) =>
  apiRequest("/SellerStoreProductRequest/create", "POST", formData, true);

export const fetchProductRequests = () =>
  apiRequest("/SellerStoreProductRequest/my-requests", "GET", null, true);

export const fetchProductRequestDetail = (requestId) =>
  apiRequest(
    `/SellerStoreProductRequest/request-detail/${requestId}`,
    "GET",
    null,
    true
  );

export const fetchProductRequestSummary = () =>
  apiRequest("/SellerStoreProductRequest/request-summary", "GET", null, true);

/* ── Hizmet Bölgeleri ────────────────────────────────────────────── */
export const getStoreCoverage = () =>
  apiRequest("/SellerStoreCoverage/my-coverage", "GET", null, true);

export const listProductImages = (storeProductId) =>
  apiRequest(
    `/SellerStoreProduct/images?storeProductId=${storeProductId}`,
    "GET",
    null,
    true
  );