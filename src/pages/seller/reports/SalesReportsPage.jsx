import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  exportSalesReport,
  createReportSchedule,
  deleteReportSchedule,
  getExportHistory,
  getReportSchedules,
  SALES_REPORT_FORMAT,
  SALES_REPORT_TYPES,
} from "@/api/sellerSalesReportService";
import { useToast } from "@/contexts/ToastContext";
import {
  FileText,
  Download,
  Calendar,
  Clock,
  Trash2,
  Plus,
  FileSpreadsheet,
  TrendingUp,
  BarChart3,
  Loader2,
  Mail,
  RefreshCw,
  CheckCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import TedarikaLoader from "@/components/ui/TedarikaLoader";

const SalesReportsPage = () => {
  const navigate = useNavigate();
  const toast = useToast();

  // Export Form State
  const [reportType, setReportType] = useState("StandardSalesReport");
  const [format, setFormat] = useState(0); // 0 = Pdf, 1 = Xlsx
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  // Schedule Form State
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleReportType, setScheduleReportType] = useState("StandardSalesReport");
  const [scheduleFormat, setScheduleFormat] = useState(0); // 0 = Pdf, 1 = Xlsx
  const [scheduleEmail, setScheduleEmail] = useState("");
  const [scheduleCron, setScheduleCron] = useState("0 8 * * *"); // Her gün 08:00
  const [scheduleTimezone, setScheduleTimezone] = useState("Europe/Istanbul");
  const [scheduleStartDate, setScheduleStartDate] = useState("");
  const [scheduleEndDate, setScheduleEndDate] = useState("");

  // Lists
  const [exportHistory, setExportHistory] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [loadingSchedules, setLoadingSchedules] = useState(true);

  useEffect(() => {
    loadExportHistory();
    loadSchedules();
    
    // Bugünün tarihini default olarak set et
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    setStartDate(thirtyDaysAgo.toISOString().split("T")[0]);
    setEndDate(today.toISOString().split("T")[0]);
  }, []);

  const loadExportHistory = async () => {
    setLoadingHistory(true);
    try {
      const data = await getExportHistory();
      setExportHistory(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Export geçmişi yüklenemedi:", err);
      setExportHistory([]);
      // Sadece kritik hatalarda kullanıcıya bildir
      if (err?.message && !err.message.includes("404")) {
        toast.error("Rapor geçmişi yüklenemedi");
      }
    } finally {
      setLoadingHistory(false);
    }
  };

  const loadSchedules = async () => {
    setLoadingSchedules(true);
    try {
      const data = await getReportSchedules();
      setSchedules(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Zamanlanmış raporlar yüklenemedi:", err);
      setSchedules([]);
      // Sadece kritik hatalarda kullanıcıya bildir
      if (err?.message && !err.message.includes("404")) {
        toast.error("Zamanlanmış raporlar yüklenemedi");
      }
    } finally {
      setLoadingSchedules(false);
    }
  };

  const handleExport = async () => {
    setLoading(true);
    try {
      const requestBody = {
        reportType,
        format,
      };

      // Tarih filtresi opsiyonel - varsa ekle
      if (startDate && endDate) {
        requestBody.filter = {
          startDate: new Date(startDate).toISOString(),
          endDate: new Date(endDate).toISOString(),
        };
      }

      const report = await exportSalesReport(requestBody);

      // storagePath üzerinden raporu aç
      if (report?.storagePath) {
        window.open(report.storagePath, "_blank");
        toast.success("Rapor başarıyla oluşturuldu ve açıldı");
        // Listeyi yenile
        setTimeout(() => {
          loadExportHistory();
        }, 1000);
      } else {
        toast.error("Rapor oluşturuldu ancak indirme linki bulunamadı");
      }
    } catch (err) {
      console.error("Rapor oluşturulamadı:", err);
      let errorMessage = "Rapor oluşturulamadı";
      
      // Hata mesajını parse et
      if (err?.message) {
        errorMessage = err.message;
        // 404 Not Found hatası için özel mesaj
        if (err.message.includes("404") || err.message.includes("Not Found") || err.message.includes("bulunamadı")) {
          errorMessage = "Rapor servisi şu anda kullanılamıyor. Lütfen daha sonra tekrar deneyin.";
        }
        // 400 Bad Request hatası için
        if (err.message.includes("400") || err.message.includes("Bad Request")) {
          errorMessage = "Geçersiz istek. Lütfen tüm alanları kontrol edin.";
        }
        // 500 Internal Server Error için
        if (err.message.includes("500") || err.message.includes("Internal Server Error")) {
          errorMessage = "Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.";
        }
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSchedule = async () => {
    try {
      const requestBody = {
        reportType: scheduleReportType,
        format: scheduleFormat,
        cronExpression: scheduleCron,
        timezone: scheduleTimezone,
      };

      // Email opsiyonel - varsa ekle
      if (scheduleEmail.trim()) {
        requestBody.email = scheduleEmail.trim();
      }

      // Tarih parametreleri opsiyonel - varsa ekle
      if (scheduleStartDate && scheduleEndDate) {
        requestBody.parameters = {
          StartDate: new Date(scheduleStartDate).toISOString(),
          EndDate: new Date(scheduleEndDate).toISOString(),
        };
      }

      await createReportSchedule(requestBody);

      toast.success("Zamanlanmış rapor başarıyla oluşturuldu");
      setShowScheduleModal(false);
      loadSchedules();
      
      // Form'u temizle
      setScheduleEmail("");
      setScheduleStartDate("");
      setScheduleEndDate("");
    } catch (err) {
      console.error("Zamanlama oluşturulamadı:", err);
      let errorMessage = "Zamanlanmış rapor oluşturulamadı";
      
      if (err?.message) {
        errorMessage = err.message;
        // 404 Not Found hatası için özel mesaj
        if (err.message.includes("404") || err.message.includes("Not Found")) {
          errorMessage = "Rapor servisi şu anda kullanılamıyor. Lütfen daha sonra tekrar deneyin.";
        }
        // 400 Bad Request hatası için
        if (err.message.includes("400") || err.message.includes("Bad Request")) {
          errorMessage = "Geçersiz istek. Lütfen tüm alanları kontrol edin.";
        }
      }
      
      toast.error(errorMessage);
    }
  };

  const handleDeleteSchedule = async (scheduleId) => {
    if (!confirm("Bu zamanlanmış raporu silmek istediğinize emin misiniz?")) {
      return;
    }

    try {
      await deleteReportSchedule(scheduleId);
      toast.success("Zamanlanmış rapor başarıyla silindi");
      loadSchedules();
    } catch (err) {
      console.error("Zamanlama silinemedi:", err);
      let errorMessage = "Zamanlanmış rapor silinemedi";
      
      if (err?.message) {
        errorMessage = err.message;
        if (err.message.includes("404") || err.message.includes("Not Found")) {
          errorMessage = "Zamanlanmış rapor bulunamadı";
        }
      }
      
      toast.error(errorMessage);
    }
  };

  const getReportTypeIcon = (type) => {
    switch (type) {
      case "StandardSalesReport":
        return <BarChart3 className="w-5 h-5" />;
      case "TopProductSalesReport":
        return <TrendingUp className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getReportTypeLabel = (type) => {
    const labels = {
      StandardSalesReport: "Standart Satış Raporu",
      TopProductSalesReport: "En Çok Satılan Ürünler Raporu",
    };
    return labels[type] || type;
  };

  const getFormatLabel = (formatValue) => {
    return formatValue === 0 ? "PDF" : "Excel";
  };

  const getFormatIcon = (formatValue) => {
    return formatValue === 0 ? <FileText className="w-5 h-5" /> : <FileSpreadsheet className="w-5 h-5" />;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { label: "Tamamlandı", color: "bg-green-100 text-green-700" },
      pending: { label: "Beklemede", color: "bg-yellow-100 text-yellow-700" },
      processing: { label: "İşleniyor", color: "bg-blue-100 text-blue-700" },
      failed: { label: "Başarısız", color: "bg-red-100 text-red-700" },
    };
    const config = statusConfig[status] || { label: status, color: "bg-gray-100 text-gray-700" };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getCronDescription = (cron) => {
    // Basit cron açıklamaları
    const descriptions = {
      "0 8 * * *": "Her Gün 08:00",
      "0 8 * * 1": "Her Pazartesi 08:00",
      "0 9 * * 1": "Her Pazartesi 09:00",
      "0 9 * * *": "Her Gün 09:00",
      "0 9 1 * *": "Her Ayın 1'i 09:00",
      "0 10 * * 1": "Her Pazartesi 10:00",
      "0 0 * * 0": "Her Pazar 00:00",
      "0 */6 * * *": "Her 6 Saatte Bir",
    };
    return descriptions[cron] || cron;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 text-white shadow-xl relative overflow-hidden">
        {/* Dekoratif arka plan */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
        <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl hidden sm:block"></div>
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-purple-400/20 rounded-full blur-3xl hidden sm:block"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 relative z-10">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg flex-shrink-0">
              <BarChart3 size={24} className="sm:w-8 sm:h-8" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1">Satış Raporları</h1>
              <p className="text-emerald-100 text-xs sm:text-sm lg:text-base">
                Raporlarınızı oluşturun ve zamanlayın
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Export Form */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 border border-gray-100">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <Download className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Rapor İndir</h2>
            </div>

            <div className="space-y-4 sm:space-y-6">
              {/* Rapor Türü */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Rapor Türü
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { value: "StandardSalesReport", label: "Standart Satış Raporu", icon: <BarChart3 className="w-5 h-5" /> },
                    { value: "TopProductSalesReport", label: "En Çok Satılan Ürünler Raporu", icon: <TrendingUp className="w-5 h-5" /> },
                  ].map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setReportType(type.value)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all ${
                        reportType === type.value
                          ? "border-emerald-600 bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 shadow-md"
                          : "border-gray-200 bg-white text-gray-700 hover:border-emerald-300 hover:shadow"
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${
                        reportType === type.value ? "bg-emerald-100" : "bg-gray-100"
                      }`}>
                        {type.icon}
                      </div>
                      <span className="font-semibold">{type.label}</span>
                      {reportType === type.value && (
                        <CheckCircle className="w-5 h-5 ml-auto text-emerald-600" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Format */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Dosya Formatı
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setFormat(0)}
                    className={`flex flex-col items-center justify-center gap-2 px-4 py-4 rounded-xl border-2 transition-all ${
                      format === 0
                        ? "border-emerald-600 bg-gradient-to-br from-emerald-50 to-teal-50 text-emerald-700 shadow-md"
                        : "border-gray-200 bg-white text-gray-700 hover:border-emerald-300 hover:shadow"
                    }`}
                  >
                    <div className={`p-3 rounded-xl ${
                      format === 0 ? "bg-emerald-100" : "bg-gray-100"
                    }`}>
                      <FileText className="w-6 h-6" />
                    </div>
                    <span className="font-bold">PDF</span>
                    {format === 0 && (
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    )}
                  </button>
                  <button
                    onClick={() => setFormat(1)}
                    className={`flex flex-col items-center justify-center gap-2 px-4 py-4 rounded-xl border-2 transition-all ${
                      format === 1
                        ? "border-emerald-600 bg-gradient-to-br from-emerald-50 to-teal-50 text-emerald-700 shadow-md"
                        : "border-gray-200 bg-white text-gray-700 hover:border-emerald-300 hover:shadow"
                    }`}
                  >
                    <div className={`p-3 rounded-xl ${
                      format === 1 ? "bg-emerald-100" : "bg-gray-100"
                    }`}>
                      <FileSpreadsheet className="w-6 h-6" />
                    </div>
                    <span className="font-bold">Excel</span>
                    {format === 1 && (
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Tarih Aralığı (Opsiyonel) */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                  Tarih Aralığı <span className="text-gray-400 font-normal text-xs">(Opsiyonel)</span>
                </label>
                <div className="space-y-4">
                  {/* Başlangıç Tarihi */}
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm"></div>
                      <span>Başlangıç Tarihi</span>
                      <span className="text-gray-400 font-normal text-xs">(GG/AA/YYYY)</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600 pointer-events-none z-10">
                        <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full pl-10 sm:pl-11 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm border-2 border-emerald-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition bg-emerald-50/50 hover:bg-emerald-50 font-medium"
                      />
                    </div>
                    {startDate && (
                      <p className="text-xs text-emerald-600 mt-1.5 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        {new Date(startDate).toLocaleDateString("tr-TR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric"
                        })}
                      </p>
                    )}
                  </div>
                  
                  {/* Bitiş Tarihi */}
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-teal-500 shadow-sm"></div>
                      <span>Bitiş Tarihi</span>
                      <span className="text-gray-400 font-normal text-xs">(GG/AA/YYYY)</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-600 pointer-events-none z-10">
                        <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full pl-10 sm:pl-11 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm border-2 border-teal-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition bg-teal-50/50 hover:bg-teal-50 font-medium"
                      />
                    </div>
                    {endDate && (
                      <p className="text-xs text-teal-600 mt-1.5 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        {new Date(endDate).toLocaleDateString("tr-TR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric"
                        })}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Export Button */}
              <button
                onClick={handleExport}
                disabled={loading}
                className="w-full py-3 sm:py-3.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 text-white rounded-xl font-bold hover:from-emerald-700 hover:via-teal-700 hover:to-green-700 hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="hidden sm:inline">Rapor Oluşturuluyor...</span>
                    <span className="sm:hidden">Oluşturuluyor...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    Raporu Oluştur ve İndir
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Schedule Form */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4 sm:mb-6 flex-wrap gap-2">
              <div className="flex items-center gap-2 sm:gap-3">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Zamanlanmış Raporlar</h2>
              </div>
              <button
                onClick={() => setShowScheduleModal(true)}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition text-sm sm:text-base"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Yeni</span>
              </button>
            </div>

            {loadingSchedules ? (
              <div className="flex justify-center py-12">
                <TedarikaLoader variant="compact" />
              </div>
            ) : schedules.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 mb-4 shadow-lg">
                  <Clock className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-700 mb-2">Zamanlanmış Rapor Yok</h3>
                <p className="text-sm text-gray-500 mb-4">Otomatik rapor oluşturmak için yeni bir zamanlama ekleyin</p>
                <button
                  onClick={() => setShowScheduleModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition text-sm font-semibold"
                >
                  <Plus className="w-4 h-4" />
                  İlk Zamanlamayı Oluştur
                </button>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {schedules.map((schedule) => (
                  <div
                    key={schedule.id}
                    className="p-4 border-2 border-gray-200 rounded-xl hover:border-emerald-300 hover:shadow-md transition-all bg-gradient-to-br from-white to-gray-50"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="p-2 rounded-lg bg-emerald-100 flex-shrink-0">
                          {getReportTypeIcon(schedule.reportType)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <p className="font-bold text-gray-900 text-sm sm:text-base">
                              {getReportTypeLabel(schedule.reportType)}
                            </p>
                            {schedule.isActive ? (
                              <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold whitespace-nowrap">
                                Aktif
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold whitespace-nowrap">
                                Pasif
                              </span>
                            )}
                          </div>
                          {schedule.email && (
                            <p className="text-xs sm:text-sm text-gray-600 flex items-center gap-2 mt-1 truncate">
                              <Mail className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                              <span className="truncate">{schedule.email}</span>
                            </p>
                          )}
                          <p className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                            <RefreshCw className="w-3 h-3 flex-shrink-0" />
                            <span>{getCronDescription(schedule.cronExpression)}</span>
                          </p>
                          {schedule.nextRunAt && (
                            <p className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                              <Clock className="w-3 h-3 flex-shrink-0" />
                              <span>Sonraki: {new Date(schedule.nextRunAt).toLocaleString("tr-TR", { 
                                day: '2-digit', 
                                month: '2-digit', 
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}</span>
                            </p>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteSchedule(schedule.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all flex-shrink-0"
                        title="Sil"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Export History */}
        <div className="mt-4 sm:mt-6 bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 border border-gray-100">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">İndirme Geçmişi</h2>
          </div>

          {loadingHistory ? (
            <div className="flex justify-center py-12">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                <p className="text-sm text-gray-500">Rapor geçmişi yükleniyor...</p>
              </div>
            </div>
          ) : exportHistory.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 mb-4 shadow-lg">
                <FileText className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-700 mb-2">Henüz Rapor Oluşturulmadı</h3>
              <p className="text-sm text-gray-500">Oluşturduğunuz raporlar burada görünecektir</p>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gradient-to-r from-emerald-50 to-teal-50">
                      <tr>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-bold text-emerald-800 uppercase">
                          Rapor Türü
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-bold text-emerald-800 uppercase hidden sm:table-cell">
                          Format
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-bold text-emerald-800 uppercase hidden md:table-cell">
                          Durum
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-bold text-emerald-800 uppercase hidden lg:table-cell">
                          Son Kullanma
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-bold text-emerald-800 uppercase">
                          İşlem
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {exportHistory.map((item) => (
                        <tr key={item.id} className="hover:bg-emerald-50 transition">
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              {getReportTypeIcon(item.reportType)}
                              <div className="min-w-0">
                                <span className="font-semibold text-gray-900 text-sm">
                                  {getReportTypeLabel(item.reportType)}
                                </span>
                                <div className="sm:hidden mt-1">
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs font-semibold">
                                    {getFormatIcon(item.format)}
                                    {getFormatLabel(item.format)}
                                  </span>
                                </div>
                                <div className="md:hidden mt-1">
                                  {getStatusBadge(item.status)}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap hidden sm:table-cell">
                            <span className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold">
                              {getFormatIcon(item.format)}
                              {getFormatLabel(item.format)}
                            </span>
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap hidden md:table-cell">
                            {getStatusBadge(item.status)}
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm text-gray-600 whitespace-nowrap hidden lg:table-cell">
                            {item.expiresAt
                              ? new Date(item.expiresAt).toLocaleString("tr-TR")
                              : "—"}
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                            {item.storagePath && item.status === "completed" ? (
                              <button
                                onClick={() => window.open(item.storagePath, "_blank")}
                                className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition text-xs sm:text-sm font-semibold"
                              >
                                <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span className="hidden sm:inline">İndir</span>
                              </button>
                            ) : (
                              <span className="text-gray-400 text-xs sm:text-sm">—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Schedule Modal */}
      <AnimatePresence>
        {showScheduleModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowScheduleModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-md w-full mx-4 p-4 sm:p-6 max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">
                Zamanlanmış Rapor Oluştur
              </h3>

              <div className="space-y-4 sm:space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Rapor Türü
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { value: "StandardSalesReport", label: "Standart Satış Raporu", icon: <BarChart3 className="w-4 h-4" /> },
                      { value: "TopProductSalesReport", label: "En Çok Satılan Ürünler Raporu", icon: <TrendingUp className="w-4 h-4" /> },
                    ].map((type) => (
                      <button
                        key={type.value}
                        onClick={() => setScheduleReportType(type.value)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all text-sm ${
                          scheduleReportType === type.value
                            ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                            : "border-gray-200 bg-white text-gray-700 hover:border-emerald-300"
                        }`}
                      >
                        {type.icon}
                        <span className="font-medium">{type.label}</span>
                        {scheduleReportType === type.value && (
                          <CheckCircle className="w-4 h-4 ml-auto text-emerald-600" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Format
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setScheduleFormat(0)}
                      className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                        scheduleFormat === 0
                          ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                          : "border-gray-200 bg-white text-gray-700 hover:border-emerald-300"
                      }`}
                    >
                      <FileText className="w-5 h-5" />
                      <span className="font-semibold">PDF</span>
                    </button>
                    <button
                      onClick={() => setScheduleFormat(1)}
                      className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                        scheduleFormat === 1
                          ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                          : "border-gray-200 bg-white text-gray-700 hover:border-emerald-300"
                      }`}
                    >
                      <FileSpreadsheet className="w-5 h-5" />
                      <span className="font-semibold">Excel</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    E-posta Adresi <span className="text-gray-400 font-normal text-xs">(Opsiyonel)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <Mail className="w-5 h-5" />
                    </div>
                    <input
                      type="email"
                      value={scheduleEmail}
                      onChange={(e) => setScheduleEmail(e.target.value)}
                      placeholder="ornek@email.com"
                      className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Zamanlama
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { value: "0 8 * * *", label: "Her Gün 08:00" },
                      { value: "0 8 * * 1", label: "Her Pazartesi 08:00" },
                      { value: "0 10 * * 1", label: "Her Pazartesi 10:00" },
                      { value: "0 9 1 * *", label: "Her Ayın 1'i 09:00" },
                    ].map((cron) => (
                      <button
                        key={cron.value}
                        onClick={() => setScheduleCron(cron.value)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all text-sm ${
                          scheduleCron === cron.value
                            ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                            : "border-gray-200 bg-white text-gray-700 hover:border-emerald-300"
                        }`}
                      >
                        <RefreshCw className="w-4 h-4" />
                        <span className="font-medium">{cron.label}</span>
                        {scheduleCron === cron.value && (
                          <CheckCircle className="w-4 h-4 ml-auto text-emerald-600" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Tarih Aralığı <span className="text-gray-400 font-normal text-xs">(Opsiyonel)</span>
                  </label>
                  <div className="space-y-4">
                    {/* Başlangıç Tarihi */}
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm"></div>
                        <span>Başlangıç Tarihi</span>
                        <span className="text-gray-400 font-normal text-xs">(GG/AA/YYYY)</span>
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600 pointer-events-none z-10">
                          <Calendar className="w-4 h-4" />
                        </div>
                        <input
                          type="date"
                          value={scheduleStartDate}
                          onChange={(e) => setScheduleStartDate(e.target.value)}
                          className="w-full pl-10 pr-3 py-2 border-2 border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition text-sm bg-emerald-50/50 hover:bg-emerald-50 font-medium"
                        />
                      </div>
                      {scheduleStartDate && (
                        <p className="text-xs text-emerald-600 mt-1.5 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          {new Date(scheduleStartDate).toLocaleDateString("tr-TR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric"
                          })}
                        </p>
                      )}
                    </div>
                    
                    {/* Bitiş Tarihi */}
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-teal-500 shadow-sm"></div>
                        <span>Bitiş Tarihi</span>
                        <span className="text-gray-400 font-normal text-xs">(GG/AA/YYYY)</span>
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-600 pointer-events-none z-10">
                          <Calendar className="w-4 h-4" />
                        </div>
                        <input
                          type="date"
                          value={scheduleEndDate}
                          onChange={(e) => setScheduleEndDate(e.target.value)}
                          className="w-full pl-10 pr-3 py-2 border-2 border-teal-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition text-sm bg-teal-50/50 hover:bg-teal-50 font-medium"
                        />
                      </div>
                      {scheduleEndDate && (
                        <p className="text-xs text-teal-600 mt-1.5 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          {new Date(scheduleEndDate).toLocaleDateString("tr-TR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric"
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowScheduleModal(false)}
                    className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 rounded-xl font-semibold text-gray-700 transition-all duration-200 hover:shadow-md"
                  >
                    İptal
                  </button>
                  <button
                    onClick={handleCreateSchedule}
                    className="flex-1 py-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 text-white rounded-xl font-semibold hover:from-emerald-700 hover:via-teal-700 hover:to-green-700 hover:shadow-xl transition-all duration-300"
                  >
                    Oluştur
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

export default SalesReportsPage;
