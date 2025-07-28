import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchOrderDetail,
  updateOrderStatus,
  cancelOrder,
} from "@/api/sellerOrderService";
import { statusLabels, statusOptions } from "@/constants/orderStatus";
import { ArrowPathIcon, XCircleIcon } from "@heroicons/react/24/solid";

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

  if (loading)
    return <div className="p-6 text-center text-gray-500 animate-pulse">Yükleniyor...</div>;

  if (!order)
    return <div className="p-6 text-center text-red-600 font-semibold">Sipariş bulunamadı.</div>;

  const status = statusLabels[order.status] || {
    text: "Bilinmiyor",
    color: "bg-gray-100 text-gray-700",
  };

  const isFinalStatus = order.status === "Delivered" || order.status === "Cancelled";

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-10">
      <h1 className="text-3xl font-bold text-gray-900 border-b pb-4">Sipariş Detayı</h1>

      {/* GENEL BİLGİLER */}
      <section className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 text-sm text-gray-800">
          <Info label="Sipariş No" value={order.orderNumber} />
          <Info label="Mağaza" value={order.storeName} />
          <Info label="Oluşturulma" value={new Date(order.createdAt).toLocaleString("tr-TR")} />
          <Info label="Kargo" value={order.carrierName || "Tanımsız"} />
          <Info label="Adres" value={order.shippingAddress} />
          <Info
            label="Toplam"
            value={`₺${order.totalAmount.toFixed(2)} ${order.currency}`}
          />
          <div className="md:col-span-2">
            <span className="font-medium">Durum: </span>
            <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${status.color}`}>
              {status.text}
            </span>
          </div>
        </div>

        {isFinalStatus && (
          <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 p-3 rounded-md text-sm">
            Bu sipariş <strong>{status.text}</strong> durumundadır ve değiştirilemez.
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border-t pt-4">
          <select
            className="border border-gray-300 rounded px-4 py-2 text-sm"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            disabled={updating || isFinalStatus}
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.value === order.status}>
                {opt.label}
              </option>
            ))}
          </select>

          <button
            onClick={handleStatusUpdate}
            disabled={updating || selectedStatus === order.status || isFinalStatus}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 disabled:opacity-50"
          >
            <ArrowPathIcon className="w-5 h-5" />
            {updating ? "Güncelleniyor..." : "Durumu Güncelle"}
          </button>

          <button
            onClick={handleCancel}
            disabled={updating || isFinalStatus}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 disabled:opacity-50"
          >
            <XCircleIcon className="w-5 h-5" />
            {updating ? "İptal Ediliyor..." : "Siparişi İptal Et"}
          </button>
        </div>
      </section>

      {/* ÖDEME */}
      <section className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Ödeme Bilgileri</h2>
        <ul className="text-sm text-gray-700 space-y-1">
          <Info label="Yöntem" value={order.payment?.name} />
          <Info label="Tutar" value={`₺${order.payment?.totalAmount?.toFixed(2)}`} />
          <Info
            label="Durum"
            value={order.payment?.status === "Pending" ? "Ödenmedi" : "Ödendi"}
          />
        </ul>
      </section>

      {/* ÜRÜNLER */}
      <section className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-6 text-gray-900">Ürünler</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {order.items.map((item, i) => (
            <div key={i} className="border border-gray-200 rounded-xl p-4 shadow-sm space-y-3">
              <div className="flex justify-center">
                <img
                  src={item.storeProductImageUrl || "/tedarika/assets/images/product-placeholder.svg"}
                  alt={item.productName}
                  className="w-24 h-24 object-cover rounded border"
                />
              </div>
              <div className="text-sm text-gray-700 space-y-1">
                <p className="font-medium text-gray-800">{item.productName}</p>
                <p>Adet: <strong>{item.quantity}</strong></p>
                <p>Birim: ₺{item.unitPrice.toFixed(2)}</p>
                <p className="font-bold text-gray-900">Toplam: ₺{item.totalPrice.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const Info = ({ label, value }) => (
  <li>
    <strong>{label}:</strong> {value || "-"}
  </li>
);

export default OrderDetailPage;
