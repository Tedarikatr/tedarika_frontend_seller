import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import SellerHeader from "@/components/sellerLanding/SellerHeader";
import HeroSection from "@/components/sellerLanding/HeroSection";
import FeaturesSection from "@/components/sellerLanding/FeaturesSection";
import StepsSection from "@/components/sellerLanding/StepsSection";
import TestimonialsSection from "@/components/sellerLanding/TestimonialsSection";
import CTASection from "@/components/sellerLanding/CTASection";
import PricingSection from "@/components/sellerLanding/PricingSection";
import ExportMadeEasySection from "@/components/sellerLanding/ExportMadeEasySection";
import ExportVurgulayanSection from "@/components/sellerLanding/ExportVurgulayanSection";
import GrowthOpportunitiesSection from "@/components/sellerLanding/GrowthOpportunitiesSection";
import GlobalOpportunitiesSection from "@/components/sellerLanding/GlobalOpportunitiesSection";
import HeroImpactSection from "@/components/sellerLanding/HeroImpactSection";
import Footer from "@/components/corporate/Footer";
import SupportFormSection from "@/components/sellerLanding/SupportFormSection";
import {
  createSeoMeta,
  getOrganizationSchema,
  getWebsiteSchema,
  getHreflangUrls
} from "@/utils/seo";



const SellerLandingPage = () => {
  const location = useLocation();
  const seoMeta = createSeoMeta({
    title: "Tedarika Satıcı Paneli - B2B Pazaryeri ile İhracat Yapın | Ücretsiz Mağaza",
    description: "Türkiye'nin en hızlı büyüyen B2B pazaryerinde mağazanızı ücretsiz açın. Global alıcılara ulaşın, güvenli ödeme alın, kolay ürün yönetimi. KOBİ'ler ve üreticiler için dijital ihracat platformu.",
    path: location.pathname,
    keywords: "B2B pazaryeri, ihracat platformu, tedarika satıcı, mağaza açma, toptan satış, KOBİ ihracat, üretici satış, global ticaret, online satış, B2B e-ticaret, Türkiye ihracat, dijital ticaret"
  });

  const organizationSchema = getOrganizationSchema();
  const websiteSchema = getWebsiteSchema(location.pathname);

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
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Tedarika Satıcı Paneli - B2B Pazaryeri" />
        <meta property="og:locale" content={seoMeta.og.locale} />
        <meta property="og:site_name" content={seoMeta.og.siteName} />
        
        {/* Twitter */}
        <meta name="twitter:card" content={seoMeta.twitter.card} />
        <meta name="twitter:title" content={seoMeta.twitter.title} />
        <meta name="twitter:description" content={seoMeta.twitter.description} />
        <meta name="twitter:image" content={seoMeta.twitter.image} />
        <meta name="twitter:image:alt" content="Tedarika Satıcı Paneli - B2B Pazaryeri" />
        
        {/* Structured Data - JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify(websiteSchema)}
        </script>
        
        <script type="application/ld+json">
          {JSON.stringify(organizationSchema)}
        </script>
      </Helmet>

    <div className="bg-white">
      <SellerHeader />
      <HeroImpactSection />
      <ExportVurgulayanSection />
      <GrowthOpportunitiesSection />
      <GlobalOpportunitiesSection />
      <ExportMadeEasySection />
      <HeroSection />
      <FeaturesSection />
      <StepsSection />
      <PricingSection /> {/* <-- BURAYA EKLENDİ */}
      {/* <TestimonialsSection /> */}
      <CTASection />
      <SupportFormSection />
       <Footer />
    </div>
    </>
  );
};

export default SellerLandingPage;