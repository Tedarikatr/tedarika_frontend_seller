import React from "react";
import ProductRow from "./ProductRow";

const MyStoreProductTable = ({ products, onRefresh, onFeedback }) => {
  if (!products?.length) {
    return (
      <div className="p-6 text-gray-500 text-sm">
        Mağazada henüz ürün bulunmamaktadır.
      </div>
    );
  }

  return (
    <table className="min-w-full text-sm text-left border-collapse">
      <thead className="bg-gray-100 text-gray-700 font-semibold">
        <tr>
          <th className="px-4 py-3 border-b border-gray-300">Ürün</th>
          <th className="px-4 py-3 border-b border-gray-300">Kategori</th>
          <th className="px-4 py-3 border-b border-gray-300">Fiyat</th>
          <th className="px-4 py-3 border-b border-gray-300">Limit</th>
          <th className="px-4 py-3 border-b border-gray-300">Görsel</th>
          <th className="px-4 py-3 border-b border-gray-300">Durum</th>
          <th className="px-4 py-3 border-b border-gray-300">İşlemler</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {products.map((product) => (
          <ProductRow
            key={product.id}
            product={product}
            onRefresh={onRefresh}
            onFeedback={onFeedback}
          />
        ))}
      </tbody>
    </table>
  );
};

export default MyStoreProductTable;
