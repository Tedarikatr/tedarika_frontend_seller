import BrandCard from "./BrandCard";
import { BrandOwnershipStatus, BrandOwnershipType } from "@/constants/brandEnums";
import { Award } from "lucide-react";

export default function BrandList({ brands, ownerships, sending, onOwnershipRequest }) {
  const getOwnershipStatus = (brandId) => {
    const item = ownerships.find((o) => o.brandId === brandId);
    if (!item) return null;
    return {
      type: typeof item.ownershipType === "number" 
        ? BrandOwnershipType[item.ownershipType] 
        : item.ownershipType || "-",
      status: typeof item.status === "number"
        ? BrandOwnershipStatus[item.status]
        : item.status || "-",
      // Original numeric values for internal use
      ownershipType: typeof item.ownershipType === "number" ? item.ownershipType : 
        Object.keys(BrandOwnershipType).find(key => BrandOwnershipType[key] === item.ownershipType) || 0,
      statusNum: typeof item.status === "number" ? item.status :
        Object.keys(BrandOwnershipStatus).find(key => BrandOwnershipStatus[key] === item.status) || 0,
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
