import React from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import SellerApplicationForm from "@/components/seller/SellerApplicationForm";
import { createSeoMeta, getBreadcrumbSchema } from "@/utils/seo";

const SellerApplicationPage = () => {
  const location = useLocation();
  const seoMeta = createSeoMeta({
    title: "Satıcı Başvurusu | Tedarika Satıcı Paneli - Ücretsiz Mağaza Açın",
    description: "Tedarika B2B pazaryerinde satıcı olmak için başvurun. Ücretsiz mağaza açın, ürünlerinizi global pazara taşıyın. Hızlı onay süreci, dijital belge yükleme, anında mağaza açılışı.",
    path: location.pathname,
    keywords: "tedarika satıcı başvurusu, B2B satıcı ol, pazaryeri başvurusu, ücretsiz mağaza aç, satıcı kayıt, ürün satış platformu, e-ticaret başvurusu, KOBİ satıcı, ihracat satıcısı"
  });

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Ana Sayfa", url: "/" },
    { name: "Satıcı Başvurusu", url: location.pathname }
  ]);

  return (
    <>
      <Helmet>
        <title>{seoMeta.title}</title>
        <meta name="description" content={seoMeta.description} />
        <meta name="keywords" content={seoMeta.keywords} />
        <link rel="canonical" href={seoMeta.canonical} />
        
        {/* Hreflang Tags */}
        {seoMeta.hreflang.map(({ hreflang, href }) => (
          <link key={hreflang} rel="alternate" hreflang={hreflang} href={href} />
        ))}
        
        {/* Open Graph */}
        <meta property="og:title" content={seoMeta.og.title} />
        <meta property="og:description" content={seoMeta.og.description} />
        <meta property="og:type" content={seoMeta.og.type} />
        <meta property="og:url" content={seoMeta.og.url} />
        <meta property="og:image" content={seoMeta.og.image} />
        <meta property="og:locale" content={seoMeta.og.locale} />
        <meta property="og:site_name" content={seoMeta.og.siteName} />
        
        {/* Twitter */}
        <meta name="twitter:card" content={seoMeta.twitter.card} />
        <meta name="twitter:title" content={seoMeta.twitter.title} />
        <meta name="twitter:description" content={seoMeta.twitter.description} />
        <meta name="twitter:image" content={seoMeta.twitter.image} />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>
      <SellerApplicationForm />
    </>
  );
};

export default SellerApplicationPage;
