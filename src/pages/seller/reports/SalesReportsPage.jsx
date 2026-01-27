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
      setExportHistory(data || []);
    } catch (err) {
      console.error("Export geçmişi yüklenemedi:", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const loadSchedules = async () => {
    setLoadingSchedules(true);
    try {
      const data = await getReportSchedules();
      setSchedules(data || []);
    } catch (err) {
      console.error("Zamanlanmış raporlar yüklenemedi:", err);
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
      } else {
        toast.error("Rapor oluşturuldu ancak indirme linki bulunamadı");
      }

      loadExportHistory();
    } catch (err) {
      console.error("Rapor oluşturulamadı:", err);
      const errorMessage = err?.response?.data?.message || err?.message || "Rapor oluşturulamadı";
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

      toast.success("Zamanlanmış rapor oluşturuldu");
      setShowScheduleModal(false);
      loadSchedules();
      
      // Form'u temizle
      setScheduleEmail("");
      setScheduleStartDate("");
      setScheduleEndDate("");
    } catch (err) {
      console.error("Zamanlama oluşturulamadı:", err);
      const errorMessage = err?.response?.data?.message || err?.message || "Zamanlama oluşturulamadı";
      toast.error(errorMessage);
    }
  };

  const handleDeleteSchedule = async (scheduleId) => {
    if (!confirm("Bu zamanlanmış raporu silmek istediğinize emin misiniz?")) {
      return;
    }

    try {
      await deleteReportSchedule(scheduleId);
      toast.success("Zamanlanmış rapor silindi");
      loadSchedules();
    } catch (err) {
      console.error("Zamanlama silinemedi:", err);
      toast.error("Zamanlama silinemedi");
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
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
              <BarChart3 size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-1">Satış Raporları</h1>
              <p className="text-emerald-100 text-sm">
                Raporlarınızı oluşturun ve zamanlayın
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Export Form */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <Download className="w-6 h-6 text-emerald-600" />
              <h2 className="text-xl font-bold text-gray-900">Rapor İndir</h2>
            </div>

            <div className="space-y-6">
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
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Tarih Aralığı <span className="text-gray-400 font-normal text-xs">(Opsiyonel)</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                    />
                  </div>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                    />
                  </div>
                </div>
              </div>

              {/* Export Button */}
              <button
                onClick={handleExport}
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Oluşturuluyor...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    Raporu İndir
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Schedule Form */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Clock className="w-6 h-6 text-emerald-600" />
                <h2 className="text-xl font-bold text-gray-900">Zamanlanmış Raporlar</h2>
              </div>
              <button
                onClick={() => setShowScheduleModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
              >
                <Plus className="w-4 h-4" />
                Yeni
              </button>
            </div>

            {loadingSchedules ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
              </div>
            ) : schedules.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Zamanlanmış rapor yok</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {schedules.map((schedule) => (
                  <div
                    key={schedule.id}
                    className="p-4 border border-gray-200 rounded-lg hover:border-emerald-300 transition"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        {getReportTypeIcon(schedule.reportType)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-bold text-gray-900">
                              {getReportTypeLabel(schedule.reportType)}
                            </p>
                            {schedule.isActive ? (
                              <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                                Aktif
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                                Pasif
                              </span>
                            )}
                          </div>
                          {schedule.email && (
                            <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                              <Mail className="w-4 h-4" />
                              {schedule.email}
                            </p>
                          )}
                          <p className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                            <RefreshCw className="w-3 h-3" />
                            {getCronDescription(schedule.cronExpression)}
                          </p>
                          {schedule.nextRunAt && (
                            <p className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                              <Clock className="w-3 h-3" />
                              Sonraki: {new Date(schedule.nextRunAt).toLocaleString("tr-TR")}
                            </p>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteSchedule(schedule.id)}
                        className="text-red-600 hover:text-red-700 transition ml-2"
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
        <div className="mt-6 bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-6 h-6 text-emerald-600" />
            <h2 className="text-xl font-bold text-gray-900">İndirme Geçmişi</h2>
          </div>

          {loadingHistory ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            </div>
          ) : exportHistory.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Henüz rapor indirilmedi</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b-2 border-emerald-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-emerald-800 uppercase">
                      Rapor Türü
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-emerald-800 uppercase">
                      Format
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-emerald-800 uppercase">
                      Durum
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-emerald-800 uppercase">
                      Son Kullanma
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-emerald-800 uppercase">
                      İşlem
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {exportHistory.map((item) => (
                    <tr key={item.id} className="hover:bg-emerald-50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getReportTypeIcon(item.reportType)}
                          <span className="font-semibold text-gray-900">
                            {getReportTypeLabel(item.reportType)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold">
                          {getFormatIcon(item.format)}
                          {getFormatLabel(item.format)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(item.status)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {item.expiresAt
                          ? new Date(item.expiresAt).toLocaleString("tr-TR")
                          : "—"}
                      </td>
                      <td className="px-6 py-4">
                        {item.storagePath && item.status === "completed" ? (
                          <button
                            onClick={() => window.open(item.storagePath, "_blank")}
                            className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition text-sm font-semibold"
                          >
                            <Download className="w-4 h-4" />
                            İndir
                          </button>
                        ) : (
                          <span className="text-gray-400 text-sm">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Zamanlanmış Rapor Oluştur
              </h3>

              <div className="space-y-5">
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
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <input
                        type="date"
                        value={scheduleStartDate}
                        onChange={(e) => setScheduleStartDate(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition text-sm"
                      />
                    </div>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <input
                        type="date"
                        value={scheduleEndDate}
                        onChange={(e) => setScheduleEndDate(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowScheduleModal(false)}
                    className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 rounded-xl font-semibold text-gray-700 transition"
                  >
                    İptal
                  </button>
                  <button
                    onClick={handleCreateSchedule}
                    className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:opacity-90 transition"
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
