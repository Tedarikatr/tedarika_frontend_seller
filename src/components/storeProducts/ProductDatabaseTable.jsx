import React from "react";

const ProductDatabaseTable = ({ products, onAdd, addingId, addedIds }) => {
  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full text-sm bg-white border-separate border-spacing-y-1">
        <thead className="bg-gray-100 text-gray-700 font-semibold">
          <tr>
            <th className="px-4 py-3 text-left">ID</th>
            <th className="px-4 py-3 text-left">Ürün Adı</th>
            <th className="px-4 py-3 text-left">Kategori</th>
            <th className="px-4 py-3 text-left">Marka</th>
            <th className="px-4 py-3 text-left">Barkod</th>
            <th className="px-4 py-3 text-center">İşlem</th>
          </tr>
        </thead>
        <tbody>
          {products.map((prod, index) => (
            <tr
              key={prod.id}
              className="bg-white hover:bg-blue-50 border border-gray-200 rounded-md shadow-sm"
            >
              <td className="px-4 py-3">{prod.id}</td>
              <td className="px-4 py-3 font-medium text-gray-800">{prod.name}</td>
              <td className="px-4 py-3">
                {prod.categoryName}
                <div className="text-xs text-gray-500">{prod.categorySubName}</div>
              </td>
              <td className="px-4 py-3">{prod.brand}</td>
              <td className="px-4 py-3">{prod.barcode}</td>
              <td className="px-4 py-3 text-center">
                {addedIds.includes(prod.id) ? (
                  <span className="inline-block text-green-700 bg-green-100 border border-green-200 px-2 py-1 rounded text-xs font-semibold">
                    ✔ Eklendi
                  </span>
                ) : (
                  <button
                    onClick={() => onAdd(prod.id)}
                    disabled={addingId === prod.id}
                    className={`w-full sm:w-auto px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all duration-150 ${
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
    </div>
  );
};

export default ProductDatabaseTable;
