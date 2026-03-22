import { useEffect, useState, useMemo } from "react";
import { getMySellerQuotations } from "@/api/sellerQuotationService";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { 
  FileText, 
  Sparkles, 
  TrendingUp, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Package,
  Search,
  Filter
} from "lucide-react";
import TedarikaLoader from "@/components/ui/TedarikaLoader";

// ✅ Numeric-based status map with icons
const statusMap = {
  0: { 
    label: "Beklemede", 
    color: "bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border-yellow-300",
    icon: Clock
  },
  1: { 
    label: "Karşı Teklif Verildi", 
    color: "bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border-blue-300",
    icon: TrendingUp
  },
  2: { 
    label: "Satıcı Kabul Etti", 
    color: "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-300",
    icon: CheckCircle
  },
  3: { 
    label: "Satıcı Reddetti", 
    color: "bg-gradient-to-r from-red-100 to-rose-100 text-red-700 border-red-300",
    icon: XCircle
  },
  4: { 
    label: "İptal Edildi", 
    color: "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-500 border-gray-300",
    icon: XCircle
  },
  5: { 
    label: "Süresi Doldu", 
    color: "bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 border-orange-300",
    icon: Clock
  },
  7: { 
    label: "Sipariş Verildi", 
    color: "bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 border-emerald-300",
    icon: Package
  },
};

const QuotationListPage = () => {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchQuotations = async () => {
      try {
        const data = await getMySellerQuotations();
        setQuotations(data || []);
      } catch {
        toast.error("Teklifler yüklenemedi.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuotations();
  }, []);

  const formatDate = (date) =>
    new Date(date).toLocaleString("tr-TR", {
      dateStyle: "short",
      timeStyle: "short",
    });

  // Filter quotations
  const filteredQuotations = useMemo(() => {
    return quotations.filter(q => 
      q.storeProductName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [quotations, searchTerm]);

  // Calculate stats
  const stats = useMemo(() => {
    const pending = quotations.filter(q => q.status === 0).length;
    const accepted = quotations.filter(q => q.status === 2).length;
    const ordered = quotations.filter(q => q.status === 7).length;
    const total = quotations.length;
    return { pending, accepted, ordered, total };
  }, [quotations]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Header */}
        <header className="mb-6 sm:mb-8 relative bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 rounded-2xl sm:rounded-3xl shadow-2xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12 text-center overflow-hidden">
          {/* Dekoratif Arka Plan */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
          <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl hidden sm:block"></div>
          <div className="absolute bottom-10 left-10 w-40 h-40 bg-cyan-400/20 rounded-full blur-3xl hidden sm:block"></div>
          
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-xl animate-pulse">
                <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                Alıcı Teklifleri
              </h1>
              <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-300 animate-pulse hidden sm:block" />
            </div>
            <p className="text-emerald-100 text-sm sm:text-base lg:text-lg font-medium px-2">
              Müşterilerinizden gelen tüm teklif taleplerini yönetin
            </p>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          <StatCard
            icon={Clock}
            label="Bekleyen"
            value={stats.pending}
            gradient="from-yellow-500 to-amber-500"
            bgGradient="from-yellow-50 to-amber-50"
          />
          <StatCard
            icon={CheckCircle}
            label="Kabul Edildi"
            value={stats.accepted}
            gradient="from-green-500 to-emerald-500"
            bgGradient="from-green-50 to-emerald-50"
          />
          <StatCard
            icon={Package}
            label="Siparişe Döndü"
            value={stats.ordered}
            gradient="from-emerald-500 to-teal-500"
            bgGradient="from-emerald-50 to-teal-50"
          />
          <StatCard
            icon={FileText}
            label="Toplam Teklif"
            value={stats.total}
            gradient="from-blue-500 to-indigo-500"
            bgGradient="from-blue-50 to-indigo-50"
          />
        </div>

        {/* Search Bar */}
        <div className="mb-4 sm:mb-6 bg-white rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-4 border-2 border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              placeholder="Ürün adına göre ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg sm:rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 text-gray-800"
            />
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 sm:py-20 bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-lg">
            <TedarikaLoader variant="compact" />
          </div>
        ) : filteredQuotations.length === 0 ? (
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-lg p-8 sm:p-12 text-center border-2 border-gray-200">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
              <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
              {searchTerm ? "Sonuç Bulunamadı" : "Henüz Teklif Yok"}
            </h3>
            <p className="text-sm sm:text-base text-gray-600">
              {searchTerm 
                ? "Arama kriterlerinize uygun teklif bulunamadı." 
                : "Müşterilerinizden teklif talebi geldiğinde burada görünecek."}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-2xl overflow-hidden border-2 border-gray-200">
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
                      <tr>
                        <th className="px-3 sm:px-6 py-3 sm:py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Ürün
                        </th>
                        <th className="px-3 sm:px-6 py-3 sm:py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider hidden sm:table-cell">
                          Tarih
                        </th>
                        <th className="px-3 sm:px-6 py-3 sm:py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider hidden md:table-cell">
                          Fiyat
                        </th>
                        <th className="px-3 sm:px-6 py-3 sm:py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider hidden lg:table-cell">
                          Miktar
                        </th>
                        <th className="px-3 sm:px-6 py-3 sm:py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Durum
                        </th>
                        <th className="px-3 sm:px-6 py-3 sm:py-5 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                          İşlem
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredQuotations.map((q) => {
                        const status = statusMap[q.status] || {
                          label: q.status || "Bilinmeyen",
                          color: "bg-gray-100 text-gray-600 border-gray-300",
                          icon: FileText
                        };
                        const StatusIcon = status.icon;
                        return (
                          <tr key={q.id} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 transition-all duration-200">
                            <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <Package className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                                <div className="min-w-0">
                                  <span className="font-medium text-gray-900 text-sm sm:text-base truncate block">{q.storeProductName}</span>
                                  <div className="sm:hidden mt-1 text-xs text-gray-500">
                                    {formatDate(q.requestedAt)}
                                  </div>
                                  <div className="md:hidden mt-1">
                                    <span className="font-bold text-emerald-600 text-xs">{q.unitPrice} ₺</span>
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-600 hidden sm:table-cell">
                              {formatDate(q.requestedAt)}
                            </td>
                            <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap hidden md:table-cell">
                              <span className="font-bold text-emerald-600 text-sm">{q.unitPrice} ₺</span>
                            </td>
                            <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-700 font-medium hidden lg:table-cell">
                              {q.quantity}
                            </td>
                            <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl border-2 shadow-sm ${status.color}`}>
                                <StatusIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                <span className="hidden sm:inline">{status.label}</span>
                                <span className="sm:hidden">{status.label.split(' ')[0]}</span>
                              </span>
                            </td>
                            <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-center">
                              <Link
                                to={`/seller/quotations/${q.id}`}
                                className="inline-flex items-center gap-1 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs sm:text-sm font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
                              >
                                <span className="hidden sm:inline">Detay</span>
                                <span className="sm:hidden">→</span>
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ icon: Icon, label, value, gradient, bgGradient }) => (
  <div className={`bg-gradient-to-br ${bgGradient} rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}>
    <div className="flex items-center justify-between">
      <div className="min-w-0 flex-1">
        <p className="text-gray-600 text-xs sm:text-sm font-semibold mb-1 sm:mb-2">{label}</p>
        <p className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900">{value}</p>
      </div>
      <div className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-lg sm:rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg flex-shrink-0`}>
        <Icon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
      </div>
    </div>
  </div>
);

export default QuotationListPage;
