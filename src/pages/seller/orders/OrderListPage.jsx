import React, { useEffect, useState } from "react";
import { fetchStoreOrders } from "@/api/sellerOrderService";
import { Link, useNavigate } from "react-router-dom";

const getStatusLabel = (status) => {
  switch (status) {
    case 1: return { text: "Oluşturuldu", color: "bg-gray-100 text-gray-800" };
    case 2: return { text: "Ödeme Bekleniyor", color: "bg-yellow-100 text-yellow-700" };
    case 3: return { text: "Ödendi", color: "bg-blue-100 text-blue-700" };
    case 4: return { text: "Kargoya Verildi", color: "bg-purple-100 text-purple-700" };
    case 5: return { text: "Teslim Edildi", color: "bg-green-100 text-green-700" };
    case 6: return { text: "İptal Edildi", color: "bg-red-100 text-red-700" };
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
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 border-b border-gray-300 pb-3">Mağaza Siparişleri</h1>
      </div>

      {loading ? (
        <div className="text-gray-500 text-sm animate-pulse">Yükleniyor...</div>
      ) : orders.length === 0 ? (
        <div className="text-gray-500 text-sm">Henüz sipariş bulunmuyor.</div>
      ) : (
        <div className="bg-white border border-gray-200 shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-gray-800">
              <thead className="bg-gray-100 text-gray-600 uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-5 py-3 text-left">#</th>
                  <th className="px-5 py-3 text-left">Sipariş No</th>
                  <th className="px-5 py-3 text-left">Mağaza</th>
                  <th className="px-5 py-3 text-left">Tarih</th>
                  <th className="px-5 py-3 text-left">Toplam</th>
                  <th className="px-5 py-3 text-left">Durum</th>
                  <th className="px-5 py-3 text-center">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => {
                  const status = getStatusLabel(order.status);
                  return (
                    <tr key={order.id} className="border-t hover:bg-gray-50 transition duration-150">
                      <td className="px-5 py-4">{index + 1}</td>
                      <td className="px-5 py-4 font-semibold">{order.orderNumber}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={order.storeImageUrl}
                            alt={order.storeName}
                            className="w-10 h-10 rounded-md object-cover border"
                          />
                          <span className="truncate max-w-[150px]">{order.storeName}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        {new Date(order.createdAt).toLocaleDateString("tr-TR")}
                      </td>
                      <td className="px-5 py-4 font-medium text-gray-900">
                        ₺{order.totalAmount.toFixed(2)}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded-full ${status.color}`}
                        >
                          {status.text}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <Link
                          to={`/seller/orders/${order.id}`}
                          className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition"
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
        </div>
      )}
    </div>
  );
};

export default OrderListPage;
