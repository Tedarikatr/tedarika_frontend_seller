import React from "react";
import { SC_SECTION } from "@/constants/sellerCenterStyles";

/**
 * Satıcı Merkezi bölüm bileşeni - başlık + içerik
 * @param {string} title - Bölüm başlığı
 * @param {React.ReactNode} children
 * @param {boolean} [showAccent] - Sol kenar accent çizgisi
 */
const SellerCenterSection = ({ title, children, showAccent = true }) => (
  <section>
    {title && (
      <h2 className={SC_SECTION.title}>
        {showAccent && <span className={SC_SECTION.titleAccent} aria-hidden="true" />}
        {title}
      </h2>
    )}
    {children}
  </section>
);

export default SellerCenterSection;
