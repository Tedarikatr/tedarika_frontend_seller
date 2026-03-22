/**
 * Google dizinine açık URL’ler — App.jsx içindeki public route’lar ile birebir uyumlu olmalı.
 * Sitemap XML: `npm run build` → scripts/generate-seo.mjs bu listeyi kullanır.
 *
 * Güncelleme: Yeni kamu sayfası eklendiğinde buraya + (gerekirse) robots Disallow kontrolü.
 */

export const SEO_ORIGINS = {
  seller: "https://www.seller.tedarika.com.tr",
  satici: "https://www.satici.tedarika.com.tr",
};

/** İlk URL için isteğe bağlı görsel sitemap alanı (Google Image) */
export const SEO_SITEMAP_IMAGE = {
  path: "/images/logo.png",
  title: "Tedarika Satıcı Paneli - B2B Pazaryeri",
  caption:
    "Tedarika B2B Pazaryeri Satıcı Paneli. Mağazanızı açın, ihracat yapın.",
};

/**
 * @typedef {Object} SeoIndexableRoute
 * @property {string} path - pathname (örn. /seller/landing)
 * @property {'always'|'hourly'|'daily'|'weekly'|'monthly'|'yearly'|'never'} changefreq
 * @property {string} priority - 0.0–1.0
 * @property {boolean} [withImage] - urlset içinde image:image (yalnızca birkaç sayfada)
 */

/** @type {SeoIndexableRoute[]} */
export const SEO_INDEXABLE_ROUTES = [
  /** Ana giriş: kök / ile çift içerik riski olmaması için yalnızca landing dizine eklenir */
  { path: "/seller/landing", changefreq: "weekly", priority: "1.0", withImage: true },
  { path: "/seller/register", changefreq: "monthly", priority: "0.9" },
  { path: "/seller/login", changefreq: "monthly", priority: "0.8" },
  { path: "/seller/forgot-password", changefreq: "monthly", priority: "0.7" },
  { path: "/seller/apply", changefreq: "monthly", priority: "0.8" },
  { path: "/seller/appointment", changefreq: "monthly", priority: "0.7" },
  { path: "/corporate/about", changefreq: "monthly", priority: "0.6" },
  { path: "/corporate/contact", changefreq: "monthly", priority: "0.6" },
  { path: "/corporate/kvkk", changefreq: "yearly", priority: "0.5" },
  { path: "/corporate/sss", changefreq: "monthly", priority: "0.6" },
  { path: "/corporate/contracts", changefreq: "yearly", priority: "0.5" },
  { path: "/satici-merkezi", changefreq: "monthly", priority: "0.9" },
  { path: "/satici-merkezi/ilk-7-gun", changefreq: "monthly", priority: "0.8" },
  { path: "/satici-merkezi/magaza-dogrulama", changefreq: "monthly", priority: "0.8" },
  { path: "/satici-merkezi/urun-listeleme", changefreq: "monthly", priority: "0.8" },
  { path: "/satici-merkezi/gorsel-standartlari", changefreq: "monthly", priority: "0.8" },
  { path: "/satici-merkezi/fiyatlandirma-teklif", changefreq: "monthly", priority: "0.8" },
  { path: "/satici-merkezi/siparis-yonetimi", changefreq: "monthly", priority: "0.8" },
  { path: "/satici-merkezi/lojistik", changefreq: "monthly", priority: "0.8" },
  { path: "/satici-merkezi/gumruk-evrak-gtip", changefreq: "monthly", priority: "0.8" },
  { path: "/satici-merkezi/odeme-tahsilat", changefreq: "monthly", priority: "0.8" },
  { path: "/satici-merkezi/uyusmazlik-iade", changefreq: "monthly", priority: "0.8" },
  { path: "/satici-merkezi/satici-politikalari", changefreq: "monthly", priority: "0.8" },
  { path: "/satici-merkezi/marka-korumasi", changefreq: "monthly", priority: "0.8" },
  { path: "/satici-merkezi/satici-performans", changefreq: "monthly", priority: "0.8" },
  { path: "/satici-merkezi/entegrasyonlar", changefreq: "monthly", priority: "0.8" },
  { path: "/satici-merkezi/guvenlik", changefreq: "monthly", priority: "0.8" },
];
