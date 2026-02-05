// =============================
// OrderListPage.jsx - Ultra Modern & Beautiful 🎨
// =============================
import React, { useEffect, useState } from "react";
import { fetchStoreOrders } from "@/api/sellerOrderService";
import { getShippingLabel } from "@/api/sellerShippingService";
import { Link, useNavigate } from "react-router-dom";
import { statusLabels } from "@/constants/orderStatus";
import { 
  ShoppingCart, 
  Package, 
  TrendingUp, 
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Calendar,
  DollarSign,
  Sparkles,
  Truck,
  Loader2
} from "lucide-react";

const StatusBadge = ({ status }) => {
  const statusConfig = {
    Created: { 
      bg: "from-blue-50 to-cyan-50", 
      text: "text-blue-700", 
      border: "border-blue-200",
      icon: <Clock size={14} />,
      label: "Oluşturuldu"
    },
    Confirmed: { 
      bg: "from-emerald-50 to-green-50", 
      text: "text-emerald-700", 
      border: "border-emerald-200",
      icon: <CheckCircle size={14} />,
      label: "Onaylandı"
    },
    Delivered: { 
      bg: "from-purple-50 to-pink-50", 
      text: "text-purple-700", 
      border: "border-purple-200",
      icon: <Package size={14} />,
      label: "Teslim Edildi"
    },
    Cancelled: { 
      bg: "from-red-50 to-rose-50", 
      text: "text-red-700", 
      border: "border-red-200",
      icon: <XCircle size={14} />,
      label: "İptal Edildi"
    },
    default: { 
      bg: "from-gray-50 to-gray-100", 
      text: "text-gray-700", 
      border: "border-gray-200",
      icon: <Clock size={14} />,
      label: "Bilinmiyor"
    }
  };

  const config = statusConfig[status] || statusConfig.default;
  const statusLabel = statusLabels[status] || { text: config.label };

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r ${config.bg} ${config.text} border ${config.border}`}>
      {config.icon}
      {statusLabel.text}
    </span>
  );
};

const OrderListPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trackingMap, setTrackingMap] = useState({});
  const [trackingLoading, setTrackingLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("sellerToken");
    if (!token) {
      navigate("/seller/login");
      return;
    }

    const loadOrders = async () => {
      try {
        const res = await fetchStoreOrders();
        setOrders(res);
        setTrackingLoading(true);
        const entries = await Promise.all(
          (res || []).map(async (order) => {
            try {
              const label = await getShippingLabel(order.id);
              return [order.id, label];
            } catch {
              return [order.id, null];
            }
          })
        );
        setTrackingMap(Object.fromEntries(entries));
      } catch (err) {
        console.error("Siparişler alınamadı:", err);
      } finally {
        setLoading(false);
        setTrackingLoading(false);
      }
    };

    loadOrders();
  }, [navigate]);

  // İstatistikler
  const stats = {
    total: orders.length,
    confirmed: orders.filter(o => o.status === 'Confirmed').length,
    delivered: orders.filter(o => o.status === 'Delivered').length,
    cancelled: orders.filter(o => o.status === 'Cancelled').length,
    totalAmount: orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Hero Header Section */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex items-center justify-between flex-wrap gap-3 sm:gap-4">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg flex-shrink-0">
                <ShoppingCart size={24} className="sm:w-8 sm:h-8 animate-pulse" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold mb-1 flex items-center gap-2">
                  <span className="truncate">Mağaza Siparişleri</span>
                  <Sparkles size={20} className="sm:w-6 sm:h-6 text-yellow-300 flex-shrink-0" />
                </h1>
                <p className="text-emerald-100 text-xs sm:text-sm">
                  Tüm siparişlerinizi görüntüleyin ve yönetin
                </p>
              </div>
            </div>
            
            {!loading && orders.length > 0 && (
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-2 sm:py-3 w-full sm:w-auto">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Package size={20} className="sm:w-6 sm:h-6" />
                  <div>
                    <div className="text-xs text-blue-100">Toplam Sipariş</div>
                    <div className="text-xl sm:text-2xl font-bold">{stats.total}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Stats Cards */}
        {!loading && orders.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
            {/* Onaylanan */}
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl sm:rounded-2xl p-3 sm:p-5 border-2 border-emerald-200 shadow-lg hover:shadow-xl transition-all">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-emerald-700 mb-1">Onaylanan</p>
                  <p className="text-2xl sm:text-3xl font-bold text-emerald-800">{stats.confirmed}</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white shadow-lg flex-shrink-0">
                  <CheckCircle size={20} className="sm:w-6 sm:h-6" />
                </div>
              </div>
            </div>

            {/* Teslim Edildi */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl sm:rounded-2xl p-3 sm:p-5 border-2 border-purple-200 shadow-lg hover:shadow-xl transition-all">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-purple-700 mb-1">Teslim Edildi</p>
                  <p className="text-2xl sm:text-3xl font-bold text-purple-800">{stats.delivered}</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white shadow-lg flex-shrink-0">
                  <Package size={20} className="sm:w-6 sm:h-6" />
                </div>
              </div>
            </div>

            {/* İptal */}
            <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl sm:rounded-2xl p-3 sm:p-5 border-2 border-red-200 shadow-lg hover:shadow-xl transition-all">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-red-700 mb-1">İptal Edildi</p>
                  <p className="text-2xl sm:text-3xl font-bold text-red-800">{stats.cancelled}</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white shadow-lg flex-shrink-0">
                  <XCircle size={20} className="sm:w-6 sm:h-6" />
                </div>
              </div>
            </div>

            {/* Toplam Tutar */}
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl sm:rounded-2xl p-3 sm:p-5 border-2 border-amber-200 shadow-lg hover:shadow-xl transition-all">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-amber-700 mb-1">Toplam Tutar</p>
                  <p className="text-lg sm:text-2xl font-bold text-amber-800 truncate">₺{stats.totalAmount.toFixed(2)}</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center text-white shadow-lg flex-shrink-0">
                  <DollarSign size={20} className="sm:w-6 sm:h-6" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Orders Table */}
        <div className="bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="text-center py-12 sm:py-20">
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 mb-4 animate-pulse shadow-xl">
                <ShoppingCart size={32} className="sm:w-10 sm:h-10 text-white" />
              </div>
              <p className="text-gray-600 font-medium text-base sm:text-lg">Siparişler yükleniyor...</p>
              <p className="text-gray-400 text-xs sm:text-sm mt-1">Lütfen bekleyin</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 sm:py-20">
              <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 mb-4 sm:mb-6 shadow-lg">
                <ShoppingCart size={40} className="sm:w-12 sm:h-12 text-gray-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-700 mb-2">
                Henüz Sipariş Bulunmuyor
              </h3>
              <p className="text-gray-500 text-xs sm:text-sm">
                Siparişleriniz burada görünecektir
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                      <tr>
                        <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                          #
                        </th>
                        <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Sipariş No
                        </th>
                        <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider hidden sm:table-cell">
                          Tarih
                        </th>
                        <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider hidden md:table-cell">
                          Toplam
                        </th>
                        <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Durum
                        </th>
                        <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider hidden lg:table-cell">
                          Kargo
                        </th>
                        <th className="px-3 sm:px-6 py-3 sm:py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                          İşlem
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {orders.map((order, index) => (
                        <tr
                          key={order.id}
                          className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 transition-all duration-200"
                        >
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                            <span className="text-xs sm:text-sm font-medium text-gray-600">
                              {index + 1}
                            </span>
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-lg flex-shrink-0">
                                #{index + 1}
                              </div>
                              <span className="font-bold text-gray-900 text-xs sm:text-sm truncate">
                                {order.orderNumber}
                              </span>
                            </div>
                            <div className="sm:hidden mt-1">
                              <div className="flex items-center gap-1 text-xs text-gray-600">
                                <Calendar size={12} className="text-gray-400" />
                                {new Date(order.createdAt).toLocaleDateString("tr-TR")}
                              </div>
                              <div className="text-xs font-semibold text-gray-900 mt-0.5">
                                ₺{order.totalAmount.toFixed(2)}
                              </div>
                            </div>
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap hidden sm:table-cell">
                            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                              <Calendar size={14} className="text-gray-400" />
                              {new Date(order.createdAt).toLocaleDateString("tr-TR")}
                            </div>
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap hidden md:table-cell">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-gray-900 text-sm">
                                ₺{order.totalAmount.toFixed(2)}
                              </span>
                            </div>
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                            <StatusBadge status={order.status} />
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap hidden lg:table-cell">
                            <TrackingBadge
                              loading={trackingLoading}
                              tracking={trackingMap[order.id]}
                            />
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-center">
                            <Link
                              to={`/seller/orders/${order.id}`}
                              className="inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-xs sm:text-sm font-semibold rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                            >
                              <Eye size={14} className="sm:w-4 sm:h-4" />
                              <span className="hidden sm:inline">Detay</span>
                            </Link>
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
    </div>
  );
};

const TrackingBadge = ({ loading, tracking }) => {
  if (loading && !tracking) {
    return (
      <span className="inline-flex items-center gap-2 text-xs text-gray-500">
        <Loader2 className="w-3 h-3 animate-spin" />
        Yükleniyor
      </span>
    );
  }

  if (!tracking) {
    return <span className="text-xs text-gray-400">-</span>;
  }

  const statusText = tracking.trackingStatus || (tracking.fileUrl || tracking.responsiveLabelUrl ? "Etiket Var" : "Kayıt Var");
  const normalized = String(statusText || "").toLowerCase();
  let badgeClass = "bg-gray-50 text-gray-700 border-gray-200";
  let icon = <Truck size={12} />;

  if (normalized.includes("deliver")) {
    badgeClass = "bg-emerald-50 text-emerald-700 border-emerald-200";
  } else if (normalized.includes("transit") || normalized.includes("in")) {
    badgeClass = "bg-blue-50 text-blue-700 border-blue-200";
  } else if (normalized.includes("return") || normalized.includes("cancel")) {
    badgeClass = "bg-rose-50 text-rose-700 border-rose-200";
  }

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${badgeClass}`}>
      {icon}
      {statusText}
    </span>
  );
};

export default OrderListPage;
