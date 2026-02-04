import React from "react";
import SellerHeader from "@/components/sellerLanding/SellerHeader";
import Footer from "@/components/corporate/Footer";
import SellerCenterNav from "./SellerCenterNav";

/**
 * Satıcı Merkezi (Seller Center) public sayfaları için ortak layout.
 * Sol panel: Hakkımızda, İletişim, SSS, Satıcı Merkezi, Destek, Randevu (merkezi yapı).
 * SEO indekslenebilir, giriş gerektirmez.
 */
const SellerCenterLayout = ({ children }) => (
  <div className="bg-white min-h-screen">
    <SellerHeader />
    <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="flex flex-col lg:flex-row lg:gap-8 max-w-6xl mx-auto">
        {/* Sol panel / in-page header - merkezi link yapısı */}
        <aside className="lg:w-56 xl:w-64 flex-shrink-0">
          <SellerCenterNav />
        </aside>
        {/* İçerik alanı */}
        <div className="flex-1 min-w-0 max-w-4xl">
          {children}
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default SellerCenterLayout;
