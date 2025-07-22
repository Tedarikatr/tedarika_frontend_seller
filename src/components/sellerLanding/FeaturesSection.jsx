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
    desc: "Tedarika'nın güçlü kurumsal ağı ile binlerce alıcıya ulaş.",
  },
  {
    icon: ShieldCheck,
    bg: "from-purple-400 to-indigo-600",
    title: "Güvenli Altyapı",
    desc: "Tüm sipariş, ödeme ve operasyon süreçlerini güvenle yönet.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="bg-emerald-50 py-24 px-6 relative overflow-hidden">
      {/* Dekoratif arka plan blur daireler */}
      <div className="absolute top-10 left-10 w-40 h-40 bg-emerald-400 opacity-20 rounded-full blur-3xl animate-pulse-slow z-0" />
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-indigo-300 opacity-10 rounded-full blur-2xl animate-pulse-slow z-0" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Başlık */}
        <motion.h2
          className="text-4xl md:text-5xl font-extrabold text-center text-[#003636] mb-4 tracking-tight"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Neden Tedarika?
        </motion.h2>

        <motion.p
          className="text-center text-gray-600 mb-16 max-w-2xl mx-auto text-lg"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Tedarika sadece bir mağaza sunmaz;{" "}
          <span className="font-semibold text-emerald-700">
            güvenli, hızlı ve erişilebilir bir satış altyapısı
          </span>{" "}
          sağlar.
        </motion.p>

        {/* Özellik Kartları */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map(({ icon: Icon, title, desc, bg }, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-transform duration-300 hover:-translate-y-1"
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 bg-gradient-to-br ${bg} shadow-inner`}
              >
                <Icon className="text-white w-6 h-6" />
              </div>
              <h3 className="font-semibold text-xl text-[#002222] mb-2">{title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
