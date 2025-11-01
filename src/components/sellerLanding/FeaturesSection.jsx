import { Rocket, BadgeCheck, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Rocket,
    bg: "from-green-400 to-emerald-600",
    title: "Hızlı Başlangıç",
    desc: "Kaydını birkaç dakikada tamamla, ürünlerini anında satışa sun.",
  },
  {
    icon: BadgeCheck,
    bg: "from-yellow-400 to-orange-500",
    title: "Geniş Erişim",
    desc: "Tedarika’nın global alıcı ağıyla binlerce B2B müşteriye ulaş.",
  },
  {
    icon: ShieldCheck,
    bg: "from-purple-400 to-indigo-600",
    title: "Güvenli Altyapı",
    desc: "Sipariş, ödeme ve kargo süreçlerini güvenle yönet. Her adımda koruma altında ol.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="relative bg-gradient-to-b from-white via-emerald-50 to-emerald-100 py-28 px-6 overflow-hidden">
      {/* Dekoratif arka plan efektleri */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" />
      <div className="absolute top-10 left-10 w-40 h-40 bg-emerald-300 opacity-20 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-10 right-10 w-56 h-56 bg-indigo-300 opacity-20 rounded-full blur-3xl animate-pulse-slow" />

      <div className="max-w-6xl mx-auto relative z-10 text-center">
        {/* Başlık */}
        <motion.h2
          className="text-4xl md:text-5xl font-extrabold text-[#002222] mb-5"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Neden{" "}
          <span className="bg-gradient-to-br from-emerald-400 to-green-700 bg-clip-text text-transparent">
            Tedarika?
          </span>
        </motion.h2>

        <motion.p
          className="text-gray-600 text-lg max-w-2xl mx-auto mb-16"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Tedarika, sadece bir pazaryeri değil —{" "}
          <span className="text-emerald-700 font-semibold">
            KOBİ’leri dünyaya bağlayan dijital ihracat ekosistemi
          </span>
          . Teknoloji, güven ve hız tek çatı altında.
        </motion.p>

        {/* Özellik Kartları */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {features.map(({ icon: Icon, title, desc, bg }, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-md hover:shadow-emerald-200/70 transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
            >
              <div
                className={`w-14 h-14 mx-auto rounded-xl flex items-center justify-center mb-6 bg-gradient-to-br ${bg} shadow-inner group-hover:shadow-lg transition-all duration-300`}
              >
                <Icon className="text-white w-7 h-7 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="font-semibold text-2xl text-[#002222] mb-3">
                {title}
              </h3>
              <p className="text-gray-600 leading-relaxed text-base">
                {desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Alt CTA Alanı */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <h3 className="text-2xl md:text-3xl font-bold text-[#003333] mb-6">
            Sen de Tedarika’da mağazanı aç, dünyaya satış yapmaya başla 🚀
          </h3>
          <a
            href="/seller/register"
            className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-4 rounded-full text-lg font-semibold transition shadow-lg hover:shadow-emerald-400/40"
          >
            Ücretsiz Mağaza Aç
          </a>
          <p className="text-sm text-gray-600 mt-3">
            <span className="text-emerald-700 font-medium">
            </span>{" "}
            · 5 dakikada kaydol · 7/24 destek
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
