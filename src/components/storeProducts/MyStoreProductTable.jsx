import React from "react";
import ProductRow from "./ProductRow";

const MyStoreProductTable = ({ products, onRefresh, onFeedback, hasCoverage }) => {
  if (!products.length) {
    return (
      <div className="p-6 text-gray-500 text-sm text-center">
        Mağazanıza ait ürün bulunmamaktadır.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg shadow border border-gray-200 bg-white">
      <table className="min-w-full divide-y divide-gray-200 text-sm text-gray-800">
        <thead className="bg-emerald-50 text-emerald-800 font-semibold text-[13px] uppercase tracking-wide">
          <tr>
            <th className="px-5 py-3 text-left whitespace-nowrap">Ürün</th>
            <th className="px-5 py-3 text-left whitespace-nowrap">Kategori</th>
            <th className="px-5 py-3 text-left whitespace-nowrap">Fiyat</th>
            <th className="px-5 py-3 text-left whitespace-nowrap">Limit</th>
            <th className="px-5 py-3 text-left whitespace-nowrap">Görsel</th>
            <th className="px-5 py-3 text-left whitespace-nowrap">Durum</th>
            <th className="px-5 py-3 text-left whitespace-nowrap">Stok</th>
            <th className="px-5 py-3 text-left whitespace-nowrap">İşlemler</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {products.map((product, index) => (
            <tr key={product.id} className={index % 2 === 1 ? "bg-gray-50" : ""}>
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
  );
};

export default MyStoreProductTable;
