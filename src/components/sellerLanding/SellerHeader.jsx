import { useNavigate } from "react-router-dom";

const SellerHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
        {/* Logo */}
        <div className="text-2xl font-extrabold text-[#003636] tracking-tight">
          Tedarika<span className="text-emerald-600">Seller</span>
        </div>

        {/* Sağ Butonlar */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
          <button
            onClick={() => navigate("/seller/login")}
            className="bg-[#003636] text-white font-medium px-5 py-2 rounded-full hover:bg-[#004848] transition text-center"
          >
            Giriş Yap
          </button>
          <button
            onClick={() => navigate("/seller/register")}
            className="bg-[#003636] text-white font-medium px-5 py-2 rounded-full hover:bg-[#004848] transition text-center"
          >
            Hesap Aç*
          </button>
        </div>
      </div>
    </header>
  );
};

export default SellerHeader;
