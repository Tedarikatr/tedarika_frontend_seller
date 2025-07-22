import React, { useEffect, useState } from "react";
import { getAllRegions } from "@/api/sellerLocationService";
import { Loader2 } from "lucide-react";

const RegionSelector = ({ value, onChange }) => {
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllRegions()
      .then(setRegions)
      .catch(() => console.error("Bölgeler alınamadı"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-gray-800">
        Bölge Seç <span className="text-red-500">*</span>
      </label>

      <div className="relative">
        <select
          value={value || ""}
          onChange={(e) => onChange(Number(e.target.value))}
          disabled={loading}
          className={`w-full appearance-none bg-white border rounded-lg px-4 py-2 text-sm transition focus:outline-none focus:ring-2 ${
            loading
              ? "border-gray-300 text-gray-400 bg-gray-50 cursor-not-allowed"
              : "border-gray-300 text-gray-700 focus:ring-blue-500"
          }`}
        >
          <option value="">-- Bölge Seçin --</option>
          {regions.map((region) => (
            <option key={region.id} value={region.id}>
              {region.name}
            </option>
          ))}
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
          Bölgeler yükleniyor...
        </div>
      )}
    </div>
  );
};

export default RegionSelector;
