import { Helmet } from "react-helmet-async";
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
import Footer from "@/components/sellerLanding/Footer";
import SupportFormSection from "@/components/sellerLanding/SupportFormSection";



const SellerLandingPage = () => {
  return (
    <>
      <Helmet>
        <title>Tedarika Satıcı Paneli - B2B Pazaryeri ile İhracat Yapın | Ücretsiz Mağaza</title>
        <meta 
          name="description" 
          content="Türkiye'nin en hızlı büyüyen B2B pazaryerinde mağazanızı ücretsiz açın. Global alıcılara ulaşın, güvenli ödeme alın, kolay ürün yönetimi. KOBİ'ler ve üreticiler için dijital ihracat platformu." 
        />
        <meta 
          name="keywords" 
          content="B2B pazaryeri, ihracat platformu, tedarika satıcı, mağaza açma, toptan satış, KOBİ ihracat, üretici satış, global ticaret, online satış, B2B e-ticaret" 
        />
        
        {/* Open Graph */}
        <meta property="og:title" content="Tedarika Satıcı Paneli - B2B Pazaryerinde Mağazanızı Açın" />
        <meta property="og:description" content="Türkiye'den dünyaya ihracat yapın. Güvenli ödeme, kolay ürün yönetimi, global alıcılara ulaşın." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://seller.tedarika.com/" />
        <meta property="og:image" content="https://seller.tedarika.com/logo.svg" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Tedarika Satıcı Paneli - B2B Pazaryeri ile İhracat Yapın" />
        <meta name="twitter:description" content="Türkiye'den dünyaya ihracat yapın. Güvenli ödeme, kolay ürün yönetimi, global alıcılara ulaşın." />
        
        {/* Structured Data - JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Tedarika Satıcı Paneli",
            "url": "https://seller.tedarika.com",
            "description": "Türkiye'nin en hızlı büyüyen B2B pazaryeri. İhracat yapın, global alıcılara ulaşın.",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://seller.tedarika.com/search?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })}
        </script>
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Tedarika",
            "url": "https://tedarika.com",
            "logo": "https://seller.tedarika.com/logo.svg",
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+90-538-236-26-05",
              "contactType": "Customer Service",
              "availableLanguage": ["Turkish", "English"]
            },
            "sameAs": [
              "https://www.linkedin.com/company/tedarika",
              "https://twitter.com/tedarika"
            ]
          })}
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