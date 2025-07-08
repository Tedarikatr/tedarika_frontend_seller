import { Store } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-br from-emerald-100 via-white to-emerald-50 py-24 px-6 text-center">
      <div className="max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 justify-center mb-6">
          <Store className="text-emerald-700 w-8 h-8 drop-shadow-md" />
          <span className="text-emerald-700 font-medium tracking-wide uppercase text-sm">
            Tedarika Satıcı Paneli
          </span>
        </div>

        <h1 className="text-5xl font-extrabold leading-tight text-[#002222] mb-6">
          Türkiye'nin En Hızlı Büyüyen B2B Pazaryerinde Yerini Al
        </h1>
        <p className="text-gray-700 text-lg max-w-xl mx-auto">
          Şirketini kaydet, mağazanı aç ve Tedarika’nın gücüyle binlerce müşteriye ulaş.
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
