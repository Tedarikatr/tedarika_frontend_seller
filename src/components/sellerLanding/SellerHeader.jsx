import { useNavigate } from "react-router-dom";

const SellerHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-[#003032] h-20 flex items-center text-white px-4 sm:px-6 shadow z-50">
      <div className="container mx-auto w-full flex justify-between items-center">
        {/* Logo ve Başlık */}
        <a href="/" className="flex items-center gap-3">
          <img
            src="/logo.svg"
            alt="Tedarika Logo"
            className="h-12 w-auto object-contain"
          />
          <span className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
            Tedarika<span className="text-emerald-400">Seller</span>
          </span>
        </a>

        {/* Giriş / Kayıt Butonları */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/seller/login")}
            className="bg-white/90 hover:bg-white text-[#003636] font-semibold px-6 py-2 rounded-full shadow-sm hover:shadow-md transition text-sm sm:text-base"
          >
            Giriş Yap
          </button>
          <button
            onClick={() => navigate("/seller/register")}
            className="border border-white text-white font-semibold px-6 py-2 rounded-full hover:bg-white hover:text-[#003636] transition text-sm sm:text-base"
          >
            Hesap Aç
          </button>
        </div>
      </div>
    </header>
  );
};

export default SellerHeader;
