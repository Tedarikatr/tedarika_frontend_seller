import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductImagesManager from "@/components/storeProducts/ProductImagesManager";
import { ArrowLeft } from "lucide-react";

const ProductImagesPage = () => {
  const { storeProductId } = useParams(); // route: /seller/products/:storeProductId/images
  const nav = useNavigate();

  return (
    <div className="p-4 sm:p-6 bg-[#f9fafb] min-h-screen overflow-x-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => nav(-1)}
            className="p-2 rounded-md hover:bg-gray-100 flex-shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl sm:text-2xl font-bold truncate">Görselleri Yönet</h1>
        </div>
        <div className="text-xs text-gray-500 truncate">Ürün ID: {storeProductId}</div>
      </div>

      <div className="bg-white rounded-xl sm:rounded-2xl border shadow-sm p-4 sm:p-5 overflow-hidden">
        <ProductImagesManager storeProductId={storeProductId} />
      </div>
    </div>
  );
};

export default ProductImagesPage;
