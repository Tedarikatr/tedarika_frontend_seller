import React from "react";
import ProductRow from "./ProductRow";

const MyStoreProductTable = ({ products, onRefresh, onFeedback, hasCoverage }) => {
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
          {/* Başlık */}
          <thead className="bg-gray-100 border-b border-gray-400">
            <tr className="text-[13px] font-semibold text-gray-700 uppercase tracking-wide">
              <th className="border border-gray-400 px-6 py-3 text-left">Ürün</th>
              <th className="border border-gray-400 px-6 py-3 text-left">Kategori</th>
              <th className="border border-gray-400 px-6 py-3 text-left">Fiyat</th>
              <th className="border border-gray-400 px-6 py-3 text-left">Limit</th>
              <th className="border border-gray-400 px-6 py-3 text-left">Görseller</th>
              <th className="border border-gray-400 px-6 py-3 text-left">Durum</th>
              <th className="border border-gray-400 px-6 py-3 text-left">Stok</th>
              <th className="border border-gray-400 px-6 py-3 text-left">İşlemler</th>
            </tr>
          </thead>

          {/* Satırlar */}
          <tbody>
            {products.map((product, index) => (
              <tr
                key={product.id}
                className={`transition-colors ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-gray-100`}
              >
                <ProductRow
                  product={product}
                  onRefresh={onRefresh}
                  onFeedback={onFeedback}
                  hasCoverage={hasCoverage}
                />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyStoreProductTable;
