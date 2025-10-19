import { useNavigate } from "react-router-dom";
import { useState } from "react";

const SellerHeader = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-[#003032] shadow-md px-4 sm:px-6 py-3 w-full">
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-white text-xl sm:text-2xl font-bold">
            Tedarika
            <span className="text-emerald-400 font-semibold ml-1">Seller</span>
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-3">
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
        </div>  

        <div className="sm:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white font-semibold text-sm border px-3 py-2 rounded-full border-white"
          >
            {isOpen ? "Kapat" : "Menü"}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="sm:hidden mt-3 px-2 flex flex-col gap-2 animate-fade-in-down">
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
        </div>
      )}
    </header>
  );
};

export default SellerHeader;
