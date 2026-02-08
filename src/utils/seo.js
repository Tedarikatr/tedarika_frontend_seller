/**
 * SEO Utility Functions
 * Domain yönetimi ve SEO meta tag'leri için yardımcı fonksiyonlar
 */

/**
 * Mevcut domain'i tespit eder
 * @returns {string} - Mevcut domain (seller.tedarika.com.tr veya satici.tedarika.com.tr)
 */
export const getCurrentDomain = () => {
  if (typeof window === 'undefined') {
    // SSR durumunda varsayılan domain
    return 'https://www.seller.tedarika.com.tr';
  }
  
  const hostname = window.location.hostname;
  
  // Subdomain kontrolü
  if (hostname.includes('satici.tedarika.com.tr')) {
    return 'https://www.satici.tedarika.com.tr';
  }
  
  // Varsayılan olarak seller subdomain
  return 'https://www.seller.tedarika.com.tr';
};

/**
 * Ana domain'i döndürür
 * @returns {string} - Ana domain
 */
export const getMainDomain = () => {
  return 'https://www.tedarika.com.tr';
};

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
export const getOgImageUrl = (imagePath = '/images/logo.png') => {
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
  
  return [
    {
      hreflang: 'tr',
      href: `https://www.seller.tedarika.com.tr${cleanPath}`
    },
    {
      hreflang: 'x-default',
      href: `https://www.seller.tedarika.com.tr${cleanPath}`
    }
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
 * Sayfa için SEO meta bilgileri oluşturur
 * @param {Object} options - SEO seçenekleri
 * @param {string} options.title - Sayfa başlığı
 * @param {string} options.description - Meta açıklama
 * @param {string} options.path - Sayfa yolu
 * @param {string} options.image - OG image yolu
 * @param {string} options.type - OG type (website, article, vb.)
 * @returns {Object} - SEO meta objesi
 */
export const createSeoMeta = ({
  title,
  description,
  path = '',
  image = '/images/logo.png',
  type = 'website',
  keywords = ''
}) => {
  const canonicalUrl = getCanonicalUrl(path);
  const ogImageUrl = getOgImageUrl(image);
  const domain = getCurrentDomain();
  
  return {
    title: title || 'Tedarika Satıcı Paneli - B2B Pazaryeri ile İhracat Yapın',
    description: description || 'Tedarika ile B2B pazaryerinde mağazanızı açın. Türkiye\'den dünyaya ihracat yapın, güvenli ödeme alın, kolay ürün yönetimi.',
    canonical: canonicalUrl,
    og: {
      title,
      description,
      url: canonicalUrl,
      image: ogImageUrl,
      type,
      siteName: 'Tedarika',
      locale: 'tr_TR'
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      image: ogImageUrl
    },
    keywords: keywords || 'tedarika, B2B pazaryeri, ihracat platformu, satıcı paneli, mağaza yönetimi, ürün satışı, toptan satış, KOBİ ihracat, B2B e-ticaret',
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
 * WebSite için JSON-LD structured data oluşturur
 * @param {string} path - Sayfa yolu
 * @returns {Object} - JSON-LD objesi
 */
export const getWebsiteSchema = (path = '') => {
  const currentDomain = getCurrentDomain();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
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
        'urlTemplate': `${currentDomain}/search?q={search_term_string}`
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
  const currentDomain = getCurrentDomain();
  
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': items.map((item, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': item.name,
      'item': item.url.startsWith('http') ? item.url : `${currentDomain}${item.url}`
    }))
  };
};

