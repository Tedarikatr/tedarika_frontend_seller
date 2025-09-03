import React from "react";
import ProductRow from "./ProductRow";

const MyStoreProductTable = ({ products, onRefresh, onFeedback, hasCoverage }) => {
  if (!products.length) {
    return (
      <div className="p-10 text-center">
        <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-emerald-50 text-emerald-700 font-medium shadow-sm">
          Mağazanıza ait ürün bulunmuyor.
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-200 shadow-[0_6px_30px_-12px_rgba(0,0,0,0.15)] bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-gray-800">
          <thead className="sticky top-0 z-10 bg-gradient-to-b from-emerald-50 to-white/60 backdrop-blur supports-[backdrop-filter]:backdrop-blur border-b">
            <tr className="text-[12px] uppercase tracking-wider text-emerald-800">
              <th className="px-6 py-4 text-left">Ürün</th>
              <th className="px-6 py-4 text-left">Kategori</th>
              <th className="px-6 py-4 text-left">Fiyat</th>
              <th className="px-6 py-4 text-left">Limit</th>
              <th className="px-6 py-4 text-left">Görseller</th>
              <th className="px-6 py-4 text-left">Durum</th>
              <th className="px-6 py-4 text-left">Stok</th>
              <th className="px-6 py-4 text-left">İşlemler</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product, index) => (
              <tr
                key={product.id}
                className={`group transition-colors ${
                  index % 2 ? "bg-white" : "bg-gray-50/50"
                } hover:bg-emerald-50/40`}
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
