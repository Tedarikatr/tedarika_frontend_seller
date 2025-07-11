import React, { useEffect, useState } from "react";
import { getAllRegions } from "@/api/sellerLocationService";

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
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">Bölge Seç</label>
      <select
        value={value || ""}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">-- Bölge Seçin --</option>
        {regions.map((r) => (
          <option key={r.id} value={r.id}>{r.name}</option>
        ))}
      </select>
      {loading && <p className="text-xs text-gray-500">Yükleniyor...</p>}
    </div>
  );
};

export default RegionSelector;
