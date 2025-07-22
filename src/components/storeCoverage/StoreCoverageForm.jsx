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
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-gray-200 max-w-3xl mx-auto space-y-6"
    >
      {/* Başlık */}
      <div className="border-b pb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
          Mağaza Kapsama Alanı Ekle
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Bölge ve ülke seçimi yaparak mağazanızın hizmet verdiği alanları tanımlayın.
        </p>
      </div>

      {/* Mesaj kutusu */}
      {message && (
        <div
          className={`text-sm px-4 py-3 rounded-md font-medium ${
            message.type === "success"
              ? "bg-green-100 text-green-800 border border-green-200"
              : "bg-red-100 text-red-800 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Region & Country Selectors */}
      <div className="space-y-4">
        <RegionSelector value={selectedRegionId} onChange={setSelectedRegionId} />

        <CountrySelector
          regionId={selectedRegionId}
          selectedCountries={selectedCountryIds}
          onChange={setSelectedCountryIds}
        />
      </div>

      {/* Submit Button */}
      <div className="pt-4 border-t flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition disabled:opacity-50"
        >
          {loading ? "Kaydediliyor..." : "Kapsama Alanı Ekle"}
        </button>
      </div>
    </form>
  );
};

export default StoreCoverageForm;
