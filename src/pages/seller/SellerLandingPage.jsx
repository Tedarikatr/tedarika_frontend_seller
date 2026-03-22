import { useLocation } from "react-router-dom";
import { SeoHelmet } from "@/components/seo";
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
  getWebApplicationSchema,
} from "@/utils/seo";



const SellerLandingPage = () => {
  const location = useLocation();
  const seoMeta = createSeoMeta({
    title: "Tedarika Satıcı Paneli - B2B Pazaryeri ile İhracat Yapın | Ücretsiz Mağaza",
    description: "Türkiye'nin en hızlı büyüyen B2B pazaryerinde mağazanızı ücretsiz açın. Global alıcılara ulaşın, güvenli ödeme alın, kolay ürün yönetimi. KOBİ'ler ve üreticiler için dijital ihracat platformu.",
    path: location.pathname,
    keywords: "tedarika satıcı paneli, B2B pazaryeri, ihracat platformu, mağaza açma, toptan satış, KOBİ ihracat, üretici satış, global ticaret, B2B e-ticaret, e-ihracat, Türkiye ihracat, dijital ticaret, satıcı kayıt, Tedarika mağaza"
  });

  const organizationSchema = getOrganizationSchema();
  const websiteSchema = getWebsiteSchema();
  const webAppSchema = getWebApplicationSchema();

  return (
    <>
      <SeoHelmet
        seoMeta={seoMeta}
        ogImageEnhancement
        jsonLd={[websiteSchema, organizationSchema, webAppSchema]}
      />

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