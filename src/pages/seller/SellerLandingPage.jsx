import SellerHeader from "@/components/sellerLanding/SellerHeader";
import HeroSection from "@/components/sellerLanding/HeroSection";
import FeaturesSection from "@/components/sellerLanding/FeaturesSection";
import StepsSection from "@/components/sellerLanding/StepsSection";
import TestimonialsSection from "@/components/sellerLanding/TestimonialsSection";
import CTASection from "@/components/sellerLanding/CTASection";
import PricingSection from "@/components/sellerLanding/PricingSection";

const SellerLandingPage = () => {
  return (
    <div className="bg-white">
      <SellerHeader />
      <HeroSection />
      <FeaturesSection />
      <StepsSection />
      <PricingSection /> {/* <-- BURAYA EKLENDİ */}
      <TestimonialsSection />
      <CTASection />
    </div>
  );
};

export default SellerLandingPage;
