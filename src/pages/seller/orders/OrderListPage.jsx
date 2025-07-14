import React, { useEffect, useState } from "react";
import { fetchStoreOrders } from "@/api/sellerOrderService";
import { Link, useNavigate } from "react-router-dom";

// Sipariş durumlarına göre etiket stilleri
const getStatusLabel = (status) => {
  switch (status) {
    case 0: return { text: "Beklemede", color: "bg-yellow-100 text-yellow-800" };
    case 1: return { text: "Hazırlanıyor", color: "bg-blue-100 text-blue-800" };
    case 2: return { text: "Kargoda", color: "bg-indigo-100 text-indigo-800" };
    case 3: return { text: "Teslim Edildi", color: "bg-green-100 text-green-800" };
    case 4: return { text: "İptal Edildi", color: "bg-red-100 text-red-800" };
    default: return { text: "Bilinmiyor", color: "bg-gray-100 text-gray-700" };
  }
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

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6 border-b pb-2">Mağaza Siparişleri</h1>

      {loading ? (
        <div className="text-gray-500 animate-pulse">Yükleniyor...</div>
      ) : orders.length === 0 ? (
        <div className="text-gray-500 text-sm">Henüz sipariş bulunmuyor.</div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
          <table className="min-w-full bg-white text-sm">
            <thead className="bg-gray-50 text-gray-700 text-left">
              <tr className="text-xs uppercase tracking-wide">
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Sipariş No</th>
                <th className="px-4 py-3">Mağaza</th>
                <th className="px-4 py-3">Tarih</th>
                <th className="px-4 py-3">Toplam</th>
                <th className="px-4 py-3">Durum</th>
                <th className="px-4 py-3 text-center">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => {
                const status = getStatusLabel(order.status);
                return (
                  <tr
                    key={order.id}
                    className="border-t hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3 font-medium">{order.orderNumber}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <img
                          src={order.storeImageUrl}
                          alt={order.storeName}
                          className="w-8 h-8 rounded object-cover border"
                        />
                        <span className="truncate max-w-[120px]">{order.storeName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">₺{order.totalAmount.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${status.color}`}
                      >
                        {status.text}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Link
                        to={`/seller/orders/${order.id}`}
                        state={{ order }} // opsiyonel, OrderDetailPage'de optimize render için
                        className="text-blue-600 hover:underline font-medium text-sm"
                      >
                        Detay
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderListPage;
