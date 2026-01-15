import React, { useEffect, useState } from "react";
import { getCountriesByRegionId } from "@/api/sellerLocationService";
import { Loader2 } from "lucide-react";

const CountrySelector = ({ regionId, selectedCountries, onChange }) => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!regionId) {
      setCountries([]);
      return;
    }

    const fetchCountries = async () => {
      setLoading(true);
      try {
        const data = await getCountriesByRegionId(regionId);
        setCountries(data);
      } catch (err) {
        console.error("Ülkeler alınamadı:", err);
        setCountries([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, [regionId]);

  const handleSelectChange = (e) => {
    const selectedValues = Array.from(e.target.selectedOptions, option => Number(option.value));
    onChange(selectedValues);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-gray-800">
        Ülke Seç <span className="text-red-500">*</span>
      </label>

      <div className="relative">
        <select
          multiple
          value={selectedCountries.map(String)}
          onChange={handleSelectChange}
          disabled={loading || !regionId || countries.length === 0}
          size={Math.min(countries.length, 8)}
          className={`w-full appearance-none bg-white border rounded-lg px-4 py-2 text-sm transition focus:outline-none focus:ring-2 ${
            loading || !regionId || countries.length === 0
              ? "border-gray-300 text-gray-400 bg-gray-50 cursor-not-allowed"
              : "border-gray-300 text-gray-700 focus:ring-blue-500"
          }`}
        >
          {loading ? (
            <option disabled>Ülkeler yükleniyor...</option>
          ) : countries.length === 0 ? (
            <option disabled>Bu bölgeye ait ülke bulunamadı.</option>
          ) : (
            countries.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))
          )}
        </select>

        {/* Custom arrow icon */}
        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1 animate-pulse">
          <Loader2 className="w-4 h-4 animate-spin" />
          Ülkeler yükleniyor...
        </div>
      )}

      {selectedCountries.length > 0 && (
        <p className="text-xs text-gray-600 mt-1">
          {selectedCountries.length} ülke seçildi
        </p>
      )}
    </div>
  );
};

export default CountrySelector;
