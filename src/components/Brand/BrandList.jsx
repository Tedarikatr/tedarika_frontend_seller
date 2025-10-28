import BrandCard from "./BrandCard";
import { BrandOwnershipStatus, BrandOwnershipType } from "@/constants/brandEnums";

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
    return <p className="text-gray-500">Marka bulunamadı.</p>;
  }

  return (
    <div className="space-y-3">
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
