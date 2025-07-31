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
      toast.success("Teklif başarıyla yüklendi.");
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
      toast.error("Lütfen tüm gerekli alanları doldurun.");
      setStatusMessage({ type: "error", message: "Tüm gerekli alanları doldurmalısınız." });
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
      toast.success("Karşı teklif başarıyla gönderildi.");
      setStatusMessage({ type: "success", message: "Karşı teklif başarıyla gönderildi." });
      resetForm();
      await fetchQuotation();
    } catch (error) {
      console.error("Karşı teklif hatası:", error.response?.data || error.message || error);
      toast.error("Karşı teklif gönderilemedi.");
      setStatusMessage({ type: "error", message: "Karşı teklif gönderilirken hata oluştu." });
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (statusValue) => {
    if (quotation.status !== 0) {
      toast.error("Bu teklifin durumu zaten güncellenmiş.");
      return;
    }

    setStatusMessage(null);
    toast.loading("Durum güncelleniyor...");
    try {
      await updateQuotationStatus(id, statusValue);
      toast.dismiss();
      toast.success("Durum başarıyla güncellendi.");
      const label = statusValue === 2 ? "Kabul Edildi" : "Reddedildi";
      setStatusMessage({ type: "success", message: `Durum "${label}" olarak güncellendi.` });
      await fetchQuotation();
    } catch (error) {
      console.error("Durum güncelleme hatası:", error.response?.data || error.message || error);
      toast.dismiss();
      toast.error("Durum güncellenemedi.");
      setStatusMessage({ type: "error", message: "Durum güncellenirken hata oluştu." });
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

  if (loading) return <div className="p-6 text-gray-600 animate-pulse">Yükleniyor...</div>;
  if (!quotation) return <div className="p-6 text-red-600">Teklif bulunamadı.</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <h1 className="text-3xl font-bold text-[#003636]">Teklif Detayı</h1>

      {/* Teklif Bilgileri */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
          <Info label="Ürün" value={quotation.storeProductName} />
          <Info label="Talep Edilen Fiyat" value={`${quotation.unitPrice} ₺`} />
          <Info label="Talep Miktarı" value={quotation.quantity} />
          <Info label="Mesaj" value={quotation.message || "-"} />
          <Info label="Talep Tarihi" value={formatDate(quotation.requestedAt)} />
          {status && (
            <div>
              <span
                className={`inline-block text-xs font-semibold px-3 py-1 rounded-full border ${status.color}`}
              >
                {status.label}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Karşı Teklif Formu */}
      {quotation.status === 2 ? (
        <div className="bg-white border border-yellow-200 rounded-2xl shadow-sm p-6 text-yellow-800 text-sm">
          Bu teklif <strong>kabul edildiği</strong> için tekrar karşı teklif gönderemezsiniz.
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Karşı Teklif Gönder</h2>
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
              className="col-span-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleRespond}
            disabled={submitting}
            className="mt-5 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm transition disabled:opacity-50"
          >
            {submitting ? "Gönderiliyor..." : "Karşı Teklifi Gönder"}
          </button>
          {statusMessage && (
            <div className="mt-4">
              <MessageBox type={statusMessage.type} message={statusMessage.message} />
            </div>
          )}
        </div>
      )}

      {/* Durum Güncelleme */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Durumu Güncelle</h2>
        {quotation.status === 0 ? (
          <div className="flex gap-4">
            <button
              onClick={() => handleStatusChange(2)}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg text-sm"
            >
              Kabul Et
            </button>
            <button
              onClick={() => handleStatusChange(3)}
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg text-sm"
            >
              Reddet
            </button>
          </div>
        ) : (
          <div className="text-sm text-gray-600">
            Teklif zaten{" "}
            <strong>
              {quotation.status === 2 ? "KABUL EDİLDİ" : quotation.status === 3 ? "REDDEDİLDİ" : "GÜNCELLENMİŞ"}
            </strong>
            .
          </div>
        )}
        {statusMessage && (
          <div className="mt-4">
            <MessageBox type={statusMessage.type} message={statusMessage.message} />
          </div>
        )}
      </div>
    </div>
  );
};

const Info = ({ label, value }) => (
  <p>
    <strong className="text-gray-600">{label}:</strong> {value}
  </p>
);

const Input = ({ name, value, onChange, type = "text", placeholder }) => (
  <input
    type={type}
    name={name}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
  />
);

const MessageBox = ({ type = "success", message }) => {
  const color =
    type === "error"
      ? "bg-red-100 text-red-800 border-red-300"
      : "bg-green-100 text-green-800 border-green-300";
  return (
    <div className={`border rounded-lg px-4 py-3 text-sm ${color}`}>
      {message}
    </div>
  );
};

export default QuotationDetailPage;
