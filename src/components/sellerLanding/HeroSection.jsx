import { Store } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-br from-emerald-100 via-white to-emerald-50 py-28 px-6 text-center">
      <div className="max-w-6xl mx-auto">
        {/* Etiket */}
        <div className="inline-flex items-center gap-2 justify-center mb-6">
          <Store className="text-emerald-700 w-8 h-8 drop-shadow-md" />
          <span className="text-emerald-700 font-semibold tracking-wide uppercase text-sm">
            Tedarika Satıcı Paneli
          </span>
        </div>

        {/* Başlık */}
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-[#002222] mb-6 drop-shadow-sm">
          Türkiye’nin En Hızlı Büyüyen<br className="hidden md:inline" /> B2B Pazaryerinde
          <span className="text-emerald-600"> Yerini Al</span>
        </h1>

        {/* Açıklama */}
        <p className="text-gray-700 text-lg max-w-2xl mx-auto mb-8">
          Hemen şirketini kaydet, mağazanı oluştur ve ürünlerini on binlerce kurumsal alıcıya ulaştır.
          Tedarika ile büyüme şimdi daha kolay.
        </p>

        {/* CTA Butonu */}
        <div className="flex justify-center gap-4 mt-6 flex-wrap">
          <a
            href="/seller/register"
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl text-lg font-semibold transition shadow-lg"
          >
            Mağaza Aç
          </a>
          <a
            href="/seller/login"
            className="bg-white border border-emerald-600 text-emerald-700 hover:bg-emerald-50 px-8 py-3 rounded-xl text-lg font-semibold transition"
          >
            Giriş Yap
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
