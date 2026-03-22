import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getSellerQuotationById,
  respondToQuotation,
  updateQuotationStatus,
} from "@/api/sellerQuotationService";
import { toast } from "react-hot-toast";
import { getQuotationStatusProps } from "@/constants/quotationStatus";
import {
  ArrowLeft,
  FileText,
  Package,
  DollarSign,
  Calendar,
  MessageSquare,
  Send,
  CheckCircle,
  XCircle,
  Sparkles,
  TrendingUp,
  Clock,
  AlertCircle,
} from "lucide-react";
import TedarikaLoader from "@/components/ui/TedarikaLoader";

const QuotationDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quotation, setQuotation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const [form, setForm] = useState({
    offeredUnitPrice: "",
    minOrderQuantity: "",
    validUntil: "",
    notes: "",
  });

  useEffect(() => {
    fetchQuotation();
  }, [id]);

  const fetchQuotation = async () => {
    setLoading(true);
    try {
      const data = await getSellerQuotationById(id);
      setQuotation(data);
    } catch {
      toast.error("Teklif bilgisi alınamadı.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRespond = async () => {
    if (!form.offeredUnitPrice || !form.minOrderQuantity || !form.validUntil) {
      setStatusMessage({
        type: "error",
        message: "Lütfen tüm gerekli alanları doldurun.",
      });
      return;
    }

    setSubmitting(true);
    try {
      await respondToQuotation(id, {
        offeredUnitPrice: parseFloat(form.offeredUnitPrice),
        minOrderQuantity: parseInt(form.minOrderQuantity),
        validUntil: form.validUntil,
        notes: form.notes,
      });
      setStatusMessage({
        type: "success",
        message: "Karşı teklif başarıyla gönderildi.",
      });
      resetForm();
      await fetchQuotation();
    } catch {
      setStatusMessage({
        type: "error",
        message: "Karşı teklif gönderilirken hata oluştu.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (statusValue) => {
    if (quotation.status === 2) {
      toast.error("Kabul edilmiş teklifin durumu değiştirilemez.");
      return;
    }
    if (quotation.status === 3) {
      toast.error("Reddedilmiş teklifin durumu değiştirilemez.");
      return;
    }

    toast.loading("Durum güncelleniyor...");
    try {
      await updateQuotationStatus(id, statusValue);
      toast.dismiss();
      setStatusMessage({
        type: "success",
        message:
          statusValue === 2
            ? "Durum 'Kabul Edildi' olarak güncellendi."
            : "Durum 'Reddedildi' olarak güncellendi.",
      });
      await fetchQuotation();
    } catch {
      toast.dismiss();
      setStatusMessage({
        type: "error",
        message: "Durum güncellenirken hata oluştu.",
      });
    }
  };

  const resetForm = () => {
    setForm({
      offeredUnitPrice: "",
      minOrderQuantity: "",
      validUntil: "",
      notes: "",
    });
  };

  const formatDate = (date) =>
    new Date(date).toLocaleString("tr-TR", {
      dateStyle: "short",
      timeStyle: "short",
    });

  const status = quotation ? getQuotationStatusProps(quotation.status) : null;

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center">
        <TedarikaLoader variant="compact" />
      </div>
    );

  if (!quotation)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50/30 flex items-center justify-center">
        <div className="text-center bg-white p-12 rounded-3xl shadow-2xl border-2 border-red-200">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-xl mx-auto mb-4">
            <AlertCircle className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-red-600 mb-2">Teklif Bulunamadı</h3>
          <p className="text-gray-600 mb-6">İstediğiniz teklif mevcut değil veya silinmiş olabilir.</p>
          <button
            onClick={() => navigate("/seller/quotations")}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:shadow-lg transition-all duration-300"
          >
            Teklif Listesine Dön
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Hero Header */}
        <header className="mb-6 sm:mb-8 relative bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 rounded-2xl sm:rounded-3xl shadow-2xl px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10 overflow-hidden">
          {/* Dekoratif Arka Plan */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
          <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <button
              onClick={() => navigate("/seller/quotations")}
              className="mb-6 flex items-center gap-2 px-4 py-2 rounded-xl bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-semibold">Geri Dön</span>
            </button>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-xl">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                  Teklif Detayı
                </h1>
                <p className="text-emerald-100 text-sm font-medium">
                  Teklif ID: #{id}
                </p>
              </div>
              <Sparkles className="w-7 h-7 text-yellow-300 animate-pulse ml-auto" />
            </div>
          </div>
        </header>

        {/* Teklif Bilgileri */}
        <section className="bg-gradient-to-br from-white to-gray-50 rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8 mb-4 sm:mb-6 border-2 border-gray-200 overflow-hidden">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <Package className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Teklif Bilgileri</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <InfoCard
              icon={Package}
              label="Ürün"
              value={quotation.storeProductName}
              gradient="from-purple-500 to-purple-600"
            />
            <InfoCard
              icon={DollarSign}
              label="Talep Edilen Fiyat"
              value={`${quotation.unitPrice} ₺`}
              gradient="from-emerald-500 to-emerald-600"
            />
            <InfoCard
              icon={TrendingUp}
              label="Talep Miktarı"
              value={quotation.quantity}
              gradient="from-amber-500 to-amber-600"
            />
            <InfoCard
              icon={Calendar}
              label="Talep Tarihi"
              value={formatDate(quotation.requestedAt)}
              gradient="from-blue-500 to-blue-600"
            />
            {quotation.message && (
              <div className="sm:col-span-2 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border-2 border-blue-200">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg flex-shrink-0">
                    <MessageSquare className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800 mb-2">Alıcı Mesajı</h4>
                    <p className="text-gray-700">{quotation.message}</p>
                  </div>
                </div>
              </div>
            )}
            {status && (
              <div className="sm:col-span-2 flex items-center justify-center">
                <StatusBadge status={quotation.status} statusProps={status} />
              </div>
            )}
          </div>
        </section>

        {/* Karşı Teklif Formu */}
        {quotation.status === 2 ? (
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl shadow-xl p-8 border-2 border-gray-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center shadow-lg">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">Teklif Kabul Edildi</h3>
                <p className="text-gray-600 text-sm">Bu teklif kabul edildiği için tekrar karşı teklif gönderemezsiniz.</p>
              </div>
            </div>
          </div>
        ) : (
          <section className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl p-8 border-2 border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg">
                <Send className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Karşı Teklif Gönder</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <DollarSign className="w-4 h-4" />
                  Birim Fiyat (₺)
                </label>
                <input
                  name="offeredUnitPrice"
                  type="number"
                  value={form.offeredUnitPrice}
                  onChange={handleInputChange}
                  placeholder="Birim Fiyat"
                  className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300"
                />
              </div>
              
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Package className="w-4 h-4" />
                  Min. Sipariş Miktarı
                </label>
                <input
                  name="minOrderQuantity"
                  type="number"
                  value={form.minOrderQuantity}
                  onChange={handleInputChange}
                  placeholder="Minimum Miktar"
                  className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300"
                />
              </div>
              
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Calendar className="w-4 h-4" />
                  Geçerlilik Tarihi
                </label>
                <input
                  name="validUntil"
                  type="datetime-local"
                  value={form.validUntil}
                  onChange={handleInputChange}
                  className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300"
                />
              </div>
              
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <MessageSquare className="w-4 h-4" />
                  Notlar (Opsiyonel)
                </label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Eklemek istediğiniz notlar..."
                  className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 resize-none"
                />
              </div>
            </div>

            <button
              onClick={handleRespond}
              disabled={submitting}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <Send className="w-5 h-5" />
              {submitting ? "Gönderiliyor..." : "Karşı Teklifi Gönder"}
            </button>

            {statusMessage && (
              <div className="mt-6">
                <MessageBox
                  type={statusMessage.type}
                  message={statusMessage.message}
                />
              </div>
            )}
          </section>
        )}

        {/* Durum Güncelleme */}
        <section className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl p-8 border-2 border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Durumu Güncelle</h2>
          </div>
          
          {(quotation.status !== 2 && quotation.status !== 3) ? (
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => handleStatusChange(2)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <CheckCircle className="w-5 h-5" />
                Kabul Et
              </button>
              <button
                onClick={() => handleStatusChange(3)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <XCircle className="w-5 h-5" />
                Reddet
              </button>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border-2 border-blue-200">
              <p className="text-gray-700">
                Teklif zaten{" "}
                <strong className="text-gray-900">
                  {quotation.status === 2
                    ? "KABUL EDİLDİ"
                    : quotation.status === 3
                    ? "REDDEDİLDİ"
                    : "GÜNCELLENMİŞ"}
                </strong>
                .
              </p>
            </div>
          )}
          
          {statusMessage && (
            <div className="mt-6">
              <MessageBox
                type={statusMessage.type}
                message={statusMessage.message}
              />
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

// InfoCard Component
const InfoCard = ({ icon: Icon, label, value, gradient }) => (
  <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-5 border-2 border-gray-200 hover:shadow-lg transition-all duration-300">
    <div className="flex items-start gap-3">
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg flex-shrink-0`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-gray-600 mb-1">{label}</p>
        <p className="text-lg font-bold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);

// StatusBadge Component
const StatusBadge = ({ status, statusProps }) => {
  const iconMap = {
    0: Clock,
    1: TrendingUp,
    2: CheckCircle,
    3: XCircle,
    4: XCircle,
    5: Clock,
    7: Package,
  };
  const Icon = iconMap[status] || FileText;
  
  return (
    <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl border-2 shadow-lg font-bold text-sm ${statusProps.color}`}>
      <Icon className="w-5 h-5" />
      {statusProps.label}
    </div>
  );
};

// MessageBox Component
const MessageBox = ({ type = "success", message }) => {
  const isError = type === "error";
  const Icon = isError ? XCircle : CheckCircle;
  const gradient = isError
    ? "from-red-100 to-rose-100"
    : "from-green-100 to-emerald-100";
  const borderColor = isError ? "border-red-300" : "border-green-300";
  const textColor = isError ? "text-red-800" : "text-green-800";
  const iconGradient = isError ? "from-red-500 to-red-600" : "from-green-500 to-green-600";

  return (
    <div className={`bg-gradient-to-r ${gradient} rounded-2xl p-5 border-2 ${borderColor} shadow-lg`}>
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${iconGradient} flex items-center justify-center shadow-lg flex-shrink-0`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <p className={`flex-1 font-medium ${textColor} pt-2`}>{message}</p>
      </div>
    </div>
  );
};

export default QuotationDetailPage;
