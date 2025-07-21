import React, { useState } from "react";
import {
  updateProductPrice,
  toggleProductOnSale,
  updateProductQuantityLimits,
  uploadProductImage,
  updateProductStock,
} from "@/api/sellerStoreService";

const ProductRow = ({ product, onRefresh, onFeedback, hasCoverage }) => {
  const [price, setPrice] = useState(product.unitPrice);
  const [minQty, setMinQty] = useState(product.minOrderQuantity);
  const [maxQty, setMaxQty] = useState(product.maxOrderQuantity);
  const [stock, setStock] = useState(product.stockQuantity ?? 0);
  const [imageFile, setImageFile] = useState(null);

  const storeProductId = product.storeProductId ?? product.id;

  const handleAction = async (fn, msg) => {
    try {
      await fn();
      onRefresh();
      onFeedback(msg, "success");
    } catch (e) {
      console.error(e);
      onFeedback("İşlem başarısız oldu!", "error");
    }
  };

  const handleImageUpload = () => {
    if (!imageFile) return;
    return uploadProductImage(storeProductId, imageFile);
  };

  return (
    <tr className="hover:bg-gray-50 transition">
      {/* Ürün */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <img
            src={imageFile ? URL.createObjectURL(imageFile) : product.imageUrl || "/placeholder.png"}
            alt={product.name}
            className="w-12 h-12 object-cover rounded border"
          />
          <div>
            <div className="font-medium text-gray-800">{product.name}</div>
            <div className="text-xs text-gray-500">#{storeProductId}</div>
          </div>
        </div>
      </td>

      {/* Kategori */}
      <td className="px-4 py-3">
        <div className="text-gray-700">{product.categoryName}</div>
        <div className="text-xs text-gray-500">{product.categorySubName}</div>
      </td>

      {/* Fiyat */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-20 border rounded px-2 py-1"
          />
          <button
            onClick={() =>
              handleAction(() => updateProductPrice(storeProductId, price), "Fiyat güncellendi.")
            }
            className="bg-green-600 text-white text-xs px-3 py-1 rounded hover:bg-green-700"
          >
            Kaydet
          </button>
        </div>
      </td>

      {/* Limit */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={minQty}
            onChange={(e) => setMinQty(e.target.value)}
            className="w-14 border px-2 py-1 rounded"
            placeholder="Min"
          />
          <input
            type="number"
            value={maxQty}
            onChange={(e) => setMaxQty(e.target.value)}
            className="w-14 border px-2 py-1 rounded"
            placeholder="Max"
          />
          <button
            onClick={() =>
              handleAction(
                () => updateProductQuantityLimits(storeProductId, minQty, maxQty),
                "Limit güncellendi."
              )
            }
            className="bg-gray-600 text-white text-xs px-3 py-1 rounded hover:bg-gray-700"
          >
            Kaydet
          </button>
        </div>
      </td>

      {/* Görsel */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <input
            type="file"
            onChange={(e) => setImageFile(e.target.files[0])}
            className="text-xs"
          />
          <button
            onClick={() => handleAction(handleImageUpload, "Görsel yüklendi.")}
            className="bg-blue-600 text-white text-xs px-3 py-1 rounded hover:bg-blue-700"
          >
            Yükle
          </button>
        </div>
      </td>

      {/* Durum */}
      <td className="px-4 py-3">
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            product.isOnSale ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"
          }`}
        >
          {product.isOnSale ? "Satışta" : "Satışta Değil"}
        </span>
      </td>

      {/* Stok */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="w-16 border px-2 py-1 rounded"
          />
          <button
            onClick={() =>
              handleAction(() => updateProductStock(storeProductId, stock), "Stok güncellendi.")
            }
            className="bg-indigo-600 text-white text-xs px-3 py-1 rounded hover:bg-indigo-700"
          >
            Kaydet
          </button>
        </div>
      </td>

      {/* İşlemler */}
      <td className="px-4 py-3">
        <button
          onClick={() =>
            handleAction(
              () => toggleProductOnSale(storeProductId, !product.isOnSale),
              product.isOnSale ? "Satış kapatıldı." : "Satışa açıldı."
            )
          }
          disabled={!hasCoverage}
          title={!hasCoverage ? "Satışa açmak için hizmet bölgesi tanımlayın." : ""}
          className={`text-yellow-600 hover:underline text-sm ${
            !hasCoverage ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {product.isOnSale ? "Satışı Kapat" : "Satışa Aç"}
        </button>
      </td>
    </tr>
  );
};

export default ProductRow;
