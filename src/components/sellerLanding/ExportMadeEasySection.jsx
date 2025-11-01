import { Globe, Package, Truck, DollarSign } from "lucide-react";
import { motion } from "framer-motion";

const ExportMadeEasySection = () => {
  return (
    <section className="relative bg-gradient-to-br from-emerald-100 to-emerald-200 py-24 px-6 text-center overflow-hidden">
      {/* Dekoratif blur daireler */}
      <div className="absolute top-10 left-10 w-40 h-40 bg-emerald-300 opacity-20 rounded-full blur-3xl animate-pulse-slow z-0" />
      <div className="absolute bottom-10 right-10 w-56 h-56 bg-indigo-300 opacity-20 rounded-full blur-3xl animate-pulse-slow z-0" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Başlık */}
        <motion.h2
          className="text-4xl md:text-5xl font-extrabold text-[#003636] mb-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          İhracatın Kolay Haliyle Tanışın
        </motion.h2>

        {/* Açıklama */}
        <motion.p
          className="text-gray-600 text-lg mb-10 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Tedarika ile ihracat süreci, karmaşık belgeler ve lojistik işlemlerden
          çok daha kolay. Birkaç adımda ürününüzü dünya çapında alıcılarla
          buluşturun.
        </motion.p>

        {/* Adım Adım İhracat */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Adım 1 */}
          <motion.div
            className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-transform duration-300 hover:-translate-y-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-600 to-green-700 text-white flex items-center justify-center mb-6">
              <Globe className="w-8 h-8" />
            </div>
            <h3 className="font-semibold text-xl text-[#002222] mb-2">Hedef Pazarı Seç</h3>
            <p className="text-sm text-gray-600">
              Tedarika ile hangi ülkeye satış yapmak istediğini kolayca belirle.
            </p>
          </motion.div>

          {/* Adım 2 */}
          <motion.div
            className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-transform duration-300 hover:-translate-y-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 text-white flex items-center justify-center mb-6">
              <Package className="w-8 h-8" />
            </div>
            <h3 className="font-semibold text-xl text-[#002222] mb-2">Ürün Yükle</h3>
            <p className="text-sm text-gray-600">
              Ürününüzü yükleyin, açıklamalarını girin ve satışa sunmaya başlayın.
            </p>
          </motion.div>

          {/* Adım 3 */}
          <motion.div
            className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-transform duration-300 hover:-translate-y-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center mb-6">
              <Truck className="w-8 h-8" />
            </div>
            <h3 className="font-semibold text-xl text-[#002222] mb-2">Kargo ve Ödeme</h3>
            <p className="text-sm text-gray-600">
              Kargo entegrasyonu ve güvenli ödeme sistemi ile işlem tamamlanır.
            </p>
          </motion.div>

          {/* Adım 4 */}
          <motion.div
            className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-transform duration-300 hover:-translate-y-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-green-400 to-teal-600 text-white flex items-center justify-center mb-6">
              <DollarSign className="w-8 h-8" />
            </div>
            <h3 className="font-semibold text-xl text-[#002222] mb-2">Ödeme Al</h3>
            <p className="text-sm text-gray-600">
              Sipariş tamamlandığında, ödemeni güvenle al ve kazancını artır.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ExportMadeEasySection;
