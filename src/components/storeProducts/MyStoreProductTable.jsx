// =============================
// MyStoreProductTable.jsx
// =============================
import React from "react";

const MyStoreProductTable = ({ products, onManage }) => {
  if (!products?.length) {
    return (
      <div className="p-10 text-center">
        <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-gray-100 text-gray-700 font-medium shadow-sm">
          Mağazanıza ait ürün bulunmuyor.
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-lg border border-gray-400 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-sm text-gray-800">
          <thead className="bg-gray-100 border-b border-gray-400">
            <tr className="text-[13px] font-semibold text-gray-700 uppercase tracking-wide">
              <th className="border border-gray-400 px-6 py-3 text-left">Ürün</th>
              <th className="border border-gray-400 px-6 py-3 text-right w-48">İşlemler</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product, index) => {
              const cover =
                product.storeProductImagesUrls?.[0] ||
                product.storeProductImageUrl ||
                product.productImageUrls?.[0] ||
                product.imageUrl ||
                "/placeholder.png";

              return (
                <tr
                  key={product.id}
                  className={`transition-colors ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-gray-100`}
                >
                  {/* Ürün Bilgisi */}
                  <td className="px-6 py-4 border-t border-gray-300">
                    <div className="flex items-center gap-3">
                      <img
                        src={cover}
                        alt={product.name || "Ürün görseli"}
                        className="w-12 h-12 object-cover rounded-md border border-gray-300 bg-white"
                      />
                      <div>
                        <div className="font-semibold text-gray-800">{product.name}</div>
                        <div className="text-[11px] text-gray-500">#{product.id}</div>
                      </div>
                    </div>
                  </td>

                  {/* Ürün Yönetimi Butonu */}
                  <td className="px-6 py-4 border-t border-gray-300 text-right">
                    <button
                      onClick={() => onManage(product)}
                      className="px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white text-xs font-semibold rounded-md shadow-sm"
                    >
                      Ürün Yönetimi
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyStoreProductTable;
