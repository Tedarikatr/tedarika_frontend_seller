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
    <div className="p-4 sm:p-8 lg:p-12 min-h-screen bg-gradient-to-br from-[#f9fafb] via-[#f4f7fa] to-[#eef2f5]">
      {/* Sayfa Başlığı */}
      <div className="mb-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#003636] flex items-center gap-3 tracking-tight">
          <MapPin className="w-8 h-8 text-[#00a99d]" />
          Mağaza Lokasyon Yönetimi
        </h1>
        <p className="text-base text-gray-600 mt-2">
          Satış yapabileceğiniz bölgeleri yönetin, yeni lokasyonlar ekleyin ve mevcut kapsamınızı kolayca düzenleyin.
        </p>
      </div>

      {/* Kartlar Alanı */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Form Kartı */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center gap-2 text-lg font-semibold text-[#003636] bg-gradient-to-r from-[#e0f7f5] to-[#c2ece8] px-6 py-4 rounded-t-2xl border-b border-gray-200">
            <MapPin className="w-5 h-5 text-[#00a99d]" />
            Yeni Lokasyon Ekle
          </div>
          <div className="p-6">
            <StoreCoverageForm onSuccess={handleSuccess} />
          </div>
        </div>

        {/* Liste Kartı */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center gap-2 text-lg font-semibold text-[#003636] bg-gradient-to-r from-[#e8edfc] to-[#d4defa] px-6 py-4 rounded-t-2xl border-b border-gray-200">
            <ListChecks className="w-5 h-5 text-[#3b5bcc]" />
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
