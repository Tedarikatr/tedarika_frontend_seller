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



const SellerLandingPage = () => {
  return (
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
       <Footer />
    </div>
  );
};

export default SellerLandingPage;