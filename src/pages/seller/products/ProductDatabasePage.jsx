import React, { useEffect, useState, useMemo } from "react";
import {
  addProductToStore,
} from "@/api/sellerStoreService";
import { useProductCache } from "@/contexts/ProductCacheContext";
import ProductDatabaseTable from "@/components/storeProducts/ProductDatabaseTable";
import ProductRequestForm from "@/components/storeProducts/ProductRequestForm";
import Pagination from "@/components/ui/Pagination";
import { 
  Database, 
  Search, 
  Package, 
  Sparkles, 
  TrendingUp,
  CheckCircle,
  ListFilter,
  RefreshCw
} from "lucide-react";

const ITEMS_PER_PAGE = 10;

const ProductDatabasePage = () => {
  const { getProductDatabase, getMyStoreProducts } = useProductCache();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [addedProductNames, setAddedProductNames] = useState([]);
  const [addingId, setAddingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const loadProducts = async (forceRefresh = false) => {
    const isLoadingState = forceRefresh ? setRefreshing : setLoading;
    isLoadingState(true);
    try {
      const [allProducts, myStoreProducts] = await Promise.all([
        getProductDatabase(forceRefresh),
        getMyStoreProducts(forceRefresh),
      ]);

      setProducts(allProducts || []);

      const addedNames = (myStoreProducts || []).map((p) =>
        p.name?.trim().toLowerCase()
      );
      setAddedProductNames(addedNames);
    } catch (err) {
      console.error("Ürünler alınamadı:", err.response?.data || err.message);
    } finally {
      isLoadingState(false);
    }
  };

  const handleRefresh = async () => {
    await loadProducts(true);
  };

  const handleAddProduct = async (productId, productName) => {
    const nameKey = productName?.trim().toLowerCase();
    if (addedProductNames.includes(nameKey)) {
      alert("Bu ürün zaten mağazanızda mevcut.");
      return;
    }

    setAddingId(productId);
    try {
      await addProductToStore(productId);
      setAddedProductNames((prev) => [...prev, nameKey]);
    } catch (err) {
      alert("Ürün eklenemedi: " + (err?.response?.data?.error || err.message));
    } finally {
      setAddingId(null);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const filteredProducts = products.filter((prod) => {
    const term = searchTerm.toLowerCase();
    return (
      prod.name?.toLowerCase().includes(term) ||
      prod.brand?.toLowerCase().includes(term) ||
      prod.categoryName?.toLowerCase().includes(term) ||
      prod.ean?.toLowerCase().includes(term) ||
      prod.sku?.toLowerCase().includes(term) ||
      prod.barcode?.toLowerCase().includes(term)
    );
  });

  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const visibleProducts = filteredProducts.slice(
    startIdx,
    startIdx + ITEMS_PER_PAGE
  );

  // Calculate stats
  const stats = useMemo(() => {
    const total = products.length;
    const added = addedProductNames.length;
    const available = total - added;
    
    return { total, added, available };
  }, [products.length, addedProductNames.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50/30 px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Header */}
        <header className="mb-8 relative bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 rounded-3xl shadow-2xl px-8 py-12 text-center overflow-hidden">
          {/* Dekoratif Arka Plan */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
          <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-40 h-40 bg-emerald-400/20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
              <div className="flex items-center justify-center gap-3 mx-auto sm:mx-0">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-xl animate-pulse">
                  <Database className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-5xl font-extrabold text-white tracking-tight">
                  Ürün Veritabanı
                </h1>
                <Sparkles className="w-8 h-8 text-yellow-300 animate-pulse" />
              </div>
              <button
                onClick={handleRefresh}
                disabled={loading || refreshing}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 rounded-2xl px-6 py-3 text-white font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg hover:shadow-xl mx-auto sm:mx-0"
                title="Ürünleri yenile"
              >
                <RefreshCw 
                  size={20} 
                  className={refreshing ? "animate-spin" : ""} 
                />
                <span className="hidden sm:inline">Yenile</span>
              </button>
            </div>
            <p className="text-emerald-100 text-lg font-medium">
              Binlerce ürün arasından seçim yapın ve mağazanıza ekleyin
            </p>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={Database}
            label="Toplam Ürün"
            value={stats.total}
            gradient="from-blue-500 to-indigo-500"
            bgGradient="from-blue-50 to-indigo-50"
          />
          <StatCard
            icon={CheckCircle}
            label="Mağazamda"
            value={stats.added}
            gradient="from-green-500 to-emerald-500"
            bgGradient="from-green-50 to-emerald-50"
          />
          <StatCard
            icon={Package}
            label="Eklenebilir"
            value={stats.available}
            gradient="from-purple-500 to-pink-500"
            bgGradient="from-purple-50 to-pink-50"
          />
        </div>

        {/* Search Bar */}
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

        {showForm && (
          <div className="mb-6">
            <ProductRequestForm
              onSuccess={() => {
                alert("Başvurunuz başarıyla gönderildi.");
                setShowForm(false);
              }}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-lg">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-xl animate-pulse mb-4">
              <Database className="w-8 h-8 text-white" />
            </div>
            <p className="text-gray-500 text-lg font-medium">Ürünler yükleniyor...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-lg p-12 text-center border-2 border-gray-200">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Package className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Ürün Bulunamadı</h3>
            <p className="text-gray-600">
              Aradığınız kriterlere uygun ürün bulunamadı.
            </p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-gray-200">
              <ProductDatabaseTable
                products={visibleProducts}
                startIndex={startIdx}
                onAdd={(id) => {
                  const prod = products.find((p) => String(p.id) === String(id));
                  handleAddProduct(id, prod?.name);
                }}
                addingId={addingId}
                addedIds={products
                  .filter((p) =>
                    addedProductNames.includes(p.name?.trim().toLowerCase())
                  )
                  .map((p) => String(p.id))}
              />
            </div>
            {filteredProducts.length > ITEMS_PER_PAGE && (
              <div className="mt-6 flex justify-center">
                <Pagination
                  total={filteredProducts.length}
                  current={currentPage}
                  perPage={ITEMS_PER_PAGE}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ icon: Icon, label, value, gradient, bgGradient }) => (
  <div className={`bg-gradient-to-br ${bgGradient} rounded-2xl p-6 border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-600 text-sm font-semibold mb-2">{label}</p>
        <p className="text-4xl font-extrabold text-gray-900">{value}</p>
      </div>
      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
        <Icon className="w-7 h-7 text-white" />
      </div>
    </div>
  </div>
);

export default ProductDatabasePage;
