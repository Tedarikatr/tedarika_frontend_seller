import React, { useEffect, useState } from "react";
import {
  fetchProductDatabase,
  addProductToStore,
  fetchMyStoreProducts,
} from "@/api/sellerStoreService";
import ProductDatabaseTable from "@/components/storeProducts/ProductDatabaseTable";
import ProductRequestForm from "@/components/storeProducts/ProductRequestForm";
import Pagination from "@/components/ui/Pagination";
import { PlusCircle } from "lucide-react";

const ITEMS_PER_PAGE = 10;

const ProductDatabasePage = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [addedProductIds, setAddedProductIds] = useState([]);
  const [addingId, setAddingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const [allProducts, myProducts] = await Promise.all([
        fetchProductDatabase(),
        fetchMyStoreProducts(),
      ]);
      setProducts(allProducts);
      setAddedProductIds(myProducts.map((p) => p.id));
    } catch (err) {
      console.error("Ürünler alınamadı:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (productId) => {
    setAddingId(productId);
    try {
      if (addedProductIds.includes(productId)) {
        alert("Bu ürün zaten mağazanızda mevcut.");
        return;
      }
      await addProductToStore(productId);
      setAddedProductIds((prev) => [...prev, productId]);
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
      prod.name.toLowerCase().includes(term) ||
      prod.brand.toLowerCase().includes(term) ||
      prod.categoryName.toLowerCase().includes(term) ||
      prod.barcode?.toLowerCase().includes(term)
    );
  });

  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const visibleProducts = filteredProducts.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      {/* Üst Alan */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Ürün Veritabanı</h1>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="Ürün, marka, kategori, barkod ara..."
            className="border border-gray-300 px-4 py-2 rounded-md text-sm w-full sm:w-72 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white transition"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap">
              {filteredProducts.length} ürün bulundu
            </span>
            <button
              onClick={() => setShowForm(true)}
              className="bg-emerald-600 text-white px-3 py-2 rounded text-sm hover:bg-emerald-700 flex items-center gap-1"
            >
              <PlusCircle size={16} />
              <span className="hidden sm:inline">Yeni Başvuru</span>
            </button>
          </div>
        </div>
      </div>

      {/* Başvuru Formu */}
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

      {/* İçerik */}
      {loading ? (
        <div className="py-10 text-center text-gray-600 text-sm">Ürünler yükleniyor, lütfen bekleyin...</div>
      ) : filteredProducts.length === 0 ? (
        <div className="py-10 text-center text-gray-500">Aradığınız kriterlere uygun ürün bulunamadı.</div>
      ) : (
        <>
          <div className="overflow-x-auto border border-gray-200 rounded-xl shadow bg-white">
            <ProductDatabaseTable
              products={visibleProducts}
              onAdd={handleAddProduct}
              addingId={addingId}
              addedIds={addedProductIds}
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
  );
};

export default ProductDatabasePage;
