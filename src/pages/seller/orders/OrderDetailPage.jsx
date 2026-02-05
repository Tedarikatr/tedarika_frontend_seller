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
  getShippingLabel,
  getShippingOffers,
  acceptShippingOffer,
  downloadShippingLabel,
} from "@/api/sellerShippingService";
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
  Upload,
  Printer,
  Download,
  Activity,
  Navigation,
  Circle,
  ExternalLink,
  Ruler,
  ChevronDown,
  ChevronUp,
  Copy
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
  const [shippingLabel, setShippingLabel] = useState(null);
  const [shippingLabelLoading, setShippingLabelLoading] = useState(false);
  const [shippingLabelError, setShippingLabelError] = useState("");
  const [showLabelModal, setShowLabelModal] = useState(false);
  const [labelLoading, setLabelLoading] = useState(false);
  const [labelPdfUrl, setLabelPdfUrl] = useState(null);
  const [offers, setOffers] = useState(null);
  const [offersLoading, setOffersLoading] = useState(false);
  const [acceptOfferLoading, setAcceptOfferLoading] = useState(false);
  const [selectedOfferId, setSelectedOfferId] = useState(null);
  const [packageDimensions, setPackageDimensions] = useState({
    weightKg: "",
    lengthCm: "",
    widthCm: "",
    heightCm: "",
  });
  const [showPackageForm, setShowPackageForm] = useState(false);

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

  const loadShippingLabel = async () => {
    setShippingLabelLoading(true);
    setShippingLabelError("");
    try {
      const data = await getShippingLabel(Number(orderId));
      setShippingLabel(data);
    } catch (err) {
      setShippingLabel(null);
      if (err?.message && !err.message.includes("bulunamadı") && !err.message.includes("404")) {
        setShippingLabelError(err.message);
      }
    } finally {
      setShippingLabelLoading(false);
    }
  };

  const loadOffers = async () => {
    setOffersLoading(true);
    setOffers(null);
    setSelectedOfferId(null);
    const body = {};
    if (packageDimensions.weightKg && !Number.isNaN(Number(packageDimensions.weightKg)))
      body.weightKg = Number(packageDimensions.weightKg);
    if (packageDimensions.lengthCm && !Number.isNaN(Number(packageDimensions.lengthCm)))
      body.lengthCm = Number(packageDimensions.lengthCm);
    if (packageDimensions.widthCm && !Number.isNaN(Number(packageDimensions.widthCm)))
      body.widthCm = Number(packageDimensions.widthCm);
    if (packageDimensions.heightCm && !Number.isNaN(Number(packageDimensions.heightCm)))
      body.heightCm = Number(packageDimensions.heightCm);
    try {
      const data = await getShippingOffers(Number(orderId), Object.keys(body).length ? body : null);
      setOffers(data);
      if (data?.cheapestOfferId) setSelectedOfferId(data.cheapestOfferId);
    } catch (err) {
      toast.error(err?.message || "Kargo teklifleri alınamadı.");
    } finally {
      setOffersLoading(false);
    }
  };

  const handleAcceptOffer = async () => {
    if (!offers?.providerShipmentId || !selectedOfferId) {
      toast.error("Lütfen bir teklif seçin.");
      return;
    }
    const offer = offers.offers?.find((o) => o.id === selectedOfferId);
    setAcceptOfferLoading(true);
    try {
      await acceptShippingOffer(Number(orderId), {
        providerShipmentId: offers.providerShipmentId,
        offerId: selectedOfferId,
        acceptedOfferTotalAmount: offer ? parseFloat(offer.totalAmount) : undefined,
      });
      toast.success("Teklif kabul edildi, etiket oluşturuldu.");
      setOffers(null);
      setSelectedOfferId(null);
      await loadShippingLabel();
    } catch (err) {
      toast.error(err?.message || "Teklif kabul edilemedi.");
    } finally {
      setAcceptOfferLoading(false);
    }
  };

  useEffect(() => {
    loadOrder();
    loadShippingLabel();
    setPaymentOpen(false);
    setPaymentError("");
  }, [orderId]);

  useEffect(() => {
    return () => {
      if (labelPdfUrl) {
        window.URL.revokeObjectURL(labelPdfUrl);
      }
    };
  }, [labelPdfUrl]);

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

  const handleViewLabel = async () => {
    setLabelLoading(true);
    setLabelPdfUrl(null);
    try {
      const blob = await downloadShippingLabel(Number(orderId));
      const url = window.URL.createObjectURL(blob);
      setLabelPdfUrl(url);
      setShowLabelModal(true);
    } catch (err) {
      toast.error(err?.message || "Kargo etiketi yüklenemedi.");
    } finally {
      setLabelLoading(false);
    }
  };

  const handlePrintLabel = () => {
    if (labelPdfUrl) {
      const printWindow = window.open(labelPdfUrl, "_blank");
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print();
        };
      }
    }
  };

  const handleDownloadLabel = () => {
    if (labelPdfUrl) {
      const link = document.createElement("a");
      link.href = labelPdfUrl;
      link.download = shippingLabel?.fileName || `kargo-etiket-${order?.orderNumber || orderId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  };

  const handleCloseLabelModal = () => {
    setShowLabelModal(false);
    if (labelPdfUrl) {
      window.URL.revokeObjectURL(labelPdfUrl);
      setLabelPdfUrl(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 mb-4 animate-pulse shadow-xl">
            <Package size={32} className="sm:w-10 sm:h-10 text-white" />
          </div>
          <p className="text-gray-600 font-medium text-base sm:text-lg">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-red-100 to-red-200 mb-4 shadow-lg">
            <XCircle size={40} className="sm:w-12 sm:h-12 text-red-600" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-700 mb-2">Sipariş Bulunamadı</h3>
          <button
            onClick={() => navigate("/seller/orders")}
            className="mt-4 px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all text-sm sm:text-base"
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
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 text-white shadow-xl relative overflow-hidden">
        {/* Dekoratif arka plan */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
        <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl hidden sm:block"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 relative z-10">
          <button
            onClick={() => navigate("/seller/orders")}
            className="mb-4 inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all backdrop-blur-sm text-sm sm:text-base"
          >
            <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Geri Dön</span>
            <span className="sm:hidden">Geri</span>
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg flex-shrink-0">
                <FileText size={24} className="sm:w-8 sm:h-8" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold mb-1 flex items-center gap-2">
                  <span className="truncate">Sipariş Detayı</span>
                  <Sparkles size={20} className="sm:w-6 sm:h-6 text-yellow-300 flex-shrink-0" />
                </h1>
                <p className="text-emerald-100 text-xs sm:text-sm">
                  Sipariş No: <span className="font-bold">{order.orderNumber}</span>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <StatusBadge status={order.status} />

              {/* Sipariş İşlemleri */}
              <div className="flex flex-wrap gap-2">
                {order.status === "Created" && (
                  <button
                    onClick={handleUpdateStatus}
                    disabled={statusLoading}
                    className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-lg sm:rounded-xl font-semibold transition-all disabled:opacity-50 border border-white/30 text-xs sm:text-sm"
                  >
                    {statusLoading ? (
                      <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                    ) : (
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                    )}
                    <span className="hidden sm:inline">Onayla</span>
                    <span className="sm:hidden">Onayla</span>
                  </button>
                )}

                {(order.status === "Created" || order.status === "Confirmed" || (payment && payment.isPaid !== false)) && (
                  <>
                    <button
                      onClick={() => setShowCarrierModal(true)}
                      className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-lg sm:rounded-xl font-semibold transition-all border border-white/30 text-xs sm:text-sm"
                    >
                      <Truck className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">Kargo Bilgisi</span>
                      <span className="sm:hidden">Kargo</span>
                    </button>

                    {shippingLabel && (
                      <button
                        onClick={handleViewLabel}
                        disabled={labelLoading}
                        className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-lg sm:rounded-xl font-semibold transition-all disabled:opacity-50 border border-white/30 text-xs sm:text-sm"
                      >
                        {labelLoading ? (
                          <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                        ) : (
                          <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
                        )}
                        <span className="hidden lg:inline">Kargo Etiketi Görüntüle</span>
                        <span className="hidden sm:inline lg:hidden">Etiket</span>
                        <span className="sm:hidden">Etiket</span>
                      </button>
                    )}
                    <button
                      onClick={handleCancelOrder}
                      disabled={cancelLoading}
                      className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-red-500/20 hover:bg-red-500/30 backdrop-blur-sm text-white rounded-lg sm:rounded-xl font-semibold transition-all disabled:opacity-50 border border-red-300/30 text-xs sm:text-sm"
                    >
                      {cancelLoading ? (
                        <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                      ) : (
                        <Ban className="w-3 h-3 sm:w-4 sm:h-4" />
                      )}
                      <span className="hidden sm:inline">İptal Et</span>
                      <span className="sm:hidden">İptal</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-4 sm:space-y-6">

        {/* Genel Bilgiler Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
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

        {shippingLabelError && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-center gap-2 text-amber-800 text-sm mb-4">
            <InfoIcon className="w-5 h-5 flex-shrink-0" />
            {shippingLabelError}
          </div>
        )}
        {/* Kargo Teklifi Al – Paket boyutları (opsiyonel) + Teklifler */}
        {!shippingLabel && (order.status === "Created" || order.status === "Confirmed") && (
          <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 overflow-hidden mb-4">
            <div className="bg-gradient-to-r from-sky-50 to-blue-50 px-4 sm:px-6 py-4 border-b border-sky-100">
              <h2 className="text-base sm:text-lg font-bold text-gray-800">Kargo Etiketi Oluştur</h2>
              <p className="text-xs text-gray-600 mt-1">Kargo teklifi alıp birini kabul ederek etiket oluşturabilirsiniz. Alıcı adresi sipariş teslimat adresinden otomatik alınır.</p>
            </div>
            <div className="p-4 sm:p-6">
              {/* Paket boyutları (opsiyonel) – ShippingPackageDimensionsRequestDto */}
              <div className="mb-4">
                <button
                  type="button"
                  onClick={() => setShowPackageForm((v) => !v)}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-sky-700 hover:text-sky-800"
                >
                  <Ruler className="w-4 h-4" />
                  Paket boyutları (desi – opsiyonel)
                  {showPackageForm ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {showPackageForm && (
                  <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <label className="flex flex-col gap-1">
                      <span className="text-xs text-gray-600">Ağırlık (kg)</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={packageDimensions.weightKg}
                        onChange={(e) => setPackageDimensions((p) => ({ ...p, weightKg: e.target.value }))}
                        placeholder="Örn. 2.5"
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                      />
                    </label>
                    <label className="flex flex-col gap-1">
                      <span className="text-xs text-gray-600">Uzunluk (cm)</span>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        value={packageDimensions.lengthCm}
                        onChange={(e) => setPackageDimensions((p) => ({ ...p, lengthCm: e.target.value }))}
                        placeholder="Örn. 30"
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                      />
                    </label>
                    <label className="flex flex-col gap-1">
                      <span className="text-xs text-gray-600">Genişlik (cm)</span>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        value={packageDimensions.widthCm}
                        onChange={(e) => setPackageDimensions((p) => ({ ...p, widthCm: e.target.value }))}
                        placeholder="Örn. 20"
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                      />
                    </label>
                    <label className="flex flex-col gap-1">
                      <span className="text-xs text-gray-600">Yükseklik (cm)</span>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        value={packageDimensions.heightCm}
                        onChange={(e) => setPackageDimensions((p) => ({ ...p, heightCm: e.target.value }))}
                        placeholder="Örn. 15"
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                      />
                    </label>
                  </div>
                )}
              </div>
              <button
                onClick={loadOffers}
                disabled={offersLoading}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-sky-600 text-white rounded-xl font-semibold hover:bg-sky-700 disabled:opacity-50"
              >
                {offersLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Truck className="w-4 h-4" />}
                Kargo Teklifi Al
              </button>
            </div>
          </div>
        )}
        {/* Kargo Teklifleri listesi (teklif alındıktan sonra) */}
        {offers && !shippingLabel && (
          <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 px-4 sm:px-6 py-4 border-b border-emerald-100">
              <h2 className="text-base sm:text-lg font-bold text-gray-800">Kargo Teklifleri</h2>
              <p className="text-xs text-gray-600 mt-1">Bir teklif seçip kabul edin. Kabul edilen tutar satıcı ödemesinden kesilir.</p>
            </div>
            <div className="p-4 sm:p-6">
              <div className="space-y-3 mb-4">
                {offers.offers?.map((offer) => (
                  <label
                    key={offer.id}
                    className={`flex items-center justify-between gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedOfferId === offer.id ? "border-emerald-500 bg-emerald-50" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="offer"
                      checked={selectedOfferId === offer.id}
                      onChange={() => setSelectedOfferId(offer.id)}
                      className="sr-only"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-gray-800">{offer.providerCode}</span>
                        <span className="text-gray-500 text-sm">{offer.providerServiceCode}</span>
                        {offers.cheapestOfferId === offer.id && (
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">En ucuz</span>
                        )}
                        {offers.fastestOfferId === offer.id && (
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">En hızlı</span>
                        )}
                      </div>
                    </div>
                    <span className="font-bold text-emerald-700 whitespace-nowrap">
                      {offer.totalAmount} {offer.currency}
                    </span>
                  </label>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleAcceptOffer}
                  disabled={acceptOfferLoading || !selectedOfferId}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 disabled:opacity-50"
                >
                  {acceptOfferLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                  Seçilen Teklifi Kabul Et
                </button>
                <button
                  onClick={() => setOffers(null)}
                  className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50"
                >
                  İptal
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Kargo Takip Durumu */}
        {shippingLabel && (
          <div className="bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-4 sm:px-6 py-3 sm:py-4 border-b border-indigo-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg flex-shrink-0">
                  <Activity size={18} className="sm:w-5 sm:h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-gray-800">Kargo Takip Durumu</h2>
                  <p className="text-xs text-gray-500">Takip durumu otomatik güncellenir</p>
                </div>
              </div>
              <button
                onClick={loadShippingLabel}
                disabled={shippingLabelLoading}
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white border border-indigo-200 text-indigo-700 text-xs sm:text-sm font-semibold rounded-lg sm:rounded-xl shadow-sm hover:shadow transition disabled:opacity-50 w-full sm:w-auto justify-center"
              >
                {shippingLabelLoading ? <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" /> : <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4" />}
                Yenile
              </button>
            </div>

            <div className="p-4 sm:p-6">
              {/* Tracking Status Timeline */}
              <div className="mb-4 sm:mb-6">
                <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-3 sm:mb-4 flex items-center gap-2">
                  <Navigation className="w-3 h-3 sm:w-4 sm:h-4" />
                  Takip Durumu Timeline
                </h3>
                <TrackingTimeline
                  trackingStatus={shippingLabel.trackingStatus}
                  orderStatus={order.status}
                  trackingUpdatedAt={shippingLabel.trackingUpdatedAt}
                />
              </div>

              {/* Tracking Bilgileri – OrderShippingLabelDto */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
                {shippingLabel.trackingNumber && (
                  <div className="bg-gradient-to-br from-sky-50 to-cyan-50 rounded-xl p-4 border border-sky-200">
                    <p className="text-xs text-sky-600 mb-1">Takip Numarası</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-bold text-gray-800 break-all">{shippingLabel.trackingNumber}</p>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard?.writeText(shippingLabel.trackingNumber);
                          toast.success("Kopyalandı");
                        }}
                        className="p-1.5 rounded-lg hover:bg-sky-100 text-sky-600"
                        title="Kopyala"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      {shippingLabel.trackingUrl && (
                        <a
                          href={shippingLabel.trackingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm font-semibold text-sky-600 hover:text-sky-800"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Takibi Görüntüle
                        </a>
                      )}
                    </div>
                  </div>
                )}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200">
                  <p className="text-xs text-blue-600 mb-1">Tracking Status</p>
                  <p className="font-bold text-gray-800">
                    {shippingLabel.trackingStatus ? (
                      <span className="inline-flex items-center gap-2">
                        <Circle className="w-2 h-2 fill-current" />
                        {shippingLabel.trackingStatus}
                      </span>
                    ) : (
                      "Henüz güncellenmedi"
                    )}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
                  <p className="text-xs text-purple-600 mb-1">Sipariş Durumu</p>
                  <p className="font-bold text-gray-800">
                    <StatusBadge status={order.status} />
                  </p>
                </div>
                {shippingLabel.createdAt && (
                  <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-4 border border-gray-200">
                    <p className="text-xs text-gray-600 mb-1">Etiket Oluşturulma</p>
                    <p className="font-bold text-gray-800">
                      {new Date(shippingLabel.createdAt).toLocaleString("tr-TR")}
                    </p>
                  </div>
                )}
                {shippingLabel.trackingUpdatedAt && (
                  <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-4 border border-emerald-200">
                    <p className="text-xs text-emerald-600 mb-1">Son Güncelleme</p>
                    <p className="font-bold text-gray-800">
                      {new Date(shippingLabel.trackingUpdatedAt).toLocaleString("tr-TR")}
                    </p>
                  </div>
                )}
                {shippingLabel.shipmentId && (
                  <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-4 border border-amber-200">
                    <p className="text-xs text-amber-600 mb-1">Shipment ID</p>
                    <p className="font-bold text-gray-800 text-xs break-all">{shippingLabel.shipmentId}</p>
                  </div>
                )}
              </div>

              {/* Durum eşlemesi bilgisi */}
              <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                    <InfoIcon className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-700 mb-1">Durum Eşlemesi</p>
                    <p className="text-xs text-gray-600 mb-2">
                      Kargo takip durumları otomatik olarak sipariş durumuna çevrilir:
                    </p>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg border border-blue-100">
                        <span className="text-gray-600 font-medium">PRE_TRANSIT / TRANSIT / OUT_FOR_DELIVERY</span>
                        <span className="text-gray-400">→</span>
                        <span className="font-semibold text-blue-600">Shipped</span>
                        <span className="text-gray-500 text-xs">(Kargoya verildi / Yolda / Dağıtımda)</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-purple-50 rounded-lg border border-purple-100">
                        <span className="text-gray-600 font-medium">DELIVERED</span>
                        <span className="text-gray-400">→</span>
                        <span className="font-semibold text-purple-600">Delivered</span>
                        <span className="text-gray-500 text-xs">(Teslim edildi)</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-amber-50 rounded-lg border border-amber-100">
                        <span className="text-gray-600 font-medium">RETURNED</span>
                        <span className="text-gray-400">→</span>
                        <span className="font-semibold text-amber-600">RefundPending</span>
                        <span className="text-gray-500 text-xs">(İade/inceleme süreci)</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-red-50 rounded-lg border border-red-100">
                        <span className="text-gray-600 font-medium">CANCELLED</span>
                        <span className="text-gray-400">→</span>
                        <span className="font-semibold text-red-600">Cancelled</span>
                        <span className="text-gray-500 text-xs">(Kargo iptal edildi)</span>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-xs text-gray-600">
                        <span className="font-semibold">Not:</span> Webhook işlemleri idempotent'tir. 
                        Aynı webhook birden fazla kez gelirse sadece en yeni olan işlenir. 
                        Sipariş durumu geçişleri geçerlilik kontrolünden geçer.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}


        {/* Ödeme Bilgileri */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-4 sm:px-6 py-3 sm:py-4 border-b border-purple-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
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
                        src={item.storeProductImageUrl || ""}
                        onError={(e) => { e.target.style.display = 'none'; }}
                        style={{ display: item.storeProductImageUrl ? 'block' : 'none' }}
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

      {/* Kargo Etiketi Görüntüleme Modal */}
      {showLabelModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full h-[90vh] flex flex-col overflow-hidden animate-[slideUp_0.3s_ease-out]">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-sky-600 to-blue-600 px-6 py-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <FileText size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Kargo Etiketi</h3>
                  <p className="text-sky-100 text-sm">Sipariş No: {order.orderNumber}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {labelPdfUrl && (
                  <>
                    <button
                      onClick={handlePrintLabel}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-xl font-semibold transition-all border border-white/30"
                    >
                      <Printer className="w-4 h-4" />
                      Yazdır
                    </button>
                    <button
                      onClick={handleDownloadLabel}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-xl font-semibold transition-all border border-white/30"
                    >
                      <Download className="w-4 h-4" />
                      İndir
                    </button>
                  </>
                )}
                <button
                  onClick={handleCloseLabelModal}
                  className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white flex items-center justify-center transition-all border border-white/30"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body - PDF Viewer */}
            <div className="flex-1 overflow-hidden bg-gray-100">
              {labelLoading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-sky-600 mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">Kargo etiketi yükleniyor...</p>
                  </div>
                </div>
              ) : labelPdfUrl ? (
                <iframe
                  src={labelPdfUrl}
                  className="w-full h-full border-0"
                  title="Kargo Etiketi"
                />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">Kargo etiketi yüklenemedi.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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

// Tracking Timeline Component
const TrackingTimeline = ({ trackingStatus, orderStatus, trackingUpdatedAt }) => {
  const getStatusSteps = () => {
    const steps = [
      {
        key: "SHIPPED",
        label: "Kargoya Verildi / Yolda / Dağıtımda",
        trackingStatuses: ["PRE_TRANSIT", "TRANSIT", "IN_TRANSIT", "OUT_FOR_DELIVERY"],
        orderStatuses: ["Shipped"],
        icon: <Truck className="w-4 h-4" />,
        color: "blue",
        description: "Kargo şirketine verildi, yolda veya dağıtımda"
      },
      {
        key: "DELIVERED",
        label: "Teslim Edildi",
        trackingStatuses: ["DELIVERED"],
        orderStatuses: ["Delivered"],
        icon: <CheckCircle className="w-4 h-4" />,
        color: "purple",
        description: "Kargo alıcıya teslim edildi"
      },
      {
        key: "RETURNED",
        label: "İade / İnceleme",
        trackingStatuses: ["RETURNED"],
        orderStatuses: ["RefundPending"],
        icon: <RefreshCw className="w-4 h-4" />,
        color: "amber",
        description: "Kargo iade edildi, inceleme süreci başlatıldı"
      },
      {
        key: "CANCELLED",
        label: "Kargo İptal Edildi",
        trackingStatuses: ["CANCELLED"],
        orderStatuses: ["Cancelled"],
        icon: <XCircle className="w-4 h-4" />,
        color: "red",
        description: "Kargo iptal edildi"
      }
    ];

    return steps.map((step, index) => {
      // Check if this step is active based on tracking status or order status
      const normalizedTrackingStatus = trackingStatus?.toUpperCase()?.trim();
      const isActiveByTracking = normalizedTrackingStatus && step.trackingStatuses.some(ts => 
        normalizedTrackingStatus === ts || 
        normalizedTrackingStatus.includes(ts) || 
        ts.includes(normalizedTrackingStatus)
      );
      const isActiveByOrder = step.orderStatuses.includes(orderStatus);
      const isActive = isActiveByTracking || isActiveByOrder;
      
      // Check if completed (only delivered can be completed)
      const isCompleted = step.key === "DELIVERED" && orderStatus === "Delivered";
      
      // Check if error state (cancelled or returned)
      const isError = step.key === "CANCELLED" || step.key === "RETURNED";
      
      return {
        ...step,
        isActive,
        isCompleted,
        isError,
        isLast: index === steps.length - 1,
        isActiveByTracking,
        isActiveByOrder
      };
    });
  };

  const steps = getStatusSteps();
  const activeStep = steps.find(s => s.isActive);

  return (
    <div className="relative">
      {/* Timeline Line */}
      <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200" />
      
      <div className="space-y-6">
        {steps.map((step, index) => {
          // Only show active steps and the next step, or all if none are active
          const shouldShow = step.isActive || 
                           (index === 0 && !activeStep) || 
                           (activeStep && index <= steps.findIndex(s => s.key === activeStep.key) + 1);
          
          if (!shouldShow && !step.isError) return null;

          return (
            <div key={step.key} className="relative flex items-start gap-4">
              {/* Status Icon */}
              <div
                className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                  step.isCompleted
                    ? "bg-purple-500 border-purple-500 text-white shadow-lg scale-110"
                    : step.isError && step.isActive
                    ? "bg-red-500 border-red-500 text-white shadow-lg scale-110"
                    : step.isError
                    ? "bg-red-100 border-red-300 text-red-600"
                    : step.isActive
                    ? "bg-blue-500 border-blue-500 text-white shadow-lg scale-110"
                    : "bg-white border-gray-300 text-gray-400"
                }`}
              >
                {step.isCompleted || step.isActive ? (
                  step.icon
                ) : (
                  <Circle className="w-3 h-3 fill-current" />
                )}
              </div>

              {/* Status Content */}
              <div className="flex-1 pt-1">
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold mb-2 ${
                    step.isCompleted
                      ? "bg-purple-100 text-purple-700 border border-purple-200"
                      : step.isError && step.isActive
                      ? "bg-red-100 text-red-700 border border-red-200"
                      : step.isError
                      ? "bg-red-50 text-red-600 border border-red-200"
                      : step.isActive
                      ? "bg-blue-100 text-blue-700 border border-blue-200"
                      : "bg-gray-100 text-gray-500 border border-gray-200"
                  }`}
                >
                  {step.label}
                  {step.isActive && (
                    <span className="text-xs font-normal opacity-75">
                      {step.isActiveByTracking ? "(Webhook)" : "(Manuel)"}
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-500 space-y-1.5">
                  <p className="text-gray-600 italic">{step.description}</p>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Tracking Status:</span>
                    <span className="font-semibold text-gray-700">
                      {step.trackingStatuses.join(" / ")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Sipariş Durumu:</span>
                    <span className="font-semibold text-gray-700">{step.orderStatuses.join(" / ")}</span>
                  </div>
                  {step.isActive && trackingUpdatedAt && (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <p className="text-emerald-600 font-medium flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Son Güncelleme: {new Date(trackingUpdatedAt).toLocaleString("tr-TR")}
                      </p>
                      {trackingStatus && (
                        <p className="text-gray-600 mt-1">
                          Mevcut Durum: <span className="font-semibold">{trackingStatus}</span>
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

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
