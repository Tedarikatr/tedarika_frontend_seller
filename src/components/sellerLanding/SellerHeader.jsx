import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { MessageCircle } from "lucide-react";
import Logo from "../../assets/images/logo.svg";



const SellerHeader = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-[#003032] shadow-md px-4 sm:px-6 py-3 w-full">
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center">
          <img src={Logo} alt="Tedarika Logo" className="h-12 sm:h-16" />
        </div>

        {/* Desktop buttons */}
        <div className="hidden sm:flex items-center gap-3">
          {/* WhatsApp Contact Button - Clear & Visible */}
          <a
            href="https://wa.me/905382362605"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold text-sm px-4 py-2 rounded-full hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg hover:shadow-green-500/50 hover:scale-105"
          >
            <MessageCircle className="w-5 h-5" />
            <span>WhatsApp Destek</span>
          </a>
          
          <button
            onClick={() => navigate("/seller/login")}
            className="bg-white text-[#003032] font-semibold text-sm px-4 py-2 rounded-full hover:bg-emerald-100 transition"
          >
            Giriş Yap
          </button>
          <button
            onClick={() => navigate("/seller/register")}
            className="border border-white text-white font-semibold text-sm px-4 py-2 rounded-full hover:bg-white hover:text-[#003032] transition"
          >
            Kayıt Ol
          </button>
          <button
            onClick={() => navigate("/seller/appointment")}
            className="bg-emerald-500 text-white font-semibold text-sm px-4 py-2 rounded-full hover:bg-emerald-400 transition"
          >
            Randevu Oluştur
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="sm:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white font-semibold text-sm border px-3 py-2 rounded-full border-white"
          >
            {isOpen ? "Kapat" : "Menü"}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {isOpen && (
        <div className="sm:hidden mt-3 px-2 flex flex-col gap-2 animate-fade-in-down">
          {/* WhatsApp Contact Button - Mobile */}
          <a
            href="https://wa.me/905382362605"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-sm px-4 py-2.5 rounded-full hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg"
          >
            <MessageCircle className="w-5 h-5" />
            <span>WhatsApp Destek</span>
          </a>
          
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
        </div>
      )}
    </header>
  );
};

export default SellerHeader;
