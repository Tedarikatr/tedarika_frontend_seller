import React, { useEffect, useState } from "react";
import {
  fetchMyStoreProducts,
  getStoreCoverage,
} from "@/api/sellerStoreService";
import MyStoreProductTable from "@/components/storeProducts/MyStoreProductTable";
import Pagination from "@/components/ui/Pagination";

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
    setTimeout(() => setFeedback(null), 3000);
  };

  useEffect(() => {
    checkCoverage();
    loadProducts();
  }, []);

  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = products.slice(start, start + ITEMS_PER_PAGE);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
        <h1 className="text-2xl font-bold text-gray-800">Mağaza Ürünlerim</h1>
        {!loading && (
          <span className="text-sm text-gray-600">
            {products.length} ürün listeleniyor
          </span>
        )}
      </div>

      {feedback && (
        <div
          className={`mb-5 px-4 py-2 rounded text-sm shadow-sm ${
            feedback.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {feedback.message}
        </div>
      )}

      <div className="border rounded-lg shadow bg-white overflow-hidden">
        {loading ? (
          <div className="text-center text-gray-600 py-8">Ürünler yükleniyor...</div>
        ) : (
          <MyStoreProductTable
            products={currentItems}
            onRefresh={loadProducts}
            onFeedback={showFeedback}
            hasCoverage={hasCoverage}
          />
        )}
      </div>

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
  );
};

export default MyStoreProductsPage;
