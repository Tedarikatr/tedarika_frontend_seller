import { Store, Globe2, ShieldCheck, Truck, Rocket, MessageCircle } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative bg-white py-16 sm:py-24 md:py-32 px-4 sm:px-6 text-center overflow-hidden">
      <div className="absolute top-0 left-10 w-40 h-40 bg-emerald-300 opacity-20 rounded-full blur-3xl z-0" />
      <div className="absolute bottom-0 right-10 w-40 h-40 bg-indigo-300 opacity-20 rounded-full blur-3xl z-0" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="inline-flex items-center gap-2 justify-center mb-6">
          <Store className="text-emerald-700 w-8 h-8 drop-shadow-md" />
          <span className="text-emerald-700 font-semibold tracking-wide uppercase text-sm">
            Tedarika Satıcı Paneli
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-[#002222] mb-4 drop-shadow">
          Türkiye'den Dünyaya{" "}
          <br className="hidden md:inline" />
          <span className="text-emerald-600 bg-gradient-to-br from-emerald-400 to-green-700 bg-clip-text text-transparent">
            Profesyonel İhracat Platformu
          </span>
        </h1>

        <p className="text-base sm:text-lg text-gray-800 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-2">
          Binlerce global alıcıya ulaşın, güvenli ödeme alın, siparişlerinizi kolayca yönetin.
          <br />
          <span className="font-semibold text-emerald-800">
            İhracatınızı büyütmek için ihtiyacınız olan her şey tek platformda.
          </span>
        </p>

        <div className="flex justify-center gap-4 mt-6 flex-wrap">
          <a
            href="/seller/register"
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-full text-lg font-semibold transition shadow-lg hover:shadow-emerald-400/40"
          >
            Ücretsiz Başlayın
          </a>
          <a
            href="/seller/login"
            className="bg-white border border-emerald-600 text-emerald-700 hover:bg-emerald-50 px-8 py-3 rounded-full text-lg font-semibold transition"
          >
            Giriş Yapın
          </a>
        </div>

        <div className="mt-8 flex justify-center">
          <a
            href="https://wa.me/905382362605"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white px-8 py-4 rounded-full text-lg font-bold shadow-2xl hover:shadow-green-500/50 transition"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full blur opacity-40 group-hover:opacity-70 transition" />
            <MessageCircle className="w-7 h-7 relative z-10" />
            <div className="relative z-10">
              <div className="text-base font-semibold">Canlı Destek</div>
              <div className="text-sm font-normal opacity-90">WhatsApp ile Bize Ulaşın</div>
            </div>
          </a>
        </div>

        <p className="mt-6 text-sm text-gray-600">
          Kredi kartı gerekmez · Kurulum ücreti yok · 7/24 Türkçe destek
        </p>
      </div>

      <div className="mt-12 sm:mt-16 md:mt-20 flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 max-w-5xl mx-auto text-gray-700 px-2">
        <div className="flex items-center gap-3">
          <Globe2 className="w-7 h-7 text-emerald-600" />
          <span className="font-medium">150+ Ülkeden Alıcı</span>
        </div>
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-7 h-7 text-emerald-600" />
          <span className="font-medium">Güvenli Ödeme Garantisi</span>
        </div>
        <div className="flex items-center gap-3">
          <Truck className="w-7 h-7 text-emerald-600" />
          <span className="font-medium">Otomatik Kargo Entegrasyonu</span>
        </div>
        <div className="flex items-center gap-3">
          <Rocket className="w-7 h-7 text-emerald-600" />
          <span className="font-medium">5 Dakikada Aktif</span>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
