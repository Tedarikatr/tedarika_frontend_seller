import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ChevronDown, Menu, MessageCircle, X } from "lucide-react";

const publicUrl = (path) => {
  return `${import.meta.env.BASE_URL}${path}`.replace(/\/{2,}/g, "/");
};

const Logo = publicUrl("images/tedarikaisortagımlogo500x500.png");

const mainNavLinks = [
  { label: "Resmi Anasayfa", href: "/" },
  { label: "Fiyatlar", href: "#pricing" }
];

const corporateLinks = [
  { label: "Hakkımızda", href: "/corporate/about" },
  { label: "İletişim", href: "/corporate/contact" },
  { label: "SSS", href: "/corporate/sss" }
];

const supportLinks = [
  { label: "Randevu Oluştur", href: "/seller/appointment" },
  { label: "WhatsApp Destek", href: "https://wa.me/905382362605", external: true }
];

const SellerHeader = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-[#003032] border-b border-white/10 shadow-sm w-full relative z-[100]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-center justify-between gap-4 py-3.5">
          <a
            href="/seller/landing"
            className="flex items-center gap-3"
            aria-label="Tedarika Satıcı Paneli"
          >
            <img src={Logo} alt="Tedarika Logo" className="h-12 sm:h-14" />
            <span className="hidden sm:inline text-white font-semibold tracking-wide">
              Satıcı Paneli
            </span>
          </a>

          <nav
            className="hidden lg:flex items-center gap-6 text-sm text-white/80"
            aria-label="Ana menü"
          >
            {mainNavLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="hover:text-white hover:bg-white/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 rounded-lg px-2 py-1"
              >
                {link.label}
              </a>
            ))}

            <div className="relative group z-50">
              <button
                type="button"
                className="flex items-center gap-1 hover:text-white hover:bg-white/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 rounded-lg px-2 py-1"
                aria-haspopup="true"
              >
                Kurumsal
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute left-0 top-full mt-2 hidden w-48 rounded-lg border border-white/10 bg-[#002829] shadow-xl group-hover:block group-focus-within:block z-[9999]">
                <div className="py-2 text-sm text-white">
                  {corporateLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      className="block px-3 py-2 hover:bg-white/10 hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </nav>

          {/* Desktop actions */}
          <div className="hidden sm:flex items-center gap-2 lg:gap-3">
            <button
              onClick={() => navigate("/seller/register")}
              className="bg-white text-[#003032] font-semibold text-sm px-4 py-2 rounded-lg hover:bg-emerald-100 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            >
              Kayıt Ol
            </button>
            <button
              onClick={() => navigate("/seller/login")}
              className="border border-white/80 text-white font-semibold text-sm px-4 py-2 rounded-lg hover:bg-white/10 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            >
              Giriş Yap
            </button>

            <div className="relative group z-50">
              <button
                type="button"
                className="flex items-center gap-1 text-white/80 font-semibold text-sm px-3 py-2 rounded-lg hover:text-white hover:bg-white/5 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                aria-haspopup="true"
              >
                Destek
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute right-0 top-full mt-2 hidden w-56 rounded-lg border border-white/10 bg-[#002829] shadow-xl group-hover:block group-focus-within:block z-[9999]">
                <div className="py-2 text-sm text-white">
                  {supportLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      className="flex items-center gap-2 px-3 py-2 hover:bg-white/10 hover:text-white transition-colors"
                    >
                      {link.label === "WhatsApp Destek" && (
                        <MessageCircle className="w-4 h-4" />
                      )}
                      <span>{link.label}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white font-semibold text-sm border px-3 py-2 rounded-lg border-white/80 hover:bg-white/5 transition"
              aria-expanded={isOpen}
              aria-controls="seller-header-menu"
              aria-label={isOpen ? "Menüyü kapat" : "Menüyü aç"}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {isOpen && (
          <div
            id="seller-header-menu"
            className="sm:hidden mt-3 pb-4 px-2 flex flex-col gap-3 animate-fade-in-down"
          >
            <div className="flex flex-col gap-2 text-sm text-white/80">
              {mainNavLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg px-3 py-2 hover:bg-white/10 hover:text-white transition"
                >
                  {link.label}
                </a>
              ))}

              <div className="mt-2 text-xs uppercase tracking-wide text-white/50 px-3">
                Kurumsal
              </div>
              {corporateLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg px-3 py-2 hover:bg-white/10 hover:text-white transition"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  navigate("/seller/register");
                  setIsOpen(false);
                }}
                className="bg-white text-[#003032] font-semibold text-sm px-4 py-2 rounded-lg hover:bg-emerald-100 transition"
              >
                Kayıt Ol
              </button>
              <button
                onClick={() => {
                  navigate("/seller/login");
                  setIsOpen(false);
                }}
                className="border border-white/80 text-white font-semibold text-sm px-4 py-2 rounded-lg hover:bg-white/10 transition"
              >
                Giriş Yap
              </button>

              <div className="mt-2 text-xs uppercase tracking-wide text-white/50 px-3">
                Destek
              </div>
              {supportLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-white/80 hover:bg-white/10 hover:text-white transition"
                >
                  {link.label === "WhatsApp Destek" && (
                    <MessageCircle className="w-4 h-4" />
                  )}
                  <span>{link.label}</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default SellerHeader;
