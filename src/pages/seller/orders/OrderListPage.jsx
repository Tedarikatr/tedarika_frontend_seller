// =============================
// OrderListPage.jsx - Ultra Modern & Beautiful 🎨
// =============================
import React, { useEffect, useState } from "react";
import { fetchStoreOrders } from "@/api/sellerOrderService";
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
  Sparkles
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
      } catch (err) {
        console.error("Siparişler alınamadı:", err);
      } finally {
        setLoading(false);
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
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                <ShoppingCart size={32} className="animate-pulse" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-1 flex items-center gap-2">
                  Mağaza Siparişleri
                  <Sparkles size={24} className="text-yellow-300" />
                </h1>
                <p className="text-emerald-100 text-sm">
                  Tüm siparişlerinizi görüntüleyin ve yönetin
                </p>
              </div>
            </div>
            
            {!loading && orders.length > 0 && (
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-3">
                <div className="flex items-center gap-3">
                  <Package size={24} />
                  <div>
                    <div className="text-xs text-blue-100">Toplam Sipariş</div>
                    <div className="text-2xl font-bold">{stats.total}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        {!loading && orders.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {/* Onaylanan */}
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-5 border-2 border-emerald-200 shadow-lg hover:shadow-xl transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-emerald-700 mb-1">Onaylanan</p>
                  <p className="text-3xl font-bold text-emerald-800">{stats.confirmed}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white shadow-lg">
                  <CheckCircle size={24} />
                </div>
              </div>
            </div>

            {/* Teslim Edildi */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-5 border-2 border-purple-200 shadow-lg hover:shadow-xl transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-purple-700 mb-1">Teslim Edildi</p>
                  <p className="text-3xl font-bold text-purple-800">{stats.delivered}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
                  <Package size={24} />
                </div>
              </div>
            </div>

            {/* İptal */}
            <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl p-5 border-2 border-red-200 shadow-lg hover:shadow-xl transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-red-700 mb-1">İptal Edildi</p>
                  <p className="text-3xl font-bold text-red-800">{stats.cancelled}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white shadow-lg">
                  <XCircle size={24} />
                </div>
              </div>
            </div>

            {/* Toplam Tutar */}
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-5 border-2 border-amber-200 shadow-lg hover:shadow-xl transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-amber-700 mb-1">Toplam Tutar</p>
                  <p className="text-2xl font-bold text-amber-800">₺{stats.totalAmount.toFixed(2)}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center text-white shadow-lg">
                  <DollarSign size={24} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Orders Table */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 mb-4 animate-pulse shadow-xl">
                <ShoppingCart size={40} className="text-white" />
              </div>
              <p className="text-gray-600 font-medium text-lg">Siparişler yükleniyor...</p>
              <p className="text-gray-400 text-sm mt-1">Lütfen bekleyin</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 mb-6 shadow-lg">
                <ShoppingCart size={48} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">
                Henüz Sipariş Bulunmuyor
              </h3>
              <p className="text-gray-500 text-sm">
                Siparişleriniz burada görünecektir
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Sipariş No
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Tarih
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Toplam
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Durum
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                      İşlem
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orders.map((order, index) => (
                    <tr
                      key={order.id}
                      className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 transition-all duration-200"
                    >
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-600">
                          {index + 1}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-lg">
                            #{index + 1}
                          </div>
                          <span className="font-bold text-gray-900">
                            {order.orderNumber}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar size={14} className="text-gray-400" />
                          {new Date(order.createdAt).toLocaleDateString("tr-TR")}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <DollarSign size={16} className="text-emerald-600" />
                          <span className="font-bold text-gray-900">
                            ₺{order.totalAmount.toFixed(2)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Link
                          to={`/seller/orders/${order.id}`}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                        >
                          <Eye size={16} />
                          Detay
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderListPage;
