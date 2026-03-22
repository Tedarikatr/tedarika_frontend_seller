// =============================
// StoreCoverageList.jsx - Ultra Modern & Beautiful 🎨
// =============================
import React, { useEffect, useState } from "react";
import { fetchMyStoreCoverage } from "@/api/sellerLocationService";
import { Globe2, MapPin, Flag, Sparkles } from "lucide-react";
import TedarikaLoader from "@/components/ui/TedarikaLoader";

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
      <div className="flex flex-col items-center justify-center py-12">
        <TedarikaLoader variant="compact" />
      </div>
    );
  }

  if (!coverage.length) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 mb-4 shadow-lg">
          <MapPin size={40} className="text-gray-400" />
        </div>
        <h3 className="text-lg font-bold text-gray-700 mb-2">
          Henüz Lokasyon Yok
        </h3>
        <p className="text-gray-500 text-sm">
          Soldaki formdan yeni lokasyon ekleyebilirsiniz
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {coverage.map((item, i) => (
        <div
          key={i}
          className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden hover:scale-[1.02]"
        >
          {/* Kart Başlık */}
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                <Globe2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold">Kapsama Alanı #{i + 1}</h3>
                <p className="text-xs text-blue-100">Aktif hizmet bölgesi</p>
              </div>
            </div>
            <Sparkles size={20} className="text-yellow-300" />
          </div>

          {/* Kart İçeriği */}
          <div className="p-5 space-y-5">
            {/* Bölgeler */}
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-4 border border-emerald-200">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white shadow-lg">
                  <MapPin size={16} />
                </div>
                <h4 className="font-bold text-gray-800">Bölgeler</h4>
                <span className="ml-auto px-2 py-1 bg-emerald-200 text-emerald-800 rounded-full text-xs font-bold">
                  {item.regions.length}
                </span>
              </div>
              {item.regions.length > 0 ? (
                <div className="space-y-2">
                  {item.regions.map((r) => (
                    <div
                      key={r.id}
                      className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 text-sm text-gray-800 font-medium shadow-sm"
                    >
                      <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                      {r.name}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic text-sm">Tanımlı bölge yok</p>
              )}
            </div>

            {/* Ülkeler */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg">
                  <Flag size={16} />
                </div>
                <h4 className="font-bold text-gray-800">Ülkeler</h4>
                <span className="ml-auto px-2 py-1 bg-blue-200 text-blue-800 rounded-full text-xs font-bold">
                  {item.countries.length}
                </span>
              </div>
              {item.countries.length > 0 ? (
                <div className="space-y-2">
                  {item.countries.map((c) => (
                    <div
                      key={c.id}
                      className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 text-sm text-gray-800 font-medium shadow-sm"
                    >
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      {c.name}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic text-sm">Tanımlı ülke yok</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StoreCoverageList;
