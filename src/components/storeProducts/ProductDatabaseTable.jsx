import React from "react";

const ProductDatabaseTable = ({ products, onAdd, addingId, addedIds }) => {
  return (
    <div className="w-full overflow-x-auto rounded-lg shadow-sm">
      <table className="min-w-full text-sm text-gray-800 bg-white border-separate border-spacing-y-1">
        {/* Başlıklar */}
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

        {/* Satırlar */}
        <tbody>
          {products.map((prod, index) => (
            <tr
              key={prod.id}
              className="bg-white hover:bg-blue-50 border border-gray-200 rounded-md shadow-sm transition-all duration-150"
            >
              {/* Sıra */}
              <td className="px-4 py-3 font-semibold text-gray-500 text-center">
                {index + 1}
              </td>

              {/* ID */}
              <td className="px-4 py-3 text-gray-600">#{prod.id}</td>

              {/* Ürün Adı */}
              <td className="px-4 py-3 font-medium text-gray-900">{prod.name}</td>

              {/* Kategori */}
              <td className="px-4 py-3">
                <div className="text-sm">{prod.categoryName}</div>
                <div className="text-xs text-gray-500">
                  {prod.categorySubName}
                </div>
              </td>

              {/* Marka */}
              <td className="px-4 py-3">{prod.brand}</td>

              {/* Barkod */}
              <td className="px-4 py-3">{prod.barcode}</td>

              {/* İşlem */}
              <td className="px-4 py-3 text-center">
                {addedIds.includes(prod.id) ? (
                  <span className="inline-flex items-center gap-1 text-green-700 bg-green-100 border border-green-200 px-3 py-1 rounded-full text-xs font-semibold">
                    <svg
                      className="w-3.5 h-3.5 text-green-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 6.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Eklendi
                  </span>
                ) : (
                  <button
                    onClick={() => onAdd(prod.id)}
                    disabled={addingId === prod.id}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition duration-150 ${
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
