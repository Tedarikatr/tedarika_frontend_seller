import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchProductDrafts } from "@/api/sellerProductDraftService";
import { useToast } from "@/contexts/ToastContext";
import {
  FileText,
  Package,
  Calendar,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import TedarikaLoader from "@/components/ui/TedarikaLoader";

const ProductDraftListPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDrafts();
  }, []);

  const loadDrafts = async () => {
    setLoading(true);
    try {
      const data = await fetchProductDrafts();
      setDrafts(data || []);
    } catch (err) {
      console.error("Yüklemeler yüklenemedi:", err);
      toast.error("Yüklemeler yüklenemedi");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <TedarikaLoader variant="compact" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/seller/products/draft/upload")}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Geri Dön
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Önceki Yüklemeler</h1>
          <p className="text-gray-600 text-sm mt-1">
            Daha önce yüklediğiniz ürün gruplarını görüntüleyin
          </p>
        </div>

        {/* Draft List */}
        {drafts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Henüz yükleme yok</h3>
            <p className="text-gray-500 text-sm mb-4">
              İlk ürün yüklemenizi yapmak için yeni yükleme başlatın
            </p>
            <button
              onClick={() => navigate("/seller/products/draft/upload")}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-sm font-medium transition"
            >
              Yeni Yükleme Başlat
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {drafts.map((draft) => (
              <div
                key={draft.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 hover:border-gray-300 transition-all cursor-pointer"
                onClick={() => navigate(`/seller/products/drafts/${draft.id}`)}
              >
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-gray-900 truncate">
                        {draft.name || "İsimsiz Yükleme"}
                      </h3>
                      <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                        <span className="inline-flex items-center gap-1">
                          <Package className="w-3 h-3" />
                          {draft.productCount} ürün
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(draft.createdAt).toLocaleDateString("tr-TR", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDraftListPage;
