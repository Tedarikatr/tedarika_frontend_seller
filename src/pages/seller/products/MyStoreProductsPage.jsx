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
  const [hasCoverage, setHasCoverage] = useState(true); // ✅ coverage kontrolü

  // ✅ Ürünleri çek
  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await fetchMyStoreProducts();
      setProducts(data);
    } catch (error) {
      console.error("Ürünler alınamadı:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Hizmet bölgesi kontrolü (geliştirilmiş)
  const checkCoverage = async () => {
    try {
      const coverage = await getStoreCoverage();

      // 🔍 Tüm coverage kayıtlarında region veya country var mı?
      const hasAnyCoverage = coverage?.some(
        (c) =>
          (c.regions?.length ?? 0) > 0 ||
          (c.countries?.length ?? 0) > 0
      );

      console.log("Coverage verisi:", coverage);
      console.log("hasCoverage sonucu:", hasAnyCoverage);

      setHasCoverage(hasAnyCoverage);
    } catch (error) {
      console.error("Hizmet bölgesi kontrolü başarısız:", error);
      setHasCoverage(false);
    }
  };

  // ✅ Feedback mesajı gösterme
  const showFeedback = (message, type = "success") => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback(null), 3000);
  };

  // ✅ İlk yükleme
  useEffect(() => {
    checkCoverage();
    loadProducts();
  }, []);

  // ✅ hasCoverage değiştiğinde logla
  useEffect(() => {
    console.log("hasCoverage:", hasCoverage);
  }, [hasCoverage]);

  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const visibleProducts = products.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-5">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">
          Mağaza Ürünlerim
        </h1>
        {!loading && (
          <span className="text-sm text-gray-600">
            {products.length} ürün listelendi
          </span>
        )}
      </div>

      {feedback && (
        <div
          className={`mb-4 px-4 py-2 rounded text-sm shadow-sm ${
            feedback.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {feedback.message}
        </div>
      )}

      <div className="w-full overflow-auto rounded-xl border border-gray-300 shadow bg-white">
        {loading ? (
          <div className="text-center text-gray-600 py-6">
            Ürünler yükleniyor...
          </div>
        ) : (
          <MyStoreProductTable
            products={visibleProducts}
            onRefresh={loadProducts}
            onFeedback={showFeedback}
            hasCoverage={hasCoverage} // ✅ Satışa aç butonu için kritik
          />
        )}
      </div>

      {!loading && products.length > ITEMS_PER_PAGE && (
        <div className="mt-6 flex justify-center">
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
