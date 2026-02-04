/**
 * Ortak tablo stilleri - tüm liste sayfalarında tutarlı görünüm için.
 * Değişiklik yapıldığında tüm tablolar güncellenir.
 */
export const TABLE_STYLES = {
  // Tablo container
  container: "w-full overflow-x-auto",
  table: "min-w-[800px] w-full",
  tableMinWidth: 800,

  // Header
  thead: "bg-gradient-to-r from-emerald-50 to-teal-50 border-b-2 border-emerald-200",
  th: "px-3 py-2.5 text-left text-xs font-bold text-emerald-800 uppercase tracking-wider",
  thCenter: "px-3 py-2.5 text-center text-xs font-bold text-emerald-800 uppercase tracking-wider",

  // Body
  tbody: "bg-white divide-y divide-gray-100",
  tr: "hover:bg-gradient-to-r hover:from-emerald-50/50 hover:to-teal-50/50 transition-all duration-200",
  trSelected: "bg-emerald-50/80",
  td: "px-3 py-2.5 text-sm text-gray-800",
  tdCenter: "px-3 py-2.5 text-center text-sm text-gray-800",

  // Hücre içeriği - uzun metinler için
  cellTruncate: "max-w-[200px] truncate",
  cellLineClamp2: "line-clamp-2 max-w-[220px]",

  // Badge / etiket stilleri
  badge: "inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-semibold",
  badgeGray: "bg-gray-100 text-gray-800",
  badgeGreen: "bg-green-100 text-green-800 border border-green-300",
  badgeAmber: "bg-amber-100 text-amber-800 border border-amber-300",
  badgeBlue: "bg-blue-50 text-blue-800",

  // Buton stilleri (tablo içi aksiyon)
  btn: "inline-flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-semibold transition-colors",
  btnPrimary: "bg-emerald-600 hover:bg-emerald-700 text-white",
  btnSecondary: "bg-blue-600 hover:bg-blue-700 text-white",
  btnAmber: "bg-amber-500 hover:bg-amber-600 text-white",

  // Mobil kart
  mobileCard: "bg-gradient-to-br from-white to-gray-50 rounded-xl border-2 border-gray-200 shadow-md overflow-hidden",
  mobileCardHeader: "bg-gradient-to-r from-emerald-50 to-teal-50 p-3 border-b border-emerald-200",
  mobileCardBody: "p-3 space-y-2",
};
