import { motion } from "framer-motion";

const steps = [
  {
    number: 1,
    title: "Hızlı Kayıt",
    desc: "Dakikalar içinde formu doldurarak Tedarika sistemine giriş yapın.",
  },
  {
    number: 2,
    title: "Şirket & Mağaza Bilgileri",
    desc: "Yasal bilgilerinizi ve mağaza detaylarını girerek başvurunuzu tamamlayın.",
  },
  {
    number: 3,
    title: "Ürünleri Ekleyin",
    desc: "Ürünlerinizi yükleyin, satışa başlayın ve kurumsal alıcılarla buluşun.",
  },
];

const StepsSection = () => (
  <section className="bg-white py-24 px-6 relative">
    <div className="max-w-6xl mx-auto">
      {/* Başlık */}
      <h2 className="text-4xl font-extrabold text-center text-[#002222] mb-4">3 Adımda Satıcı Olun</h2>
      <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto text-lg">
        Tedarika’ya katılmak sadece birkaç dakika sürer. Aşağıdaki adımları izleyerek mağazanızı kolayca açabilirsiniz.
      </p>

      {/* Adımlar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
        {steps.map(({ number, title, desc }, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.2 }}
            className="bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300"
          >
            <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-400 text-white flex items-center justify-center text-2xl font-bold shadow-md">
              {number}
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
