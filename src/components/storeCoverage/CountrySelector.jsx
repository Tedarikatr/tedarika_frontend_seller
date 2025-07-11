import React, { useEffect, useState } from "react";
import { getCountriesByRegionId } from "@/api/sellerLocationService";

const CountrySelector = ({ regionId, selectedCountries, onChange }) => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!regionId) {
      setCountries([]);
      return;
    }

    const fetch = async () => {
      setLoading(true);
      try {
        const data = await getCountriesByRegionId(regionId);
        setCountries(data);
      } catch (err) {
        console.error("Ülkeler alınamadı:", err);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [regionId]);

  const toggle = (id) => {
    if (selectedCountries.includes(id)) {
      onChange(selectedCountries.filter((c) => c !== id));
    } else {
      onChange([...selectedCountries, id]);
    }
  };

  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">Ülkeleri Seç</label>

      {loading ? (
        <p className="text-xs text-gray-500">Yükleniyor...</p>
      ) : countries.length === 0 ? (
        <p className="text-xs text-gray-500">Bu bölgeye ait ülke bulunamadı.</p>
      ) : (
        <div className="flex flex-wrap gap-2 mt-1">
          {countries.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => toggle(c.id)}
              className={`px-3 py-1.5 rounded-full text-sm border transition ${
                selectedCountries.includes(c.id)
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-gray-100 text-gray-800 border-gray-300 hover:bg-blue-50"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CountrySelector;
