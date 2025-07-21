import React, { useEffect, useState } from "react";
import { fetchStoreOrders } from "@/api/sellerOrderService";
import { Link, useNavigate } from "react-router-dom";
import { statusLabels } from "@/constants/orderStatus";

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
      <h1 className="text-3xl font-bold mb-6 border-b pb-2 text-gray-800">Mağaza Siparişleri</h1>

      {loading ? (
        <div className="text-gray-500 text-sm animate-pulse">Yükleniyor...</div>
      ) : orders.length === 0 ? (
        <div className="text-gray-500 text-sm">Henüz sipariş bulunmuyor.</div>
      ) : (
        <div className="bg-white border shadow-md rounded-lg overflow-x-auto">
          <table className="min-w-full text-sm text-gray-800">
            <thead className="bg-gray-100 text-gray-600 text-xs uppercase">
              <tr>
                <th className="px-5 py-3 text-left">#</th>
                <th className="px-5 py-3 text-left">Sipariş No</th>
                <th className="px-5 py-3 text-left">Tarih</th>
                <th className="px-5 py-3 text-left">Toplam</th>
                <th className="px-5 py-3 text-left">Durum</th>
                <th className="px-5 py-3 text-center">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => {
                const status = statusLabels[order.status] || { text: "Bilinmiyor", color: "bg-gray-100 text-gray-700" };
                return (
                  <tr key={order.id} className="border-t hover:bg-gray-50">
                    <td className="px-5 py-4">{index + 1}</td>
                    <td className="px-5 py-4 font-semibold">{order.orderNumber}</td>
                    <td className="px-5 py-4">{new Date(order.createdAt).toLocaleDateString("tr-TR")}</td>
                    <td className="px-5 py-4 font-medium">₺{order.totalAmount.toFixed(2)}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${status.color}`}>
                        {status.text}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <Link to={`/seller/orders/${order.id}`} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">Detay</Link>
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
