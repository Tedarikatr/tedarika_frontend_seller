// =============================
// OrderDetailPage.jsx - Ultra Modern & Beautiful 🎨
// =============================
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchOrderDetail,
  fetchPaymentDetail,
  updateOrderStatus,
  updateCarrierInfo,
  cancelOrder
} from "@/api/sellerOrderService";
import {
  downloadGeliverOrderLabel,
  getGeliverOrderTracking,
  createGeliverOrderLabel,
  uploadGeliverOrderLabel,
  updateGeliverTracking,
} from "@/api/sellerGeliverService";
import { statusLabels } from "@/constants/orderStatus";
import { CARRIER_OPTIONS } from "@/constants/carrierCompanies";
import { toast } from "react-hot-toast";
import {
  ArrowLeft,
  Package,
  CreditCard,
  ShoppingBag,
  MapPin,
  Calendar,
  DollarSign,
  Info as InfoIcon,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  EyeOff,
  Truck,
  Store,
  FileText,
  Sparkles,
  Edit,
  Ban,
  Loader2,
  Send,
  RefreshCw,
  Upload
} from "lucide-react";

// Modern Status Badge
const StatusBadge = ({ status }) => {
  const statusConfig = {
    Created: {
      bg: "from-blue-50 to-cyan-50",
      text: "text-blue-700",
      border: "border-blue-200",
      icon: <Clock size={16} />,
      label: "Oluşturuldu"
    },
    Confirmed: {
      bg: "from-emerald-50 to-green-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
      icon: <CheckCircle size={16} />,
      label: "Onaylandı"
    },
    Delivered: {
      bg: "from-purple-50 to-pink-50",
      text: "text-purple-700",
      border: "border-purple-200",
      icon: <Package size={16} />,
      label: "Teslim Edildi"
    },
    Cancelled: {
      bg: "from-red-50 to-rose-50",
      text: "text-red-700",
      border: "border-red-200",
      icon: <XCircle size={16} />,
      label: "İptal Edildi"
    },
    default: {
      bg: "from-gray-50 to-gray-100",
      text: "text-gray-700",
      border: "border-gray-200",
      icon: <Clock size={16} />,
      label: "Bilinmiyor"
    }
  };

  const config = statusConfig[status] || statusConfig.default;
  const statusLabel = statusLabels[status] || { text: config.label };

  return (
    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r ${config.bg} ${config.text} border-2 ${config.border}`}>
      {config.icon}
      {statusLabel.text}
    </span>
  );
};

// Info Card Component
const InfoCard = ({ icon: Icon, label, value, colorClass = "text-gray-700" }) => (
  <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-md transition-all">
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white shadow-lg`}>
        <Icon size={20} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500 mb-0.5">{label}</p>
        <p className={`font-semibold truncate ${colorClass}`}>{value}</p>
      </div>
    </div>
  </div>
);

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [payment, setPayment] = useState(null);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [geliverTracking, setGeliverTracking] = useState(null);
  const [geliverLoading, setGeliverLoading] = useState(false);
  const [geliverError, setGeliverError] = useState("");
  const [labelDownloading, setLabelDownloading] = useState(false);
  const [labelSaving, setLabelSaving] = useState(false);
  const [labelUploading, setLabelUploading] = useState(false);
  const [trackingUpdating, setTrackingUpdating] = useState(false);
  const [labelUploadFile, setLabelUploadFile] = useState(null);
  const [manualLabelForm, setManualLabelForm] = useState({
    labelUrl: "",
    responsiveLabelUrl: "",
    shipmentId: "",
    trackingNumber: "",
    trackingUrl: "",
    trackingStatus: "",
    trackingUpdatedAt: "",
    contentType: "application/pdf",
  });
  const [trackingForm, setTrackingForm] = useState({
    shipmentId: "",
    trackingNumber: "",
    trackingUrl: "",
    trackingStatus: "",
    trackingUpdatedAt: "",
  });

  // Kargo Modal State
  const [showCarrierModal, setShowCarrierModal] = useState(false);
  const [carrierCompany, setCarrierCompany] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [carrierLoading, setCarrierLoading] = useState(false);

  // İşlem Loading States
  const [statusLoading, setStatusLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("sellerToken");
    if (!token) navigate("/seller/login");
  }, [navigate]);

  const loadOrder = async () => {
    setLoading(true);
    try {
      const data = await fetchOrderDetail(Number(orderId));
      setOrder(data);
      
      // Ödeme bilgilerini otomatik olarak yükle
      try {
        const paymentData = await fetchPaymentDetail(Number(orderId));
        setPayment(paymentData);
      } catch (paymentErr) {
        console.log("Ödeme detayları yüklenemedi:", paymentErr);
        // Ödeme bilgisi yoksa sessizce devam et
      }
    } catch (err) {
      console.error("Detay yüklenemedi:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadGeliverTracking = async () => {
    setGeliverLoading(true);
    setGeliverError("");
    try {
      const data = await getGeliverOrderTracking(Number(orderId));
      setGeliverTracking(data);
    } catch (err) {
      setGeliverTracking(null);
      setGeliverError(err?.message || "Geliver kargo bilgisi alınamadı.");
    } finally {
      setGeliverLoading(false);
    }
  };

  useEffect(() => {
    if (!geliverTracking) return;
    setManualLabelForm((prev) => ({
      ...prev,
      shipmentId: geliverTracking.shipmentId || prev.shipmentId,
      trackingNumber: geliverTracking.trackingNumber || prev.trackingNumber,
      trackingUrl: geliverTracking.trackingUrl || prev.trackingUrl,
      trackingStatus: geliverTracking.trackingStatus || prev.trackingStatus,
      trackingUpdatedAt: geliverTracking.trackingUpdatedAt
        ? new Date(geliverTracking.trackingUpdatedAt).toISOString().slice(0, 16)
        : prev.trackingUpdatedAt,
      contentType: geliverTracking.contentType || prev.contentType,
      labelUrl: geliverTracking.fileUrl || prev.labelUrl,
      responsiveLabelUrl: geliverTracking.responsiveLabelUrl || prev.responsiveLabelUrl,
    }));
    setTrackingForm((prev) => ({
      ...prev,
      shipmentId: geliverTracking.shipmentId || prev.shipmentId,
      trackingNumber: geliverTracking.trackingNumber || prev.trackingNumber,
      trackingUrl: geliverTracking.trackingUrl || prev.trackingUrl,
      trackingStatus: geliverTracking.trackingStatus || prev.trackingStatus,
      trackingUpdatedAt: geliverTracking.trackingUpdatedAt
        ? new Date(geliverTracking.trackingUpdatedAt).toISOString().slice(0, 16)
        : prev.trackingUpdatedAt,
    }));
  }, [geliverTracking]);

  useEffect(() => {
    loadOrder();
    loadGeliverTracking();
    setPaymentOpen(false);
    setPaymentError("");
  }, [orderId]);

  const handleFetchPayment = async () => {
    setPaymentLoading(true);
    setPaymentError("");
    try {
      const data = await fetchPaymentDetail(Number(orderId));
      setPayment(data);
      setPaymentOpen(true);
    } catch (err) {
      console.error("Ödeme detayları alınamadı:", err);
      setPaymentError("Ödeme detayları alınamadı.");
      setPaymentOpen(true);
    } finally {
      setPaymentLoading(false);
    }
  };

  // Sipariş durumunu güncelle (Created -> Confirmed)
  const handleUpdateStatus = async () => {
    if (!window.confirm("Siparişi onaylamak istediğinize emin misiniz?")) return;

    setStatusLoading(true);
    try {
      console.log("Sipariş onaylanıyor:", orderId, "Status: Confirmed");
      await updateOrderStatus(Number(orderId), "Confirmed");
      toast.success("Sipariş onaylandı!");
      await loadOrder();
    } catch (err) {
      console.error("Durum güncellenemedi:", err);
      toast.error(`Sipariş durumu güncellenemedi: ${err.message}`);
    } finally {
      setStatusLoading(false);
    }
  };

  // Kargo bilgisi güncelle
  const handleUpdateCarrier = async () => {
    if (!carrierCompany || !trackingNumber) {
      toast.error("Lütfen tüm alanları doldurun");
      return;
    }

    setCarrierLoading(true);
    try {
      await updateCarrierInfo(Number(orderId), {
        carrierCompany,
        trackingNumber
      });
      toast.success("Kargo bilgisi başarıyla güncellendi!");
      setShowCarrierModal(false);
      setCarrierCompany("");
      setTrackingNumber("");
      await loadOrder();
    } catch (err) {
      console.error("Kargo bilgisi güncellenemedi:", err);
      toast.error("Kargo bilgisi güncellenemedi.");
    } finally {
      setCarrierLoading(false);
    }
  };

  // Siparişi iptal et
  const handleCancelOrder = async () => {
    if (!window.confirm("Siparişi iptal etmek istediğinize emin misiniz? Bu işlem geri alınamaz!")) return;

    setCancelLoading(true);
    try {
      await cancelOrder(Number(orderId));
      toast.success("Sipariş iptal edildi!");
      await loadOrder();
    } catch (err) {
      console.error("Sipariş iptal edilemedi:", err);
      toast.error("Sipariş iptal edilemedi.");
    } finally {
      setCancelLoading(false);
    }
  };

  const handleDownloadLabel = async () => {
    setLabelDownloading(true);
    try {
      const blob = await downloadGeliverOrderLabel(Number(orderId));
      const fileName =
        geliverTracking?.fileName ||
        `geliver-label-${order?.orderNumber || orderId}.pdf`;
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      toast.error(err?.message || "Kargo etiketi indirilemedi.");
    } finally {
      setLabelDownloading(false);
    }
  };

  const handleManualLabelChange = (e) => {
    const { name, value } = e.target;
    setManualLabelForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleManualLabelSave = async (e) => {
    e.preventDefault();
    if (!manualLabelForm.shipmentId || !manualLabelForm.labelUrl) {
      toast.error("Shipment ID ve label URL zorunludur.");
      return;
    }
    setLabelSaving(true);
    try {
      const payload = {
        labelUrl: manualLabelForm.labelUrl.trim(),
        responsiveLabelUrl: manualLabelForm.responsiveLabelUrl.trim() || null,
        shipmentId: manualLabelForm.shipmentId.trim(),
        trackingNumber: manualLabelForm.trackingNumber.trim() || null,
        trackingUrl: manualLabelForm.trackingUrl.trim() || null,
        trackingStatus: manualLabelForm.trackingStatus.trim() || null,
        trackingUpdatedAt: manualLabelForm.trackingUpdatedAt
          ? new Date(manualLabelForm.trackingUpdatedAt).toISOString()
          : null,
        contentType: manualLabelForm.contentType || "application/pdf",
      };
      const data = await createGeliverOrderLabel(Number(orderId), payload);
      toast.success(data?.isSkipped ? "Etiket zaten kayıtlı." : "Etiket bilgisi kaydedildi.");
      await loadGeliverTracking();
    } catch (err) {
      toast.error(err?.message || "Etiket kaydedilemedi.");
    } finally {
      setLabelSaving(false);
    }
  };

  const handleLabelUpload = async () => {
    if (!labelUploadFile) {
      toast.error("Lütfen bir etiket dosyası seçin.");
      return;
    }
    setLabelUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", labelUploadFile);
      await uploadGeliverOrderLabel(Number(orderId), formData);
      toast.success("Etiket dosyası yüklendi.");
      setLabelUploadFile(null);
      await loadGeliverTracking();
    } catch (err) {
      toast.error(err?.message || "Etiket yüklenemedi.");
    } finally {
      setLabelUploading(false);
    }
  };

  const handleTrackingUpdate = async (e) => {
    e.preventDefault();
    if (!trackingForm.shipmentId) {
      toast.error("Shipment ID zorunludur.");
      return;
    }
    setTrackingUpdating(true);
    try {
      const payload = {
        shipmentId: trackingForm.shipmentId.trim(),
        trackingNumber: trackingForm.trackingNumber.trim() || null,
        trackingUrl: trackingForm.trackingUrl.trim() || null,
        trackingStatus: trackingForm.trackingStatus.trim() || null,
        trackingUpdatedAt: trackingForm.trackingUpdatedAt
          ? new Date(trackingForm.trackingUpdatedAt).toISOString()
          : null,
      };
      await updateGeliverTracking(payload);
      toast.success("Takip bilgisi güncellendi.");
      await loadGeliverTracking();
    } catch (err) {
      toast.error(err?.message || "Takip bilgisi güncellenemedi.");
    } finally {
      setTrackingUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 mb-4 animate-pulse shadow-xl">
            <Package size={40} className="text-white" />
          </div>
          <p className="text-gray-600 font-medium text-lg">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-red-100 to-red-200 mb-4 shadow-lg">
            <XCircle size={48} className="text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">Sipariş Bulunamadı</h3>
          <button
            onClick={() => navigate("/seller/orders")}
            className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            Siparişlere Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <button
            onClick={() => navigate("/seller/orders")}
            className="mb-4 inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all backdrop-blur-sm"
          >
            <ArrowLeft size={20} />
            Geri Dön
          </button>

          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                <FileText size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-1 flex items-center gap-2">
                  Sipariş Detayı
                  <Sparkles size={24} className="text-yellow-300" />
                </h1>
                <p className="text-emerald-100 text-sm">
                  Sipariş No: <span className="font-bold">{order.orderNumber}</span>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge status={order.status} />

              {/* Sipariş İşlemleri */}
              <div className="flex flex-wrap gap-2">
                {order.status === "Created" && (
                  <button
                    onClick={handleUpdateStatus}
                    disabled={statusLoading}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-xl font-semibold transition-all disabled:opacity-50 border border-white/30"
                  >
                    {statusLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckCircle className="w-4 h-4" />
                    )}
                    Onayla
                  </button>
                )}

                {(order.status === "Created" || order.status === "Confirmed" || (payment && payment.isPaid !== false)) && (
                  <>
                    <button
                      onClick={() => setShowCarrierModal(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-xl font-semibold transition-all border border-white/30"
                    >
                      <Truck className="w-4 h-4" />
                      Kargo Bilgisi
                    </button>

                    <button
                      onClick={handleCancelOrder}
                      disabled={cancelLoading}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 backdrop-blur-sm text-white rounded-xl font-semibold transition-all disabled:opacity-50 border border-red-300/30"
                    >
                      {cancelLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Ban className="w-4 h-4" />
                      )}
                      İptal Et
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">

        {/* Genel Bilgiler Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <InfoCard
            icon={Store}
            label="Mağaza"
            value={order.storeName}
          />
          <InfoCard
            icon={Calendar}
            label="Oluşturulma"
            value={new Date(order.createdAt).toLocaleString("tr-TR")}
          />
          <InfoCard
            icon={DollarSign}
            label="Toplam Tutar"
            value={`₺${order.totalAmount.toFixed(2)} ${order.currency}`}
            colorClass="text-emerald-700 text-lg"
          />
          <InfoCard
            icon={Truck}
            label="Kargo Şirketi"
            value={order.carrierCompany || "Henüz Eklenmedi"}
            colorClass={order.carrierCompany ? "text-gray-900" : "text-gray-400"}
          />
          <InfoCard
            icon={Package}
            label="Takip Numarası"
            value={order.trackingNumber || "Henüz Eklenmedi"}
            colorClass={order.trackingNumber ? "text-gray-900" : "text-gray-400"}
          />
          <InfoCard
            icon={MapPin}
            label="Teslimat Adresi"
            value={order.shippingAddress}
          />
        </div>

        {/* Geliver Kargo Etiketi */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-sky-50 to-blue-50 px-6 py-4 border-b border-sky-100 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-lg">
                <Truck size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800">Geliver Kargo Etiketi</h2>
                <p className="text-xs text-gray-500">Siparişin etiket ve takip durumu</p>
              </div>
            </div>
            <button
              onClick={loadGeliverTracking}
              disabled={geliverLoading}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-sky-200 text-sky-700 text-sm font-semibold rounded-xl shadow-sm hover:shadow transition disabled:opacity-50"
            >
              {geliverLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              Yenile
            </button>
          </div>

          <div className="p-6 space-y-4">
            {geliverLoading ? (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                Geliver bilgileri yükleniyor...
              </div>
            ) : geliverTracking ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <InfoRow label="Shipment ID" value={geliverTracking.shipmentId} />
                  <InfoRow label="Takip Numarası" value={geliverTracking.trackingNumber} />
                  <InfoRow label="Takip Durumu" value={geliverTracking.trackingStatus} />
                  <InfoRow
                    label="Takip Güncelleme"
                    value={
                      geliverTracking.trackingUpdatedAt
                        ? new Date(geliverTracking.trackingUpdatedAt).toLocaleString("tr-TR")
                        : "-"
                    }
                  />
                  <InfoRow label="Etiket Dosyası" value={geliverTracking.fileName || "-"} />
                  <InfoRow label="Kayıt Durumu" value={geliverTracking.isSkipped ? "Zaten Kayıtlı" : "Yeni"} />
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleDownloadLabel}
                    disabled={labelDownloading}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-semibold hover:shadow-lg transition disabled:opacity-50"
                  >
                    {labelDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                    Etiketi İndir
                  </button>
                  {geliverTracking.fileUrl && (
                    <a
                      href={geliverTracking.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition"
                    >
                      <Eye className="w-4 h-4" />
                      Etiketi Görüntüle
                    </a>
                  )}
                  {geliverTracking.trackingUrl && (
                    <a
                      href={geliverTracking.trackingUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition"
                    >
                      <Package className="w-4 h-4" />
                      Kargo Takip
                    </a>
                  )}
                </div>

              </>
            ) : (
              <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
                {geliverError || "Bu sipariş için Geliver etiketi bulunmuyor."}
              </div>
            )}

            <div className="border-t border-gray-100 pt-5 space-y-6">
              {/* Manuel Etiket Yükleme */}
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">Manuel Etiket Yükleme</h3>
                <div className="flex flex-wrap items-center gap-3">
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setLabelUploadFile(e.target.files?.[0] || null)}
                    className="text-sm"
                  />
                  <button
                    onClick={handleLabelUpload}
                    disabled={labelUploading}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-100 transition disabled:opacity-50"
                  >
                    {labelUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    Etiketi Yükle
                  </button>
                </div>
              </div>

              {/* Manuel Etiket Kaydı */}
              <form onSubmit={handleManualLabelSave} className="bg-white border border-gray-200 rounded-2xl p-4 space-y-4">
                <h3 className="text-sm font-semibold text-gray-800">Manuel Etiket Kaydı</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <InputField
                    label="Label URL"
                    name="labelUrl"
                    value={manualLabelForm.labelUrl}
                    onChange={handleManualLabelChange}
                    required
                  />
                  <InputField
                    label="Responsive Label URL"
                    name="responsiveLabelUrl"
                    value={manualLabelForm.responsiveLabelUrl}
                    onChange={handleManualLabelChange}
                  />
                  <InputField
                    label="Shipment ID"
                    name="shipmentId"
                    value={manualLabelForm.shipmentId}
                    onChange={handleManualLabelChange}
                    required
                  />
                  <InputField
                    label="Tracking No"
                    name="trackingNumber"
                    value={manualLabelForm.trackingNumber}
                    onChange={handleManualLabelChange}
                  />
                  <InputField
                    label="Tracking URL"
                    name="trackingUrl"
                    value={manualLabelForm.trackingUrl}
                    onChange={handleManualLabelChange}
                  />
                  <InputField
                    label="Tracking Status"
                    name="trackingStatus"
                    value={manualLabelForm.trackingStatus}
                    onChange={handleManualLabelChange}
                  />
                  <InputField
                    label="Tracking Updated At"
                    name="trackingUpdatedAt"
                    value={manualLabelForm.trackingUpdatedAt}
                    onChange={handleManualLabelChange}
                    type="datetime-local"
                  />
                  <InputField
                    label="Content Type"
                    name="contentType"
                    value={manualLabelForm.contentType}
                    onChange={handleManualLabelChange}
                  />
                </div>
                <button
                  type="submit"
                  disabled={labelSaving}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 text-white text-sm font-semibold hover:shadow-lg transition disabled:opacity-50"
                >
                  {labelSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  Etiket Bilgisini Kaydet
                </button>
              </form>

              {/* Takip Bilgisi Güncelle */}
              <form onSubmit={handleTrackingUpdate} className="bg-white border border-gray-200 rounded-2xl p-4 space-y-4">
                <h3 className="text-sm font-semibold text-gray-800">Takip Bilgisi Güncelle</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <InputField
                    label="Shipment ID"
                    name="shipmentId"
                    value={trackingForm.shipmentId}
                    onChange={(e) => setTrackingForm((prev) => ({ ...prev, shipmentId: e.target.value }))}
                    required
                  />
                  <InputField
                    label="Tracking No"
                    name="trackingNumber"
                    value={trackingForm.trackingNumber}
                    onChange={(e) => setTrackingForm((prev) => ({ ...prev, trackingNumber: e.target.value }))}
                  />
                  <InputField
                    label="Tracking URL"
                    name="trackingUrl"
                    value={trackingForm.trackingUrl}
                    onChange={(e) => setTrackingForm((prev) => ({ ...prev, trackingUrl: e.target.value }))}
                  />
                  <InputField
                    label="Tracking Status"
                    name="trackingStatus"
                    value={trackingForm.trackingStatus}
                    onChange={(e) => setTrackingForm((prev) => ({ ...prev, trackingStatus: e.target.value }))}
                  />
                  <InputField
                    label="Tracking Updated At"
                    name="trackingUpdatedAt"
                    value={trackingForm.trackingUpdatedAt}
                    onChange={(e) => setTrackingForm((prev) => ({ ...prev, trackingUpdatedAt: e.target.value }))}
                    type="datetime-local"
                  />
                </div>
                <button
                  type="submit"
                  disabled={trackingUpdating}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition disabled:opacity-50"
                >
                  {trackingUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                  Takip Bilgisini Güncelle
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Ödeme Bilgileri */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-purple-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
                <CreditCard size={20} />
              </div>
              <h2 className="text-lg font-bold text-gray-800">Ödeme Bilgileri</h2>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleFetchPayment}
                disabled={paymentLoading}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white text-sm font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
              >
                {paymentLoading ? (
                  <>Yükleniyor...</>
                ) : (
                  <>
                    <Eye size={16} />
                    Detayları Getir
                  </>
                )}
              </button>
              {payment && (
                <button
                  onClick={() => setPaymentOpen((s) => !s)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-xl border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all"
                >
                  {paymentOpen ? <EyeOff size={16} /> : <Eye size={16} />}
                  {paymentOpen ? "Gizle" : "Göster"}
                </button>
              )}
            </div>
          </div>

          <div className="p-6 space-y-4">
            {/* Kısa Özet */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200">
                <p className="text-xs text-blue-600 mb-1">Ödeme Yöntemi</p>
                <p className="font-bold text-gray-800">{order.payment?.name || "-"}</p>
              </div>
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-4 border border-emerald-200">
                <p className="text-xs text-emerald-600 mb-1">Tutar</p>
                <p className="font-bold text-gray-800">₺{order.payment?.totalAmount?.toFixed(2) || "-"}</p>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-4 border border-amber-200">
                <p className="text-xs text-amber-600 mb-1">Durum</p>
                <p className="font-bold text-gray-800">
                  {order.payment?.status === "Pending" ? "Ödenmedi" : "Ödendi"}
                </p>
              </div>
            </div>

            {/* Detaylı Ödeme Paneli */}
            {paymentOpen && (
              <div className="mt-6 bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-6 space-y-6">
                {paymentError && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-2 text-red-700">
                    <XCircle size={20} />
                    {paymentError}
                  </div>
                )}
                {payment && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { label: "Payment ID", value: payment.paymentId },
                        { label: "Conversation ID", value: payment.paymentConversationId || "-" },
                        { label: "Taksit", value: payment.installment },
                        { label: "Para Birimi", value: payment.currency },
                        { label: "Toplam Ödenen", value: fmt(payment.totalPaidPrice) },
                        { label: "İyzico Komisyonu", value: fmt(payment.totalIyziCommission) },
                        { label: "Platform Ödemesi", value: fmt(payment.totalPlatformPayout) },
                        { label: "Alt Mağaza Ödemesi", value: fmt(payment.totalSubMerchantPayout) },
                      ].map((item, i) => (
                        <div key={i} className="bg-white rounded-xl p-3 border border-gray-200">
                          <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                          <p className="font-semibold text-gray-800">{item.value}</p>
                        </div>
                      ))}
                    </div>

                    {/* Kalemler Tablosu */}
                    {Array.isArray(payment.items) && payment.items.length > 0 && (
                      <div className="mt-6">
                        <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                          <FileText size={18} />
                          Ödeme Kalemleri
                        </h3>
                        <div className="overflow-x-auto rounded-xl border border-gray-200">
                          <table className="min-w-full text-sm">
                            <thead className="bg-gradient-to-r from-gray-100 to-gray-50">
                              <tr>
                                <th className="px-4 py-3 text-left font-bold text-gray-700">#</th>
                                <th className="px-4 py-3 text-left font-bold text-gray-700">Ödenen</th>
                                <th className="px-4 py-3 text-left font-bold text-gray-700">Komisyon</th>
                                <th className="px-4 py-3 text-left font-bold text-gray-700">Platform</th>
                                <th className="px-4 py-3 text-left font-bold text-gray-700">Alt Mağaza</th>
                                <th className="px-4 py-3 text-left font-bold text-gray-700">Bloke (Mağaza)</th>
                                <th className="px-4 py-3 text-left font-bold text-gray-700">Bloke (Alt)</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {payment.items.map((it, idx) => (
                                <tr key={idx} className="hover:bg-blue-50 transition-colors">
                                  <td className="px-4 py-3 font-medium">{idx + 1}</td>
                                  <td className="px-4 py-3">{fmt(it.paidPrice ?? it.totalPaidPrice)}</td>
                                  <td className="px-4 py-3">{fmt(it.iyziCommission ?? it.totalIyziCommission)}</td>
                                  <td className="px-4 py-3">{fmt(it.platformPayout ?? it.totalPlatformPayout)}</td>
                                  <td className="px-4 py-3">{fmt(it.subMerchantPayout ?? it.totalSubMerchantPayout)}</td>
                                  <td className="px-4 py-3">{fmt(it.blockageMerchant ?? it.totalBlockageMerchant)}</td>
                                  <td className="px-4 py-3">{fmt(it.blockageSubMerchant ?? it.totalBlockageSubMerchant)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Ürünler */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-50 to-green-50 px-6 py-4 border-b border-emerald-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white shadow-lg">
              <ShoppingBag size={20} />
            </div>
            <h2 className="text-lg font-bold text-gray-800">Sipariş Ürünleri</h2>
            <span className="ml-auto px-3 py-1 bg-emerald-200 text-emerald-800 rounded-full text-xs font-bold">
              {order.items.length} Ürün
            </span>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {order.items.map((item, i) => (
                <div
                  key={i}
                  className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-2xl p-5 hover:shadow-xl transition-all duration-200 hover:scale-105"
                >
                  <div className="flex justify-center mb-4">
                    <div className="relative">
                      <img
                        src={
                          item.storeProductImageUrl ||
                          "/tedarika/assets/images/product-placeholder.svg"
                        }
                        alt={item.productName}
                        className="w-32 h-32 object-cover rounded-xl border-2 border-gray-200 shadow-lg"
                      />
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg">
                        {i + 1}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-bold text-gray-800 text-center mb-3">
                      {item.productName}
                    </h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between items-center p-2 bg-blue-50 rounded-lg">
                        <span className="text-blue-700">Adet:</span>
                        <span className="font-bold text-gray-800">{item.quantity}</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-purple-50 rounded-lg">
                        <span className="text-purple-700">Birim:</span>
                        <span className="font-bold text-gray-800">₺{item.unitPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border border-emerald-200">
                        <span className="text-emerald-700 font-semibold">Toplam:</span>
                        <span className="font-bold text-emerald-800">₺{item.totalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Kargo Bilgisi Modal */}
      {showCarrierModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-[slideUp_0.3s_ease-out]">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-5 text-white">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Truck size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Kargo Bilgisi Ekle</h3>
                  <p className="text-emerald-100 text-sm">Sipariş No: {order.orderNumber}</p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* Kargo Şirketi */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Kargo Şirketi *
                </label>
                <select
                  value={carrierCompany}
                  onChange={(e) => setCarrierCompany(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all"
                >
                  <option value="">Seçiniz...</option>
                  {CARRIER_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Takip Numarası */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Takip Numarası *
                </label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Kargo takip numarasını girin"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all"
                />
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 flex items-start gap-3">
                <InfoIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-800">
                  Kargo bilgisi eklendikten sonra müşteri kargo takip numarasını görebilecektir.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowCarrierModal(false);
                  setCarrierCompany("");
                  setTrackingNumber("");
                }}
                disabled={carrierLoading}
                className="px-5 py-2.5 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition-all disabled:opacity-50"
              >
                İptal
              </button>
              <button
                onClick={handleUpdateCarrier}
                disabled={carrierLoading || !carrierCompany || !trackingNumber}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
              >
                {carrierLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Kaydediliyor...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Kaydet
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { 
            transform: translateY(20px); 
            opacity: 0; 
          }
          to { 
            transform: translateY(0); 
            opacity: 1; 
          }
        }
      `}</style>
    </div>
  );
};

const InfoRow = ({ label, value }) => (
  <div className="flex flex-col gap-1">
    <span className="text-xs text-gray-500">{label}</span>
    <span className="font-semibold text-gray-800 break-all">{value || "-"}</span>
  </div>
);

const InputField = ({ label, name, value, onChange, type = "text", required }) => (
  <label className="flex flex-col gap-1 text-xs text-gray-500">
    {label} {required && <span className="text-rose-600">*</span>}
    <input
      name={name}
      value={value}
      onChange={onChange}
      type={type}
      required={required}
      className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
    />
  </label>
);

// Formatlayıcı
function fmt(n) {
  if (n === null || n === undefined) return "-";
  const num = Number(n);
  if (Number.isNaN(num)) return String(n);
  return `₺${num.toFixed(2)}`;
}

export default OrderDetailPage;
