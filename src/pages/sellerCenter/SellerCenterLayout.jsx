import React from "react";
import SellerHeader from "@/components/sellerLanding/SellerHeader";
import Footer from "@/components/corporate/Footer";

/**
 * Satıcı Merkezi (Seller Center) public sayfaları için ortak layout.
 * SEO indekslenebilir, giriş gerektirmez.
 */
const SellerCenterLayout = ({ children }) => (
  <div className="bg-white min-h-screen">
    <SellerHeader />
    <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-4xl">
      {children}
    </main>
    <Footer />
  </div>
);

export default SellerCenterLayout;
