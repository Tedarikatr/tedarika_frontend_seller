import React from "react";
import { SC_CALLOUT } from "@/constants/sellerCenterStyles";

/**
 * Satıcı Merkezi uyarı/bilgi kutusu
 * @param {React.ReactNode} children
 * @param {'info'|'warning'|'success'} [variant]
 */
const SellerCenterCallout = ({ children, variant = "info" }) => (
  <div className={SC_CALLOUT[variant]} role="region" aria-label="Bilgi">
    {children}
  </div>
);

export default SellerCenterCallout;
