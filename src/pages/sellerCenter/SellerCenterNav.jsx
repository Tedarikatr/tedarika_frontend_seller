import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ExternalLink, ChevronRight } from "lucide-react";
import { sellerCenterNavLinks, sellerCenterQuickLinks } from "@/constants/sellerCenterLinks";
import { SC_NAV } from "@/constants/sellerCenterStyles";

/**
 * Satıcı Merkezi sol panel - Hızlı erişim ve Başlangıç rehberi
 * Kurumsal tasarım, mobilde yatay kaydırılabilir.
 */
const SellerCenterNav = () => {
  const pathname = useLocation().pathname;

  const isActive = (href) =>
    pathname === href || (href === "/satici-merkezi" && pathname.startsWith("/satici-merkezi"));

  return (
    <nav className={SC_NAV.wrapper} aria-label="Hızlı erişim">
      {/* Mobil: yatay kaydırılabilir bar */}
      <div className="flex lg:hidden overflow-x-auto overscroll-x-contain py-2 px-3 gap-1.5 scrollbar-hide">
        {[...sellerCenterNavLinks, ...sellerCenterQuickLinks].map((link) => {
          const active = link.href && isActive(link.href);
          const baseClass = `flex items-center gap-2 px-3.5 py-2.5 rounded-lg whitespace-nowrap text-sm font-medium transition-colors ${
            active ? "bg-emerald-100 text-emerald-800" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          }`;
          if (link.external) {
            return (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={baseClass}
              >
                {link.icon && <link.icon className="w-4 h-4 flex-shrink-0" />}
                {link.label}
                <ExternalLink className="w-3.5 h-3.5 opacity-60" />
              </a>
            );
          }
          return (
            <Link key={link.label + (link.href || "")} to={link.href} className={baseClass}>
              {link.icon && <link.icon className="w-4 h-4 flex-shrink-0" />}
              {link.label}
            </Link>
          );
        })}
      </div>

      {/* Desktop: dikey panel */}
      <div className="hidden lg:block">
        <div className={SC_NAV.sectionTitle}>Hızlı erişim</div>
        <div className="py-1">
          {sellerCenterNavLinks.map((link) => {
            const active = link.href && isActive(link.href);
            const linkClass = `${SC_NAV.link} ${active ? SC_NAV.linkActive : ""}`;
            if (link.external) {
              return (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${linkClass} ${SC_NAV.linkExternal}`}
                >
                  <span className="flex items-center gap-3">
                    {link.icon && <link.icon className="w-4 h-4 flex-shrink-0" />}
                    {link.label}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                </a>
              );
            }
            return (
              <Link key={link.label} to={link.href} className={linkClass}>
                {link.icon && <link.icon className="w-4 h-4 flex-shrink-0" />}
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className={SC_NAV.sectionTitle}>Başlangıç rehberi</div>
        <div className="py-1">
          {sellerCenterQuickLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                className={`${SC_NAV.link} ${active ? SC_NAV.linkActive : ""}`}
              >
                <span className="line-clamp-2">{link.label}</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default SellerCenterNav;
