import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { SC_BREADCRUMB } from "@/constants/sellerCenterStyles";

/**
 * Satıcı Merkezi breadcrumb bileşeni
 * @param {Array<{ name: string, url: string }>} items - Breadcrumb öğeleri
 */
const SellerCenterBreadcrumb = ({ items = [] }) => (
  <nav className={SC_BREADCRUMB.nav} aria-label="Breadcrumb">
    {items.map((item, i) => (
      <React.Fragment key={item.url}>
        {i > 0 && <ChevronRight className={SC_BREADCRUMB.separator} />}
        {i < items.length - 1 ? (
          <Link to={item.url} className={SC_BREADCRUMB.link}>
            {item.name}
          </Link>
        ) : (
          <span className={SC_BREADCRUMB.current}>{item.name}</span>
        )}
      </React.Fragment>
    ))}
  </nav>
);

export default SellerCenterBreadcrumb;
