import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchDraftProducts, fetchDraftProductDetail } from "@/api/sellerProductDraftService";
import { DRAFT_STATUS_LABELS, SOURCE_TYPE_LABELS } from "@/constants/productDraftStatus";
import { useToast } from "@/contexts/ToastContext";
import {
  ArrowLeft,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  FileSpreadsheet,
  FileCode,
  Package,
  AlertCircle,
  Calendar,
  Tag,
  Loader2,
  Eye,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ProductDraftDetailPage = () => {
  const { draftId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    loadProducts();
  }, [draftId]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await fetchDraftProducts(draftId);
      setProducts(data || []);
    } catch (err) {
      console.error("Ürünler yüklenemedi:", err);
      toast.error("Ürünler yüklenemedi");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = async (productDraftId) => {
    try {
      const detail = await fetchDraftProductDetail(productDraftId);
      setSelectedProduct(detail);
      setShowDetailModal(true);
    } catch (err) {
      toast.error("Ürün detayı yüklenemedi");
    }
  };

  const getStatusIcon = (status) => {
    const config = DRAFT_STATUS_LABELS[status] || DRAFT_STATUS_LABELS.Pending;
    switch (config.icon) {
      case "Clock":
        return <Clock className="w-5 h-5" />;
      case "CheckCircle":
        return <CheckCircle className="w-5 h-5" />;
      case "XCircle":
        return <XCircle className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  const getSourceIcon = (sourceType) => {
    const config = SOURCE_TYPE_LABELS[sourceType] || SOURCE_TYPE_LABELS.Json;
    switch (config.icon) {
      case "FileSpreadsheet":
        return <FileSpreadsheet className="w-5 h-5" />;
      case "FileCode":
        return <FileCode className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getStatusBadgeClass = (status) => {
    const config = DRAFT_STATUS_LABELS[status];
    if (!config) return "bg-gray-100 text-gray-800 border-gray-200";
    
    switch (config.color) {
      case "amber":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "green":
        return "bg-green-100 text-green-800 border-green-200";
      case "red":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getSourceBadgeClass = (sourceType) => {
    const config = SOURCE_TYPE_LABELS[sourceType] || SOURCE_TYPE_LABELS.Json;
    switch (config?.color) {
      case "green":
        return "bg-green-100 text-green-800";
      case "blue":
        return "bg-blue-100 text-blue-800";
      case "purple":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredProducts = products.filter((product) => {
    if (filter === "all") return true;
    if (filter === "pending") return product.status === "Pending";
    if (filter === "approved") return product.status === "Approved";
    if (filter === "rejected") return product.status === "Rejected";
    return true;
  });

  const stats = {
    total: products.length,
    pending: products.filter((p) => p.status === "Pending").length,
    approved: products.filter((p) => p.status === "Approved").length,
    rejected: products.filter((p) => p.status === "Rejected").length,
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
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <button
            onClick={() => navigate("/seller/products/drafts")}
            className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-4 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Geri Dön
          </button>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
              <Package size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-1">Draft Ürünleri</h1>
              <p className="text-emerald-100 text-sm">{stats.total} ürün</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Stats */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[
            { key: "all", label: "Tümü", count: stats.total, color: "emerald" },
            { key: "pending", label: "Beklemede", count: stats.pending, color: "amber" },
            { key: "approved", label: "Onaylı", count: stats.approved, color: "green" },
            { key: "rejected", label: "Reddedildi", count: stats.rejected, color: "red" },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setFilter(item.key)}
              className={`p-4 rounded-xl font-semibold transition ${
                filter === item.key
                  ? `bg-${item.color}-600 text-white shadow-lg`
                  : "bg-white text-gray-700 hover:bg-gray-50 shadow"
              }`}
            >
              <div className="text-2xl font-bold">{item.count}</div>
              <div className="text-sm">{item.label}</div>
            </button>
          ))}
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b-2 border-emerald-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-emerald-800 uppercase tracking-wider">
                    Ürün
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-emerald-800 uppercase tracking-wider">
                    Marka
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-emerald-800 uppercase tracking-wider">
                    Kaynak
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-emerald-800 uppercase tracking-wider">
                    Tarih
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-emerald-800 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-emerald-800 uppercase tracking-wider">
                    İşlem
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredProducts.map((product) => {
                  const statusConfig = DRAFT_STATUS_LABELS[product.status] || DRAFT_STATUS_LABELS.Pending;
                  const sourceConfig = SOURCE_TYPE_LABELS[product.sourceType] || SOURCE_TYPE_LABELS.Json;

                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 transition-all duration-200"
                    >
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">{product.name}</div>
                        {product.gtin && (
                          <div className="text-xs text-gray-500 mt-1">GTIN: {product.gtin}</div>
                        )}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Tag className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-700 font-medium">
                            {product.brandName || "—"}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg ${getSourceBadgeClass(product.sourceType)} text-xs font-bold`}>
                          {getSourceIcon(product.sourceType)}
                          {sourceConfig.text}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          {new Date(product.createdAt).toLocaleDateString("tr-TR")}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg ${getStatusBadgeClass(product.status)} text-xs font-bold border`}>
                          {getStatusIcon(product.status)}
                          {statusConfig.text}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => handleViewDetail(product.id)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg text-sm font-semibold hover:opacity-90 transition"
                        >
                          <Eye className="w-4 h-4" />
                          Detay
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDetailModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6 rounded-t-2xl">
                <h2 className="text-2xl font-bold">{selectedProduct.name}</h2>
                <p className="text-emerald-100 text-sm mt-1">{selectedProduct.brandName}</p>
              </div>

              <div className="p-6 space-y-6">
                {/* Images */}
                {selectedProduct.imageUrls && selectedProduct.imageUrls.length > 0 && (
                  <div>
                    <h3 className="font-bold text-gray-900 mb-3">Görseller</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {selectedProduct.imageUrls.map((url, index) => (
                        <img
                          key={index}
                          src={url}
                          alt={`Product ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border border-gray-200"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Fiyat</p>
                    <p className="font-bold text-gray-900">
                      {selectedProduct.unitPrice} {selectedProduct.currencyCode}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Stok</p>
                    <p className="font-bold text-gray-900">{selectedProduct.stockQuantity}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Min. Sipariş</p>
                    <p className="font-bold text-gray-900">{selectedProduct.minOrderQuantity}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Max. Sipariş</p>
                    <p className="font-bold text-gray-900">{selectedProduct.maxOrderQuantity}</p>
                  </div>
                </div>

                {/* Description */}
                {selectedProduct.description && (
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Açıklama</h3>
                    <p className="text-gray-600 text-sm">{selectedProduct.description}</p>
                  </div>
                )}

                {/* Attributes */}
                {selectedProduct.attributes && Object.keys(selectedProduct.attributes).length > 0 && (
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Özellikler</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(selectedProduct.attributes).map(([key, value]) => (
                        <div key={key} className="bg-gray-50 rounded-lg p-3">
                          <p className="text-xs text-gray-500">{key}</p>
                          <p className="font-semibold text-gray-900">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setShowDetailModal(false)}
                  className="w-full py-3 bg-gray-200 hover:bg-gray-300 rounded-xl font-semibold text-gray-700 transition"
                >
                  Kapat
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductDraftDetailPage;
