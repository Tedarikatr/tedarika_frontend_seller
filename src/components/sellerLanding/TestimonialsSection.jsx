import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sadık Özer",
    brand: "Anatolia Soap",
    quote:
      "Tedarika ile sadece Türkiye’de değil, yurtdışından da sipariş almaya başladık. Lojistik ve faturalandırma süreçleri sorunsuz ilerliyor.",
  },
  {
    name: "Aziz Aydın",
    brand: "Robotistan",
    quote:
      "Tedarika sayesinde ürünlerimizi binlerce kurumsal alıcıyla buluşturduk. B2B satışlarımızda ciddi bir artış yakaladık.",
  },
];

const TestimonialsSection = () => (
  <section className="bg-gradient-to-b from-emerald-50 to-white py-24 px-6">
    <div className="max-w-6xl mx-auto">
      {/* Başlık */}
      <h2 className="text-4xl font-extrabold text-center text-[#002222] mb-4">
        Satıcılarımız Ne Diyor?
      </h2>
      <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto text-lg">
        Tedarika’yı tercih eden satıcılar; erişim, hız ve operasyon kolaylığından memnun. İşte bazı başarı hikayeleri:
      </p>

      {/* Yorumlar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {testimonials.map(({ name, brand, quote }, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.3 }}
            viewport={{ once: true }}
            className="relative bg-white rounded-2xl border border-emerald-100 shadow-sm hover:shadow-lg p-8 transition-all duration-300"
          >
            <Quote className="absolute top-4 left-4 w-8 h-8 text-emerald-400 opacity-30" />

            <p className="text-gray-700 italic mb-6 text-[15px] leading-relaxed">
              “{quote}”
            </p>

            <div className="border-t pt-4">
              <p className="text-sm font-semibold text-[#003636]">{name}</p>
              <p className="text-sm text-gray-500">{brand}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialsSection;
