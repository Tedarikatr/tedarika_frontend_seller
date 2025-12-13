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
  Package,
  Users,
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
  const [reportType, setReportType] = useState("DailySales");
  const [format, setFormat] = useState("Pdf");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  // Schedule Form State
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleReportType, setScheduleReportType] = useState("DailySales");
  const [scheduleFormat, setScheduleFormat] = useState("Pdf");
  const [scheduleEmail, setScheduleEmail] = useState("");
  const [scheduleCron, setScheduleCron] = useState("0 9 * * 1"); // Her pazartesi 09:00
  const [scheduleTimezone, setScheduleTimezone] = useState("Europe/Istanbul");

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
    if (!startDate || !endDate) {
      toast.error("Lütfen tarih aralığı seçin");
      return;
    }

    setLoading(true);
    try {
      const blob = await exportSalesReport({
        reportType,
        format,
        filter: {
          startDate: new Date(startDate).toISOString(),
          endDate: new Date(endDate).toISOString(),
        },
      });

      // Dosyayı indir
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `sales-report-${reportType}-${startDate}-${endDate}.${format.toLowerCase()}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("Rapor başarıyla indirildi");
      loadExportHistory();
    } catch (err) {
      console.error("Rapor oluşturulamadı:", err);
      toast.error("Rapor oluşturulamadı");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSchedule = async () => {
    if (!scheduleEmail) {
      toast.error("Lütfen e-posta adresi girin");
      return;
    }

    try {
      await createReportSchedule({
        reportType: scheduleReportType,
        format: scheduleFormat,
        email: scheduleEmail,
        cronExpression: scheduleCron,
        timezone: scheduleTimezone,
        parameters: {},
      });

      toast.success("Zamanlanmış rapor oluşturuldu");
      setShowScheduleModal(false);
      loadSchedules();
      
      // Form'u temizle
      setScheduleEmail("");
    } catch (err) {
      console.error("Zamanlama oluşturulamadı:", err);
      toast.error("Zamanlama oluşturulamadı");
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
      case "DailySales":
        return <Calendar className="w-5 h-5" />;
      case "MonthlySales":
        return <BarChart3 className="w-5 h-5" />;
      case "ProductSales":
        return <Package className="w-5 h-5" />;
      case "CategorySales":
        return <TrendingUp className="w-5 h-5" />;
      case "CustomerSales":
        return <Users className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getReportTypeLabel = (type) => {
    const labels = {
      DailySales: "Günlük Satışlar",
      MonthlySales: "Aylık Satışlar",
      ProductSales: "Ürün Bazlı",
      CategorySales: "Kategori Bazlı",
      CustomerSales: "Müşteri Bazlı",
    };
    return labels[type] || type;
  };

  const getCronDescription = (cron) => {
    // Basit cron açıklamaları
    const descriptions = {
      "0 9 * * 1": "Her Pazartesi 09:00",
      "0 9 * * *": "Her Gün 09:00",
      "0 9 1 * *": "Her Ayın 1'i 09:00",
      "0 0 * * 0": "Her Pazar 00:00",
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
                    { value: "DailySales", label: "Günlük Satışlar", icon: <Calendar className="w-5 h-5" /> },
                    { value: "MonthlySales", label: "Aylık Satışlar", icon: <BarChart3 className="w-5 h-5" /> },
                    { value: "ProductSales", label: "Ürün Bazlı", icon: <Package className="w-5 h-5" /> },
                    { value: "CategorySales", label: "Kategori Bazlı", icon: <TrendingUp className="w-5 h-5" /> },
                    { value: "CustomerSales", label: "Müşteri Bazlı", icon: <Users className="w-5 h-5" /> },
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
                    onClick={() => setFormat("Pdf")}
                    className={`flex flex-col items-center justify-center gap-2 px-4 py-4 rounded-xl border-2 transition-all ${
                      format === "Pdf"
                        ? "border-emerald-600 bg-gradient-to-br from-emerald-50 to-teal-50 text-emerald-700 shadow-md"
                        : "border-gray-200 bg-white text-gray-700 hover:border-emerald-300 hover:shadow"
                    }`}
                  >
                    <div className={`p-3 rounded-xl ${
                      format === "Pdf" ? "bg-emerald-100" : "bg-gray-100"
                    }`}>
                      <FileText className="w-6 h-6" />
                    </div>
                    <span className="font-bold">PDF</span>
                    {format === "Pdf" && (
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    )}
                  </button>
                  <button
                    onClick={() => setFormat("Xlsx")}
                    className={`flex flex-col items-center justify-center gap-2 px-4 py-4 rounded-xl border-2 transition-all ${
                      format === "Xlsx"
                        ? "border-emerald-600 bg-gradient-to-br from-emerald-50 to-teal-50 text-emerald-700 shadow-md"
                        : "border-gray-200 bg-white text-gray-700 hover:border-emerald-300 hover:shadow"
                    }`}
                  >
                    <div className={`p-3 rounded-xl ${
                      format === "Xlsx" ? "bg-emerald-100" : "bg-gray-100"
                    }`}>
                      <FileSpreadsheet className="w-6 h-6" />
                    </div>
                    <span className="font-bold">Excel</span>
                    {format === "Xlsx" && (
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Tarih Aralığı */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Tarih Aralığı
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
                      <div className="flex items-start gap-3">
                        {getReportTypeIcon(schedule.reportType)}
                        <div>
                          <p className="font-bold text-gray-900">
                            {getReportTypeLabel(schedule.reportType)}
                          </p>
                          <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                            <Mail className="w-4 h-4" />
                            {schedule.email}
                          </p>
                          <p className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                            <RefreshCw className="w-3 h-3" />
                            {getCronDescription(schedule.cronExpression)}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteSchedule(schedule.id)}
                        className="text-red-600 hover:text-red-700 transition"
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
                      Tarih Aralığı
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-emerald-800 uppercase">
                      İndirilme Tarihi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {exportHistory.map((item, index) => (
                    <tr key={index} className="hover:bg-emerald-50 transition">
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
                          {item.format === "Pdf" ? (
                            <FileText className="w-4 h-4" />
                          ) : (
                            <FileSpreadsheet className="w-4 h-4" />
                          )}
                          {item.format}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {item.startDate && item.endDate
                          ? `${new Date(item.startDate).toLocaleDateString("tr-TR")} - ${new Date(item.endDate).toLocaleDateString("tr-TR")}`
                          : "—"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {item.createdAt
                          ? new Date(item.createdAt).toLocaleString("tr-TR")
                          : "—"}
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
                  <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
                    {[
                      { value: "DailySales", label: "Günlük Satışlar", icon: <Calendar className="w-4 h-4" /> },
                      { value: "MonthlySales", label: "Aylık Satışlar", icon: <BarChart3 className="w-4 h-4" /> },
                      { value: "ProductSales", label: "Ürün Bazlı", icon: <Package className="w-4 h-4" /> },
                      { value: "CategorySales", label: "Kategori Bazlı", icon: <TrendingUp className="w-4 h-4" /> },
                      { value: "CustomerSales", label: "Müşteri Bazlı", icon: <Users className="w-4 h-4" /> },
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
                      onClick={() => setScheduleFormat("Pdf")}
                      className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                        scheduleFormat === "Pdf"
                          ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                          : "border-gray-200 bg-white text-gray-700 hover:border-emerald-300"
                      }`}
                    >
                      <FileText className="w-5 h-5" />
                      <span className="font-semibold">PDF</span>
                    </button>
                    <button
                      onClick={() => setScheduleFormat("Xlsx")}
                      className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                        scheduleFormat === "Xlsx"
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
                    E-posta Adresi
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
                      { value: "0 9 * * 1", label: "Her Pazartesi 09:00" },
                      { value: "0 9 * * *", label: "Her Gün 09:00" },
                      { value: "0 9 1 * *", label: "Her Ayın 1'i 09:00" },
                      { value: "0 0 * * 0", label: "Her Pazar 00:00" },
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
