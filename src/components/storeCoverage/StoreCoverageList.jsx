import React, { useEffect, useState } from "react";
import { fetchMyStoreCoverage } from "@/api/sellerLocationService";
import { Globe2 } from "lucide-react";

const StoreCoverageList = () => {
  const [coverage, setCoverage] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyStoreCoverage()
      .then(setCoverage)
      .catch(() => alert("Kapsama alanları alınamadı"))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return <p className="text-sm text-gray-500">Yükleniyor...</p>;

  if (!coverage.length)
    return <p className="text-sm text-gray-500">Henüz kapsama alanı eklenmedi.</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
      {coverage.map((item, i) => (
        <div
          key={i}
          className="rounded-xl bg-white shadow-md border border-gray-200 hover:shadow-lg transition-all"
        >
          {/* Kart Başlık */}
          <div className="flex items-center gap-2 bg-blue-50 px-4 py-3 rounded-t-xl border-b border-blue-200">
            <Globe2 className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-semibold text-blue-900">Kapsama Alanı {i + 1}</span>
          </div>

          {/* Kart İçeriği */}
          <div className="px-5 py-4 text-sm space-y-2">
            <div>
              <span className="font-medium text-gray-700">Bölgeler:</span>{" "}
              <span className="text-gray-800">
                {item.regions.map((r) => r.name).join(", ") || "Yok"}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Ülkeler:</span>{" "}
              <span className="text-gray-800">
                {item.countries.map((c) => c.name).join(", ") || "Yok"}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StoreCoverageList;
