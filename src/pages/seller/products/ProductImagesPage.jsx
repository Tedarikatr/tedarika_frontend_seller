import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductImagesManager from "@/components/storeProducts/ProductImagesManager";
import { ArrowLeft } from "lucide-react";

const ProductImagesPage = () => {
  const { storeProductId } = useParams(); // route: /seller/products/:storeProductId/images
  const nav = useNavigate();

  return (
    <div className="p-6 bg-[#f9fafb] min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => nav(-1)}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            <ArrowLeft />
          </button>
          <h1 className="text-2xl font-bold">Görselleri Yönet</h1>
        </div>
        <div className="text-xs text-gray-500">Ürün ID: {storeProductId}</div>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm p-5">
        <ProductImagesManager storeProductId={storeProductId} />
      </div>
    </div>
  );
};

export default ProductImagesPage;
