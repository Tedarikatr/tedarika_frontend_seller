import React from "react";
import SellerHeader from "@/components/sellerLanding/SellerHeader";
import Footer from "@/components/corporate/Footer";
import SellerCenterNav from "./SellerCenterNav";
import { SC_COLORS } from "@/constants/sellerCenterStyles";

/**
 * Satıcı Merkezi (Seller Center) public sayfaları için ortak layout.
 * Kurumsal tasarım: slate arka plan, sol panel Hızlı erişim, ana içerik alanı.
 */
const SellerCenterLayout = ({ children }) => (
  <div className={`${SC_COLORS.bgPage} min-h-[100dvh] flex flex-col`}>
    <SellerHeader />
    <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-10 lg:py-12 flex-1 pb-[max(1.5rem,env(safe-area-inset-bottom,0px))]">
      <div className="flex flex-col lg:flex-row lg:gap-8 max-w-6xl mx-auto">
        <aside className="lg:w-56 xl:w-64 flex-shrink-0 lg:sticky lg:top-24 lg:self-start">
          <SellerCenterNav />
        </aside>
        <div className="flex-1 min-w-0 max-w-4xl">
          {children}
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default SellerCenterLayout;
