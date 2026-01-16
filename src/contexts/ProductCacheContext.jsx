import { createContext, useContext, useState, useCallback, useRef } from "react";
import {
  fetchMyStoreProducts,
  fetchProductDatabase,
} from "@/api/sellerStoreService";

const ProductCacheContext = createContext(null);

export const useProductCache = () => {
  const context = useContext(ProductCacheContext);
  if (!context) {
    throw new Error("useProductCache must be used within ProductCacheProvider");
  }
  return context;
};

// Cache verilerini tutan yapı
const CACHE_KEYS = {
  MY_STORE_PRODUCTS: "myStoreProducts",
  PRODUCT_DATABASE: "productDatabase",
};

export const ProductCacheProvider = ({ children }) => {
  // Cache state - timestamp ile birlikte tutuluyor
  const [cache, setCache] = useState({
    [CACHE_KEYS.MY_STORE_PRODUCTS]: null,
    [CACHE_KEYS.PRODUCT_DATABASE]: null,
  });

  // Cache timestamps
  const cacheTimestamps = useRef({
    [CACHE_KEYS.MY_STORE_PRODUCTS]: null,
    [CACHE_KEYS.PRODUCT_DATABASE]: null,
  });

  // My Store Products cache yönetimi
  const getMyStoreProducts = useCallback(
    async (forceRefresh = false) => {
      const cacheKey = CACHE_KEYS.MY_STORE_PRODUCTS;
      const cachedData = cache[cacheKey];

      // Eğer cache varsa ve force refresh değilse cache'i döndür
      if (!forceRefresh && cachedData !== null) {
        return cachedData;
      }

      // API'den veri çek
      try {
        const data = await fetchMyStoreProducts();
        const products = data || [];

        // Cache'i güncelle
        setCache((prev) => ({
          ...prev,
          [cacheKey]: products,
        }));
        cacheTimestamps.current[cacheKey] = Date.now();

        return products;
      } catch (error) {
        console.error("My Store Products fetch error:", error);
        // Hata durumunda cache varsa onu döndür
        if (cachedData !== null) {
          return cachedData;
        }
        throw error;
      }
    },
    [cache]
  );

  // Product Database cache yönetimi
  const getProductDatabase = useCallback(
    async (forceRefresh = false) => {
      const cacheKey = CACHE_KEYS.PRODUCT_DATABASE;
      const cachedData = cache[cacheKey];

      // Eğer cache varsa ve force refresh değilse cache'i döndür
      if (!forceRefresh && cachedData !== null) {
        return cachedData;
      }

      // API'den veri çek
      try {
        const data = await fetchProductDatabase();
        const products = data || [];

        // Cache'i güncelle
        setCache((prev) => ({
          ...prev,
          [cacheKey]: products,
        }));
        cacheTimestamps.current[cacheKey] = Date.now();

        return products;
      } catch (error) {
        console.error("Product Database fetch error:", error);
        // Hata durumunda cache varsa onu döndür
        if (cachedData !== null) {
          return cachedData;
        }
        throw error;
      }
    },
    [cache]
  );

  // Cache'i temizle
  const clearCache = useCallback((key = null) => {
    if (key) {
      setCache((prev) => ({
        ...prev,
        [key]: null,
      }));
      cacheTimestamps.current[key] = null;
    } else {
      // Tüm cache'i temizle
      setCache({
        [CACHE_KEYS.MY_STORE_PRODUCTS]: null,
        [CACHE_KEYS.PRODUCT_DATABASE]: null,
      });
      cacheTimestamps.current = {
        [CACHE_KEYS.MY_STORE_PRODUCTS]: null,
        [CACHE_KEYS.PRODUCT_DATABASE]: null,
      };
    }
  }, []);

  // Cache durumunu kontrol et
  const hasCache = useCallback(
    (key) => {
      return cache[key] !== null;
    },
    [cache]
  );

  const value = {
    getMyStoreProducts,
    getProductDatabase,
    clearCache,
    hasCache,
    CACHE_KEYS,
  };

  return (
    <ProductCacheContext.Provider value={value}>
      {children}
    </ProductCacheContext.Provider>
  );
};