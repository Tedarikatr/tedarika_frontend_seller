import React, { useEffect, useState } from "react";
import { fetchStoreOrders } from "@/api/sellerOrderService";
import { Link, useNavigate } from "react-router-dom";
import { statusLabels } from "@/constants/orderStatus";

// 🎨 Durum rengi (nokta)
const getStatusDotColor = (status) => {
  switch (status) {
    case "Created":
    case "Confirmed":
      return "bg-gray-700";
    case "Delivered":
      return "bg-gray-500";
    case "Cancelled":
      return "bg-gray-400";
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
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
      <h1 className="text-2xl font-bold text-gray-800 border-b border-gray-300 pb-3">
        Mağaza Siparişleri
      </h1>

      {loading ? (
        <div className="bg-white p-6 rounded-lg border border-gray-200 text-center text-gray-500 animate-pulse">
          Siparişler yükleniyor...
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white p-8 rounded-lg border border-gray-200 text-center text-gray-600">
          Henüz sipariş bulunmamaktadır.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-400 bg-white shadow-sm">
          <table className="min-w-full border-collapse text-sm text-gray-800">
            {/* Başlık */}
            <thead className="bg-gray-100 text-gray-700 text-xs uppercase tracking-wide">
              <tr>
                <Th>#</Th>
                <Th>Sipariş No</Th>
                <Th>Tarih</Th>
                <Th>Toplam</Th>
                <Th>Durum</Th>
                <Th className="text-center">İşlem</Th>
              </tr>
            </thead>

            {/* Satırlar */}
            <tbody>
              {orders.map((order, index) => {
                const status = statusLabels[order.status] || {
                  text: "Bilinmiyor",
                  color: "bg-gray-100 text-gray-700 border border-gray-300",
                };

                return (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50 transition-colors border-t border-gray-300"
                  >
                    <Td>{index + 1}</Td>
                    <Td>
                      <span className="font-semibold text-gray-900">
                        {order.orderNumber}
                      </span>
                    </Td>
                    <Td>
                      {new Date(order.createdAt).toLocaleDateString("tr-TR")}
                    </Td>
                    <Td>
                      <span className="font-semibold text-gray-800">
                        ₺{order.totalAmount.toFixed(2)}
                      </span>
                    </Td>
                    <Td>
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${getStatusDotColor(order.status)}`}
                        />
                        <span
                          className={`text-xs font-medium px-3 py-1 rounded-full ${status.color}`}
                        >
                          {status.text}
                        </span>
                      </div>
                    </Td>
                    <Td className="text-center">
                      <Link
                        to={`/seller/orders/${order.id}`}
                        className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-semibold text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 transition"
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

// 🧱 Table Head Hücresi
const Th = ({ children, className = "" }) => (
  <th
    className={`px-5 py-3 text-left border border-gray-300 font-semibold ${className}`}
  >
    {children}
  </th>
);

// 🧱 Table Data Hücresi
const Td = ({ children, className = "" }) => (
  <td className={`px-5 py-4 border border-gray-300 ${className}`}>{children}</td>
);

export default OrderListPage;
