import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ExternalLink, ChevronRight } from "lucide-react";
import { sellerCenterNavLinks, sellerCenterQuickLinks } from "@/constants/sellerCenterLinks";

/**
 * Satıcı Merkezi sayfalarında sol panel / in-page header.
 * Hakkımızda, İletişim, SSS, Satıcı Merkezi, Randevu, Destek - merkezi yapı.
 */
const SellerCenterNav = () => {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <nav
      className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6 sm:mb-8"
      aria-label="Hızlı erişim"
    >
      {/* Mobil: yatay kaydırılabilir bar - ana linkler + başlangıç */}
      <div className="flex lg:hidden overflow-x-auto overscroll-x-contain py-2 px-3 gap-1">
        {[...sellerCenterNavLinks, ...sellerCenterQuickLinks].map((link) => {
          const isActive = link.href && (pathname === link.href || (link.href === "/satici-merkezi" && pathname.startsWith("/satici-merkezi")));
          if (link.external) return (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg whitespace-nowrap text-sm font-medium transition-colors ${
                isActive ? "bg-emerald-100 text-emerald-800" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {link.icon && <link.icon className="w-4 h-4 flex-shrink-0" />}
              {link.label}
              <ExternalLink className="w-3.5 h-3.5 opacity-60" />
            </a>
          );
          return (
            <Link
              key={link.label + (link.href || "")}
              to={link.href}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg whitespace-nowrap text-sm font-medium transition-colors ${
                isActive ? "bg-emerald-100 text-emerald-800" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {link.icon && <link.icon className="w-4 h-4 flex-shrink-0" />}
              {link.label}
            </Link>
          );
        })}
      </div>

      {/* Desktop: sol panel / dikey liste */}
      <div className="hidden lg:block py-2">
        <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500 border-b border-gray-100">
          Hızlı erişim
        </div>
        <div className="py-2">
          {sellerCenterNavLinks.map((link) => {
            const isActive = pathname === link.href || (link.href === "/satici-merkezi" && pathname.startsWith("/satici-merkezi"));
            return link.external ? (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center justify-between gap-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                  isActive ? "bg-emerald-50 text-emerald-800 border-l-2 border-emerald-600" : "text-gray-700 hover:bg-gray-50 border-l-2 border-transparent"
                }`}
              >
                <span className="flex items-center gap-2">
                  {link.icon && <link.icon className="w-4 h-4 flex-shrink-0" />}
                  {link.label}
                </span>
                <ExternalLink className="w-3.5 h-3.5 opacity-60 flex-shrink-0" />
              </a>
            ) : (
              <Link
                key={link.label}
                to={link.href}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                  isActive ? "bg-emerald-50 text-emerald-800 border-l-2 border-emerald-600" : "text-gray-700 hover:bg-gray-50 border-l-2 border-transparent"
                }`}
              >
                {link.icon && <link.icon className="w-4 h-4 flex-shrink-0" />}
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Başlangıç bağlantıları */}
        <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500 border-t border-b border-gray-100 mt-2">
          Başlangıç rehberi
        </div>
        <div className="py-2">
          {sellerCenterQuickLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                className={`flex items-center justify-between gap-2 px-4 py-2 text-sm transition-colors ${
                  isActive ? "bg-emerald-50 text-emerald-800 border-l-2 border-emerald-600 font-medium" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-2 border-transparent"
                }`}
              >
                <span className="line-clamp-2">{link.label}</span>
                <ChevronRight className="w-3.5 h-3.5 opacity-60 flex-shrink-0" />
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default SellerCenterNav;
