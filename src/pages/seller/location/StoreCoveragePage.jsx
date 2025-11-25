// =============================
// StoreCoveragePage.jsx - Ultra Modern & Beautiful 🎨
// =============================
import React, { useState, useEffect } from "react";
import StoreCoverageForm from "@/components/storeCoverage/StoreCoverageForm";
import StoreCoverageList from "@/components/storeCoverage/StoreCoverageList";
import { MapPin, ListChecks, AlertCircle, Globe, Sparkles, Map } from "lucide-react";
import { getMyStore } from "@/api/sellerStoreService";
import { useNavigate } from "react-router-dom";

const StoreCoveragePage = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [hasStore, setHasStore] = useState(true);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleSuccess = () => {
    setRefreshKey((prev) => prev + 1);
  };

  useEffect(() => {
    const verifyStore = async () => {
      try {
        const store = await getMyStore();
        if (!store || !store.id) {
          setHasStore(false);
          return;
        }
      } catch (err) {
        console.warn("Mağaza bilgisi alınamadı:", err);
        setHasStore(false);
      } finally {
        setLoading(false);
      }
    };

    verifyStore();
  }, []);

  // ⏳ Yükleniyor ekranı
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 mb-4 animate-pulse shadow-xl">
            <Map size={40} className="text-white" />
          </div>
          <p className="text-gray-600 font-medium text-lg">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  // ⚠️ Mağaza yoksa
  if (!hasStore) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center px-6">
        <div className="bg-white rounded-3xl shadow-2xl border-2 border-amber-200 px-10 py-12 max-w-lg">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
              <AlertCircle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              Henüz Mağaza Bulunmuyor
            </h2>
            <p className="text-gray-600">
              Lokasyon ekleyebilmek için öncelikle bir mağaza oluşturmalısınız.
            </p>
            <button
              onClick={() => navigate("/seller/store/create")}
              className="mt-4 px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Mağaza Oluştur
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Mağaza varsa normal içerik
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Hero Header Section */}
      <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
              <Globe size={32} className="animate-pulse" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-1 flex items-center gap-2">
                Mağaza Lokasyon Yönetimi
                <Sparkles size={24} className="text-yellow-300" />
              </h1>
              <p className="text-emerald-100 text-sm">
                Hizmet vereceğiniz bölgeleri ve ülkeleri yönetin
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form Kartı */}
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden hover:shadow-3xl transition-all duration-300">
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 px-6 py-5 border-b border-emerald-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white shadow-lg">
                <MapPin size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800">Yeni Lokasyon Ekle</h2>
                <p className="text-xs text-gray-600">Bölge ve ülke seçimi yapın</p>
              </div>
            </div>
            <div className="p-6">
              <StoreCoverageForm onSuccess={handleSuccess} />
            </div>
          </div>

          {/* Liste Kartı */}
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden hover:shadow-3xl transition-all duration-300">
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 px-6 py-5 border-b border-blue-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg">
                <ListChecks size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800">Eklenen Lokasyonlar</h2>
                <p className="text-xs text-gray-600">Mevcut hizmet bölgeleriniz</p>
              </div>
            </div>
            <div className="p-6">
              <StoreCoverageList key={refreshKey} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreCoveragePage;
