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

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <p className="text-gray-500 text-sm animate-pulse">Yükleniyor...</p>
      </div>
    );
  }

  if (!coverage.length) {
    return (
      <div className="bg-white p-10 rounded-2xl border border-gray-100 text-center shadow-sm">
        <p className="text-gray-500 text-sm">Henüz kapsama alanı eklenmedi.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 mt-6">
      {coverage.map((item, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
        >
          {/* Kart Başlık */}
          <div className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-4">
            <div className="bg-white/20 p-2 rounded-full flex items-center justify-center">
              <Globe2 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold">
              Kapsama Alanı #{i + 1}
            </h3>
          </div>

          {/* Kart İçeriği */}
          <div className="p-6 space-y-5 text-sm">
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Bölgeler</h4>
              {item.regions.length > 0 ? (
                <ul className="list-disc list-inside text-gray-800 space-y-1">
                  {item.regions.map((r) => (
                    <li key={r.id}>{r.name}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic">Tanımlı bölge yok.</p>
              )}
            </div>

            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Ülkeler</h4>
              {item.countries.length > 0 ? (
                <ul className="list-disc list-inside text-gray-800 space-y-1">
                  {item.countries.map((c) => (
                    <li key={c.id}>{c.name}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic">Tanımlı ülke yok.</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StoreCoverageList;
