import React from "react";
import { SC_PROSE } from "@/constants/sellerCenterStyles";

/**
 * Satıcı Merkezi makale içeriği wrapper - tutarlı typography
 */
const SellerCenterProse = ({ children, className = "" }) => (
  <div className={`${SC_PROSE.wrapper} ${className}`}>{children}</div>
);

export default SellerCenterProse;
