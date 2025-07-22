import React, { useEffect, useState } from "react";
import {
  fetchProductRequests,
  fetchProductRequestDetail,
  getAllCategories,
  getSubCategoriesByCategoryId,
} from "@/api/sellerStoreService";
import { ChevronDown, ChevronUp } from "lucide-react";

const ProductRequestListPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [details, setDetails] = useState({});
  const [categoryMap, setCategoryMap] = useState({});
  const [subcategoryMap, setSubcategoryMap] = useState({});

  useEffect(() => {
    const loadData = async () => {
      try {
        const [reqs, cats] = await Promise.all([
          fetchProductRequests(),
          getAllCategories(),
        ]);

        setRequests(reqs);

        const catMap = {};
        cats.forEach((c) => {
          catMap[c.id] = c.name;
        });
        setCategoryMap(catMap);
      } catch (error) {
        console.error("Veriler yüklenemedi:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const toggleExpand = async (id) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      if (!details[id]) {
        const detail = await fetchProductRequestDetail(id);
        setDetails((prev) => ({ ...prev, [id]: detail }));

        const categoryId = detail.categoryId;
        if (!subcategoryMap[categoryId]) {
          try {
            const subs = await getSubCategoriesByCategoryId(categoryId);
            const subMap = {};
            subs.forEach((s) => {
              subMap[s.id] = s.name;
            });
            setSubcategoryMap((prev) => ({
              ...prev,
              [categoryId]: subMap,
            }));
          } catch (err) {
            console.error("Alt kategoriler alınamadı:", err);
          }
        }
      }
      setExpandedId(id);
    }
  };

  const getStatusText = (status) =>
    status === true ? "Onaylandı" : status === false ? "Beklemede" : "Reddedildi";

  const getStatusColor = (status) =>
    status === true
      ? "text-green-700 bg-green-100 border border-green-300"
      : status === false
      ? "text-yellow-800 bg-yellow-100 border border-yellow-300"
      : "text-red-700 bg-red-100 border border-red-300";

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Ürün Başvurularım</h1>

      {loading ? (
        <p className="text-sm text-gray-500">Yükleniyor...</p>
      ) : requests.length === 0 ? (
        <p className="text-sm text-gray-500">Herhangi bir başvuru bulunamadı.</p>
      ) : (
        <div className="space-y-4">
          {requests.map((r) => (
            <div
              key={r.id}
              className="bg-white border border-gray-200 rounded-xl shadow-md transition-all"
            >
              <button
                type="button"
                className="w-full text-left flex justify-between items-center px-4 sm:px-6 py-4 hover:bg-gray-50 transition"
                onClick={() => toggleExpand(r.id)}
              >
                <div>
                  <h2 className="text-sm sm:text-base font-semibold text-gray-800 mb-1">
                    {r.name}
                    <span className="text-gray-500 font-normal"> — {r.brand}</span>
                  </h2>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded ${getStatusColor(r.isApproved)}`}
                  >
                    {getStatusText(r.isApproved)}
                  </span>
                </div>
                <div className="text-gray-500">
                  {expandedId === r.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </button>

              {expandedId === r.id && details[r.id] && (
                <div className="px-4 sm:px-6 py-4 border-t text-sm text-gray-700 bg-gray-50 grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
                  <Field label="Açıklama" value={details[r.id].description} />
                  <Field label="Birim Tipleri" value={details[r.id].unitTypes} />
                  <Field
                    label="Kategori"
                    value={categoryMap[details[r.id].categoryId] || `#${details[r.id].categoryId}`}
                  />
                  <Field
                    label="Alt Kategori"
                    value={
                      subcategoryMap[details[r.id].categoryId]?.[details[r.id].categorySubId] ||
                      `#${details[r.id].categorySubId}`
                    }
                  />
                  <Field label="Yurt içi satış" value={details[r.id].allowedDomestic ? "Evet" : "Hayır"} />
                  <Field label="Yurt dışı satış" value={details[r.id].allowedInternational ? "Evet" : "Hayır"} />
                  <Field label="Durum" value={getStatusText(details[r.id].status)} />
                  <Field
                    label="Oluşturulma"
                    value={new Date(details[r.id].createdAt).toLocaleString("tr-TR")}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductRequestListPage;

// ✅ Yardımcı alan bileşeni
const Field = ({ label, value }) => (
  <div>
    <span className="block text-gray-500 font-medium">{label}:</span>
    <span className="block">{value}</span>
  </div>
);
