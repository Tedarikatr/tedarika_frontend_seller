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
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-[#003636] mb-8 border-b pb-4">Mağaza Siparişleri</h1>

      {loading ? (
        <div className="bg-white p-6 rounded-lg shadow text-gray-500 text-center animate-pulse">
          Siparişler yükleniyor...
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-gray-600 text-center">
          Henüz sipariş bulunmamaktadır.
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl shadow overflow-x-auto">
          <table className="min-w-full text-sm text-gray-800 divide-y divide-gray-100">
            <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
              <tr>
                <th className="px-5 py-3 text-left">#</th>
                <th className="px-5 py-3 text-left">Sipariş No</th>
                <th className="px-5 py-3 text-left">Tarih</th>
                <th className="px-5 py-3 text-left">Toplam</th>
                <th className="px-5 py-3 text-left">Durum</th>
                <th className="px-5 py-3 text-center">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order, index) => {
                const status = statusLabels[order.status] || {
                  text: "Bilinmiyor",
                  color: "bg-gray-100 text-gray-700 border border-gray-300",
                };

                return (
                  <tr key={order.id} className="hover:bg-gray-50 transition">
                    <td className="px-5 py-4 font-medium">{index + 1}</td>
                    <td className="px-5 py-4 font-semibold text-indigo-800">{order.orderNumber}</td>
                    <td className="px-5 py-4">
                      {new Date(order.createdAt).toLocaleDateString("tr-TR")}
                    </td>
                    <td className="px-5 py-4 font-bold text-green-700">
                      ₺{order.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${status.color}`}
                      >
                        {status.text}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <Link
                        to={`/seller/orders/${order.id}`}
                        className="inline-block text-blue-600 hover:text-blue-800 font-medium text-sm transition"
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
