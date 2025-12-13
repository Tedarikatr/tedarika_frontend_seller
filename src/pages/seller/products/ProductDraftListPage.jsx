import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchProductDrafts } from "@/api/sellerProductDraftService";
import { useToast } from "@/contexts/ToastContext";
import {
  FileText,
  Upload,
  Sparkles,
  Package,
  Calendar,
  Loader2,
  ChevronRight,
  FolderOpen,
} from "lucide-react";
import { motion } from "framer-motion";

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
      console.error("Draft listesi yüklenemedi:", err);
      toast.error("Draft listesi yüklenemedi");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                <FolderOpen size={32} className="animate-pulse" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-1 flex items-center gap-2">
                  Ürün Draft Grupları
                  <Sparkles size={24} className="text-yellow-300" />
                </h1>
                <p className="text-emerald-100 text-sm">
                  Toplu yükleme başvurularınızı gruplar halinde görüntüleyin
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate("/seller/products/draft/upload")}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-xl font-semibold transition-all border border-white/30"
            >
              <Upload className="w-5 h-5" />
              Yeni Yükleme
            </button>
          </div>
        </div>
      </div>

      {/* Draft Stats */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Toplam Grup</p>
                <p className="text-2xl font-bold text-gray-900">{drafts.length}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Toplam Ürün</p>
                <p className="text-2xl font-bold text-gray-900">
                  {drafts.reduce((sum, draft) => sum + draft.productCount, 0)}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Son Yükleme</p>
                <p className="text-sm font-semibold text-gray-900">
                  {drafts.length > 0
                    ? new Date(drafts[0].createdAt).toLocaleDateString("tr-TR")
                    : "—"}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Draft List */}
        {drafts.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Henüz draft yok</h3>
            <p className="text-gray-500 mb-6">
              İlk toplu ürün yüklemenizi yapmak için yeni yükleme başlatın
            </p>
            <button
              onClick={() => navigate("/seller/products/draft/upload")}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:opacity-90 transition"
            >
              <Upload className="w-5 h-5" />
              Yeni Yükleme Başlat
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {drafts.map((draft) => (
              <motion.div
                key={draft.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.01 }}
                className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:border-emerald-200 transition-all cursor-pointer"
                onClick={() => navigate(`/seller/products/drafts/${draft.id}`)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg">
                      <FolderOpen className="w-7 h-7 text-white" />
                    </div>

                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        {draft.name}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="inline-flex items-center gap-1">
                          <Package className="w-4 h-4" />
                          {draft.productCount} ürün
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(draft.createdAt).toLocaleDateString("tr-TR")}
                        </span>
                      </div>
                    </div>
                  </div>

                  <ChevronRight className="w-6 h-6 text-gray-400" />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDraftListPage;
