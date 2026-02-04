import React from "react";
import { SC_HERO } from "@/constants/sellerCenterStyles";

/**
 * Satıcı Merkezi sayfa hero bileşeni - kurumsal görünüm
 * @param {string} h1 - Ana başlık
 * @param {string} [subtitle] - Alt başlık
 * @param {string} [description] - Açıklama metni
 * @param {React.ElementType} [icon] - Lucide icon bileşeni
 */
const SellerCenterHero = ({ h1, subtitle, description, icon: Icon }) => (
  <header className={`${SC_HERO.wrapper} ${SC_HERO.gradient} ${SC_HERO.padding} mb-6 sm:mb-8`}>
    <div className={SC_HERO.overlay} aria-hidden="true" />
    <div className="relative z-10">
      {Icon && (
        <div className={`${SC_HERO.iconWrapper} mb-4`}>
          <Icon className={SC_HERO.iconClass} strokeWidth={2} />
        </div>
      )}
      <h1 className={SC_HERO.title}>{h1}</h1>
      {subtitle && <p className={SC_HERO.subtitle}>{subtitle}</p>}
      {description && <p className={SC_HERO.desc}>{description}</p>}
    </div>
  </header>
);

export default SellerCenterHero;
