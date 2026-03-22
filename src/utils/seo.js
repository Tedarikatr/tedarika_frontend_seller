/**
 * SEO Utility Functions
 * Domain yönetimi ve SEO meta tag'leri için yardımcı fonksiyonlar
 */

import { SEO_DEFAULTS, SEO_MAIN_SITE_ORIGIN, SEO_ORIGINS } from "@/constants/seo";

/**
 * Mevcut domain'i tespit eder (SEO_ORIGINS tek kaynak)
 * @returns {string} - Satıcı paneli origin (seller veya satici host)
 */
export const getCurrentDomain = () => {
  if (typeof window === "undefined") {
    return SEO_ORIGINS.seller;
  }
  const hostname = window.location.hostname;
  if (hostname.includes("satici.tedarika")) {
    return SEO_ORIGINS.satici;
  }
  return SEO_ORIGINS.seller;
};

/**
 * Ana marka domain'i (tedarika.com.tr)
 * @returns {string}
 */
export const getMainDomain = () => SEO_MAIN_SITE_ORIGIN;

/**
 * Canonical URL oluşturur
 * @param {string} path - Sayfa yolu (örn: /seller/register)
 * @returns {string} - Tam canonical URL
 */
export const getCanonicalUrl = (path = '') => {
  const domain = getCurrentDomain();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${domain}${cleanPath}`;
};

/**
 * Open Graph image URL'i oluşturur
 * @param {string} imagePath - Resim yolu (opsiyonel)
 * @returns {string} - Tam image URL
 */
export const getOgImageUrl = (imagePath = SEO_DEFAULTS.ogImagePath) => {
  const domain = getCurrentDomain();
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${domain}${cleanPath}`;
};

/**
 * Hreflang tag'leri için alternatif URL'leri döndürür
 * @param {string} path - Sayfa yolu
 * @returns {Array} - Hreflang objeleri
 */
export const getHreflangUrls = (path = '') => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const primary = `${SEO_ORIGINS.seller}${cleanPath}`;
  return [
    { hreflang: 'tr', href: primary },
    { hreflang: 'x-default', href: primary }
  ];
};

/**
 * Site haritası URL'i döndürür
 * @returns {string} - Sitemap URL
 */
export const getSitemapUrl = () => {
  const domain = getCurrentDomain();
  return `${domain}/sitemap.xml`;
};

/**
 * Robots.txt URL'i döndürür
 * @returns {string} - Robots.txt URL
 */
export const getRobotsUrl = () => {
  const domain = getCurrentDomain();
  return `${domain}/robots.txt`;
};

/**
 * Sayfa için SEO meta bilgileri oluşturur.
 * Google SEO Başlangıç Kılavuzu: başlık sayfaya özgü, net ve kısa; meta açıklama sayfaya özgü ve alakalı noktaları içermeli.
 * Not: Google Arama "keywords" meta etiketini kullanmaz; diğer arama motorları için isteğe bağlı bırakıyoruz.
 *
 * @param {Object} options - SEO seçenekleri
 * @param {string} options.title - Sayfa başlığı (arama sonucunda başlık bağlantısı; ~50-60 karakter önerilir)
 * @param {string} options.description - Meta açıklama (snippet için; ~150-160 karakter önerilir)
 * @param {string} options.path - Sayfa yolu
 * @param {string} options.image - OG image yolu
 * @param {string} options.type - OG type (website, article, vb.)
 * @param {string} options.keywords - Opsiyonel; Google kullanmaz, diğer motorlar için
 * @returns {Object} - SEO meta objesi
 */
export const createSeoMeta = ({
  title,
  description,
  path = '',
  image = SEO_DEFAULTS.ogImagePath,
  type = 'website',
  keywords = ''
}) => {
  const canonicalUrl = getCanonicalUrl(path);
  const ogImageUrl = getOgImageUrl(image);
  const resolvedTitle = (title && String(title).trim()) || SEO_DEFAULTS.defaultTitle;
  const resolvedDescription =
    (description && String(description).trim()) || SEO_DEFAULTS.defaultDescription;
  const resolvedKeywords =
    (keywords && String(keywords).trim()) || SEO_DEFAULTS.defaultKeywords;

  return {
    title: resolvedTitle,
    description: resolvedDescription,
    canonical: canonicalUrl,
    og: {
      title: resolvedTitle,
      description: resolvedDescription,
      url: canonicalUrl,
      image: ogImageUrl,
      type,
      siteName: SEO_DEFAULTS.siteName,
      locale: SEO_DEFAULTS.locale
    },
    twitter: {
      card: 'summary_large_image',
      title: resolvedTitle,
      description: resolvedDescription,
      image: ogImageUrl
    },
    keywords: resolvedKeywords,
    hreflang: getHreflangUrls(path)
  };
};

/**
 * Organization için JSON-LD structured data oluşturur
 * @returns {Object} - JSON-LD objesi
 */
export const getOrganizationSchema = () => {
  const mainDomain = getMainDomain();
  const currentDomain = getCurrentDomain();
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': 'Tedarika',
    'url': mainDomain,
    'logo': `${currentDomain}/images/logo.png`,
    'contactPoint': {
      '@type': 'ContactPoint',
      'telephone': '+90-538-236-26-05',
      'contactType': 'Customer Service',
      'availableLanguage': ['Turkish', 'English'],
      'areaServed': 'TR',
      'email': 'info@tedarika.com.tr'
    },
    'sameAs': [
      'https://www.linkedin.com/company/tedarika',
      'https://twitter.com/tedarika'
    ]
  };
};

/**
 * WebSite + SearchAction: Google'da sitelinks arama kutusu (Rich Result) için.
 * urlTemplate, sayfada gerçekten kullanılan arama URL'i ile eşleşmeli (yoksa landing ile query).
 * @returns {Object} - JSON-LD objesi
 */
export const getWebsiteSchema = () => {
  const currentDomain = getCurrentDomain();
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': 'Tedarika Satıcı Paneli',
    'url': currentDomain,
    'description': 'Türkiye\'nin en hızlı büyüyen B2B pazaryeri. İhracat yapın, global alıcılara ulaşın.',
    'potentialAction': {
      '@type': 'SearchAction',
      'target': {
        '@type': 'EntryPoint',
        'urlTemplate': `${currentDomain}/seller/landing?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  };
};

/**
 * BreadcrumbList için JSON-LD structured data oluşturur
 * @param {Array} items - Breadcrumb öğeleri [{name, url}]
 * @returns {Object} - JSON-LD objesi
 */
export const getBreadcrumbSchema = (items = []) => {
  const domain = getCurrentDomain();
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': items.map((item, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': item.name,
      'item': item.url.startsWith('http') ? item.url : `${domain}${item.url}`
    }))
  };
};

/**
 * WebApplication JSON-LD - Satıcı paneli için (Google'da uygulama/servis snippet'i)
 */
export const getWebApplicationSchema = () => {
  const currentDomain = getCurrentDomain();
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    'name': 'Tedarika Satıcı Paneli',
    'url': `${currentDomain}/seller/landing`,
    'applicationCategory': 'BusinessApplication',
    'operatingSystem': 'Any',
    'description': 'B2B pazaryerinde mağaza açma, ürün yönetimi, sipariş takibi ve e-ihracat için satıcı paneli. KOBİ ve üreticiler için ücretsiz kayıt.',
    'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'TRY' },
    'publisher': { '@id': `${currentDomain}/#organization` }
  };
};

/**
 * FAQPage JSON-LD - SSS sayfaları için zengin snippet (Google genişletilmiş SSS)
 * @param {Array} faqs - [{ question, answer }]
 */
export const getFAQPageSchema = (faqs = []) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  'mainEntity': faqs.map(({ question, answer }) => ({
    '@type': 'Question',
    'name': question,
    'acceptedAnswer': { '@type': 'Answer', 'text': answer }
  }))
});

/**
 * Article JSON-LD - Satıcı Merkezi makaleleri için snippet potansiyeli
 * @param {Object} opts - { headline, description, datePublished, dateModified, url }
 */
export const getArticleSchema = (opts = {}) => {
  const domain = getCurrentDomain();
  const url = opts.url ? (opts.url.startsWith('http') ? opts.url : `${domain}${opts.url}`) : domain;
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': opts.headline || 'Tedarika Satıcı Merkezi',
    'description': opts.description || '',
    'datePublished': opts.datePublished || '2024-01-01',
    'dateModified': opts.dateModified || opts.datePublished || '2024-01-01',
    'author': { '@type': 'Organization', 'name': 'Tedarika' },
    'publisher': { '@type': 'Organization', 'name': 'Tedarika', 'logo': { '@type': 'ImageObject', 'url': `${domain}/images/logo.png` } },
    'mainEntityOfPage': { '@type': 'WebPage', '@id': url }
  };
};

/**
 * İletişim sayfası — ContactPage + JSON-LD
 * @param {ReturnType<createSeoMeta>} seoMeta
 */
export const getContactPageSchema = (seoMeta) => ({
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'İletişim',
  description: seoMeta.description,
  url: seoMeta.canonical,
  mainEntity: {
    '@type': 'Organization',
    name: 'Tedarika',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+90-538-236-26-05',
      contactType: 'Customer Service',
      email: 'info@tedarika.com.tr',
      availableLanguage: ['Turkish', 'English']
    }
  }
});

/**
 * Hakkımızda sayfası — Organization snippet (domain tek kaynaktan)
 */
export const getAboutPageOrganizationSchema = () => {
  const domain = getCurrentDomain();
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Tedarika Satıcı Platformu',
    url: domain,
    logo: `${domain}/images/logo.png`,
    description:
      "Tedarika Satıcı Platformu, ihracat yapmak isteyen KOBİ'lere ve üreticilere özel olarak tasarlanmış dijital bir pazaryeri çözümüdür.",
    slogan: 'Üret, biz dünyaya taşıyalım',
    sameAs: ['https://www.tedarika.com.tr'],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'info@tedarika.com.tr',
      contactType: 'customer service'
    }
  };
};
