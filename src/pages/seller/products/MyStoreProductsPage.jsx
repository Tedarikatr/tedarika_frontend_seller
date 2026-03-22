// =============================
// MyStoreProductsPage.jsx - Ultra Modern & Beautiful 🎨
// =============================
import React, { useEffect, useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import {
  getStoreCoverage,
  removeProductsFromStore,
  setOnSaleBulk,
} from "@/api/sellerStoreService";
import {
  bulkUpdatePrices,
  convertFromTry,
} from "@/api/sellerStoreProductPricesService";
import { useProductCache } from "@/contexts/ProductCacheContext";
import MyStoreProductTable from "@/components/storeProducts/MyStoreProductTable";
import ProductManagementPanel from "@/components/storeProducts/ProductManagementPanel";
import Pagination from "@/components/ui/Pagination";
import { 
  CheckCircle, 
  XCircle, 
  Package, 
  TrendingUp, 
  ShoppingBag,
  Sparkles,
  AlertCircle,
  RefreshCw,
  Search,
  ListFilter,
  Trash2,
  CheckSquare,
  Square,
  DollarSign,
  ArrowRightLeft,
  X,
} from "lucide-react";
import { CURRENCY_OPTIONS } from "@/constants/currencyCode";
import TedarikaLoader from "@/components/ui/TedarikaLoader";

const ITEMS_PER_PAGE = 10;

const MyStoreProductsPage = () => {
  const navigate = useNavigate();
  const { getMyStoreProducts } = useProductCache();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [feedback, setFeedback] = useState(null);
  const [productsWithoutProductId, setProductsWithoutProductId] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasCoverage, setHasCoverage] = useState(true);

  // Panel state
  const [selectedProduct, setSelectedProduct] = useState(null);
  // Toplu kaldırma için seçili ürün ID'leri (storeProductId)
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [bulkRemoving, setBulkRemoving] = useState(false);

  // Toplu fiyat güncelleme modal
  const [showBulkPriceModal, setShowBulkPriceModal] = useState(false);
  const [bulkPriceForm, setBulkPriceForm] = useState({
    currencyCode: "TRY",
    updateMode: "percent",
    amountToAdd: "",
    percentageChange: "",
    useSelectedProducts: false,
  });
  const [bulkPriceLoading, setBulkPriceLoading] = useState(false);
  const [bulkPriceError, setBulkPriceError] = useState(null);

  // Kur çevirimi modal
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [convertForm, setConvertForm] = useState({
    targetCurrencyCode: "EUR",
    rateTryPerUnitTarget: "",
    useSelectedProducts: false,
  });
  const [convertLoading, setConvertLoading] = useState(false);
  const [convertError, setConvertError] = useState(null);

  // Toplu satışa aç / kapat
  const [bulkOnSaleLoading, setBulkOnSaleLoading] = useState(false);

  const loadProducts = async (forceRefresh = false) => {
    const isLoadingState = forceRefresh ? setRefreshing : setLoading;
    isLoadingState(true);
    try {
      const data = await getMyStoreProducts(forceRefresh);
      setProducts(data || []);
    } catch (error) {
      console.error("Ürünler alınamadı:", error);
    } finally {
      isLoadingState(false);
    }
  };

  const handleRefresh = async () => {
    await loadProducts(true);
    showFeedback("Ürünler yenilendi", "success");
  };

  const checkCoverage = async () => {
    try {
      const coverage = await getStoreCoverage();
      const hasAny =
        coverage?.some(
          (c) => (c.regions?.length ?? 0) > 0 || (c.countries?.length ?? 0) > 0
        ) ?? false;
      setHasCoverage(hasAny);
    } catch (error) {
      console.error("Coverage kontrol hatası:", error);
      setHasCoverage(false);
    }
  };

  const showFeedback = (message, type = "success") => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback(null), 4000);
  };

  const getStoreProductId = (p) => p.id ?? p.storeProductId;

  const handleSelectionChange = (ids) => {
    setSelectedIds(ids);
  };

  const handleSelectAllOnPage = () => {
    const ids = new Set(currentItems.map(getStoreProductId).filter(Boolean));
    setSelectedIds(ids);
  };

  const handleDeselectAll = () => {
    setSelectedIds(new Set());
  };

  const handleBulkSetOnSale = async (isOnSale) => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) {
      showFeedback("En az bir ürün seçin.", "error");
      return;
    }
    setBulkOnSaleLoading(true);
    try {
      const res = await setOnSaleBulk(ids, isOnSale);
      const total = res?.totalRequested ?? 0;
      const success = res?.successCount ?? 0;
      const fail = res?.failCount ?? 0;
      const results = res?.results ?? [];
      await loadProducts(true);
      setSelectedIds(new Set());
      if (fail > 0) {
        const failMessages = results.filter((r) => !r.success).map((r) => r.message);
        const uniqueReasons = [...new Set(failMessages)];
        showFeedback(
          `${success} ürün ${isOnSale ? "satışa açıldı" : "satıştan kaldırıldı"}, ${fail} ürün güncellenemedi.${uniqueReasons.length ? ` Sebepler: ${uniqueReasons.slice(0, 2).join("; ")}` : ""}`,
          "error"
        );
      } else {
        showFeedback(
          `${success} ürün ${isOnSale ? "satışa açıldı" : "satıştan kaldırıldı"}.`,
          "success"
        );
      }
    } catch (err) {
      const msg = err?.message ?? err?.errors?.[0] ?? "Toplu satış durumu güncellenirken bir hata oluştu.";
      showFeedback(msg, "error");
    } finally {
      setBulkOnSaleLoading(false);
    }
  };

  const handleBulkRemove = async () => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) {
      showFeedback("Lütfen kaldırılacak ürünleri seçin.", "error");
      return;
    }
    if (!window.confirm(`${ids.length} ürünü mağazanızdan kaldırmak istediğinize emin misiniz?`)) {
      return;
    }
    setBulkRemoving(true);
    try {
      const res = await removeProductsFromStore(ids);
      const success = res?.successCount ?? 0;
      const fail = res?.failCount ?? 0;
      await loadProducts(true);
      setSelectedIds(new Set());
      if (fail > 0) {
        showFeedback(`${success} ürün kaldırıldı, ${fail} ürün kaldırılamadı.`, "error");
      } else {
        showFeedback(`${success} ürün mağazanızdan kaldırıldı.`, "success");
      }
    } catch (err) {
      console.error("Toplu kaldırma hatası:", err);
      showFeedback("Ürünler kaldırılırken bir hata oluştu.", "error");
    } finally {
      setBulkRemoving(false);
    }
  };

  const handleBulkPriceUpdate = async () => {
    const { currencyCode, updateMode, amountToAdd, percentageChange, useSelectedProducts } = bulkPriceForm;
    const useFixed = updateMode === "fixed";
    const addVal = parseFloat(amountToAdd);
    const percentVal = parseFloat(percentageChange);

    if (!currencyCode || currencyCode.length !== 3) {
      showFeedback("Lütfen para birimi seçin.", "error");
      return;
    }
    if (useFixed && isNaN(addVal)) {
      showFeedback("Lütfen eklenecek tutarı girin (negatif = indirim).", "error");
      return;
    }
    if (!useFixed && isNaN(percentVal)) {
      showFeedback("Lütfen yüzde değişim girin (örn. 10 veya -5).", "error");
      return;
    }

    setBulkPriceLoading(true);
    setBulkPriceError(null);
    try {
      const body = { currencyCode };
      if (useSelectedProducts && selectedIds.size > 0) {
        body.storeProductIds = Array.from(selectedIds);
      }
      if (useFixed) body.amountToAdd = addVal;
      else body.percentageChange = percentVal;

      const res = await bulkUpdatePrices(body);
      const count = res?.updatedCount ?? 0;
      await loadProducts(true);
      setShowBulkPriceModal(false);
      setBulkPriceForm({ currencyCode: "TRY", updateMode: "percent", amountToAdd: "", percentageChange: "", useSelectedProducts: false });
      setBulkPriceError(null);
      showFeedback(`${count} ürün fiyatı güncellendi.`, "success");
    } catch (err) {
      const msg = err?.errors?.[0] ?? err?.message ?? "Toplu fiyat güncelleme başarısız.";
      setBulkPriceError(msg);
    } finally {
      setBulkPriceLoading(false);
    }
  };

  const handleConvertFromTry = async () => {
    const { targetCurrencyCode, rateTryPerUnitTarget, useSelectedProducts } = convertForm;
    const rate = parseFloat(rateTryPerUnitTarget);

    if (!targetCurrencyCode || targetCurrencyCode.length !== 3) {
      showFeedback("Lütfen hedef para birimi seçin.", "error");
      return;
    }
    if (targetCurrencyCode === "TRY") {
      showFeedback("Hedef para birimi TRY olamaz.", "error");
      return;
    }
    if (isNaN(rate) || rate <= 0) {
      showFeedback("Kur değeri 0'dan büyük olmalıdır (1 hedef birim = X TRY).", "error");
      return;
    }

    setConvertLoading(true);
    setConvertError(null);
    try {
      const body = { targetCurrencyCode, rateTryPerUnitTarget: rate };
      if (useSelectedProducts && selectedIds.size > 0) {
        body.storeProductIds = Array.from(selectedIds);
      }

      const res = await convertFromTry(body);
      const count = res?.processedCount ?? 0;
      await loadProducts(true);
      setShowConvertModal(false);
      setConvertForm({ targetCurrencyCode: "EUR", rateTryPerUnitTarget: "", useSelectedProducts: false });
      setConvertError(null);
      showFeedback(`${count} ürün TRY'den ${targetCurrencyCode}'ye çevrildi.`, "success");
    } catch (err) {
      setConvertError(err?.message ?? "Kur çevirimi başarısız.");
    } finally {
      setConvertLoading(false);
    }
  };

  // Body scroll lock + Escape to close modals
  useEffect(() => {
    if (showBulkPriceModal || showConvertModal) {
      document.body.style.overflow = "hidden";
      const onEscape = (e) => {
        if (e.key === "Escape") {
          if (showBulkPriceModal && !bulkPriceLoading) {
            setShowBulkPriceModal(false);
            setBulkPriceError(null);
          }
          if (showConvertModal && !convertLoading) {
            setShowConvertModal(false);
            setConvertError(null);
          }
        }
      };
      window.addEventListener("keydown", onEscape);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", onEscape);
      };
    }
    document.body.style.overflow = "";
    return undefined;
  }, [showBulkPriceModal, showConvertModal, bulkPriceLoading, convertLoading]);

  const handleProductIdMissing = (product) => {
    setProductsWithoutProductId((prev) => {
      const exists = prev.some((p) => (p.id ?? p.storeProductId) === (product.id ?? product.storeProductId));
      if (exists) return prev;
      return [...prev, product];
    });
    showFeedback(
      `"${product.name}" ürününde productId bilgisi bulunamadı. API'de bu alanın dönmesi gerekiyor.`,
      "error"
    );
  };

  useEffect(() => {
    checkCoverage();
    loadProducts();
  }, []);

  // Filtreleme
  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return products;
    const term = searchTerm.toLowerCase();
    return products.filter((prod) =>
      prod.name?.toLowerCase().includes(term) ||
      prod.brand?.toLowerCase().includes(term) ||
      prod.categoryName?.toLowerCase().includes(term) ||
      prod.ean?.toLowerCase().includes(term) ||
      prod.sku?.toLowerCase().includes(term) ||
      prod.barcode?.toLowerCase().includes(term)
    );
  }, [products, searchTerm]);

  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = filteredProducts.slice(start, start + ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Hero Header Section */}
      <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 text-white shadow-xl relative overflow-hidden">
        {/* Dekoratif arka plan */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
        <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl hidden sm:block"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg flex-shrink-0">
                <ShoppingBag size={24} className="sm:w-8 sm:h-8 animate-pulse" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold mb-1 flex items-center gap-2">
                  <span className="truncate">Mağaza Ürünlerim</span>
                  <Sparkles size={20} className="sm:w-6 sm:h-6 text-yellow-300 flex-shrink-0" />
                </h1>
                <p className="text-emerald-100 text-xs sm:text-sm">
                  Tüm ürünlerinizi buradan yönetin ve düzenleyin
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
              {!loading && (
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-2 sm:py-3 flex-1 sm:flex-none">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Package size={20} className="sm:w-6 sm:h-6" />
                    <div>
                      <div className="text-xs text-emerald-100">Toplam Ürün</div>
                      <div className="text-xl sm:text-2xl font-bold">{products.length}</div>
                    </div>
                  </div>
                </div>
              )}
              <button
                onClick={handleRefresh}
                disabled={loading || refreshing}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-2 sm:py-3 text-white font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg hover:shadow-xl text-sm sm:text-base"
                title="Ürünleri yenile"
              >
                <RefreshCw 
                  size={18} 
                  className={`sm:w-5 sm:h-5 ${refreshing ? "animate-spin" : ""}`}
                />
                <span className="hidden sm:inline">Yenile</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Stats Cards */}
        {!loading && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
            {/* Aktif Ürünler */}
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 border-2 border-emerald-200 shadow-lg hover:shadow-xl transition-all">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-emerald-700 mb-1">Satışta</p>
                  <p className="text-2xl sm:text-3xl font-bold text-emerald-800">
                    {products.filter(p => p.isOnSale).length}
                  </p>
                </div>
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white shadow-lg flex-shrink-0">
                  <TrendingUp size={24} className="sm:w-7 sm:h-7" />
                </div>
              </div>
            </div>

            {/* Pasif Ürünler */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 border-2 border-amber-200 shadow-lg hover:shadow-xl transition-all">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-amber-700 mb-1">Pasif</p>
                  <p className="text-2xl sm:text-3xl font-bold text-amber-800">
                    {products.filter(p => !p.isOnSale).length}
                  </p>
                </div>
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg flex-shrink-0">
                  <AlertCircle size={24} className="sm:w-7 sm:h-7" />
                </div>
              </div>
            </div>

            {/* Toplam */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 border-2 border-blue-200 shadow-lg hover:shadow-xl transition-all">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-blue-700 mb-1">Toplam Ürün</p>
                  <p className="text-2xl sm:text-3xl font-bold text-blue-800">{products.length}</p>
                </div>
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white shadow-lg flex-shrink-0">
                  <Package size={24} className="sm:w-7 sm:h-7" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search Bar */}
        {!loading && products.length > 0 && (
          <div className="mb-6 bg-white rounded-2xl shadow-lg p-5 border-2 border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Ürün, marka, kategori, barkod ara..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-300 text-gray-800"
                />
              </div>
              <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border-2 border-emerald-200">
                <ListFilter className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-bold text-emerald-800 whitespace-nowrap">
                  {filteredProducts.length} ürün bulundu
                </span>
              </div>
            </div>
          </div>
        )}

        {/* productId Eksik Ürünler Raporu */}
        {productsWithoutProductId.length > 0 && (
          <div className="mb-6 px-6 py-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-800 shadow-lg">
            <h3 className="font-bold mb-2 flex items-center gap-2">
              <AlertCircle size={20} />
              productId Eksik Ürünler Raporu
            </h3>
            <p className="text-sm mb-3">
              Aşağıdaki ürünlerde <strong>productId</strong> bilgisi bulunmuyor. Düzenleme talebi göndermek için API&apos;de bu alanın dönmesi gerekiyor.
            </p>
            <ul className="text-sm space-y-1 list-disc list-inside">
              {productsWithoutProductId.map((p) => (
                <li key={p.id ?? p.storeProductId ?? p.name}>
                  {p.name} {p.sku ? `(SKU: ${p.sku})` : ""}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Geri Bildirim */}
        {feedback && (
          <div
            className={`flex items-start gap-3 mb-6 px-6 py-4 rounded-2xl text-sm font-medium shadow-xl border-2 animate-[slideDown_0.3s_ease-out] ${
              feedback.type === "success"
                ? "bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-300 text-emerald-800"
                : "bg-gradient-to-r from-red-50 to-rose-50 border-red-300 text-red-800"
            }`}
          >
            {feedback.type === "success" ? (
              <CheckCircle size={20} className="mt-0.5 flex-shrink-0" />
            ) : (
              <XCircle size={20} className="mt-0.5 flex-shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* Toplu İşlem Bar */}
        {!loading && filteredProducts.length > 0 && (
          <div className="mb-6 bg-white rounded-2xl shadow-lg p-4 sm:p-5 border-2 border-gray-200">
            <div className="flex flex-col gap-4">
              {/* Seçim kontrolleri */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm font-semibold text-gray-700">
                  Toplu İşlem
                </span>
                <button
                  type="button"
                  onClick={handleSelectAllOnPage}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium transition-all"
                >
                  <CheckSquare size={16} />
                  Bu sayfadaki tümünü seç
                </button>
                <button
                  type="button"
                  onClick={handleDeselectAll}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium transition-all"
                >
                  <Square size={16} />
                  Seçimi temizle
                </button>
                {selectedIds.size > 0 && (
                  <span className="px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 text-sm font-bold">
                    {selectedIds.size} ürün seçili
                  </span>
                )}
              </div>
              {/* Aksiyon butonları */}
              <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-gray-100">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide mr-1">Satış durumu:</span>
                <button
                  type="button"
                  onClick={() => handleBulkSetOnSale(true)}
                  disabled={bulkOnSaleLoading || selectedIds.size === 0}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-sm font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Seçili ürünleri satışa açar"
                >
                  {bulkOnSaleLoading ? (
                    <TedarikaLoader variant="micro" light className="h-4 w-4" label="İşleniyor" />
                  ) : (
                    <TrendingUp size={18} />
                  )}
                  {bulkOnSaleLoading ? "İşleniyor..." : "Seçilenleri satışa aç"}
                </button>
                <button
                  type="button"
                  onClick={() => handleBulkSetOnSale(false)}
                  disabled={bulkOnSaleLoading || selectedIds.size === 0}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-sm font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Seçili ürünleri satıştan kaldırır"
                >
                  <AlertCircle size={18} />
                  Seçilenleri satıştan kaldır
                </button>
                <button
                  type="button"
                  onClick={() => { setShowBulkPriceModal(true); setBulkPriceError(null); }}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-sm font-bold shadow-lg hover:shadow-xl transition-all"
                >
                  <DollarSign size={18} />
                  Toplu Fiyat Güncelle
                </button>
                <button
                  type="button"
                  onClick={() => { setShowConvertModal(true); setConvertError(null); }}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-bold shadow-lg hover:shadow-xl transition-all"
                >
                  <ArrowRightLeft size={18} />
                  TRY'den Kur Çevir
                </button>
                <button
                  type="button"
                  onClick={handleBulkRemove}
                  disabled={bulkRemoving || selectedIds.size === 0}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white text-sm font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 size={18} />
                  {bulkRemoving ? "Kaldırılıyor..." : "Mağazadan Kaldır"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tablo Container */}
        <div className="bg-white rounded-3xl shadow-2xl border-2 border-gray-200 overflow-hidden">
          {loading ? (
            <div className="text-center py-20">
              <TedarikaLoader variant="compact" label="Ürünler yükleniyor..." />
              <p className="text-gray-400 text-sm mt-2">Lütfen bekleyin</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 mb-6 shadow-lg">
                <ShoppingBag size={48} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">
                Henüz Ürün Bulunmuyor
              </h3>
              <p className="text-gray-500 text-sm mb-6">
                Mağazanıza ürün ekleyerek satışa başlayabilirsiniz
              </p>
              <button 
                onClick={() => navigate("/seller/products/database")}
                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Ürün Ekle
              </button>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 mb-6 shadow-lg">
                <Search size={48} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">
                Ürün Bulunamadı
              </h3>
              <p className="text-gray-500 text-sm mb-6">
                Aradığınız kriterlere uygun ürün bulunamadı.
              </p>
              <button 
                onClick={() => setSearchTerm("")}
                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Aramayı Temizle
              </button>
            </div>
          ) : (
            <MyStoreProductTable
              products={currentItems}
              startIndex={(currentPage - 1) * ITEMS_PER_PAGE}
              onManage={setSelectedProduct}
              onProductIdMissing={handleProductIdMissing}
              selectedIds={selectedIds}
              onSelectionChange={handleSelectionChange}
              getStoreProductId={getStoreProductId}
              onRefresh={() => loadProducts(true)}
              onFeedback={showFeedback}
              hasCoverage={hasCoverage}
            />
          )}
        </div>

        {/* Sayfalama */}
        {!loading && filteredProducts.length > ITEMS_PER_PAGE && (
          <div className="mt-8 flex justify-center">
            <Pagination
              total={filteredProducts.length}
              current={currentPage}
              perPage={ITEMS_PER_PAGE}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      {/* Toplu Fiyat Güncelleme Modal - createPortal ile body'ye render, blur + scroll fix */}
      {showBulkPriceModal && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto" style={{ position: "fixed" }}>
          <div
            className="fixed inset-0 bg-black/70 modal-backdrop-blur"
            onClick={() => !bulkPriceLoading && (setShowBulkPriceModal(false), setBulkPriceError(null))}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-md my-8 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-[modalSlideIn_0.3s_ease-out] flex flex-col max-h-[calc(100vh-4rem)]">
            <div className="flex-shrink-0 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign size={22} />
                <h3 className="text-base font-bold">Toplu Fiyat Güncelle</h3>
              </div>
              <button type="button" onClick={() => !bulkPriceLoading && (setShowBulkPriceModal(false), setBulkPriceError(null))} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {bulkPriceError && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm">
                  <XCircle size={18} className="flex-shrink-0 mt-0.5" />
                  <span>{bulkPriceError}</span>
                </div>
              )}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Para Birimi</label>
                <select
                  value={bulkPriceForm.currencyCode}
                  onChange={(e) => setBulkPriceForm((f) => ({ ...f, currencyCode: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                >
                  {CURRENCY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Güncelleme Tipi</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="updateMode" checked={bulkPriceForm.updateMode === "percent"} onChange={() => setBulkPriceForm((f) => ({ ...f, updateMode: "percent" }))} className="text-amber-600" />
                    <span className="text-sm">Yüzde Değişim</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="updateMode" checked={bulkPriceForm.updateMode === "fixed"} onChange={() => setBulkPriceForm((f) => ({ ...f, updateMode: "fixed" }))} className="text-amber-600" />
                    <span className="text-sm">Sabit Tutar Ekle/Çıkar</span>
                  </label>
                </div>
              </div>
              {bulkPriceForm.updateMode === "percent" ? (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Yüzde (%10 artış, -5 indirim)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="örn. 10 veya -5"
                    value={bulkPriceForm.percentageChange}
                    onChange={(e) => setBulkPriceForm((f) => ({ ...f, percentageChange: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Eklenecek tutar (negatif = indirim, örn. 100₺+30₺=130₺)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="örn. 30 veya -10"
                    value={bulkPriceForm.amountToAdd}
                    onChange={(e) => setBulkPriceForm((f) => ({ ...f, amountToAdd: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                  />
                </div>
              )}
              {selectedIds.size > 0 && (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bulkPriceForm.useSelectedProducts}
                    onChange={(e) => setBulkPriceForm((f) => ({ ...f, useSelectedProducts: e.target.checked }))}
                    className="rounded text-amber-600"
                  />
                  <span className="text-sm text-gray-700">Sadece seçili {selectedIds.size} ürünü güncelle</span>
                </label>
              )}
            </div>
            <div className="flex-shrink-0 px-5 pb-5 pt-2 flex gap-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => !bulkPriceLoading && (setShowBulkPriceModal(false), setBulkPriceError(null))}
                className="flex-1 px-4 py-2.5 rounded-xl border-2 border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                İptal
              </button>
              <button
                type="button"
                onClick={handleBulkPriceUpdate}
                disabled={bulkPriceLoading}
                className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 transition-colors"
              >
                {bulkPriceLoading ? (
                  <span className="inline-flex items-center justify-center gap-2">
                    <TedarikaLoader variant="micro" light className="h-5 w-5" label="Güncelleniyor" />
                    Güncelleniyor...
                  </span>
                ) : (
                  "Güncelle"
                )}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* TRY'den Kur Çevir Modal - createPortal ile body'ye render */}
      {showConvertModal && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto" style={{ position: "fixed" }}>
          <div
            className="fixed inset-0 bg-black/70 modal-backdrop-blur"
            onClick={() => !convertLoading && (setShowConvertModal(false), setConvertError(null))}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-md my-8 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-[modalSlideIn_0.3s_ease-out] flex flex-col max-h-[calc(100vh-4rem)]">
            <div className="flex-shrink-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ArrowRightLeft size={22} />
                <h3 className="text-base font-bold">TRY&apos;den Kur Çevir</h3>
              </div>
              <button type="button" onClick={() => !convertLoading && (setShowConvertModal(false), setConvertError(null))} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {convertError && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm">
                  <XCircle size={18} className="flex-shrink-0 mt-0.5" />
                  <span>{convertError}</span>
                </div>
              )}
              <p className="text-sm text-gray-600">
                TRY fiyatlarınız, belirttiğiniz kura göre hedef para birimine çevrilir. Örn: 1 EUR = 35 TRY
              </p>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Hedef Para Birimi</label>
                <select
                  value={convertForm.targetCurrencyCode}
                  onChange={(e) => setConvertForm((f) => ({ ...f, targetCurrencyCode: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  {CURRENCY_OPTIONS.filter((o) => o.value !== "TRY").map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Kur (1 {convertForm.targetCurrencyCode} = ? TRY)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="örn. 35"
                  value={convertForm.rateTryPerUnitTarget}
                  onChange={(e) => setConvertForm((f) => ({ ...f, rateTryPerUnitTarget: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
              {selectedIds.size > 0 && (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={convertForm.useSelectedProducts}
                    onChange={(e) => setConvertForm((f) => ({ ...f, useSelectedProducts: e.target.checked }))}
                    className="rounded text-blue-600"
                  />
                  <span className="text-sm text-gray-700">Sadece seçili {selectedIds.size} ürünü çevir</span>
                </label>
              )}
            </div>
            <div className="flex-shrink-0 px-5 pb-5 pt-2 flex gap-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => !convertLoading && (setShowConvertModal(false), setConvertError(null))}
                className="flex-1 px-4 py-2.5 rounded-xl border-2 border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                İptal
              </button>
              <button
                type="button"
                onClick={handleConvertFromTry}
                disabled={convertLoading}
                className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 transition-colors"
              >
                {convertLoading ? (
                  <span className="inline-flex items-center justify-center gap-2">
                    <TedarikaLoader variant="micro" light className="h-5 w-5" label="Çevriliyor" />
                    Çevriliyor...
                  </span>
                ) : (
                  "Çevir"
                )}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Ürün Yönetimi Paneli */}
      {selectedProduct && (
        <ProductManagementPanel
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onFeedback={showFeedback}
          onRefresh={() => loadProducts(true)}
          hasCoverage={hasCoverage}
        />
      )}

      <style>{`
        @keyframes slideDown {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slideIn {
          from { transform: scale(0.95) translateY(-20px); opacity: 0; }
          to { transform: scale(1) translateY(0); opacity: 1; }
        }
        @keyframes modalSlideIn {
          from { transform: scale(0.96) translateY(-12px); opacity: 0; }
          to { transform: scale(1) translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default MyStoreProductsPage;
