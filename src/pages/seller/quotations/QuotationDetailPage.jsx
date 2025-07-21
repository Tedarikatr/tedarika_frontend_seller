import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getSellerQuotationById,
  respondToQuotation,
  updateQuotationStatus,
} from "../../../api/sellerQuotationService";
import { toast } from "react-hot-toast";

const QuotationDetailPage = () => {
  const { id } = useParams();
  const [quotation, setQuotation] = useState(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    offeredUnitPrice: "",
    minOrderQuantity: "",
    validUntil: "",
    notes: "",
  });

  // Fetch quotation on mount
  useEffect(() => {
    const fetchQuotation = async () => {
      try {
        const data = await getSellerQuotationById(id);
        setQuotation(data);
      } catch {
        toast.error("Teklif bilgisi alınamadı.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuotation();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRespond = async () => {
    try {
      await respondToQuotation(id, {
        offeredUnitPrice: parseFloat(form.offeredUnitPrice),
        minOrderQuantity: parseInt(form.minOrderQuantity),
        validUntil: form.validUntil,
        notes: form.notes,
      });
      toast.success("Karşı teklif başarıyla gönderildi.");
    } catch {
      toast.error("Karşı teklif gönderilemedi.");
    }
  };

  const handleStatusChange = async (status) => {
    try {
      await updateQuotationStatus(id, { status });
      toast.success("Durum güncellendi.");
    } catch {
      toast.error("Durum güncelleme başarısız.");
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleString("tr-TR", {
      dateStyle: "short",
      timeStyle: "short",
    });

  const getStatusLabel = (status) => {
    switch (status) {
      case 1:
        return "Kabul Edildi";
      case 2:
        return "Reddedildi";
      default:
        return "Beklemede";
    }
  };

  if (loading) return <div className="p-6 text-gray-600">Yükleniyor...</div>;
  if (!quotation)
    return <div className="p-6 text-red-600">Teklif bulunamadı.</div>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Teklif Detayı
      </h1>

      {/* Quotation Info */}
      <div className="bg-white shadow rounded-lg p-6 border border-gray-200 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
          <p><strong>Ürün:</strong> {quotation.storeProductName}</p>
          <p><strong>Talep Edilen Fiyat:</strong> {quotation.unitPrice} ₺</p>
          <p><strong>Talep Miktarı:</strong> {quotation.quantity}</p>
          <p><strong>Mesaj:</strong> {quotation.message || "-"}</p>
          <p><strong>Talep Tarihi:</strong> {formatDate(quotation.requestedAt)}</p>
          <p><strong>Durum:</strong> {getStatusLabel(quotation.status)}</p>
        </div>
      </div>

      {/* Response Form */}
      <div className="bg-white shadow rounded-lg p-6 border border-gray-200 mb-8">
        <h2 className="text-lg font-semibold mb-4">Karşı Teklif Gönder</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="number"
            name="offeredUnitPrice"
            value={form.offeredUnitPrice}
            onChange={handleInputChange}
            placeholder="Birim Fiyat (₺)"
            className="border rounded px-3 py-2 text-sm"
          />
          <input
            type="number"
            name="minOrderQuantity"
            value={form.minOrderQuantity}
            onChange={handleInputChange}
            placeholder="Min. Sipariş Miktarı"
            className="border rounded px-3 py-2 text-sm"
          />
          <input
            type="datetime-local"
            name="validUntil"
            value={form.validUntil}
            onChange={handleInputChange}
            className="border rounded px-3 py-2 text-sm"
          />
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleInputChange}
            placeholder="Notlar"
            rows={3}
            className="border rounded px-3 py-2 text-sm col-span-full"
          />
        </div>
        <button
          onClick={handleRespond}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white text-sm px-5 py-2 rounded"
        >
          Karşı Teklifi Gönder
        </button>
      </div>

      {/* Status Buttons */}
      <div className="bg-white shadow rounded-lg p-6 border border-gray-200">
        <h2 className="text-lg font-semibold mb-4">Durumu Güncelle</h2>
        <div className="flex gap-4">
          <button
            onClick={() => handleStatusChange(1)}
            className="bg-green-600 hover:bg-green-700 text-white text-sm px-5 py-2 rounded"
          >
            Kabul Et
          </button>
          <button
            onClick={() => handleStatusChange(2)}
            className="bg-red-600 hover:bg-red-700 text-white text-sm px-5 py-2 rounded"
          >
            Reddet
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuotationDetailPage;
