import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  addProductToStore,
} from "@/api/sellerStoreService";
import { useProductCache } from "@/contexts/ProductCacheContext";
import ProductDatabaseTable from "@/components/storeProducts/ProductDatabaseTable";
import ProductRequestForm from "@/components/storeProducts/ProductRequestForm";
import Pagination from "@/components/ui/Pagination";
import { 
  Search,
  Tag,
  ShoppingCart,
  List,
  ArrowRight,
} from "lucide-react";

const ITEMS_PER_PAGE = 10;

const ProductDatabasePage = () => {
  const navigate = useNavigate();
  const { getProductDatabase, getMyStoreProducts } = useProductCache();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [addedProductNames, setAddedProductNames] = useState([]);
  const [addingId, setAddingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchType, setSearchType] = useState("single"); // "single" or "bulk"

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

  const handleSearch = () => {
    // Arama işlemi zaten searchTerm state'i ile otomatik yapılıyor
    setCurrentPage(1);
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

  return (
    <div className="min-h-screen bg-[#F8F8F8] px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero/Search Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-3">
                Ürün girmek ve satışa açmak çok kolay!
              </h1>
              <p className="text-gray-700 text-base mb-6">
                Hepsiburada kataloğunda ürünleri arayıp satışa açabilir, ürününüz katalogda yok ise "Ürün Ekle" butonu ile yeni ürün girebilirsiniz.
              </p>

              {/* Radio Buttons */}
              <div className="flex items-center gap-6 mb-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="searchType"
                    value="single"
                    checked={searchType === "single"}
                    onChange={(e) => setSearchType(e.target.value)}
                    className="w-4 h-4 text-orange-500 focus:ring-orange-500"
                  />
                  <span className="text-gray-700 font-medium">Ürün Ara</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer relative">
                  <input
                    type="radio"
                    name="searchType"
                    value="bulk"
                    checked={searchType === "bulk"}
                    onChange={(e) => setSearchType(e.target.value)}
                    className="w-4 h-4 text-orange-500 focus:ring-orange-500"
                  />
                  <span className="text-gray-700 font-medium">Toplu Ürün Ara</span>
                  <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded ml-2">
                    Yeni
                  </span>
                </label>
              </div>

              {/* Search Input and Button */}
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Ürün numarasını, barkodunu veya ürün adını ara"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleSearch();
                      }
                    }}
                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all text-gray-800"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-lg transition-colors shadow-md hover:shadow-lg"
                >
                  Ara
                </button>
              </div>
            </div>

            {/* Illustration */}
            <div className="hidden lg:block flex-shrink-0 ml-8">
              <RunningPersonIllustration />
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <ActionCard
            icon={Tag}
            title="Kendi ürününüzü ekleyin"
            description="Hepsiburada kataloğunda bulunmayan ürününüzü ekleyin."
            linkText="Ürün ekle"
            onClick={() => setShowForm(true)}
            iconColor="text-purple-500"
          />
          <ActionCard
            icon={ShoppingCart}
            title="Kendi ürününüzü toplu ekleyin"
            description="Hepsiburada kataloğunda bulunmayan ürünlerinizi toplu bir şekilde ekleyin."
            linkText="Toplu ürün ekle"
            onClick={() => navigate("/seller/products/draft/upload")}
            iconColor="text-purple-500"
          />
          <ActionCard
            icon={List}
            title="Çok sayıda ürünü arayın"
            description="Hepsiburada kataloğundan birden fazla ürünü toplu olarak arayın."
            linkText="Toplu ürün ara"
            onClick={() => {
              setSearchType("bulk");
              // Toplu arama için özel bir sayfa veya modal açılabilir
            }}
            iconColor="text-purple-500"
          />
        </div>

        {/* Product Request Form Modal */}
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

        {/* Products Table */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-lg">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-xl animate-pulse mb-4">
              <Search className="w-8 h-8 text-white" />
            </div>
            <p className="text-gray-500 text-lg font-medium">Ürünler yükleniyor...</p>
          </div>
        ) : filteredProducts.length === 0 && searchTerm ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-200">
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Ürün Bulunamadı</h3>
            <p className="text-gray-600">
              Aradığınız kriterlere uygun ürün bulunamadı.
            </p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <>
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
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
        ) : null}
      </div>
    </div>
  );
};

// Action Card Component
const ActionCard = ({ icon: Icon, title, description, linkText, onClick, iconColor }) => (
  <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
    <div className="flex flex-col items-start">
      <div className={`w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center mb-4 ${iconColor}`}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm mb-4">{description}</p>
      <button
        onClick={onClick}
        className="text-orange-500 font-semibold hover:text-orange-600 transition-colors flex items-center gap-1 group"
      >
        {linkText}
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  </div>
);

// Running Person Illustration Component
const RunningPersonIllustration = () => (
  <svg
    width="200"
    height="200"
    viewBox="0 0 200 200"
    className="text-gray-400"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Cloud shapes */}
    <ellipse cx="50" cy="40" rx="25" ry="15" fill="#E5E7EB" opacity="0.6" />
    <ellipse cx="80" cy="35" rx="20" ry="12" fill="#E5E7EB" opacity="0.6" />
    <ellipse cx="30" cy="50" rx="18" ry="10" fill="#E5E7EB" opacity="0.6" />
    
    {/* Ground line */}
    <path
      d="M 10 180 Q 50 175, 100 180 T 190 180"
      stroke="#E5E7EB"
      strokeWidth="2"
      fill="none"
    />
    
    {/* Running person */}
    {/* Head */}
    <circle cx="100" cy="100" r="12" fill="#4B5563" />
    
    {/* Hair */}
    <path
      d="M 88 95 Q 85 85, 90 80 Q 95 75, 100 80 Q 105 75, 110 80 Q 115 85, 112 95"
      fill="#374151"
    />
    
    {/* Body */}
    <ellipse cx="100" cy="125" rx="8" ry="20" fill="#6B7280" />
    
    {/* Arms */}
    <path
      d="M 92 115 Q 85 110, 88 120"
      stroke="#6B7280"
      strokeWidth="3"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M 108 115 Q 115 110, 112 120"
      stroke="#6B7280"
      strokeWidth="3"
      fill="none"
      strokeLinecap="round"
    />
    
    {/* Legs */}
    <path
      d="M 95 145 L 95 165 L 90 170"
      stroke="#6B7280"
      strokeWidth="4"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M 105 145 L 105 165 L 110 170"
      stroke="#6B7280"
      strokeWidth="4"
      fill="none"
      strokeLinecap="round"
    />
    
    {/* Shoes */}
    <ellipse cx="90" cy="170" rx="5" ry="3" fill="#F97316" />
    <ellipse cx="110" cy="170" rx="5" ry="3" fill="#F97316" />
    
    {/* Belt */}
    <rect x="92" y="130" width="16" height="4" fill="#F97316" />
  </svg>
);

export default ProductDatabasePage;
