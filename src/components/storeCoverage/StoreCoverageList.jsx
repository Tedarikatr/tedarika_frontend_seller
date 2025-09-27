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
      <p className="text-sm text-gray-500 animate-pulse">
        Yükleniyor...
      </p>
    );
  }

  if (!coverage.length) {
    return (
      <div className="bg-white p-8 rounded-2xl border text-center text-sm text-gray-600 shadow-sm">
        Henüz kapsama alanı eklenmedi.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-4">
      {coverage.map((item, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl shadow-md border border-gray-200 hover:shadow-xl transition-all duration-300"
        >
          {/* Kart Başlık */}
          <div className="flex items-center gap-3 bg-gradient-to-r from-blue-50 via-blue-100 to-blue-50 px-6 py-4 rounded-t-2xl border-b border-blue-200">
            <div className="bg-blue-600 text-white p-2.5 rounded-full shadow-md">
              <Globe2 className="w-5 h-5" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-blue-900">
              Kapsama Alanı #{i + 1}
            </h3>
          </div>

          {/* Kart İçeriği */}
          <div className="px-6 py-5 text-sm sm:text-[15px] space-y-5">
            <div>
              <span className="block font-semibold text-gray-700 mb-2">
                🌍 Bölgeler
              </span>
              {item.regions.length > 0 ? (
                <ul className="list-disc list-inside text-gray-800 space-y-1">
                  {item.regions.map((r) => (
                    <li key={r.id}>{r.name}</li>
                  ))}
                </ul>
              ) : (
                <span className="text-gray-500 italic">
                  Tanımlı bölge yok.
                </span>
              )}
            </div>

            <div>
              <span className="block font-semibold text-gray-700 mb-2">
                🏳️ Ülkeler
              </span>
              {item.countries.length > 0 ? (
                <ul className="list-disc list-inside text-gray-800 space-y-1">
                  {item.countries.map((c) => (
                    <li key={c.id}>{c.name}</li>
                  ))}
                </ul>
              ) : (
                <span className="text-gray-500 italic">
                  Tanımlı ülke yok.
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StoreCoverageList;
