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
  const [subcategoryMap, setSubcategoryMap] = useState({}); // { [categoryId]: { subId: name } }

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

        // alt kategori adlarını da getir
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
      ? "text-green-600 bg-green-100"
      : status === false
      ? "text-yellow-600 bg-yellow-100"
      : "text-red-600 bg-red-100";

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Ürün Başvurularım</h1>

      {loading ? (
        <p className="text-sm text-gray-500">Yükleniyor...</p>
      ) : requests.length === 0 ? (
        <p className="text-sm text-gray-500">Herhangi bir başvuru bulunamadı.</p>
      ) : (
        <div className="space-y-4">
          {requests.map((r) => (
            <div key={r.id} className="bg-white border border-gray-300 rounded-xl shadow">
              <div
                className="flex justify-between items-center px-6 py-4 cursor-pointer hover:bg-gray-50"
                onClick={() => toggleExpand(r.id)}
              >
                <div>
                  <h2 className="text-sm font-semibold text-gray-800">
                    {r.name} — <span className="text-gray-500">{r.brand}</span>
                  </h2>
                  <span
                    className={`text-xs px-2 py-1 rounded ${getStatusColor(r.isApproved)}`}
                  >
                    {getStatusText(r.isApproved)}
                  </span>
                </div>
                <div className="text-gray-500">
                  {expandedId === r.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </div>

              {expandedId === r.id && details[r.id] && (
                <div className="px-6 pb-4 pt-2 border-t bg-gray-50 text-sm text-gray-700 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div><strong>Açıklama:</strong> {details[r.id].description}</div>
                  <div><strong>Birim Tipleri:</strong> {details[r.id].unitTypes}</div>
                  <div>
                    <strong>Kategori:</strong>{" "}
                    {categoryMap[details[r.id].categoryId] || `#${details[r.id].categoryId}`}
                  </div>
                  <div>
                    <strong>Alt Kategori:</strong>{" "}
                    {subcategoryMap[details[r.id].categoryId]?.[details[r.id].categorySubId] ||
                      `#${details[r.id].categorySubId}`}
                  </div>
                  <div><strong>Yurt içi:</strong> {details[r.id].allowedDomestic ? "Evet" : "Hayır"}</div>
                  <div><strong>Yurt dışı:</strong> {details[r.id].allowedInternational ? "Evet" : "Hayır"}</div>
                  <div><strong>Durum:</strong> {getStatusText(details[r.id].status)}</div>
                  <div><strong>Oluşturulma:</strong> {new Date(details[r.id].createdAt).toLocaleString()}</div>
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
