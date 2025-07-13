import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  fetchOrderDetail,
  updateOrderStatus,
  cancelOrder,
} from "@/api/sellerOrderService";
import { ArrowPathIcon, XCircleIcon } from "@heroicons/react/24/solid";

const statusOptions = [
  { value: 0, label: "Beklemede" },
  { value: 1, label: "Hazırlanıyor" },
  { value: 2, label: "Kargoda" },
  { value: 3, label: "Teslim Edildi" },
];

const statusLabels = {
  0: { text: "Beklemede", color: "bg-yellow-100 text-yellow-800" },
  1: { text: "Hazırlanıyor", color: "bg-blue-100 text-blue-800" },
  2: { text: "Kargoda", color: "bg-indigo-100 text-indigo-800" },
  3: { text: "Teslim Edildi", color: "bg-green-100 text-green-800" },
  4: { text: "İptal Edildi", color: "bg-red-100 text-red-800" },
};

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);

  const loadOrder = async () => {
    setLoading(true);
    try {
      const data = await fetchOrderDetail(orderId);
      setOrder(data);
      setSelectedStatus(data.status);
    } catch (err) {
      console.error("Detay yüklenemedi:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const handleStatusUpdate = async () => {
    if (selectedStatus === order.status) return;
    setUpdating(true);
    try {
      await updateOrderStatus(order.id, selectedStatus);
      await loadOrder();
    } catch (err) {
      console.error("Durum güncellenemedi:", err);
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = async () => {
    const confirmed = window.confirm("Siparişi iptal etmek istediğinize emin misiniz?");
    if (!confirmed) return;
    setUpdating(true);
    try {
      await cancelOrder(order.id);
      await loadOrder();
    } catch (err) {
      console.error("İptal işlemi başarısız:", err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-600 animate-pulse">
        Sipariş bilgileri yükleniyor...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-6 text-center text-red-600 font-semibold">
        Sipariş bulunamadı veya yüklenirken bir hata oluştu.
      </div>
    );
  }

  const status = statusLabels[order.status] || {
    text: "Bilinmiyor",
    color: "bg-gray-200 text-gray-800",
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-semibold text-gray-800 border-b pb-2">Sipariş Detayı</h1>

      <div className="bg-white shadow rounded-md border p-6 space-y-4">
        <div>
          <h2 className="text-lg font-medium text-gray-700 mb-2">Sipariş Bilgileri</h2>
          <ul className="text-sm space-y-1 text-gray-700">
            <li><span className="font-medium">Sipariş No:</span> {order.orderNumber}</li>
            <li><span className="font-medium">Tarih:</span> {new Date(order.createdAt).toLocaleString()}</li>
            <li><span className="font-medium">Toplam:</span> ₺{order.totalAmount.toFixed(2)}</li>
            <li>
              <span className="font-medium">Durum:</span>{" "}
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${status.color}`}>
                {status.text}
              </span>
            </li>
          </ul>
        </div>

        <div className="pt-4 border-t flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <select
            className="border border-gray-300 rounded-md text-sm px-4 py-2 focus:ring-emerald-500 focus:border-emerald-500"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(Number(e.target.value))}
            disabled={updating}
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <button
            onClick={handleStatusUpdate}
            disabled={updating || selectedStatus === order.status}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm px-5 py-2 rounded-md disabled:opacity-50 transition"
          >
            <ArrowPathIcon className="w-4 h-4" />
            {updating ? "Güncelleniyor..." : "Durumu Güncelle"}
          </button>

          <button
            onClick={handleCancel}
            disabled={updating || order.status === 4}
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium text-sm px-5 py-2 rounded-md disabled:opacity-50 transition"
          >
            <XCircleIcon className="w-4 h-4" />
            {updating ? "İptal Ediliyor..." : "Siparişi İptal Et"}
          </button>
        </div>
      </div>

      {/* İleride: Ürün listesi ve alıcı bilgileri burada yer alabilir */}
    </div>
  );
};

export default OrderDetailPage;
