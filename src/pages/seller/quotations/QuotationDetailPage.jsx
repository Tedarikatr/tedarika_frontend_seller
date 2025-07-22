import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getSellerQuotationById,
  respondToQuotation,
  updateQuotationStatus,
} from "@/api/sellerQuotationService";
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

  const getStatusColor = (status) => {
    switch (status) {
      case 1:
        return "bg-green-100 text-green-800 border-green-200";
      case 2:
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

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
          <div>
            <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full border ${getStatusColor(quotation.status)}`}>
              {getStatusLabel(quotation.status)}
            </span>
          </div>
        </div>
      </div>

      {/* Karşı Teklif Formu */}
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
          className="mt-5 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm transition"
        >
          Karşı Teklifi Gönder
        </button>
      </div>

      {/* Durum Güncelleme */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Durumu Güncelle</h2>
        <div className="flex gap-4">
          <button
            onClick={() => handleStatusChange(1)}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg text-sm"
          >
            Kabul Et
          </button>
          <button
            onClick={() => handleStatusChange(2)}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg text-sm"
          >
            Reddet
          </button>
        </div>
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

export default QuotationDetailPage;
