import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchRefundRequests,
  decideRefundRequest,
  inspectRefundRequest,
} from "@/api/sellerOrderService";
import { REFUND_REQUEST_STATUS_LABELS } from "@/constants/refundStatus";
import { useToast } from "@/contexts/ToastContext";
import {
  PackageX,
  Clock,
  CheckCircle,
  XCircle,
  Package,
  Search,
  AlertCircle,
  Lock,
  Loader2,
  Eye,
  ThumbsUp,
  ThumbsDown,
  FileText,
  Truck,
  Calendar,
  DollarSign,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const RefundRequestsPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDecisionModal, setShowDecisionModal] = useState(false);
  const [showInspectionModal, setShowInspectionModal] = useState(false);
  const [sellerNote, setSellerNote] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const data = await fetchRefundRequests();
      setRequests(data || []);
    } catch (err) {
      console.error("İade talepleri yüklenemedi:", err);
      toast.error("İade talepleri yüklenemedi");
    } finally {
      setLoading(false);
    }
  };

  const handleDecision = async (approve) => {
    if (!selectedRequest) return;

    setProcessing(true);
    try {
      await decideRefundRequest(selectedRequest.id, {
        approve,
        sellerNote: sellerNote || undefined,
      });
      
      toast.success(approve ? "İade talebi onaylandı" : "İade talebi reddedildi");
      setShowDecisionModal(false);
      setSellerNote("");
      loadRequests();
    } catch (err) {
      console.error("İşlem başarısız:", err);
      toast.error("İşlem başarısız oldu");
    } finally {
      setProcessing(false);
    }
  };

  const handleInspection = async (accept) => {
    if (!selectedRequest) return;

    setProcessing(true);
    try {
      await inspectRefundRequest(selectedRequest.id, {
        acceptReturn: accept,
        sellerNote: sellerNote || undefined,
      });
      
      toast.success(accept ? "İade kabul edildi" : "İade reddedildi");
      setShowInspectionModal(false);
      setSellerNote("");
      loadRequests();
    } catch (err) {
      console.error("İnceleme kaydedilemedi:", err);
      toast.error("İnceleme kaydedilemedi");
    } finally {
      setProcessing(false);
    }
  };

  const getStatusIcon = (status) => {
    const config = REFUND_REQUEST_STATUS_LABELS[status];
    if (!config) return <AlertCircle className="w-5 h-5" />;
    
    switch (config.icon) {
      case "Clock":
        return <Clock className="w-5 h-5" />;
      case "CheckCircle":
        return <CheckCircle className="w-5 h-5" />;
      case "XCircle":
        return <XCircle className="w-5 h-5" />;
      case "Package":
        return <Package className="w-5 h-5" />;
      case "Search":
        return <Search className="w-5 h-5" />;
      case "AlertCircle":
        return <AlertCircle className="w-5 h-5" />;
      case "Lock":
        return <Lock className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  const getStatusBadgeClass = (status) => {
    const config = REFUND_REQUEST_STATUS_LABELS[status];
    if (!config) return "bg-gray-100 text-gray-800 border-gray-200";
    
    switch (config.color) {
      case "amber":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "green":
        return "bg-green-100 text-green-800 border-green-200";
      case "red":
        return "bg-red-100 text-red-800 border-red-200";
      case "gray":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const filteredRequests = requests.filter((req) => {
    if (filter === "all") return true;
    if (filter === "pending") return req.status === "PendingSellerApproval";
    if (filter === "inspection") return req.status === "AwaitingSellerInspection";
    if (filter === "completed") return req.status === "Accepted";
    return true;
  });

  const stats = {
    total: requests.length,
    pending: requests.filter((r) => r.status === "PendingSellerApproval").length,
    inspection: requests.filter((r) => r.status === "AwaitingSellerInspection").length,
    completed: requests.filter((r) => r.status === "Accepted").length,
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
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
              <PackageX size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-1">İade Talepleri</h1>
              <p className="text-emerald-100 text-sm">{stats.total} talep</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Stats */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[
            { key: "all", label: "Tümü", count: stats.total, color: "gray" },
            { key: "pending", label: "Onay Bekleyen", count: stats.pending, color: "amber" },
            { key: "inspection", label: "İnceleme Bekleyen", count: stats.inspection, color: "amber" },
            { key: "completed", label: "Tamamlanan", count: stats.completed, color: "green" },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setFilter(item.key)}
              className={`p-4 rounded-xl font-semibold transition ${
                filter === item.key
                  ? item.color === "gray"
                    ? "bg-gray-600 text-white shadow-lg"
                    : item.color === "amber"
                    ? "bg-amber-600 text-white shadow-lg"
                    : "bg-green-600 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-gray-50 shadow"
              }`}
            >
              <div className="text-2xl font-bold">{item.count}</div>
              <div className="text-sm">{item.label}</div>
            </button>
          ))}
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {filteredRequests.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
              <PackageX className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">İade talebi bulunamadı</p>
            </div>
          ) : (
            filteredRequests.map((request) => {
              const statusConfig = REFUND_REQUEST_STATUS_LABELS[request.status];
              const totalAmount = request.items?.reduce((sum, item) => sum + (item.requestedAmount || 0), 0) || 0;

              return (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">
                          Sipariş #{request.orderNumber}
                        </h3>
                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg ${getStatusBadgeClass(request.status)} text-xs font-bold border`}>
                          {getStatusIcon(request.status)}
                          {statusConfig?.text || request.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{statusConfig?.description}</p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedRequest(request);
                          setShowDetailModal(true);
                        }}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        Detay
                      </button>

                      {request.status === "PendingSellerApproval" && (
                        <button
                          onClick={() => {
                            setSelectedRequest(request);
                            setShowDecisionModal(true);
                          }}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition"
                        >
                          Karar Ver
                        </button>
                      )}

                      {request.status === "AwaitingSellerInspection" && (
                        <button
                          onClick={() => {
                            setSelectedRequest(request);
                            setShowInspectionModal(true);
                          }}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition"
                        >
                          İncele
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-gray-500 text-xs">Talep Tarihi</p>
                        <p className="font-semibold text-gray-900">
                          {new Date(request.requestedAt).toLocaleDateString("tr-TR")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Package className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-gray-500 text-xs">Ürün Sayısı</p>
                        <p className="font-semibold text-gray-900">{request.items?.length || 0}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-gray-500 text-xs">Toplam Tutar</p>
                        <p className="font-semibold text-gray-900">{totalAmount.toFixed(2)} ₺</p>
                      </div>
                    </div>

                    {request.buyerShipmentTrackingNumber && (
                      <div className="flex items-center gap-2 text-sm">
                        <Truck className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-gray-500 text-xs">Kargo Takip</p>
                          <p className="font-semibold text-gray-900 text-xs">
                            {request.buyerShipmentTrackingNumber}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {request.reason && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">İade Nedeni:</p>
                      <p className="text-sm text-gray-700">{request.reason}</p>
                    </div>
                  )}
                </motion.div>
              );
            })
          )}
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedRequest && (
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
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6 rounded-t-2xl">
                <h2 className="text-2xl font-bold">İade Talebi Detayı</h2>
                <p className="text-emerald-100 text-sm mt-1">Sipariş #{selectedRequest.orderNumber}</p>
              </div>

              <div className="p-6 space-y-6">
                {/* Status */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Durum</h3>
                  <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${getStatusBadgeClass(selectedRequest.status)} font-bold border`}>
                    {getStatusIcon(selectedRequest.status)}
                    {REFUND_REQUEST_STATUS_LABELS[selectedRequest.status]?.text}
                  </span>
                </div>

                {/* Items */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-3">İade Edilen Ürünler</h3>
                  <div className="space-y-2">
                    {selectedRequest.items?.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-semibold text-gray-900">Ürün {index + 1}</p>
                          <p className="text-sm text-gray-600">Miktar: {item.requestedQuantity}</p>
                        </div>
                        <p className="font-bold text-gray-900">{item.requestedAmount?.toFixed(2)} ₺</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reason */}
                {selectedRequest.reason && (
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">İade Nedeni</h3>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedRequest.reason}</p>
                  </div>
                )}

                {/* Seller Note */}
                {selectedRequest.sellerNote && (
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Satıcı Notu</h3>
                    <p className="text-gray-700 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                      {selectedRequest.sellerNote}
                    </p>
                  </div>
                )}

                {/* Tracking */}
                {selectedRequest.buyerShipmentTrackingNumber && (
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Kargo Takip No</h3>
                    <p className="text-gray-700 font-mono bg-gray-50 p-3 rounded-lg">
                      {selectedRequest.buyerShipmentTrackingNumber}
                    </p>
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

      {/* Decision Modal */}
      <AnimatePresence>
        {showDecisionModal && selectedRequest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDecisionModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full"
            >
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6 rounded-t-2xl">
                <h2 className="text-xl font-bold">İade Kararı</h2>
                <p className="text-emerald-100 text-sm mt-1">Sipariş #{selectedRequest.orderNumber}</p>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Not (İsteğe Bağlı)
                  </label>
                  <textarea
                    value={sellerNote}
                    onChange={(e) => setSellerNote(e.target.value)}
                    placeholder="İade kararınız hakkında açıklama yazın..."
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleDecision(false)}
                    disabled={processing}
                    className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <ThumbsDown className="w-5 h-5" />
                    Reddet
                  </button>
                  <button
                    onClick={() => handleDecision(true)}
                    disabled={processing}
                    className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {processing ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <ThumbsUp className="w-5 h-5" />
                    )}
                    Onayla
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Inspection Modal */}
      <AnimatePresence>
        {showInspectionModal && selectedRequest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowInspectionModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full"
            >
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6 rounded-t-2xl">
                <h2 className="text-xl font-bold">Ürün İncelemesi</h2>
                <p className="text-emerald-100 text-sm mt-1">Sipariş #{selectedRequest.orderNumber}</p>
              </div>

              <div className="p-6 space-y-4">
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                  <p className="text-sm text-emerald-800">
                    <strong>Dikkat:</strong> Ürünü fiziksel olarak inceledikten sonra kararınızı verin.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    İnceleme Notu (İsteğe Bağlı)
                  </label>
                  <textarea
                    value={sellerNote}
                    onChange={(e) => setSellerNote(e.target.value)}
                    placeholder="Ürün durumu ve karar gerekçeniz..."
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleInspection(false)}
                    disabled={processing}
                    className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-5 h-5" />
                    Reddet
                  </button>
                  <button
                    onClick={() => handleInspection(true)}
                    disabled={processing}
                    className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {processing ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <CheckCircle className="w-5 h-5" />
                    )}
                    Kabul Et
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RefundRequestsPage;
