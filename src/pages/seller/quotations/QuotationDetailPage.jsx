import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getSellerQuotationById,
  respondToQuotation,
  updateQuotationStatus,
} from "@/api/sellerQuotationService";
import { toast } from "react-hot-toast";
import { getQuotationStatusProps } from "@/constants/quotationStatus";

const QuotationDetailPage = () => {
  const { id } = useParams();
  const [quotation, setQuotation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const [form, setForm] = useState({
    offeredUnitPrice: "",
    minOrderQuantity: "",
    validUntil: "",
    notes: "",
  });

  useEffect(() => {
    fetchQuotation();
  }, [id]);

  const fetchQuotation = async () => {
    setLoading(true);
    try {
      const data = await getSellerQuotationById(id);
      setQuotation(data);
    } catch {
      toast.error("Teklif bilgisi alınamadı.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRespond = async () => {
    if (!form.offeredUnitPrice || !form.minOrderQuantity || !form.validUntil) {
      setStatusMessage({
        type: "error",
        message: "Lütfen tüm gerekli alanları doldurun.",
      });
      return;
    }

    setSubmitting(true);
    try {
      await respondToQuotation(id, {
        offeredUnitPrice: parseFloat(form.offeredUnitPrice),
        minOrderQuantity: parseInt(form.minOrderQuantity),
        validUntil: form.validUntil,
        notes: form.notes,
      });
      setStatusMessage({
        type: "success",
        message: "Karşı teklif başarıyla gönderildi.",
      });
      resetForm();
      await fetchQuotation();
    } catch {
      setStatusMessage({
        type: "error",
        message: "Karşı teklif gönderilirken hata oluştu.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (statusValue) => {
    if (quotation.status !== 0) {
      toast.error("Bu teklifin durumu zaten güncellenmiş.");
      return;
    }

    toast.loading("Durum güncelleniyor...");
    try {
      await updateQuotationStatus(id, statusValue);
      toast.dismiss();
      setStatusMessage({
        type: "success",
        message:
          statusValue === 2
            ? "Durum 'Kabul Edildi' olarak güncellendi."
            : "Durum 'Reddedildi' olarak güncellendi.",
      });
      await fetchQuotation();
    } catch {
      toast.dismiss();
      setStatusMessage({
        type: "error",
        message: "Durum güncellenirken hata oluştu.",
      });
    }
  };

  const resetForm = () => {
    setForm({
      offeredUnitPrice: "",
      minOrderQuantity: "",
      validUntil: "",
      notes: "",
    });
  };

  const formatDate = (date) =>
    new Date(date).toLocaleString("tr-TR", {
      dateStyle: "short",
      timeStyle: "short",
    });

  const status = quotation ? getQuotationStatusProps(quotation.status) : null;

  if (loading)
    return (
      <div className="p-6 text-center text-gray-500 animate-pulse">
        Yükleniyor...
      </div>
    );

  if (!quotation)
    return (
      <div className="p-6 text-center text-red-600 font-semibold">
        Teklif bulunamadı.
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
      <h1 className="text-2xl font-bold text-gray-800 border-b border-gray-300 pb-3">
        Teklif Detayı
      </h1>

      {/* 📦 Teklif Bilgileri */}
      <section className="bg-white border border-gray-300 rounded-lg shadow-sm p-6 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-800">
          <Info label="Ürün" value={quotation.storeProductName} />
          <Info label="Talep Edilen Fiyat" value={`${quotation.unitPrice} ₺`} />
          <Info label="Talep Miktarı" value={quotation.quantity} />
          <Info label="Mesaj" value={quotation.message || "-"} />
          <Info label="Talep Tarihi" value={formatDate(quotation.requestedAt)} />
          {status && (
            <div>
              <span
                className={`inline-block text-xs font-medium px-3 py-1 rounded-full border ${status.color}`}
              >
                {status.label}
              </span>
            </div>
          )}
        </div>
      </section>

      {/* 💬 Karşı Teklif Formu */}
      {quotation.status === 2 ? (
        <div className="bg-gray-50 border border-gray-300 rounded-lg shadow-sm p-6 text-gray-700 text-sm">
          Bu teklif <strong>kabul edildiği</strong> için tekrar karşı teklif
          gönderemezsiniz.
        </div>
      ) : (
        <section className="bg-white border border-gray-300 rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Karşı Teklif Gönder
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              name="offeredUnitPrice"
              type="number"
              value={form.offeredUnitPrice}
              onChange={handleInputChange}
              placeholder="Birim Fiyat (₺)"
            />
            <Input
              name="minOrderQuantity"
              type="number"
              value={form.minOrderQuantity}
              onChange={handleInputChange}
              placeholder="Min. Sipariş Miktarı"
            />
            <Input
              name="validUntil"
              type="datetime-local"
              value={form.validUntil}
              onChange={handleInputChange}
            />
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleInputChange}
              rows={3}
              placeholder="Notlar"
              className="col-span-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-gray-400"
            />
          </div>

          <button
            onClick={handleRespond}
            disabled={submitting}
            className="mt-5 border border-gray-400 bg-gray-700 hover:bg-gray-800 text-white px-5 py-2 rounded-md text-sm transition disabled:opacity-50"
          >
            {submitting ? "Gönderiliyor..." : "Karşı Teklifi Gönder"}
          </button>

          {statusMessage && (
            <div className="mt-4">
              <MessageBox
                type={statusMessage.type}
                message={statusMessage.message}
              />
            </div>
          )}
        </section>
      )}

      {/* 🔧 Durum Güncelleme */}
      <section className="bg-white border border-gray-300 rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Durumu Güncelle
        </h2>
        {quotation.status === 0 ? (
          <div className="flex gap-3">
            <button
              onClick={() => handleStatusChange(2)}
              className="border border-gray-400 bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-md text-sm"
            >
              Kabul Et
            </button>
            <button
              onClick={() => handleStatusChange(3)}
              className="border border-gray-400 bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-md text-sm"
            >
              Reddet
            </button>
          </div>
        ) : (
          <div className="text-sm text-gray-600">
            Teklif zaten{" "}
            <strong>
              {quotation.status === 2
                ? "KABUL EDİLDİ"
                : quotation.status === 3
                ? "REDDEDİLDİ"
                : "GÜNCELLENMİŞ"}
            </strong>
            .
          </div>
        )}
        {statusMessage && (
          <div className="mt-4">
            <MessageBox
              type={statusMessage.type}
              message={statusMessage.message}
            />
          </div>
        )}
      </section>
    </div>
  );
};

// 📋 Bilgi satırı
const Info = ({ label, value }) => (
  <p>
    <strong className="text-gray-600">{label}:</strong> {value}
  </p>
);

// 🧱 Gri Input
const Input = ({ name, value, onChange, type = "text", placeholder }) => (
  <input
    type={type}
    name={name}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-gray-400"
  />
);

// 💬 Mesaj kutusu
const MessageBox = ({ type = "success", message }) => {
  const color =
    type === "error"
      ? "bg-red-100 text-red-700 border border-red-300"
      : "bg-green-100 text-green-700 border border-green-300";
  return (
    <div className={`rounded-md px-4 py-2 text-sm ${color}`}>{message}</div>
  );
};

export default QuotationDetailPage;
