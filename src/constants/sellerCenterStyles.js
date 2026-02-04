/**
 * Satıcı Merkezi - Kurumsal tasarım token'ları
 * Tüm Seller Center sayfalarında tutarlı görünüm için merkezi stil yapısı.
 */

/** Ana sayfa arka plan rengi */
export const SC_COLORS = {
  bgPage: "bg-slate-50",
};

/** Hero bileşeni stilleri */
export const SC_HERO = {
  wrapper: "relative overflow-hidden rounded-2xl sm:rounded-[1.25rem] shadow-lg border border-slate-200/50",
  gradient: "bg-gradient-to-br from-slate-800 via-emerald-800 to-teal-900",
  overlay: "absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(16,185,129,0.15)_0%,_transparent_50%)]",
  padding: "p-6 sm:p-8 lg:p-10",
  iconWrapper: "w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20",
  iconClass: "w-7 h-7 sm:w-8 sm:h-8 text-white",
  title: "text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight",
  subtitle: "text-slate-200 text-base sm:text-lg mt-1",
  desc: "text-slate-300 text-sm sm:text-base mt-3 max-w-2xl leading-relaxed",
};

/** Breadcrumb stilleri */
export const SC_BREADCRUMB = {
  nav: "flex items-center gap-1.5 text-sm text-slate-500 mb-5 sm:mb-6 flex-wrap",
  link: "hover:text-emerald-600 transition-colors",
  separator: "w-4 h-4 text-slate-400 flex-shrink-0",
  current: "text-slate-700 font-medium",
};

/** Sol panel (Hızlı erişim) stilleri */
export const SC_NAV = {
  wrapper: "bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden",
  sectionTitle: "px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 bg-slate-50 border-b border-slate-100",
  link: "flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 border-l-2 border-transparent transition-colors",
  linkActive: "bg-emerald-50/80 text-emerald-800 border-l-2 border-emerald-600 font-semibold",
  linkExternal: "flex items-center justify-between gap-2",
};

/** İçerik kartı stilleri */
export const SC_CARD = {
  base: "bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden",
  padded: "p-6 sm:p-8",
  hover: "hover:shadow-md hover:border-slate-300 transition-all duration-200",
};

/** Bölüm (Section) stilleri */
export const SC_SECTION = {
  title: "text-xl sm:text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3",
  titleAccent: "w-1 h-7 bg-gradient-to-b from-emerald-600 to-teal-600 rounded-full flex-shrink-0",
};

/** Prose içerik stilleri */
export const SC_PROSE = {
  wrapper: "prose prose-slate prose-lg max-w-none prose-headings:text-slate-900 prose-headings:font-bold prose-p:text-slate-600 prose-p:leading-relaxed prose-li:text-slate-600 prose-ul:my-4 prose-ol:my-4",
};

/** Uyarı/Kutu (Callout) stilleri */
export const SC_CALLOUT = {
  info: "bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5",
  warning: "bg-amber-50 border border-amber-200 rounded-xl p-4 sm:p-5",
  success: "bg-emerald-50 border border-emerald-200 rounded-xl p-4 sm:p-5",
};

/** FAQ accordion stilleri */
export const SC_FAQ = {
  item: "bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden transition-all duration-200 hover:border-slate-300",
  trigger: "w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 rounded-xl",
  iconBtn: "flex-shrink-0 w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-emerald-100 group-hover:text-emerald-700 transition-colors",
  content: "px-5 sm:px-6 pb-5 sm:pb-6 pt-0",
  contentInner: "pt-4 border-t border-slate-100",
};
