import React, { useState } from "react";
import RegionSelector from "./RegionSelector";
import CountrySelector from "./CountrySelector";
import { addStoreCoverage } from "@/api/sellerLocationService";

const StoreCoverageForm = ({ onSuccess }) => {
  const [selectedRegionId, setSelectedRegionId] = useState(null);
  const [selectedCountryIds, setSelectedCountryIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedRegionId || selectedCountryIds.length === 0) {
      setMessage({ type: "error", text: "Lütfen bölge ve en az bir ülke seçin." });
      return;
    }

    try {
      setLoading(true);
      setMessage(null);

      await addStoreCoverage({
        regionIds: [selectedRegionId],
        countryIds: selectedCountryIds,
      });

      setMessage({ type: "success", text: "Kapsama alanı başarıyla eklendi." });
      setSelectedRegionId(null);
      setSelectedCountryIds([]);
      onSuccess?.();
    } catch (err) {
      console.error("Kapsama ekleme hatası:", err);
      setMessage({ type: "error", text: "Kapsama alanı eklenirken hata oluştu." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border shadow space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">Mağaza Kapsama Alanı Ekle</h2>

      {message && (
        <div
          className={`text-sm px-4 py-2 rounded ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <RegionSelector selectedRegionId={selectedRegionId} onChange={setSelectedRegionId} />

      <CountrySelector
        regionId={selectedRegionId}
        selectedCountries={selectedCountryIds}
        onChange={setSelectedCountryIds}
      />

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
        >
          {loading ? "Kaydediliyor..." : "Kapsama Alanı Ekle"}
        </button>
      </div>
    </form>
  );
};

export default StoreCoverageForm;
