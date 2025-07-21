import { useEffect, useState } from "react";
import { getMySellerQuotations } from "../../../api/sellerQuotationService";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";

const QuotationListPage = () => {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuotations = async () => {
      try {
        const data = await getMySellerQuotations();
        setQuotations(data || []);
      } catch {
        toast.error("Teklifler yüklenemedi.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuotations();
  }, []);

  const getStatusLabel = (status) => {
    switch (status) {
      case 1:
        return <span className="text-green-600 font-medium">Kabul Edildi</span>;
      case 2:
        return <span className="text-red-500 font-medium">Reddedildi</span>;
      default:
        return <span className="text-gray-500 font-medium">Beklemede</span>;
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleString("tr-TR", {
      dateStyle: "short",
      timeStyle: "short",
    });

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">
        Alıcı Teklifleri
      </h1>

      {loading ? (
        <p className="text-center text-gray-500">Yükleniyor...</p>
      ) : quotations.length === 0 ? (
        <p className="text-center text-gray-500">Henüz teklif bulunmamaktadır.</p>
      ) : (
        <div className="overflow-x-auto border rounded-lg shadow-sm bg-white">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="px-4 py-3 text-left">Alıcı</th>
                <th className="px-4 py-3 text-left">Ürün</th>
                <th className="px-4 py-3 text-left">Tarih</th>
                <th className="px-4 py-3 text-left">Fiyat</th>
                <th className="px-4 py-3 text-left">Miktar</th>
                <th className="px-4 py-3 text-left">Durum</th>
                <th className="px-4 py-3 text-center">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {quotations.map((q) => (
                <tr key={q.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3">{q.buyerName || "Bilinmeyen Alıcı"}</td>
                  <td className="px-4 py-3">{q.storeProductName}</td>
                  <td className="px-4 py-3">{formatDate(q.requestedAt)}</td>
                  <td className="px-4 py-3">{q.unitPrice} ₺</td>
                  <td className="px-4 py-3">{q.quantity}</td>
                  <td className="px-4 py-3">{getStatusLabel(q.status)}</td>
                  <td className="px-4 py-3 text-center">
                    <Link
                      to={`/seller/quotations/${q.id}`}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Detay
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default QuotationListPage;
