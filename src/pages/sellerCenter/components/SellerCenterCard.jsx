import React from "react";
import { SC_CARD } from "@/constants/sellerCenterStyles";

/**
 * Satıcı Merkezi içerik kartı - kurumsal stil
 * @param {React.ReactNode} children
 * @param {boolean} [hover] - Hover efekti
 * @param {string} [className]
 */
const SellerCenterCard = ({ children, hover = false, className = "" }) => (
  <div
    className={`${SC_CARD.base} ${SC_CARD.padded} ${hover ? SC_CARD.hover : ""} ${className}`}
  >
    {children}
  </div>
);

export default SellerCenterCard;
