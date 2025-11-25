import BrandCard from "./BrandCard";
import { BrandOwnershipStatus, BrandOwnershipType } from "@/constants/brandEnums";
import { Award } from "lucide-react";

export default function BrandList({ brands, ownerships, sending, onOwnershipRequest }) {
  const getOwnershipStatus = (brandId) => {
    const item = ownerships.find((o) => o.brandId === brandId);
    if (!item) return null;
    return {
      type: BrandOwnershipType[item.ownershipType] || "-",
      status: BrandOwnershipStatus[item.status] || "-",
    };
  };

  if (brands.length === 0) {
    return (
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-lg p-12 text-center border-2 border-gray-200">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center mx-auto mb-6 shadow-lg">
          <Award className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Marka Bulunamadı</h3>
        <p className="text-gray-600">
          Arama kriterlerinize uygun marka bulunamadı.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {brands.map((brand) => {
        const ownership = getOwnershipStatus(brand.id);
        return (
          <BrandCard
            key={brand.id}
            brand={brand}
            ownership={ownership}
            sending={sending}
            onRequest={onOwnershipRequest}
          />
        );
      })}
    </div>
  );
}
