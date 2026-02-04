import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchProductDrafts } from "@/api/sellerProductDraftService";
import { DRAFT_STATUS_LABELS, SOURCE_TYPE_LABELS } from "@/constants/productDraftStatus";
import { useToast } from "@/contexts/ToastContext";
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  FileSpreadsheet,
  FileCode,
  Upload,
  Sparkles,
  Package,
  AlertCircle,
  ExternalLink,
  Calendar,
  Tag,
  Loader2,
  SkipForward,
} from "lucide-react";

const ProductDraftsPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, pending, approved, rejected

  useEffect(() => {
    loadDrafts();
  }, []);

  const loadDrafts = async () => {
    setLoading(true);
    try {
      const data = await fetchProductDrafts();
      setDrafts(data || []);
    } catch (err) {
      console.error("Ürün başvuruları yüklenemedi:", err);
      toast.error("Ürün başvuruları yüklenemedi");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    const statusKey = typeof status === "number" ? status : status;
    const config = DRAFT_STATUS_LABELS[statusKey];
    
    if (!config) return <AlertCircle className="w-5 h-5" />;
    
    switch (config.icon) {
      case "Clock":
        return <Clock className="w-5 h-5" />;
      case "CheckCircle":
        return <CheckCircle className="w-5 h-5" />;
      case "XCircle":
        return <XCircle className="w-5 h-5" />;
      case "Loader2":
        return <Loader2 className="w-5 h-5 animate-spin" />;
      case "SkipForward":
        return <SkipForward className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  const getSourceIcon = (sourceType) => {
    const config = SOURCE_TYPE_LABELS[sourceType] || SOURCE_TYPE_LABELS.Json;
    
    if (!config) return <FileText className="w-5 h-5" />;
    
    switch (config.icon) {
      case "FileSpreadsheet":
        return <FileSpreadsheet className="w-5 h-5" />;
      case "FileCode":
        return <FileCode className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getStatusBadgeClass = (statusKey) => {
    const config = DRAFT_STATUS_LABELS[statusKey];
    if (!config) return "bg-gray-100 text-gray-800 border-gray-200";
    
    switch (config.color) {
      case "amber":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "green":
        return "bg-green-100 text-green-800 border-green-200";
      case "red":
        return "bg-red-100 text-red-800 border-red-200";
      case "blue":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "gray":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getSourceBadgeClass = (sourceType) => {
    const config = SOURCE_TYPE_LABELS[sourceType] || SOURCE_TYPE_LABELS.Json;
    if (!config) return "bg-gray-100 text-gray-800";
    
    switch (config.color) {
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

  const filteredDrafts = drafts.filter((draft) => {
    if (filter === "all") return true;
    if (filter === "pending") return draft.status === "Pending" || draft.status === 0;
    if (filter === "approved") return draft.status === "Approved" || draft.status === 1;
    if (filter === "rejected") return draft.status === "Rejected" || draft.status === 2;
    return true;
  });

  const stats = {
    total: drafts.length,
    pending: drafts.filter((d) => d.status === "Pending" || d.status === 0).length,
    approved: drafts.filter((d) => d.status === "Approved" || d.status === 1).length,
    rejected: drafts.filter((d) => d.status === "Rejected" || d.status === 2).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg flex-shrink-0">
                <FileText className="w-6 h-6 sm:w-8 sm:h-8 animate-pulse" />
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold mb-1 flex flex-wrap items-center gap-2">
                  Ürün Başvuruları
                  <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-300 flex-shrink-0" />
                </h1>
                <p className="text-emerald-100 text-xs sm:text-sm">
                  Toplu ürün yükleme başvurularınızı görüntüleyin
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate("/seller/products/draft/upload")}
              className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-xl font-semibold transition-all border border-white/30 text-sm sm:text-base"
            >
              <Upload className="w-5 h-5" />
              Yeni Başvuru
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Toplam"
            value={stats.total}
            icon={Package}
            gradient="from-blue-500 to-indigo-500"
            bgGradient="from-blue-50 to-indigo-50"
            active={filter === "all"}
            onClick={() => setFilter("all")}
          />
          <StatCard
            label="Beklemede"
            value={stats.pending}
            icon={Clock}
            gradient="from-amber-500 to-orange-500"
            bgGradient="from-amber-50 to-orange-50"
            active={filter === "pending"}
            onClick={() => setFilter("pending")}
          />
          <StatCard
            label="Onaylandı"
            value={stats.approved}
            icon={CheckCircle}
            gradient="from-green-500 to-emerald-500"
            bgGradient="from-green-50 to-emerald-50"
            active={filter === "approved"}
            onClick={() => setFilter("approved")}
          />
          <StatCard
            label="Reddedildi"
            value={stats.rejected}
            icon={XCircle}
            gradient="from-red-500 to-rose-500"
            bgGradient="from-red-50 to-rose-50"
            active={filter === "rejected"}
            onClick={() => setFilter("rejected")}
          />
        </div>

        {/* Drafts List */}
        <div className="bg-white rounded-3xl shadow-2xl border-2 border-gray-200 overflow-hidden">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 mb-4 animate-pulse shadow-xl">
                <Loader2 size={40} className="text-white animate-spin" />
              </div>
              <p className="text-gray-600 font-medium text-lg">Yükleniyor...</p>
            </div>
          ) : filteredDrafts.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 mb-6 shadow-lg">
                <FileText size={48} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">Başvuru Bulunmuyor</h3>
              <p className="text-gray-500 text-sm mb-6">
                Henüz ürün başvurunuz bulunmamaktadır
              </p>
              <button
                onClick={() => navigate("/seller/products/draft/upload")}
                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                İlk Başvuruyu Yap
              </button>
            </div>
          ) : (
            <>
              {/* Mobil kart görünümü */}
              <div className="xl:hidden space-y-3 p-4 sm:p-0">
                {filteredDrafts.map((draft) => {
                  const statusKey = typeof draft.status === "number" ? draft.status : draft.status;
                  const statusConfig = DRAFT_STATUS_LABELS[statusKey] || { text: "Bilinmiyor", color: "gray", icon: "AlertCircle" };
                  const sourceConfig = SOURCE_TYPE_LABELS[draft.sourceType] || SOURCE_TYPE_LABELS.Json;
                  return (
                    <div
                      key={draft.id}
                      className="bg-white border-2 border-gray-200 rounded-xl p-4 shadow-sm hover:border-emerald-300 transition-all"
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold text-gray-900 truncate">{draft.name}</h3>
                          {draft.description && (
                            <p className="text-xs text-gray-500 mt-1 truncate">{draft.description}</p>
                          )}
                        </div>
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${getStatusBadgeClass(statusKey)} text-xs font-bold border flex-shrink-0`}>
                          {getStatusIcon(draft.status)}
                          {statusConfig.text}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs text-gray-600 mb-3">
                        <span className="inline-flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          {draft.brandName || "—"}
                        </span>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded ${getSourceBadgeClass(draft.sourceType)}`}>
                          {getSourceIcon(draft.sourceType)}
                          {sourceConfig.text}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(draft.createdAt).toLocaleDateString("tr-TR")}
                        </span>
                      </div>
                      {draft.sourceReference && (
                        <a
                          href={draft.sourceReference}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-semibold"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Dosya
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
              {/* Masaüstü tablo görünümü */}
              <div className="hidden xl:block overflow-x-auto table-scroll-touch">
              <table className="min-w-full">
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
                  {filteredDrafts.map((draft) => {
                    const statusKey = typeof draft.status === "number" ? draft.status : draft.status;
                    const statusConfig = DRAFT_STATUS_LABELS[statusKey] || { text: "Bilinmiyor", color: "gray", icon: "AlertCircle" };
                    const sourceConfig = SOURCE_TYPE_LABELS[draft.sourceType] || SOURCE_TYPE_LABELS.Json;

                    return (
                      <tr
                        key={draft.id}
                        className="hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 transition-all duration-200"
                      >
                        {/* Ürün */}
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-bold text-gray-900">{draft.name}</div>
                            <div className="text-xs text-gray-500 mt-1 max-w-xs truncate">
                              {draft.description}
                            </div>
                            {draft.excelRowReference && (
                              <div className="text-xs text-blue-600 mt-1">
                                {draft.excelRowReference}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Marka */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Tag className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-700 font-medium">
                              {draft.brandName || "—"}
                            </span>
                          </div>
                        </td>

                        {/* Kaynak */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg ${getSourceBadgeClass(draft.sourceType)} text-xs font-bold`}>
                            {getSourceIcon(draft.sourceType)}
                            {sourceConfig.text}
                          </div>
                        </td>

                        {/* Tarih */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            {new Date(draft.createdAt).toLocaleDateString("tr-TR")}
                          </div>
                        </td>

                        {/* Durum */}
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg ${getStatusBadgeClass(statusKey)} text-xs font-bold border`}>
                            {getStatusIcon(draft.status)}
                            {statusConfig.text}
                          </span>
                        </td>

                        {/* İşlem */}
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          {draft.sourceReference && (
                            <a
                              href={draft.sourceReference}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold hover:shadow-lg hover:scale-105 transition-all duration-300"
                            >
                              <ExternalLink className="w-4 h-4" />
                              Dosya
                            </a>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ label, value, icon: Icon, gradient, bgGradient, active, onClick }) => (
  <button
    onClick={onClick}
    className={`bg-gradient-to-br ${bgGradient} rounded-xl sm:rounded-2xl p-4 sm:p-5 border-2 shadow-lg hover:shadow-xl transition-all cursor-pointer ${
      active ? `border-${gradient.split("-")[1]}-400 ring-4 ring-${gradient.split("-")[1]}-100` : "border-gray-200"
    }`}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs font-semibold text-gray-700 mb-1">{label}</p>
        <p className="text-2xl sm:text-3xl font-bold text-gray-800">{value}</p>
      </div>
      <div className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-lg sm:rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-lg`}>
        <Icon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
      </div>
    </div>
  </button>
);

export default ProductDraftsPage;
