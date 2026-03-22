import React, { useState } from "react";
import { CheckCircle, Plus, Tag, Package, List } from "lucide-react";
import DataTable from "@/components/ui/DataTable";
import { TABLE_STYLES } from "@/constants/tableStyles";
import ProductAttributesModal from "./ProductAttributesModal";

const ProductDatabaseTable = ({
  products = [],
  onAdd,
  addingId,
  addedIds = [],
  startIndex = 0,
}) => {
  const [selectedProductForAttributes, setSelectedProductForAttributes] = useState(null);

  const columns = [
    {
      key: "#",
      label: "#",
      width: 48,
      render: (_, displayIndex) => (
        <span className="text-gray-500 font-medium">{displayIndex + 1}</span>
      ),
    },
    {
      key: "name",
      label: "Ürün Adı",
      minWidth: 140,
      render: (prod) => (
        <div className="flex items-center gap-2 min-w-0">
          <Package className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span className="font-semibold text-gray-900 truncate" title={prod.name}>
            {prod.name}
          </span>
        </div>
      ),
    },
    {
      key: "category",
      label: "Kategori",
      minWidth: 120,
      render: (prod) => (
        <div className={TABLE_STYLES.cellLineClamp2}>
          <span className="text-gray-900">{prod.categoryName}</span>
          {prod.categorySubName && (
            <span className="text-gray-500 text-xs block">{prod.categorySubName}</span>
          )}
        </div>
      ),
    },
    {
      key: "brand",
      label: "Marka",
      minWidth: 100,
      render: (prod) => (
        <div className="flex items-center gap-1.5 truncate">
          <Tag className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
          <span className="text-gray-700 truncate">{prod.brand || "-"}</span>
        </div>
      ),
    },
    {
      key: "ean",
      label: "EAN",
      minWidth: 100,
      render: (prod) => (
        <span className={`${TABLE_STYLES.badge} ${TABLE_STYLES.badgeGray} font-mono text-[11px]`}>
          {prod.ean ?? prod.barcode ?? "-"}
        </span>
      ),
    },
    {
      key: "sku",
      label: "SKU",
      minWidth: 90,
      render: (prod) => (
        <span className={`${TABLE_STYLES.badge} ${TABLE_STYLES.badgeGray} font-mono text-[11px]`}>
          {prod.sku ?? "-"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "İşlem",
      align: "center",
      minWidth: 200,
      render: (prod) => {
        const productId = String(prod.id ?? prod.productId);
        const isAdded = addedIds.includes(productId);
        const isAdding = String(addingId) === productId;
        return (
          <div className="flex items-center justify-center gap-1.5 flex-wrap">
            <button
              onClick={() => setSelectedProductForAttributes(prod)}
              className={`${TABLE_STYLES.btn} bg-purple-600 hover:bg-purple-700 text-white`}
            >
              <List className="w-3.5 h-3.5" />
              Özellikler
            </button>
            {isAdded ? (
              <span className={`${TABLE_STYLES.badge} ${TABLE_STYLES.badgeGreen}`}>
                <CheckCircle className="w-3.5 h-3.5" />
                Mağazada Var
              </span>
            ) : (
              <button
                onClick={() => onAdd(productId)}
                disabled={isAdding}
                className={`${TABLE_STYLES.btn} ${
                  isAdding ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                {isAdding ? "Ekleniyor..." : "Ekle"}
              </button>
            )}
          </div>
        );
      },
    },
  ];

  const mobileCard = (prod, index) => {
    const productId = String(prod.id ?? prod.productId);
    const isAdded = addedIds.includes(productId);
    const isAdding = String(addingId) === productId;
    return (
      <>
        <div className={TABLE_STYLES.mobileCardHeader}>
          <div className="flex items-start gap-3">
            <Package className="w-8 h-8 text-emerald-600 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="text-xs text-gray-500">#{index + 1}</span>
              <h3 className="font-bold text-gray-900 text-sm line-clamp-2 mt-0.5">{prod.name}</h3>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <span className="text-[11px] text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded">
                  {prod.categoryName}
                  {prod.categorySubName && ` / ${prod.categorySubName}`}
                </span>
                <span className="text-[11px] text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded">
                  {prod.brand || "-"}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className={TABLE_STYLES.mobileCardBody}>
          <button
            onClick={() => setSelectedProductForAttributes(prod)}
            className={`${TABLE_STYLES.mobileBtn} bg-purple-600 text-white`}
          >
            <List className="w-4 h-4" />
            Özellikler
          </button>
          {isAdded ? (
            <span className={`${TABLE_STYLES.mobileBtn} bg-green-100 border border-green-300 text-green-800 pointer-events-none`}>
              <CheckCircle className="w-4 h-4" />
              Mağazada Var
            </span>
          ) : (
            <button
              onClick={() => onAdd(productId)}
              disabled={isAdding}
              className={`${TABLE_STYLES.mobileBtn} ${
                isAdding ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-blue-600 text-white"
              }`}
            >
              <Plus className="w-4 h-4" />
              {isAdding ? "Ekleniyor..." : "Mağazama Ekle"}
            </button>
          )}
        </div>
      </>
    );
  };

  return (
    <>
      <DataTable
        columns={columns}
        data={products}
        rowKey={(p) => String(p.id ?? p.productId)}
        startIndex={startIndex}
        emptyMessage="Ürün bulunamadı."
        minTableWidth={900}
        mobileCard={mobileCard}
      />
      {selectedProductForAttributes && (
        <ProductAttributesModal
          productId={selectedProductForAttributes.id ?? selectedProductForAttributes.productId}
          productName={selectedProductForAttributes.name}
          isOpen={!!selectedProductForAttributes}
          onClose={() => setSelectedProductForAttributes(null)}
        />
      )}
    </>
  );
};

export default ProductDatabaseTable;
