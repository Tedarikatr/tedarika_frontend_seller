import React, { useEffect, useState } from "react";
import RegionSelector from "./RegionSelector";
import CountrySelector from "./CountrySelector";
import { addStoreCoverage } from "@/api/sellerLocationService";

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
    <form
      onSubmit={handleSubmit}
      className="bg-white/70 backdrop-blur-sm p-8 rounded-3xl shadow-lg border border-gray-100 max-w-3xl mx-auto space-y-6 transition-all duration-300 hover:shadow-xl"
    >
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Mağaza Kapsama Alanı Ekle
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Bölge ve ülke seçimi yaparak mağazanızın hizmet verdiği alanları tanımlayın.
        </p>
      </div>

      {message && (
        <div
          className={`text-sm px-4 py-3 rounded-xl font-medium shadow-sm border ${
            message.type === "success"
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-red-50 text-red-700 border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="space-y-4">
        <RegionSelector value={selectedRegionId} onChange={setSelectedRegionId} />
        <CountrySelector
          regionId={selectedRegionId}
          selectedCountries={selectedCountryIds}
          onChange={setSelectedCountryIds}
        />
      </div>

      <div className="pt-4 border-t flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50"
        >
          {loading ? "Kaydediliyor..." : "Kapsama Alanı Ekle"}
        </button>
      </div>
    </form>
  );
};

export default StoreCoverageForm;
