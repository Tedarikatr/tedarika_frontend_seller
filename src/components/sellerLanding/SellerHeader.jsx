import { useNavigate } from "react-router-dom";

const SellerHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-[#003636] shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
        {/* Logo */}
        <div className="text-2xl font-extrabold text-white tracking-tight">
          Tedarika<span className="text-emerald-400">Seller</span>
        </div>

        {/* Sağ Butonlar */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
          <button
            onClick={() => navigate("/seller/login")}
            className="bg-emerald-400 text-[#003636] font-semibold px-5 py-2 rounded-full hover:bg-emerald-500 transition-all duration-200 text-center"
          >
            Giriş Yap
          </button>
          <button
            onClick={() => navigate("/seller/register")}
            className="border border-emerald-400 text-white font-semibold px-5 py-2 rounded-full hover:bg-emerald-400 hover:text-[#003636] transition-all duration-200 text-center"
          >
            Hesap Aç
          </button>
        </div>
      </div>
    </header>
  );
};

export default SellerHeader;
