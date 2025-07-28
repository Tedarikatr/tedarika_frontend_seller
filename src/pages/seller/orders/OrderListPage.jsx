import React, { useEffect, useState } from "react";
import { fetchStoreOrders } from "@/api/sellerOrderService";
import { Link, useNavigate } from "react-router-dom";
import { statusLabels } from "@/constants/orderStatus";

// Durum renklerini belirleyen yardımcı
const getStatusDotColor = (status) => {
  switch (status) {
    case "Created":
    case "Confirmed":
      return "bg-green-500";
    case "Delivered":
      return "bg-orange-400";
    case "Cancelled":
      return "bg-red-500";
    default:
      return "bg-gray-300";
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
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">
      <h1 className="text-3xl font-bold text-gray-900 border-b pb-4">Mağaza Siparişleri</h1>

      {loading ? (
        <div className="bg-white p-6 rounded-xl shadow text-center text-gray-500 animate-pulse">
          Siparişler yükleniyor...
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white p-8 rounded-xl shadow text-center text-gray-600">
          Henüz sipariş bulunmamaktadır.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl shadow border border-gray-200 bg-white">
          <table className="min-w-full text-sm divide-y divide-gray-100">
            <thead className="bg-gray-50 text-gray-700 uppercase text-xs tracking-wider">
              <tr>
                <Th>#</Th>
                <Th>Sipariş No</Th>
                <Th>Tarih</Th>
                <Th>Toplam</Th>
                <Th>Durum</Th>
                <Th className="text-center">İşlem</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-800">
              {orders.map((order, index) => {
                const status = statusLabels[order.status] || {
                  text: "Bilinmiyor",
                  color: "bg-gray-100 text-gray-700 border border-gray-300",
                };

                return (
                  <tr key={order.id} className="hover:bg-gray-50 transition">
                    <Td>{index + 1}</Td>
                    <Td>
                      <span className="font-semibold text-indigo-700">
                        {order.orderNumber}
                      </span>
                    </Td>
                    <Td>
                      {new Date(order.createdAt).toLocaleDateString("tr-TR")}
                    </Td>
                    <Td>
                      <span className="font-bold text-green-700">
                        ₺{order.totalAmount.toFixed(2)}
                      </span>
                    </Td>
                    <Td>
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${getStatusDotColor(order.status)}`}
                          title={order.status}
                        />
                        <span className={`text-xs font-medium px-3 py-1 rounded-full ${status.color}`}>
                          {status.text}
                        </span>
                      </div>
                    </Td>
                    <Td className="text-center">
                      <Link
                        to={`/seller/orders/${order.id}`}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm transition"
                      >
                        Detay
                      </Link>
                    </Td>
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

// Yardımcı Table Head bileşeni
const Th = ({ children, className = "" }) => (
  <th className={`px-5 py-3 text-left ${className}`}>{children}</th>
);

// Yardımcı Table Cell bileşeni
const Td = ({ children, className = "" }) => (
  <td className={`px-5 py-4 align-middle ${className}`}>{children}</td>
);

export default OrderListPage;
