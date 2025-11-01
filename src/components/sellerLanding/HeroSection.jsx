import { Store, Globe2, ShieldCheck, Truck, Rocket } from "lucide-react";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-emerald-100 via-white to-emerald-50 py-32 px-6 text-center overflow-hidden">
      {/* Dekoratif blur daireler */}
      <div className="absolute top-0 left-10 w-40 h-40 bg-emerald-300 opacity-20 rounded-full blur-3xl animate-pulse-slow z-0" />
      <div className="absolute bottom-0 right-10 w-40 h-40 bg-indigo-300 opacity-20 rounded-full blur-3xl animate-pulse-slow z-0" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Etiket */}
        <motion.div
          className="inline-flex items-center gap-2 justify-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Store className="text-emerald-700 w-8 h-8 drop-shadow-md" />
          <span className="text-emerald-700 font-semibold tracking-wide uppercase text-sm">
            Tedarika Satıcı Paneli
          </span>
        </motion.div>

        {/* Başlık */}
        <motion.h1
          className="text-5xl md:text-6xl font-extrabold leading-tight text-[#002222] mb-4 drop-shadow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          Türkiye’nin En Hızlı Büyüyen{" "}
          <br className="hidden md:inline" />
          B2B Pazaryerinde{" "}
          <span className="text-emerald-600 bg-gradient-to-br from-emerald-400 to-green-700 bg-clip-text text-transparent">
            Yerini Al
          </span>
        </motion.h1>

        {/* Alt slogan (dinamik duygusal mesaj) */}
        <motion.p
          className="text-lg text-gray-800 mb-10 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <strong className="text-emerald-700 font-semibold">
            Üreticiler, KOBİ’ler ve İhracatçılar
          </strong>{" "}
          için dijital ticaretin yeni adresi.  
          Belgelerden ödemeye, kargodan müşteri bulmaya kadar{" "}
          <span className="font-semibold text-emerald-800">
            her şeyi tek panelden yönetin.
          </span>
        </motion.p>

        {/* CTA Butonları */}
        <motion.div
          className="flex justify-center gap-4 mt-6 flex-wrap"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <a
            href="/seller/register"
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-full text-lg font-semibold transition shadow-lg hover:shadow-emerald-400/40"
          >
            Mağazanı Ücretsiz Aç
          </a>
          <a
            href="/seller/login"
            className="bg-white border border-emerald-600 text-emerald-700 hover:bg-emerald-50 px-8 py-3 rounded-full text-lg font-semibold transition"
          >
            Zaten Üyeyim
          </a>
        </motion.div>

        {/* Alt bilgi */}
        <motion.p
          className="mt-6 text-sm text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          Ücretsiz kayıt · Türkçe destek
        </motion.p>
      </div>

      {/* Avantajlar barı */}
      <motion.div
        className="mt-20 flex flex-wrap justify-center gap-8 max-w-5xl mx-auto text-gray-700"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        <div className="flex items-center gap-3">
          <Globe2 className="w-7 h-7 text-emerald-600" />
          <span><strong>Global alıcılar</strong> seni bekliyor</span>
        </div>
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-7 h-7 text-emerald-600" />
          <span><strong>Güvenli ödeme</strong> sistemiyle koruma</span>
        </div>
        <div className="flex items-center gap-3">
          <Truck className="w-7 h-7 text-emerald-600" />
          <span><strong>Kargo entegrasyonu</strong> hazır</span>
        </div>
        <div className="flex items-center gap-3">
          <Rocket className="w-7 h-7 text-emerald-600" />
          <span><strong>5 dakikada</strong> mağazan aktif!</span>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
