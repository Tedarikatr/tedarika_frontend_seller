import React, { useEffect, useState } from "react";
import {
  fetchMyStoreProducts,
  getStoreCoverage,
} from "@/api/sellerStoreService";
import MyStoreProductTable from "@/components/storeProducts/MyStoreProductTable";
import Pagination from "@/components/ui/Pagination";
import { CheckCircle, XCircle } from "lucide-react";

const ITEMS_PER_PAGE = 10;

const MyStoreProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasCoverage, setHasCoverage] = useState(true);

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
      const hasAny = coverage?.some(
        (c) => (c.regions?.length ?? 0) > 0 || (c.countries?.length ?? 0) > 0
      );
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
    <div className="p-6 bg-[#f9f9f9] min-h-screen">
      {/* Sayfa Başlığı */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
        <h1 className="text-3xl font-extrabold text-gray-800">Mağaza Ürünlerim</h1>
        {!loading && (
          <span className="text-sm text-gray-600">
            Toplam <strong>{products.length}</strong> ürün listeleniyor
          </span>
        )}
      </div>

      {/* Geri Bildirim Kartı */}
      {feedback && (
        <div
          className={`flex items-start gap-3 mb-6 px-5 py-3 rounded-xl text-sm font-medium shadow-md ${
            feedback.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle size={18} className="mt-0.5" />
          ) : (
            <XCircle size={18} className="mt-0.5" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Ürün Tablosu */}
      <div className="border border-gray-200 rounded-2xl shadow-xl bg-white overflow-hidden">
        {loading ? (
          <div className="text-center text-gray-500 py-10 animate-pulse">
            Ürünler yükleniyor...
          </div>
        ) : products.length === 0 ? (
          <div className="text-center text-gray-400 py-16 text-lg font-medium">
            Henüz mağazanızda ürün bulunmuyor.
          </div>
        ) : (
          <MyStoreProductTable
            products={currentItems}
            onRefresh={loadProducts}
            onFeedback={showFeedback}
            hasCoverage={hasCoverage}
          />
        )}
      </div>

      {/* Sayfalama */}
      {!loading && products.length > ITEMS_PER_PAGE && (
        <div className="mt-10 flex justify-center">
          <Pagination
            total={products.length}
            current={currentPage}
            perPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};

export default MyStoreProductsPage;
