import { Globe, Package, Truck, DollarSign } from "lucide-react";
import { motion } from "framer-motion";

const ExportVurgulayanSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-emerald-100 to-emerald-50 py-32 px-6 text-center overflow-hidden">
      {/* Arka Plan Efektleri */}
      <div className="absolute top-10 left-10 w-40 h-40 bg-emerald-300 opacity-20 rounded-full blur-3xl animate-pulse-slow z-0" />
      <div className="absolute bottom-10 right-10 w-56 h-56 bg-indigo-300 opacity-20 rounded-full blur-3xl animate-pulse-slow z-0" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Başlık */}
        <motion.h2
          className="text-5xl md:text-6xl font-extrabold text-[#003636] mb-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Türk Üreticiler İçin{" "}
          <span className="text-emerald-600 bg-gradient-to-br from-emerald-400 to-green-700 bg-clip-text text-transparent">
            İhracat Kolaylığı
          </span>{" "}
          Burada Başlıyor
        </motion.h2>

        {/* Açıklama */}
        <motion.p
          className="text-lg text-gray-600 max-w-2xl mx-auto mb-12"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <span className="text-emerald-700 font-semibold">Tedarika</span> ile, ürünlerinizi sadece Türkiye’de değil, dünyada da alıcılarla buluşturun. Her adımda yanınızdayız —{" "}
          <span className="font-semibold text-emerald-800">belgelerden lojistiğe</span>,{" "}
          <span className="font-semibold text-emerald-800">ödemeden güvenli alışverişe</span>.
        </motion.p>

        {/* 3 Adımda İhracat */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Adım 1 */}
          <motion.div
            className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-transform duration-300 hover:-translate-y-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 text-white flex items-center justify-center mb-6">
              <Globe className="w-8 h-8" />
            </div>
            <h3 className="font-semibold text-xl text-[#002222] mb-2">Global Pazara Adım At</h3>
            <p className="text-sm text-gray-600">Dünya çapındaki alıcılara, kolayca erişin ve satışa başlamak için gerekli tüm adımları atın.</p>
          </motion.div>

          {/* Adım 2 */}
          <motion.div
            className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-transform duration-300 hover:-translate-y-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 text-white flex items-center justify-center mb-6">
              <Package className="w-8 h-8" />
            </div>
            <h3 className="font-semibold text-xl text-[#002222] mb-2">Ürünlerinizi Yükleyin</h3>
            <p className="text-sm text-gray-600">Ürünlerinizi platforma yükleyin, dünyanın dört bir yanındaki alıcılara sunun.</p>
          </motion.div>

          {/* Adım 3 */}
          <motion.div
            className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-transform duration-300 hover:-translate-y-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-700 text-white flex items-center justify-center mb-6">
              <Truck className="w-8 h-8" />
            </div>
            <h3 className="font-semibold text-xl text-[#002222] mb-2">Güvenli Ödeme ve Teslimat</h3>
            <p className="text-sm text-gray-600">Her işlemde güvenli ödeme, güvenilir teslimat garantisi ile satışı tamamlayın.</p>
          </motion.div>
        </div>

        {/* İhracata Hemen Başla CTA */}
        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <h3 className="text-2xl md:text-3xl font-bold text-[#003333] mb-6">
            Hemen İhracata Başla, Türk Üreticilerinin Dünyaya Açılmasını Sağla
          </h3>
          <a
            href="/seller/register"
            className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-4 rounded-full text-lg font-semibold transition shadow-lg hover:shadow-emerald-400/40"
          >
            Mağazanı Ücretsiz Aç
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default ExportVurgulayanSection;
