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
        const res = await getMySellerQuotations();
        setQuotations(res || []);
      } catch {
        toast.error("Teklifler yüklenemedi");
      } finally {
        setLoading(false);
      }
    };

    fetchQuotations();
  }, []);

  return (
    <div className="px-6 py-10 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
        Alıcı Teklifleri
      </h2>

      {loading ? (
        <p className="text-center text-gray-500">Yükleniyor...</p>
      ) : quotations.length === 0 ? (
        <p className="text-center text-gray-500">Henüz teklif bulunmamaktadır.</p>
      ) : (
        <div className="space-y-4">
          {quotations.map((q) => (
            <Link
              key={q.id}
              to={`/seller/quotations/${q.id}`}
              className="flex justify-between items-center bg-gradient-to-br from-blue-50 to-white border border-blue-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-200"
            >
              <div>
                <p className="text-blue-700 font-semibold text-base hover:underline">
                  {q.buyerName || "Bilinmeyen Alıcı"}
                </p>
                <p className="text-sm text-gray-700">{q.storeProductName}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(q.requestedAt).toLocaleString("tr-TR")}
                </p>
              </div>
              <div className="text-right space-y-1">
                <p className="text-green-600 font-bold text-sm">{q.unitPrice} ₺</p>
                <p className="text-gray-800 text-sm">Miktar: {q.quantity}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuotationListPage;
