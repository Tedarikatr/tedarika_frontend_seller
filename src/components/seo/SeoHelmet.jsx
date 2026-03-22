import { Helmet } from "react-helmet-async";
import { SEO_DEFAULTS } from "@/constants/seo";

/**
 * Tüm sayfalarda tekrarlanan meta/OG/Twitter etiketlerini tek bileşende toplar.
 *
 * @param {object} props
 * @param {ReturnType<import('@/utils/seo').createSeoMeta>} [props.seoMeta] - createSeoMeta çıktısı
 * @param {string} [props.robots] - Örn. SEO_ROBOTS.INDEX_FOLLOW
 * @param {boolean} [props.includeKeywords=true] - keywords meta (makalelerde opsiyonel kapalı)
 * @param {string} [props.ogType] - createSeoMeta type üzerine yazım (örn. article)
 * @param {boolean} [props.includeOgSiteName=true]
 * @param {boolean} [props.includeTwitterUrl=false]
 * @param {boolean} [props.ogImageEnhancement=false] - og:image width/height/alt + twitter:image:alt
 * @param {string} [props.ogImageAlt]
 * @param {object[]} [props.jsonLd] - JSON-LD objeleri (her biri ayrı script)
 * @param {string} [props.pageTitle] - seoMeta yokken sadece <title> (örn. abonelik)
 */
export default function SeoHelmet({
  seoMeta,
  robots,
  includeKeywords = true,
  ogType,
  includeOgSiteName = true,
  includeTwitterUrl = false,
  ogImageEnhancement = false,
  ogImageAlt,
  jsonLd,
  pageTitle,
}) {
  if (!seoMeta) {
    return (
      <Helmet>
        {pageTitle ? <title>{pageTitle}</title> : null}
        {robots ? <meta name="robots" content={robots} /> : null}
      </Helmet>
    );
  }

  const type = ogType ?? seoMeta.og.type;
  const twUrl = includeTwitterUrl ? seoMeta.canonical : undefined;
  const imgAlt = ogImageAlt ?? SEO_DEFAULTS.defaultOgImageAlt;
  const ld = Array.isArray(jsonLd) ? jsonLd.filter(Boolean) : jsonLd ? [jsonLd] : [];
  const googleSiteVerification = import.meta.env.VITE_GOOGLE_SITE_VERIFICATION;

  return (
    <Helmet>
      <title>{seoMeta.title}</title>
      <meta name="description" content={seoMeta.description} />
      {includeKeywords ? <meta name="keywords" content={seoMeta.keywords} /> : null}
      <link rel="canonical" href={seoMeta.canonical} />
      {robots ? <meta name="robots" content={robots} /> : null}
      {googleSiteVerification ? (
        <meta name="google-site-verification" content={googleSiteVerification} />
      ) : null}

      {seoMeta.hreflang.map(({ hreflang, href }, i) => (
        <link key={`${hreflang}-${i}-${href}`} rel="alternate" hreflang={hreflang} href={href} />
      ))}

      <meta property="og:title" content={seoMeta.og.title} />
      <meta property="og:description" content={seoMeta.og.description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={seoMeta.og.url} />
      <meta property="og:image" content={seoMeta.og.image} />
      {ogImageEnhancement ? (
        <>
          <meta property="og:image:width" content={SEO_DEFAULTS.ogImageWidth} />
          <meta property="og:image:height" content={SEO_DEFAULTS.ogImageHeight} />
          <meta property="og:image:alt" content={imgAlt} />
        </>
      ) : null}
      <meta property="og:locale" content={seoMeta.og.locale} />
      {includeOgSiteName ? (
        <meta property="og:site_name" content={seoMeta.og.siteName} />
      ) : null}

      <meta name="twitter:card" content={seoMeta.twitter.card} />
      {twUrl ? <meta name="twitter:url" content={twUrl} /> : null}
      <meta name="twitter:title" content={seoMeta.twitter.title} />
      <meta name="twitter:description" content={seoMeta.twitter.description} />
      <meta name="twitter:image" content={seoMeta.twitter.image} />
      {ogImageEnhancement ? (
        <meta name="twitter:image:alt" content={imgAlt} />
      ) : null}

      {ld.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}
