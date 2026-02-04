import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ChevronDown, Menu, MessageCircle, X, Home, ExternalLink } from "lucide-react";
import { corporateLinks, supportLinks } from "@/constants/sellerCenterLinks";

const publicUrl = (path) => {
  return `${import.meta.env.BASE_URL}${path}`.replace(/\/{2,}/g, "/");
};

const Logo = publicUrl("images/logo.png");

const mainNavLinks = [
  { label: "Anasayfa", href: "/", icon: Home },
  { label: "Fiyatlar", href: "#pricing", icon: null },
];

const SellerHeader = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEscape);
    }
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="bg-[#003032] border-b border-white/10 shadow-sm w-full relative z-[100]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-center justify-between gap-4 py-1">
          <a
            href="/seller/landing"
            className="flex items-center gap-3 group"
            aria-label="Tedarika Satıcı Paneli"
          >
            <img src={Logo} alt="Tedarika Logo" className="h-12 sm:h-20 md:h-28 -my-2 sm:-my-4 md:-my-6 group-hover:scale-110 transition-transform duration-300" />
          </a>

          <nav
            className="hidden lg:flex items-center gap-6 text-base font-semibold text-white"
            aria-label="Ana menü"
          >
            {mainNavLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="hover:text-emerald-300 hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 rounded-lg px-3 py-2"
              >
                {link.label}
              </a>
            ))}

            <div className="relative group z-50">
              <button
                type="button"
                className="flex items-center gap-1 hover:text-emerald-300 hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 rounded-lg px-3 py-2"
                aria-haspopup="true"
              >
                Satıcı Merkezi
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute left-0 top-full pt-2 hidden w-48 group-hover:block group-focus-within:block z-[9999]">
                <div className="rounded-lg border border-white/10 bg-[#002829] shadow-xl">
                  <div className="py-2 text-sm text-white">
                    {corporateLinks.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        className="flex items-center gap-2 px-3 py-2 hover:bg-white/10 hover:text-white transition-colors"
                      >
                        {link.icon && <link.icon className="w-4 h-4 text-emerald-400/80 flex-shrink-0" />}
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="relative group z-50">
              <button
                type="button"
                className="flex items-center gap-1 hover:text-emerald-300 hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 rounded-lg px-3 py-2"
                aria-haspopup="true"
              >
                Destek
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute left-0 top-full pt-2 hidden w-56 group-hover:block group-focus-within:block z-[9999]">
                <div className="rounded-lg border border-white/10 bg-[#002829] shadow-xl">
                  <div className="py-2 text-sm text-white">
                    {supportLinks.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        target={link.external ? "_blank" : undefined}
                        rel={link.external ? "noopener noreferrer" : undefined}
                        className="flex items-center gap-2 px-3 py-2 hover:bg-white/10 hover:text-white transition-colors"
                      >
                        {link.icon && <link.icon className="w-4 h-4 text-emerald-400/80 flex-shrink-0" />}
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </nav>

          {/* Desktop actions */}
          <div className="hidden lg:flex items-center gap-2 lg:gap-3">
            <button
              onClick={() => navigate("/seller/register")}
              className="bg-white text-[#003032] font-bold text-base px-5 py-2.5 rounded-lg hover:bg-emerald-100 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            >
              Kayıt Ol
            </button>
            <button
              onClick={() => navigate("/seller/login")}
              className="border-2 border-white text-white font-bold text-base px-5 py-2.5 rounded-lg hover:bg-white/10 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            >
              Giriş Yap
            </button>
          </div>

          {/* Mobile menu button - lg:hidden = sadece < 1024px'de görünür */}
          <div className="lg:hidden">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center -mr-2 p-2 text-white rounded-xl hover:bg-white/10 active:bg-white/15 transition-colors touch-manipulation"
              aria-expanded={isOpen}
              aria-controls="seller-header-menu"
              aria-label={isOpen ? "Menüyü kapat" : "Menüyü aç"}
            >
              {isOpen ? <X className="w-6 h-6" strokeWidth={2.5} /> : <Menu className="w-6 h-6" strokeWidth={2.5} />}
            </button>
          </div>
        </div>

        {/* Mobile menu overlay & panel */}
        <div
          id="seller-header-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Navigasyon menüsü"
          className={`lg:hidden fixed inset-0 z-[99] top-0 left-0 right-0 bottom-0 flex flex-col transition-opacity duration-300 ${
            isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        >
          {/* Backdrop - tıklanınca kapat */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeMenu}
            aria-hidden="true"
          />

          {/* Panel - header altından, safe-area destekli */}
          <div
            className={`relative mt-[72px] mx-3 rounded-2xl bg-[#002829] border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[calc(100vh-88px)] transition-transform duration-300 ease-out ${
              isOpen ? "translate-y-0" : "-translate-y-4"
            }`}
            style={{ paddingBottom: "env(safe-area-inset-bottom, 0)" }}
          >
            <div className="flex-1 overflow-y-auto overscroll-contain py-4 px-4">
              <nav className="space-y-1" aria-label="Ana menü">
                {mainNavLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={closeMenu}
                    className="flex items-center gap-3 min-h-[48px] px-4 py-3 rounded-xl text-white font-medium text-base active:bg-white/10 transition-colors touch-manipulation"
                  >
                    {link.icon && <link.icon className="w-5 h-5 text-emerald-400 flex-shrink-0" />}
                    {link.label}
                  </a>
                ))}
              </nav>

              <div className="my-4 h-px bg-white/10" />

              <div className="space-y-1">
                <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-emerald-400/90">
                  Satıcı Merkezi
                </div>
                {corporateLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={closeMenu}
                    className="flex items-center gap-3 min-h-[48px] px-4 py-3 rounded-xl text-white/90 font-medium text-base active:bg-white/10 transition-colors touch-manipulation"
                  >
                    {link.icon && <link.icon className="w-5 h-5 text-emerald-400/80 flex-shrink-0" />}
                    {link.label}
                  </a>
                ))}
              </div>

              <div className="my-4 h-px bg-white/10" />

              <div className="flex flex-col gap-3 px-2">
                <button
                  type="button"
                  onClick={() => { navigate("/seller/register"); closeMenu(); }}
                  className="min-h-[48px] w-full bg-white text-[#003032] font-bold text-base rounded-xl hover:bg-emerald-50 active:bg-emerald-100 transition-colors touch-manipulation"
                >
                  Kayıt Ol
                </button>
                <button
                  type="button"
                  onClick={() => { navigate("/seller/login"); closeMenu(); }}
                  className="min-h-[48px] w-full border-2 border-white/80 text-white font-bold text-base rounded-xl hover:bg-white/10 active:bg-white/15 transition-colors touch-manipulation"
                >
                  Giriş Yap
                </button>
              </div>

              <div className="my-4 h-px bg-white/10" />

              <div className="space-y-1">
                <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-emerald-400/90">
                  Destek
                </div>
                {supportLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    onClick={closeMenu}
                    className="flex items-center justify-between min-h-[48px] px-4 py-3 rounded-xl text-white/90 font-medium text-base active:bg-white/10 transition-colors touch-manipulation"
                  >
                    <span className="flex items-center gap-3">
                      {link.icon && <link.icon className="w-5 h-5 text-emerald-400/80 flex-shrink-0" />}
                      {link.label}
                    </span>
                    {link.external && <ExternalLink className="w-4 h-4 text-white/50" />}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default SellerHeader;
