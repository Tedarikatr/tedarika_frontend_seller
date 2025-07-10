import React from "react";

const ProductDatabaseTable = ({ products, onAdd, addingId, addedIds }) => {
  return (
    <table className="min-w-full divide-y divide-gray-200 text-sm bg-white">
      <thead className="bg-gray-100 text-gray-700 font-semibold">
        <tr>
          <th className="px-5 py-3 text-left border-b border-gray-300">ID</th>
          <th className="px-5 py-3 text-left border-b border-gray-300">Ürün Adı</th>
          <th className="px-5 py-3 text-left border-b border-gray-300">Kategori</th>
          <th className="px-5 py-3 text-left border-b border-gray-300">Marka</th>
          <th className="px-5 py-3 text-left border-b border-gray-300">Barkod</th>
          <th className="px-5 py-3 text-center border-b border-gray-300">İşlem</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {products.map((prod) => (
          <tr key={prod.id} className="hover:bg-gray-50 transition-colors">
            <td className="px-5 py-3 text-gray-800 border-r border-gray-200">{prod.id}</td>
            <td className="px-5 py-3 font-medium text-gray-900 border-r border-gray-200">{prod.name}</td>
            <td className="px-5 py-3 text-gray-700 border-r border-gray-200">
              {prod.categoryName}
              <div className="text-xs text-gray-500">{prod.categorySubName}</div>
            </td>
            <td className="px-5 py-3 text-gray-700 border-r border-gray-200">{prod.brand}</td>
            <td className="px-5 py-3 text-gray-700 border-r border-gray-200">{prod.barcode}</td>
            <td className="px-5 py-3 text-center">
              {addedIds.includes(prod.id) ? (
                <span className="inline-block text-green-700 text-sm font-semibold">
                  Eklendi
                </span>
              ) : (
                <button
                  onClick={() => onAdd(prod.id)}
                  disabled={addingId === prod.id}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-150 ${
                    addingId === prod.id
                      ? "bg-gray-300 text-white cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {addingId === prod.id ? "Ekleniyor..." : "Mağazama Ekle"}
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProductDatabaseTable;
