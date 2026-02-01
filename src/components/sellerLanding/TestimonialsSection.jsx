import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    name: "Sadık Özer",
    brand: "Anatolia Soap",
    role: "Kurucu",
    quote:
      "Tedarika ile sadece Türkiye'de değil, Avrupa ve Orta Doğu'dan da düzenli siparişler almaya başladık. Platform sayesinde yeni pazarlara açılmak çok kolay oldu.",
    rating: 5,
  },
  {
    name: "Aziz Aydın",
    brand: "Robotistan",
    role: "Genel Müdür",
    quote:
      "B2B satışlarımızı katlayan bir platform. Müşteri bulma, sipariş takibi ve ödeme süreçleri son derece profesyonel. Kesinlikle tavsiye ediyorum.",
    rating: 5,
  },
  {
    name: "Mehmet Yılmaz",
    brand: "Textile Export Co.",
    role: "İhracat Müdürü",
    quote:
      "Yıllardır ihracat yapıyoruz ama Tedarika kadar kolay bir platform görmedim. Tüm süreçler dijital ve şeffaf, müşteri desteği harika.",
    rating: 5,
  },
];

const TestimonialsSection = () => (
  <section className="bg-gradient-to-b from-white to-emerald-50 py-12 sm:py-16 lg:py-24 px-4 sm:px-6">
    <div className="max-w-6xl mx-auto">
      {/* Başlık */}
      <motion.h2
        className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-center text-[#002222] mb-3 sm:mb-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Başarı Hikayeleri
      </motion.h2>
      <motion.p
        className="text-center text-gray-600 mb-8 sm:mb-12 lg:mb-16 max-w-2xl mx-auto text-base sm:text-lg"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        Binlerce satıcı Tedarika ile işlerini büyütüyor. İşte bazı gerçek deneyimler.
      </motion.p>

      {/* Yorumlar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map(({ name, brand, role, quote, rating }, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.2 }}
            viewport={{ once: true }}
            className="relative bg-white rounded-xl sm:rounded-2xl border border-emerald-100 shadow-md hover:shadow-xl p-4 sm:p-6 lg:p-8 transition-all duration-300 hover:-translate-y-1"
          >
            <Quote className="absolute top-6 right-6 w-10 h-10 text-emerald-200 opacity-50" />

            {/* Yıldızlar */}
            <div className="flex gap-1 mb-4">
              {[...Array(rating)].map((_, idx) => (
                <Star key={idx} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>

            <p className="text-gray-700 mb-6 text-[15px] leading-relaxed">
              "{quote}"
            </p>

            <div className="border-t pt-4">
              <p className="font-semibold text-[#003636]">{name}</p>
              <p className="text-sm text-emerald-600 font-medium">{brand}</p>
              <p className="text-xs text-gray-500">{role}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Güven Badge'leri */}
      <motion.div
        className="mt-16 flex flex-wrap justify-center gap-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <div>
          <p className="text-2xl sm:text-3xl font-bold text-emerald-600">5.000+</p>
          <p className="text-xs sm:text-sm text-gray-600">Aktif Satıcı</p>
        </div>
        <div>
          <p className="text-2xl sm:text-3xl font-bold text-emerald-600">150+</p>
          <p className="text-xs sm:text-sm text-gray-600">Ülke</p>
        </div>
        <div>
          <p className="text-2xl sm:text-3xl font-bold text-emerald-600">1M+</p>
          <p className="text-xs sm:text-sm text-gray-600">Başarılı İşlem</p>
        </div>
        <div>
          <p className="text-2xl sm:text-3xl font-bold text-emerald-600">4.8/5</p>
          <p className="text-xs sm:text-sm text-gray-600">Ortalama Puan</p>
        </div>
      </motion.div>
    </div>
  </section>
);

export default TestimonialsSection;
