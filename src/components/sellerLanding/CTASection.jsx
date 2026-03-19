import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-gradient-to-br from-emerald-600 via-teal-600 to-green-700 text-white py-12 sm:py-16 md:py-20 px-4 sm:px-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 sm:mb-6 tracking-tight px-2">
          İhracata Başlamak İçin Hazır mısınız?
        </h2>

        <p className="text-base sm:text-lg md:text-xl text-emerald-50 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-2">
          Binlerce satıcı Tedarika ile global pazarlarda büyüyor.
          <br />
          Siz de bugün kaydolun, yarın ilk siparişinizi almaya başlayın.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => navigate("/seller/register")}
            className="group bg-white text-emerald-700 hover:bg-emerald-50 font-bold px-10 py-4 rounded-full text-lg shadow-2xl transition flex items-center gap-2"
          >
            Ücretsiz Kayıt Ol
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => navigate("/seller/login")}
            className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-semibold px-10 py-4 rounded-full text-lg transition"
          >
            Giriş Yapın
          </button>
        </div>

        <p className="text-sm text-emerald-100 mt-8">
          5.000+ aktif satıcı • 150+ ülkeden alıcı • 1M+ başarılı işlem
        </p>
      </div>
    </section>
  );
};

export default CTASection;
