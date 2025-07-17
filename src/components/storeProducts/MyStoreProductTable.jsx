import React from "react";
import ProductRow from "./ProductRow";

const MyStoreProductTable = ({ products, onRefresh, onFeedback, hasCoverage }) => {
  if (!products?.length) {
    return (
      <div className="p-6 text-gray-500 text-sm border border-gray-200 rounded-md bg-white shadow-sm">
        Mağazada henüz ürün bulunmamaktadır.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-xl border border-gray-300 shadow-sm">
      <table className="min-w-full text-sm text-left border-collapse">
        <thead className="bg-gray-100 text-gray-700 font-semibold">
          <tr>
            <th className="px-5 py-3 border-b border-gray-300 whitespace-nowrap">Ürün</th>
            <th className="px-5 py-3 border-b border-gray-300 whitespace-nowrap">Kategori</th>
            <th className="px-5 py-3 border-b border-gray-300 whitespace-nowrap">Fiyat</th>
            <th className="px-5 py-3 border-b border-gray-300 whitespace-nowrap">Limit</th>
            <th className="px-5 py-3 border-b border-gray-300 whitespace-nowrap">Görsel</th>
            <th className="px-5 py-3 border-b border-gray-300 whitespace-nowrap">Durum</th>
            <th className="px-5 py-3 border-b border-gray-300 whitespace-nowrap">Stok</th>
            <th className="px-5 py-3 border-b border-gray-300 whitespace-nowrap">İşlemler</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {products.map((product) => (
            <ProductRow
              key={product.id}
              product={product}
              onRefresh={onRefresh}
              onFeedback={onFeedback}
              hasCoverage={hasCoverage} // ✅ EKLENDİ!
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyStoreProductTable;
