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

// ✅ Fiyat güncelle
export const updateProductPrice = (productId, price) =>
  apiRequest(`/SellerStoreProduct/update-price-productId=${productId}&price=${price}`, "PUT", null, true);

// ✅ Aktif/Pasif
// ✅ Aktif/Pasif durumu ayarla
export const toggleProductActiveStatus = (productId, isActive) =>
  apiRequest("/SellerStoreProduct/set-active-status", "PUT", { productId, isActive }, true);

// ✅ Satış durumu ayarla
export const toggleProductOnSale = (productId, isOnSale) =>
  apiRequest("/SellerStoreProduct/set-on-sale", "PUT", { productId, isOnSale }, true);


// ✅ Min/Max limiti güncelle
export const updateProductQuantityLimits = (productId, minQty, maxQty) =>
  apiRequest(
    `/SellerStoreProduct/set-quantity-limits-productId=${productId}&minQty=${minQty}&maxQty=${maxQty}`,
    "PUT",
    null,
    true
  );

// ✅ Görsel yükle (DÜZENLENMİŞ)
export const uploadProductImage = (productId, file) => {
  const formData = new FormData();
  formData.append("file", file);

  return apiRequest(
    `/SellerStoreProduct/upload-image?productId=${productId}`,
    "POST",
    formData,
    true
  );
};

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
// ✅ Stok güncelle
export const updateProductStock = (productId, stock) =>
  apiRequest(
    `/SellerStoreProduct/update-stock-productId=${productId}&stock=${stock}`,
    "PUT",
    null,
    true
  );
