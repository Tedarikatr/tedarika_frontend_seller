// =============================
// StoreCoverageForm.jsx - Ultra Modern & Beautiful 🎨
// =============================
import React, { useEffect, useState } from "react";
import RegionSelector from "./RegionSelector";
import CountrySelector from "./CountrySelector";
import { addStoreCoverage } from "@/api/sellerLocationService";
import { MapPin, Globe, CheckCircle, XCircle, Save } from "lucide-react";
import TedarikaLoader from "@/components/ui/TedarikaLoader";

const StoreCoverageForm = ({ onSuccess }) => {
  const [selectedRegionId, setSelectedRegionId] = useState(null);
  const [selectedCountryIds, setSelectedCountryIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    setSelectedCountryIds([]);
  }, [selectedRegionId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRegionId || selectedCountryIds.length === 0) {
      setMessage({
        type: "error",
        text: "Lütfen bölge ve en az bir ülke seçin.",
      });
      return;
    }

    try {
      setLoading(true);
      setMessage(null);
      await addStoreCoverage({
        regionIds: [selectedRegionId],
        countryIds: selectedCountryIds,
      });
      setMessage({
        type: "success",
        text: "Kapsama alanı başarıyla eklendi.",
      });
      setSelectedRegionId(null);
      setSelectedCountryIds([]);
      onSuccess?.();
    } catch (err) {
      setMessage({
        type: "error",
        text: "Kapsama alanı eklenirken hata oluştu.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message && (
        <div
          className={`flex items-start gap-3 px-5 py-4 rounded-2xl text-sm font-medium shadow-lg border-2 animate-[slideDown_0.3s_ease-out] ${
            message.type === "success"
              ? "bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-300 text-emerald-800"
              : "bg-gradient-to-r from-red-50 to-rose-50 border-red-300 text-red-800"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle size={20} className="flex-shrink-0 mt-0.5" />
          ) : (
            <XCircle size={20} className="flex-shrink-0 mt-0.5" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <div className="space-y-5">
        {/* Region Selector */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
            <MapPin size={16} className="text-emerald-600" />
            Bölge Seçimi
          </label>
          <RegionSelector value={selectedRegionId} onChange={setSelectedRegionId} />
        </div>

        {/* Country Selector */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
            <Globe size={16} className="text-blue-600" />
            Ülke Seçimi
          </label>
          <CountrySelector
            regionId={selectedRegionId}
            selectedCountries={selectedCountryIds}
            onChange={setSelectedCountryIds}
          />
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200">
        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <TedarikaLoader variant="micro" light className="h-5 w-5" label="Kaydediliyor" />
              Kaydediliyor...
            </span>
          ) : (
            <>
              <Save size={18} />
              Kapsama Alanı Ekle
            </>
          )}
        </button>
      </div>

      <style>{`
        @keyframes slideDown {
          from { 
            transform: translateY(-20px); 
            opacity: 0; 
          }
          to { 
            transform: translateY(0); 
            opacity: 1; 
          }
        }
      `}</style>
    </form>
  );
};

export default StoreCoverageForm;
