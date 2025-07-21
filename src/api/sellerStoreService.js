import { apiRequest } from "./apiRequest";

// Mağazayı getir
export const getMyStore = () =>
  apiRequest("/SellerStore/my-store", "GET", null, true);

// Mağaza oluştur
export const createStore = (data) =>
  apiRequest("/SellerStore/create-store", "POST", data, true);

// Mağaza güncelle
export const updateStore = (id, data) =>
  apiRequest(`/SellerStore/update-store/${id}`, "PUT", data, true);

// Kategori listesi
export const getAllCategories = () =>
  apiRequest("/AdminCategory/all", "GET");

export const getSubCategoriesByCategoryId = (categoryId) =>
  apiRequest(`/AdminCategorySub/by-category?categoryId=${categoryId}`, "GET");

// ✅ Mağazadaki ürünleri getir
export const fetchMyStoreProducts = () =>
  apiRequest("/SellerStoreProduct/my-products", "GET", null, true);

// ✅ Ürün veritabanını getir
export const fetchProductDatabase = () =>
  apiRequest("/SellerStoreProduct/product-database-list-all", "GET", null, true);

// ✅ Ürünü mağazaya ekle
export const addProductToStore = (productId) =>
  apiRequest(`/SellerStoreProduct/${productId}/add`, "POST", null, true);

// ✅ Fiyat güncelle (storeProductId gerekiyor)
export const updateProductPrice = (storeProductId, price) =>
  apiRequest(`/SellerStoreProduct/update-price-storeProductId=${storeProductId}&price=${price}`, "PUT", null, true);

// ✅ Satış durumu ayarla
export const toggleProductOnSale = (storeProductId, isOnSale) =>
  apiRequest("/SellerStoreProduct/set-on-sale", "PUT", { storeProductId, isOnSale }, true);


// ✅ Min/Max limiti güncelle
export const updateProductQuantityLimits = (storeProductId, minQty, maxQty) =>
  apiRequest(
    `/SellerStoreProduct/set-quantity-limits-storeProductId=${storeProductId}&minQty=${minQty}&maxQty=${maxQty}`,
    "PUT",
    null,
    true
  );

// ✅ Görsel yükle
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

// ✅ Stok güncelle
export const updateProductStock = (storeProductId, stock) =>
  apiRequest(
    `/SellerStoreProduct/update-stock-storeProductId=${storeProductId}&stock=${stock}`,
    "PUT",
    null,
    true
  );

// ✅ İstek oluştur
export const createProductRequest = (formData) =>
  apiRequest("/SellerStoreProductRequest/create", "POST", formData, true);

// ✅ Tüm istekleri getir
export const fetchProductRequests = () =>
  apiRequest("/SellerStoreProductRequest/my-requests", "GET", null, true);

// ✅ İstek detayını getir
export const fetchProductRequestDetail = (requestId) =>
  apiRequest(`/SellerStoreProductRequest/request-detail/${requestId}`, "GET", null, true);

// ✅ Özet veriyi getir
export const fetchProductRequestSummary = () =>
  apiRequest("/SellerStoreProductRequest/request-summary", "GET", null, true);

// ✅ Hizmet bölgeleri
export const getStoreCoverage = () =>
  apiRequest("/SellerStoreCoverage/my-coverage", "GET", null, true);
