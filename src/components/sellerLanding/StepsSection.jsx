import { motion } from "framer-motion";
import { Globe, Store, Package, CheckCircle } from "lucide-react";

const steps = [
  {
    number: 1,
    title: "Hızlı Kayıt",
    desc: "Dakikalar içinde formu doldurarak Tedarika sistemine giriş yapın.",
    icon: Globe,
    bg: "from-teal-500 to-teal-700",
  },
  {
    number: 2,
    title: "Şirket & Mağaza Bilgileri",
    desc: "Yasal bilgilerinizi ve mağaza detaylarını girerek başvurunuzu tamamlayın.",
    icon: Store,
    bg: "from-yellow-500 to-orange-600",
  },
  {
    number: 3,
    title: "Ürünleri Ekleyin",
    desc: "Ürünlerinizi yükleyin, satışa başlayın ve kurumsal alıcılarla buluşun.",
    icon: Package,
    bg: "from-purple-600 to-indigo-700",
  },
];

const StepsSection = () => (
  <section className="bg-gradient-to-r from-emerald-100 via-white to-emerald-50 py-24 px-6 relative">
    <div className="max-w-6xl mx-auto">
      {/* Başlık */}
      <motion.h2
        className="text-4xl font-extrabold text-center text-[#002222] mb-4"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        3 Adımda Satıcı Olun
      </motion.h2>
      <motion.p
        className="text-center text-gray-600 mb-16 max-w-2xl mx-auto text-lg"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        Tedarika’ya katılmak sadece birkaç dakika sürer. Aşağıdaki adımları izleyerek mağazanızı kolayca açabilirsiniz.
      </motion.p>

      {/* Adımlar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
        {steps.map(({ number, title, desc, icon: Icon, bg }, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.2 }}
            className="bg-white border border-emerald-100 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div
              className={`w-16 h-16 mx-auto mb-5 rounded-full bg-gradient-to-br ${bg} text-white flex items-center justify-center text-2xl font-bold shadow-lg`}
            >
              <Icon className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-semibold text-[#003636] mb-2">{title}</h4>
            <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default StepsSection;
