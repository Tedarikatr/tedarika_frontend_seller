import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchOrderDetail, fetchPaymentDetail } from "@/api/sellerOrderService";
import { statusLabels } from "@/constants/orderStatus";

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [payment, setPayment] = useState(null);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("sellerToken");
    if (!token) navigate("/seller/login");
  }, [navigate]);

  const loadOrder = async () => {
    setLoading(true);
    try {
      const data = await fetchOrderDetail(Number(orderId));
      setOrder(data);
    } catch (err) {
      console.error("Detay yüklenemedi:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrder();
    setPayment(null);
    setPaymentOpen(false);
    setPaymentError("");
  }, [orderId]);

  const handleFetchPayment = async () => {
    setPaymentLoading(true);
    setPaymentError("");
    try {
      const data = await fetchPaymentDetail(Number(orderId));
      setPayment(data);
      setPaymentOpen(true);
    } catch (err) {
      console.error("Ödeme detayları alınamadı:", err);
      setPaymentError("Ödeme detayları alınamadı.");
      setPaymentOpen(true);
    } finally {
      setPaymentLoading(false);
    }
  };

  if (loading)
    return (
      <div className="p-6 text-center text-gray-500 animate-pulse">
        Yükleniyor...
      </div>
    );

  if (!order)
    return (
      <div className="p-6 text-center text-red-600 font-semibold">
        Sipariş bulunamadı.
      </div>
    );

  const status = statusLabels[order.status] || {
    text: "Bilinmiyor",
    color: "bg-gray-100 text-gray-700 border border-gray-300",
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
      <h1 className="text-2xl font-bold text-gray-800 border-b border-gray-300 pb-3">
        Sipariş Detayı
      </h1>

      {/* 🧱 GENEL BİLGİLER */}
      <section className="bg-white border border-gray-300 rounded-lg shadow-sm p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 text-sm text-gray-800">
          <Info label="Sipariş No" value={order.orderNumber} />
          <Info label="Mağaza" value={order.storeName} />
          <Info
            label="Oluşturulma"
            value={new Date(order.createdAt).toLocaleString("tr-TR")}
          />
          <Info label="Kargo" value={order.carrierName || "Tanımsız"} />
          <Info label="Adres" value={order.shippingAddress} />
          <Info
            label="Toplam"
            value={`₺${order.totalAmount.toFixed(2)} ${order.currency}`}
          />
          <div className="md:col-span-2">
            <strong>Durum: </strong>
            <span
              className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${status.color}`}
            >
              {status.text}
            </span>
          </div>
        </div>
      </section>

      {/* 💳 ÖDEME BİLGİLERİ */}
      <section className="bg-white border border-gray-300 rounded-lg shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">
            Ödeme Bilgileri
          </h2>
          <div className="flex items-center gap-3">
            <button
              onClick={handleFetchPayment}
              disabled={paymentLoading}
              className="border border-gray-400 text-gray-700 px-4 py-1.5 rounded-md text-sm hover:bg-gray-100 transition disabled:opacity-50"
            >
              {paymentLoading ? "Yükleniyor..." : "Ödeme Detaylarını Getir"}
            </button>
            {payment && (
              <button
                onClick={() => setPaymentOpen((s) => !s)}
                className="border border-gray-300 text-gray-700 px-3 py-1.5 rounded-md text-sm hover:bg-gray-100 transition"
              >
                {paymentOpen ? "Detayı Gizle" : "Detayı Göster"}
              </button>
            )}
          </div>
        </div>

        {/* Kısa Özet */}
        <ul className="text-sm text-gray-700 space-y-1">
          <Info label="Yöntem" value={order.payment?.name} />
          <Info
            label="Tutar"
            value={`₺${order.payment?.totalAmount?.toFixed(2) || "-"}`}
          />
          <Info
            label="Durum"
            value={
              order.payment?.status === "Pending" ? "Ödenmedi" : "Ödendi"
            }
          />
        </ul>

        {/* ✅ ÖDEME DETAY PANELİ */}
        {paymentOpen && (
          <div className="border border-gray-300 bg-gray-50 rounded-md p-4 space-y-3">
            {paymentError && (
              <div className="text-sm text-red-600">{paymentError}</div>
            )}
            {payment && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700">
                  <Info label="Payment ID" value={payment.paymentId} />
                  <Info
                    label="Conversation ID"
                    value={payment.paymentConversationId || "-"}
                  />
                  <Info label="Taksit" value={payment.installment} />
                  <Info label="Para Birimi" value={payment.currency} />
                  <Info
                    label="Toplam Ödenen"
                    value={fmt(payment.totalPaidPrice)}
                  />
                  <Info
                    label="İyzico Komisyonu"
                    value={fmt(payment.totalIyziCommission)}
                  />
                  <Info
                    label="Platform Ödemesi"
                    value={fmt(payment.totalPlatformPayout)}
                  />
                  <Info
                    label="Alt Mağaza Ödemesi"
                    value={fmt(payment.totalSubMerchantPayout)}
                  />
                </div>

                {/* Kalemler */}
                <div className="mt-4">
                  <h3 className="font-medium text-gray-800 mb-2">Kalemler</h3>
                  {Array.isArray(payment.items) && payment.items.length > 0 ? (
                    <div className="overflow-x-auto border border-gray-300 rounded-md">
                      <table className="min-w-full text-sm border-collapse">
                        <thead className="bg-gray-100 text-gray-700">
                          <tr>
                            <th className="px-3 py-2 border border-gray-300">
                              #
                            </th>
                            <th className="px-3 py-2 border border-gray-300">
                              Ödenen
                            </th>
                            <th className="px-3 py-2 border border-gray-300">
                              Komisyon
                            </th>
                            <th className="px-3 py-2 border border-gray-300">
                              Platform
                            </th>
                            <th className="px-3 py-2 border border-gray-300">
                              Alt Mağaza
                            </th>
                            <th className="px-3 py-2 border border-gray-300">
                              Bloke (Mağaza)
                            </th>
                            <th className="px-3 py-2 border border-gray-300">
                              Bloke (Alt)
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {payment.items.map((it, idx) => (
                            <tr
                              key={idx}
                              className="border-t border-gray-300 hover:bg-gray-50"
                            >
                              <td className="px-3 py-2 border border-gray-300">
                                {idx + 1}
                              </td>
                              <td className="px-3 py-2 border border-gray-300">
                                {fmt(it.paidPrice ?? it.totalPaidPrice)}
                              </td>
                              <td className="px-3 py-2 border border-gray-300">
                                {fmt(
                                  it.iyziCommission ?? it.totalIyziCommission
                                )}
                              </td>
                              <td className="px-3 py-2 border border-gray-300">
                                {fmt(it.platformPayout ?? it.totalPlatformPayout)}
                              </td>
                              <td className="px-3 py-2 border border-gray-300">
                                {fmt(
                                  it.subMerchantPayout ??
                                    it.totalSubMerchantPayout
                                )}
                              </td>
                              <td className="px-3 py-2 border border-gray-300">
                                {fmt(
                                  it.blockageMerchant ??
                                    it.totalBlockageMerchant
                                )}
                              </td>
                              <td className="px-3 py-2 border border-gray-300">
                                {fmt(
                                  it.blockageSubMerchant ??
                                    it.totalBlockageSubMerchant
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-600">
                      Kalem bilgisi bulunmuyor.
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </section>

      {/* 📦 ÜRÜNLER */}
      <section className="bg-white border border-gray-300 rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Ürünler</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {order.items.map((item, i) => (
            <div
              key={i}
              className="border border-gray-300 rounded-md p-4 space-y-3 hover:shadow-sm transition"
            >
              <div className="flex justify-center">
                <img
                  src={
                    item.storeProductImageUrl ||
                    "/tedarika/assets/images/product-placeholder.svg"
                  }
                  alt={item.productName}
                  className="w-24 h-24 object-cover rounded-md border border-gray-300"
                />
              </div>
              <div className="text-sm text-gray-700 space-y-1">
                <p className="font-medium text-gray-800">{item.productName}</p>
                <p>
                  Adet: <strong>{item.quantity}</strong>
                </p>
                <p>Birim: ₺{item.unitPrice.toFixed(2)}</p>
                <p className="font-semibold text-gray-900">
                  Toplam: ₺{item.totalPrice.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

// 🧩 Bilgi satırı bileşeni
const Info = ({ label, value }) => (
  <li className="text-sm text-gray-700">
    <strong>{label}:</strong> {value ?? "-"}
  </li>
);

// 💰 Basit formatlayıcı
function fmt(n) {
  if (n === null || n === undefined) return "-";
  const num = Number(n);
  if (Number.isNaN(num)) return String(n);
  return `₺${num.toFixed(2)}`;
}

export default OrderDetailPage;
