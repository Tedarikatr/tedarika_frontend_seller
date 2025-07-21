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
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto text-sm text-left">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="px-5 py-3">Ürün</th>
            <th className="px-5 py-3">Kategori</th>
            <th className="px-5 py-3">Fiyat</th>
            <th className="px-5 py-3">Limit</th>
            <th className="px-5 py-3">Görsel</th>
            <th className="px-5 py-3">Durum</th>
            <th className="px-5 py-3">Stok</th>
            <th className="px-5 py-3">İşlemler</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {products.map((product) => (
            <ProductRow
              key={product.id}
              product={product}
              onRefresh={onRefresh}
              onFeedback={onFeedback}
              hasCoverage={hasCoverage}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyStoreProductTable;
