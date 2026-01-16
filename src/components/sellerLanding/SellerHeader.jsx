import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { MessageCircle } from "lucide-react";
import Logo from "../../assets/images/logo.svg";

const navLinks = [
  { label: "Resmi Anasayfa", href: "/" },
  { label: "Hakkımızda", href: "/corporate/about" },
  { label: "SSS", href: "/corporate/sss" },
  { label: "Fiyatlar", href: "#pricing" }
];

const SellerHeader = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-[#003032] shadow-md w-full">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-center justify-between gap-4 py-3">
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
            className="hidden lg:flex items-center gap-6 text-sm text-emerald-50"
            aria-label="Ana menü"
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 rounded-full px-2 py-1"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop actions */}
          <div className="hidden sm:flex items-center gap-2 lg:gap-3">
            <button
              onClick={() => navigate("/seller/login")}
              className="bg-white text-[#003032] font-semibold text-sm px-4 py-2 rounded-full hover:bg-emerald-100 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            >
              Giriş Yap
            </button>
            <button
              onClick={() => navigate("/seller/register")}
              className="border border-white text-white font-semibold text-sm px-4 py-2 rounded-full hover:bg-white hover:text-[#003032] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            >
              Kayıt Ol
            </button>
            <button
              onClick={() => navigate("/seller/appointment")}
              className="bg-emerald-500 text-white font-semibold text-sm px-4 py-2 rounded-full hover:bg-emerald-400 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            >
              Randevu Oluştur
            </button>
            <a
              href="https://wa.me/905382362605"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold text-sm px-4 py-2 rounded-full hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg hover:shadow-green-500/40"
            >
              <MessageCircle className="w-5 h-5" />
              <span>WhatsApp Destek</span>
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white font-semibold text-sm border px-3 py-2 rounded-full border-white"
              aria-expanded={isOpen}
              aria-controls="seller-header-menu"
            >
              {isOpen ? "Kapat" : "Menü"}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {isOpen && (
          <div
            id="seller-header-menu"
            className="sm:hidden mt-3 pb-4 px-2 flex flex-col gap-3 animate-fade-in-down"
          >
            <div className="flex flex-col gap-2 text-sm text-emerald-50">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="rounded-full px-3 py-2 hover:bg-white/10 transition"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  navigate("/seller/login");
                  setIsOpen(false);
                }}
                className="bg-white text-[#003032] font-semibold text-sm px-4 py-2 rounded-full hover:bg-emerald-100 transition"
              >
                Giriş Yap
              </button>
              <button
                onClick={() => {
                  navigate("/seller/register");
                  setIsOpen(false);
                }}
                className="border border-white text-white font-semibold text-sm px-4 py-2 rounded-full hover:bg-white hover:text-[#003032] transition"
              >
                Kayıt Ol
              </button>
              <button
                onClick={() => {
                  navigate("/seller/appointment");
                  setIsOpen(false);
                }}
                className="bg-emerald-500 text-white font-semibold text-sm px-4 py-2 rounded-full hover:bg-emerald-400 transition"
              >
                Randevu Oluştur
              </button>
              <a
                href="https://wa.me/905382362605"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-sm px-4 py-2.5 rounded-full hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg"
              >
                <MessageCircle className="w-5 h-5" />
                <span>WhatsApp Destek</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default SellerHeader;
