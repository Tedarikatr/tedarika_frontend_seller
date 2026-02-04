/**
 * DataTable - Ortak tablo bileşeni
 * Ürünler, siparişler, teklifler, iade talepleri, kampanyalar, yorumlar vb. sayfalarda kullanılır.
 * Tek bir yerden stil ve davranış kontrolü sağlar.
 */
import React from "react";
import { TABLE_STYLES } from "@/constants/tableStyles";

/**
 * @param {Object} props
 * @param {Array} props.columns - [{ key, label, align?: 'left'|'center', width?, minWidth?, render: (item, index) => node, headerClassName? }]
 * @param {Array} props.data - Satır verileri
 * @param {(item) => string|number} props.rowKey - Benzersiz satır anahtarı
 * @param {number} [props.startIndex=0] - # sütunu için başlangıç indeksi
 * @param {string} [props.emptyMessage='Veri bulunamadı']
 * @param {boolean} [props.loading=false]
 * @param {number} [props.minTableWidth=800]
 * @param {React.ReactNode} [props.mobileCard] - (item, index) => node - Mobil için kart render
 * @param {Object} [props.selection] - { selectedIds: Set, onSelectionChange, getRowId }
 * @param {string} [props.className]
 */
const DataTable = ({
  columns = [],
  data = [],
  rowKey = (item) => item?.id ?? item?.productId ?? Math.random(),
  startIndex = 0,
  emptyMessage = "Veri bulunamadı",
  loading = false,
  minTableWidth = TABLE_STYLES.tableMinWidth,
  mobileCard,
  selection,
  className = "",
}) => {
  if (loading) {
    return (
      <div className={`${TABLE_STYLES.container} ${className}`}>
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full" />
          <span className="ml-3 text-gray-500 text-sm">Yükleniyor...</span>
        </div>
      </div>
    );
  }

  if (!data?.length) {
    return (
      <div className={`${TABLE_STYLES.container} ${className}`}>
        <div className="py-12 text-center text-gray-500 text-sm">{emptyMessage}</div>
      </div>
    );
  }

  const getRowId = selection?.getRowId ?? rowKey;

  return (
    <div className={`${TABLE_STYLES.container} ${className}`}>
      {/* Tablo - mobilde yatay kaydırma, xl'de mobil kart varsa kartlar gösterilir */}
      <div className={mobileCard ? "hidden xl:block" : ""}>
        {!mobileCard && (
          <p className="xl:hidden text-xs text-gray-500 mb-2 px-1 flex items-center gap-1">
            <span className="inline-block w-4 h-4 text-emerald-500">←</span>
            Kaydırarak tüm sütunları görüntüleyin
          </p>
        )}
        <table className={TABLE_STYLES.table} style={{ minWidth: minTableWidth }}>
          <thead className={TABLE_STYLES.thead}>
            <tr>
              {selection && (
                <th className={`${TABLE_STYLES.thCenter} w-12`}>
                  <span className="sr-only">Seç</span>
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={
                    col.align === "center"
                      ? `${TABLE_STYLES.thCenter} ${col.headerClassName || ""}`
                      : `${TABLE_STYLES.th} ${col.headerClassName || ""}`
                  }
                  style={{ width: col.width, minWidth: col.minWidth }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={TABLE_STYLES.tbody}>
            {data.map((item, index) => {
              const id = getRowId(item);
              const isSelected = selection && id && selection.selectedIds?.has(id);
              return (
                <tr
                  key={id}
                  className={`${TABLE_STYLES.tr} ${isSelected ? TABLE_STYLES.trSelected : ""}`}
                >
                  {selection && (
                    <td className={`${TABLE_STYLES.tdCenter} w-12`}>
                      {id && (
                        <button
                          type="button"
                          onClick={() => selection.onSelectionChange?.(item)}
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                            isSelected
                              ? "bg-emerald-600 border-emerald-600 text-white"
                              : "border-gray-300 hover:border-emerald-500 bg-white"
                          }`}
                          aria-label={isSelected ? "Seçimi kaldır" : "Seç"}
                        >
                          {isSelected && (
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </button>
                      )}
                    </td>
                  )}
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={
                        col.align === "center"
                          ? `${TABLE_STYLES.tdCenter} ${col.cellClassName || ""}`
                          : `${TABLE_STYLES.td} ${col.cellClassName || ""}`
                      }
                      style={{ width: col.width, minWidth: col.minWidth }}
                    >
                      {col.render ? col.render(item, startIndex + index) : item[col.key]}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobil Kartlar - xl altında gösterilir */}
      {mobileCard && (
        <div className={`xl:hidden ${TABLE_STYLES.mobileContainer}`}>
          {data.map((item, index) => (
            <div key={getRowId(item)} className={TABLE_STYLES.mobileCard}>
              {mobileCard(item, startIndex + index)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DataTable;
export { TABLE_STYLES };
