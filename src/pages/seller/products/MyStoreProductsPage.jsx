// =============================
// MyStoreProductsPage.jsx - Ultra Modern & Beautiful 🎨
// =============================
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchMyStoreProducts,
  getStoreCoverage,
} from "@/api/sellerStoreService";
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
  AlertCircle
} from "lucide-react";

const ITEMS_PER_PAGE = 10;

const MyStoreProductsPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasCoverage, setHasCoverage] = useState(true);

  // Panel state
  const [selectedProduct, setSelectedProduct] = useState(null);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await fetchMyStoreProducts();
      setProducts(data || []);
    } catch (error) {
      console.error("Ürünler alınamadı:", error);
    } finally {
      setLoading(false);
    }
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

  useEffect(() => {
    checkCoverage();
    loadProducts();
  }, []);

  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = products.slice(start, start + ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Hero Header Section */}
      <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                <ShoppingBag size={32} className="animate-pulse" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-1 flex items-center gap-2">
                  Mağaza Ürünlerim
                  <Sparkles size={24} className="text-yellow-300" />
                </h1>
                <p className="text-emerald-100 text-sm">
                  Tüm ürünlerinizi buradan yönetin ve düzenleyin
                </p>
              </div>
            </div>
            
            {!loading && (
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-3">
                <div className="flex items-center gap-3">
                  <Package size={24} />
                  <div>
                    <div className="text-xs text-emerald-100">Toplam Ürün</div>
                    <div className="text-2xl font-bold">{products.length}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        {!loading && products.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {/* Aktif Ürünler */}
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-5 border-2 border-emerald-200 shadow-lg hover:shadow-xl transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-emerald-700 mb-1">Satışta</p>
                  <p className="text-3xl font-bold text-emerald-800">
                    {products.filter(p => p.isOnSale).length}
                  </p>
                </div>
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white shadow-lg">
                  <TrendingUp size={28} />
                </div>
              </div>
            </div>

            {/* Pasif Ürünler */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 border-2 border-amber-200 shadow-lg hover:shadow-xl transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-amber-700 mb-1">Pasif</p>
                  <p className="text-3xl font-bold text-amber-800">
                    {products.filter(p => !p.isOnSale).length}
                  </p>
                </div>
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg">
                  <AlertCircle size={28} />
                </div>
              </div>
            </div>

            {/* Toplam */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-5 border-2 border-blue-200 shadow-lg hover:shadow-xl transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-blue-700 mb-1">Toplam Ürün</p>
                  <p className="text-3xl font-bold text-blue-800">{products.length}</p>
                </div>
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white shadow-lg">
                  <Package size={28} />
                </div>
              </div>
            </div>
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

        {/* Tablo Container */}
        <div className="bg-white rounded-3xl shadow-2xl border-2 border-gray-200 overflow-hidden">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 mb-4 animate-pulse shadow-xl">
                <Package size={40} className="text-white" />
              </div>
              <p className="text-gray-600 font-medium text-lg">Ürünler yükleniyor...</p>
              <p className="text-gray-400 text-sm mt-1">Lütfen bekleyin</p>
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
          ) : (
            <MyStoreProductTable
              products={currentItems}
              onManage={setSelectedProduct}
            />
          )}
        </div>

        {/* Sayfalama */}
        {!loading && products.length > ITEMS_PER_PAGE && (
          <div className="mt-8 flex justify-center">
            <Pagination
              total={products.length}
              current={currentPage}
              perPage={ITEMS_PER_PAGE}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      {/* Ürün Yönetimi Paneli */}
      {selectedProduct && (
        <ProductManagementPanel
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onFeedback={showFeedback}
          onRefresh={loadProducts}
          hasCoverage={hasCoverage}
        />
      )}

      <style>{`
        @keyframes slideDown {
          from { 
            transform: translateY(-20px); 
            opacity: 0; 
          }
          to { 
            transform: translateY(0); 
            opacity: 1; 
          }
        }
      `}</style>
    </div>
  );
};

export default MyStoreProductsPage;
