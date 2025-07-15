import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchOrderDetail,
  updateOrderStatus,
  cancelOrder,
} from "@/api/sellerOrderService";
import { ArrowPathIcon, XCircleIcon } from "@heroicons/react/24/solid";

const statusOptions = [
  { value: 1, label: "Oluşturuldu" },
  { value: 2, label: "Ödeme Bekleniyor" },
  { value: 3, label: "Ödendi" },
  { value: 4, label: "Kargoya Verildi" },
  { value: 5, label: "Teslim Edildi" },
];

const statusLabels = {
  1: { text: "Oluşturuldu", color: "bg-gray-100 text-gray-800" },
  2: { text: "Ödeme Bekleniyor", color: "bg-yellow-100 text-yellow-700" },
  3: { text: "Ödendi", color: "bg-blue-100 text-blue-700" },
  4: { text: "Kargoya Verildi", color: "bg-purple-100 text-purple-700" },
  5: { text: "Teslim Edildi", color: "bg-green-100 text-green-700" },
  6: { text: "İptal Edildi", color: "bg-red-100 text-red-700" },
};

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("sellerToken");
    if (!token) navigate("/seller/login");
  }, [navigate]);

  const loadOrder = async () => {
    setLoading(true);
    try {
      const data = await fetchOrderDetail(Number(orderId));
      setOrder(data);
      setSelectedStatus(data.status);
    } catch (err) {
      console.error("Detay yüklenemedi:", err);
      setOrder(null);
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
    if (!window.confirm("Siparişi iptal etmek istediğinize emin misiniz?")) return;
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
    return <div className="p-6 text-center text-gray-500 animate-pulse">Yükleniyor...</div>;
  }

  if (!order) {
    return (
      <div className="p-6 text-center text-red-600 font-semibold">
        Sipariş bulunamadı, yetkisiz erişim olabilir.
      </div>
    );
  }

  const status = statusLabels[order.status] || {
    text: "Bilinmiyor",
    color: "bg-gray-200 text-gray-800",
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 border-b pb-2">
        Sipariş Detayı
      </h1>

      {/* Genel Bilgiler */}
      <section className="bg-white border border-gray-200 rounded-md shadow-sm p-6 space-y-4">
        <ul className="text-sm text-gray-700 space-y-1">
          <li><strong>Sipariş No:</strong> {order.orderNumber}</li>
          <li><strong>Mağaza:</strong> {order.storeName}</li>
          <li><strong>Oluşturulma:</strong> {new Date(order.createdAt).toLocaleString()}</li>
          <li><strong>Toplam:</strong> ₺{order.totalAmount.toFixed(2)} {order.currency}</li>
          <li><strong>Kargo:</strong> {order.carrierName || "Tanımsız"}</li>
          <li><strong>Adres:</strong> {order.shippingAddress}</li>
          <li>
            <strong>Durum:</strong>{" "}
            <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${status.color}`}>
              {status.text}
            </span>
          </li>
        </ul>

        {/* Statü Güncelleme */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border-t pt-4">
          <select
            className="border rounded-md px-4 py-2 text-sm shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(Number(e.target.value))}
            disabled={updating}
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.value === order.status}>
                {opt.label}
              </option>
            ))}
          </select>

          <button
            onClick={handleStatusUpdate}
            disabled={updating || selectedStatus === order.status}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-md text-sm font-semibold inline-flex items-center gap-2 transition-transform hover:scale-105 disabled:opacity-50"
          >
            <ArrowPathIcon className="w-5 h-5" />
            {updating ? "Güncelleniyor..." : "Durumu Güncelle"}
          </button>

          <button
            onClick={handleCancel}
            disabled={updating || order.status === 6}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-md text-sm font-semibold inline-flex items-center gap-2 transition-transform hover:scale-105 disabled:opacity-50"
          >
            <XCircleIcon className="w-5 h-5" />
            {updating ? "İptal Ediliyor..." : "Siparişi İptal Et"}
          </button>
        </div>
      </section>

      {/* Ödeme Bilgileri */}
      <section className="bg-white border border-gray-200 rounded-md shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Ödeme Bilgileri</h2>
        <ul className="text-sm text-gray-700 space-y-1">
          <li><strong>Yöntem:</strong> {order.payment?.name}</li>
          <li><strong>Tutar:</strong> ₺{order.payment?.totalAmount?.toFixed(2)}</li>
          <li><strong>Durum:</strong> {order.payment?.status === 1 ? "Ödenmedi" : "Ödendi"}</li>
        </ul>
      </section>

      {/* Ürünler */}
      <section className="bg-white border border-gray-200 rounded-md shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-5">Ürünler</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {order.items.map((item, i) => (
            <div
              key={i}
              className="bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition duration-300 p-4 flex flex-col gap-3"
            >
              <div className="flex justify-center">
                <img
                  src={item.storeProductImageUrl}
                  alt={item.productName}
                  className="w-24 h-24 object-cover rounded-md border"
                />
              </div>
              <div className="text-sm text-gray-700 space-y-1">
                <h3 className="text-base font-semibold text-gray-800">{item.productName}</h3>
                <p>Adet: <span className="font-medium">{item.quantity}</span></p>
                <p>Birim Fiyat: ₺{item.unitPrice.toFixed(2)}</p>
                <p className="font-semibold text-gray-900">Toplam: ₺{item.totalPrice.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default OrderDetailPage;
