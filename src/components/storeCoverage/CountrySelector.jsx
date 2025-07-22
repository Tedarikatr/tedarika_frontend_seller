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

  const toggleCountry = (id) => {
    if (selectedCountries.includes(id)) {
      onChange(selectedCountries.filter((c) => c !== id));
    } else {
      onChange([...selectedCountries, id]);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-gray-800">
        Ülkeleri Seç <span className="text-red-500">*</span>
      </label>

      {loading ? (
        <div className="flex items-center gap-2 text-xs text-gray-500 animate-pulse">
          <Loader2 className="w-4 h-4 animate-spin" />
          Ülkeler yükleniyor...
        </div>
      ) : countries.length === 0 ? (
        <p className="text-sm text-gray-500 italic">Bu bölgeye ait ülke bulunamadı.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {countries.map((c) => {
            const isSelected = selectedCountries.includes(c.id);
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => toggleCountry(c.id)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border shadow-sm ${
                  isSelected
                    ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                    : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
                }`}
              >
                {c.name}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CountrySelector;
