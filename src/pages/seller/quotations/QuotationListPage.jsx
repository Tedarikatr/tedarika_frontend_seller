import { useEffect, useState } from "react";
import { getMySellerQuotations } from "@/api/sellerQuotationService";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";

// ✅ Numeric-based status map
const statusMap = {
  0: { label: "Beklemede", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  1: { label: "Karşı Teklif Verildi", color: "bg-blue-100 text-blue-700 border-blue-200" },
  2: { label: "Satıcı Kabul Etti", color: "bg-green-100 text-green-700 border-green-200" },
  3: { label: "Satıcı Reddetti", color: "bg-red-100 text-red-700 border-red-200" },
  4: { label: "İptal Edildi", color: "bg-gray-100 text-gray-500 border-gray-200" },
  5: { label: "Süresi Doldu", color: "bg-orange-100 text-orange-700 border-orange-200" },
  7: { label: "Sipariş Verildi", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
};

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

  const formatDate = (date) =>
    new Date(date).toLocaleString("tr-TR", {
      dateStyle: "short",
      timeStyle: "short",
    });

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-[#003636] mb-8 text-center sm:text-left">
        Alıcı Teklifleri
      </h1>

      {loading ? (
        <p className="text-center text-gray-500 text-sm">Yükleniyor...</p>
      ) : quotations.length === 0 ? (
        <div className="bg-white p-8 rounded-xl shadow-sm text-center text-gray-600">
          Henüz teklif bulunmamaktadır.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm bg-white">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50 text-gray-700 font-semibold text-xs uppercase">
              <tr>
                <th className="px-5 py-4 text-left">Alıcı</th>
                <th className="px-5 py-4 text-left">Ürün</th>
                <th className="px-5 py-4 text-left">Tarih</th>
                <th className="px-5 py-4 text-left">Fiyat</th>
                <th className="px-5 py-4 text-left">Miktar</th>
                <th className="px-5 py-4 text-left">Durum</th>
                <th className="px-5 py-4 text-center">İncele</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-800">
              {quotations.map((q) => {
                const status = statusMap[q.status] || {
                  label: q.status || "Bilinmeyen",
                  color: "bg-gray-100 text-gray-600 border-gray-200",
                };
                return (
                  <tr key={q.id} className="hover:bg-gray-50 transition">
                    <td className="px-5 py-4">{q.buyerName || "Bilinmeyen Alıcı"}</td>
                    <td className="px-5 py-4">{q.storeProductName}</td>
                    <td className="px-5 py-4">{formatDate(q.requestedAt)}</td>
                    <td className="px-5 py-4">{q.unitPrice} ₺</td>
                    <td className="px-5 py-4">{q.quantity}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-block text-xs font-semibold px-3 py-1 rounded-full border ${status.color}`}
                      >
                        {status.label}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <Link
                        to={`/seller/quotations/${q.id}`}
                        className="inline-block text-blue-600 hover:text-blue-800 text-sm font-medium transition"
                      >
                        Detay
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default QuotationListPage;
