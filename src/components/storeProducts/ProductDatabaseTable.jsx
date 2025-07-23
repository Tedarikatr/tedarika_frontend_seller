import React from "react";

const ProductDatabaseTable = ({ products = [], onAdd, addingId, addedIds = [] }) => {
  return (
    <div className="w-full overflow-x-auto rounded-lg shadow-sm">
      <table className="min-w-full text-sm text-gray-800 bg-white border-separate border-spacing-y-2">
        <thead className="bg-emerald-50 text-emerald-800 font-semibold text-[13px] uppercase tracking-wide">
          <tr>
            <th className="px-4 py-3 text-left w-10">#</th>
            <th className="px-4 py-3 text-left">ID</th>
            <th className="px-4 py-3 text-left">Ürün Adı</th>
            <th className="px-4 py-3 text-left">Kategori</th>
            <th className="px-4 py-3 text-left">Marka</th>
            <th className="px-4 py-3 text-left">Barkod</th>
            <th className="px-4 py-3 text-center">İşlem</th>
          </tr>
        </thead>
        <tbody>
          {products.map((prod, index) => {
            const productId = String(prod.id ?? prod.productId);
            const isAdded = addedIds.includes(productId);
            const isAdding = String(addingId) === productId;

            return (
              <tr key={productId} className="transition-all duration-150">
                <td className="px-4 py-3 text-center rounded-l-lg bg-white border border-gray-200 shadow-sm">
                  {index + 1}
                </td>
                <td className="px-4 py-3 bg-white border border-gray-200 shadow-sm">#{prod.id}</td>
                <td className="px-4 py-3 bg-white border border-gray-200 shadow-sm font-medium">
                  {prod.name}
                </td>
                <td className="px-4 py-3 bg-white border border-gray-200 shadow-sm">
                  <div className="text-sm">{prod.categoryName}</div>
                  <div className="text-xs text-gray-500">{prod.categorySubName}</div>
                </td>
                <td className="px-4 py-3 bg-white border border-gray-200 shadow-sm">{prod.brand}</td>
                <td className="px-4 py-3 bg-white border border-gray-200 shadow-sm">{prod.barcode}</td>
                <td className="px-4 py-3 text-center rounded-r-lg bg-white border border-gray-200 shadow-sm">
                  {isAdded ? (
                    <span className="inline-flex items-center gap-1 text-gray-700 bg-gray-100 border border-gray-200 px-3 py-1 rounded-full text-xs font-medium">
                      <svg
                        className="w-3.5 h-3.5 text-gray-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 6.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Mağazada Var
                    </span>
                  ) : (
                    <button
                      onClick={() => onAdd(productId)}
                      disabled={isAdding}
                      className={`px-3 py-1.5 rounded-md text-xs font-semibold transition duration-150 ${
                        isAdding
                          ? "bg-gray-300 text-white cursor-not-allowed"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                    >
                      {isAdding ? "Ekleniyor..." : "Mağazama Ekle"}
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ProductDatabaseTable;
