import React, { useState } from "react";
import StoreCoverageForm from "@/components/storeCoverage/StoreCoverageForm";
import StoreCoverageList from "@/components/storeCoverage/StoreCoverageList";
import { MapPin, ListChecks } from "lucide-react";

const StoreCoveragePage = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSuccess = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-10 min-h-screen bg-[#f4f6f8]">
      {/* Sayfa Başlığı */}
      <div className="mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#003636] flex items-center gap-2 tracking-tight">
          <MapPin className="w-6 h-6 text-[#005e5e]" />
          Mağaza Lokasyon Yönetimi
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Bölge ve ülke bazlı kapsama alanınızı kolayca yönetin.
        </p>
      </div>

      {/* Kartlar Alanı */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Kartı */}
        <div className="rounded-2xl border border-gray-300 bg-white shadow-md">
          <div className="flex items-center gap-2 text-base font-semibold text-[#003636] bg-[#e0f4f2] px-6 py-3 rounded-t-2xl border-b border-gray-200">
            <MapPin className="w-5 h-5 text-[#005e5e]" />
            Yeni Lokasyon Ekle
          </div>
          <div className="p-6">
            <StoreCoverageForm onSuccess={handleSuccess} />
          </div>
        </div>

        {/* Liste Kartı */}
        <div className="rounded-2xl border border-gray-300 bg-white shadow-md">
          <div className="flex items-center gap-2 text-base font-semibold text-[#003636] bg-[#edf1fd] px-6 py-3 rounded-t-2xl border-b border-gray-200">
            <ListChecks className="w-5 h-5 text-[#005e5e]" />
            Eklenen Lokasyonlar
          </div>
          <div className="p-6">
            <StoreCoverageList key={refreshKey} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreCoveragePage;
