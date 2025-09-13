import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchOrderDetail, fetchPaymentDetail } from "@/api/sellerOrderService";
import { statusLabels } from "@/constants/orderStatus";

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ ödeme detay state'i
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
    // ödeme paneli her sipariş değişiminde sıfırlansın
    setPayment(null);
    setPaymentOpen(false);
    setPaymentError("");
  }, [orderId]);

  // ✅ ödeme detayını getir
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
    return <div className="p-6 text-center text-gray-500 animate-pulse">Yükleniyor...</div>;

  if (!order)
    return <div className="p-6 text-center text-red-600 font-semibold">Sipariş bulunamadı.</div>;

  const status = statusLabels[order.status] || {
    text: "Bilinmiyor",
    color: "bg-gray-100 text-gray-700",
  };

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
          <Info label="Toplam" value={`₺${order.totalAmount.toFixed(2)} ${order.currency}`} />
          <div className="md:col-span-2">
            <span className="font-medium">Durum: </span>
            <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${status.color}`}>
              {status.text}
            </span>
          </div>
        </div>
      </section>

      {/* ÖDEME ÖZETİ + DETAY BUTONU */}
      <section className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Ödeme Bilgileri</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={handleFetchPayment}
              className="rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 disabled:opacity-50"
              disabled={paymentLoading}
            >
              {paymentLoading ? "Yükleniyor..." : "Ödeme Detaylarını Getir"}
            </button>
            {payment && (
              <button
                onClick={() => setPaymentOpen((s) => !s)}
                className="rounded-md border border-gray-300 text-gray-700 text-sm font-medium px-3 py-2"
              >
                {paymentOpen ? "Detayı Gizle" : "Detayı Göster"}
              </button>
            )}
          </div>
        </div>

        {/* Ödeme özeti (order içinden mevcutsa) */}
        <ul className="text-sm text-gray-700 space-y-1 mb-4">
          <Info label="Yöntem" value={order.payment?.name} />
          <Info label="Tutar" value={`₺${order.payment?.totalAmount?.toFixed(2)}`} />
          <Info label="Durum" value={order.payment?.status === "Pending" ? "Ödenmedi" : "Ödendi"} />
        </ul>

        {/* ✅ Ödeme Detay Paneli */}
        {paymentOpen && (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            {paymentError && (
              <div className="mb-3 text-sm text-red-600 font-medium">{paymentError}</div>
            )}

            {!payment && !paymentError && (
              <div className="text-sm text-gray-600">Detay bulunamadı.</div>
            )}

            {payment && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <Info label="Payment ID" value={payment.paymentId} />
                  <Info label="Conversation ID" value={payment.paymentConversationId || "-"} />
                  <Info label="Taksit" value={payment.installment} />
                  <Info label="Para Birimi" value={payment.currency} />
                  <Info label="Toplam Ödenen" value={fmt(payment.totalPaidPrice)} />
                  <Info label="İyzico Komisyonu" value={fmt(payment.totalIyziCommission)} />
                  <Info label="Platform Ödemesi" value={fmt(payment.totalPlatformPayout)} />
                  <Info label="Alt Mağaza Ödemesi" value={fmt(payment.totalSubMerchantPayout)} />
                  <Info label="Bloke (Mağaza)" value={fmt(payment.totalBlockageMerchant)} />
                  <Info label="Bloke (Alt Mağaza)" value={fmt(payment.totalBlockageSubMerchant)} />
                  <Info
                    label="Raporlama API'den"
                    value={payment.fromReportingApi ? "Evet" : "Hayır"}
                  />
                </div>

                <div className="mt-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Kalemler</h3>
                  {Array.isArray(payment.items) && payment.items.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm">
                        <thead>
                          <tr className="text-left text-gray-600">
                            <th className="px-3 py-2">#</th>
                            <th className="px-3 py-2">Ödenen</th>
                            <th className="px-3 py-2">Komisyon</th>
                            <th className="px-3 py-2">Platform</th>
                            <th className="px-3 py-2">Alt Mağaza</th>
                            <th className="px-3 py-2">Bloke (Mağaza)</th>
                            <th className="px-3 py-2">Bloke (Alt)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {payment.items.map((it, idx) => (
                            <tr key={idx} className="border-t">
                              <td className="px-3 py-2">{idx + 1}</td>
                              <td className="px-3 py-2">{fmt(it.paidPrice ?? it.totalPaidPrice)}</td>
                              <td className="px-3 py-2">{fmt(it.iyziCommission ?? it.totalIyziCommission)}</td>
                              <td className="px-3 py-2">{fmt(it.platformPayout ?? it.totalPlatformPayout)}</td>
                              <td className="px-3 py-2">{fmt(it.subMerchantPayout ?? it.totalSubMerchantPayout)}</td>
                              <td className="px-3 py-2">{fmt(it.blockageMerchant ?? it.totalBlockageMerchant)}</td>
                              <td className="px-3 py-2">{fmt(it.blockageSubMerchant ?? it.totalBlockageSubMerchant)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-600">Kalem bilgisi bulunmuyor.</div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
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
    <strong>{label}:</strong> {value ?? "-"}
  </li>
);

// küçük yardımcı formatlayıcı
function fmt(n) {
  if (n === null || n === undefined) return "-";
  const num = Number(n);
  if (Number.isNaN(num)) return String(n);
  return `₺${num.toFixed(2)}`;
}

export default OrderDetailPage;
