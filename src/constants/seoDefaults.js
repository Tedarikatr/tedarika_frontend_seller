/**
 * Tek kaynak: varsayılan SEO metinleri ve OG görsel sabitleri.
 * index.html içindeki ilk yükleme metinleriyle uyumlu tutulmalı (manuel senkron).
 *
 * Search Console: .env içinde VITE_GOOGLE_SITE_VERIFICATION=... (SeoHelmet enjekte eder).
 * Kamu URL listesi: src/constants/seo/index.js → seoPublicRoutes (sitemap ile senkron).
 */

/** Ana marka sitesi (Organization.url vb. şema alanları) */
export const SEO_MAIN_SITE_ORIGIN = "https://www.tedarika.com.tr";

export const SEO_DEFAULTS = {
  defaultTitle:
    "Tedarika Satıcı Paneli - B2B Pazaryeri ile İhracat Yapın | Mağazanızı Ücretsiz Açın",
  defaultDescription:
    "Tedarika Satıcı Paneli: B2B pazaryerinde mağazanızı ücretsiz açın. Türkiye'den dünyaya ihracat, güvenli ödeme, kolay ürün yönetimi. KOBİ ve üreticiler için dijital e-ihracat platformu.",
  defaultKeywords:
    "tedarika satıcı paneli, B2B pazaryeri, ihracat platformu, satıcı paneli, mağaza açma, ürün yönetimi, toptan satış, KOBİ ihracat, B2B e-ticaret, e-ihracat, dijital ticaret, Türkiye ihracat, global ticaret, satıcı kayıt, Tedarika mağaza, toptan satış platformu, üretici satış, ihracat yazılımı, B2B satış paneli",
  siteName: "Tedarika",
  locale: "tr_TR",
  author: "Tedarika",
  /** public/ altında OG görsel yolu */
  ogImagePath: "/images/logo.png",
  ogImageWidth: "1200",
  ogImageHeight: "630",
  defaultOgImageAlt: "Tedarika Satıcı Paneli - B2B Pazaryeri",
};

/** Arama motoru robots direktifleri — tutarlı kullanım için */
export const SEO_ROBOTS = {
  INDEX_FOLLOW: "index, follow",
  NOINDEX_NOFOLLOW: "noindex, nofollow",
};
