import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

/**
 * Satıcı Merkezi link listesi - hızlı başlangıç vb.
 * @param {Array<{ to: string, label: string }>} links
 */
const SellerCenterLinkList = ({ links = [] }) => (
  <ul className="space-y-3">
    {links.map(({ to, label }) => (
      <li key={label}>
        <Link
          to={to}
          className="group inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-800 font-medium transition-colors"
        >
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          {label}
        </Link>
      </li>
    ))}
  </ul>
);

export default SellerCenterLinkList;
