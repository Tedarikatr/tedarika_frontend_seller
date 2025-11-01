import { Globe, Package, CheckCircle, Briefcase, Star } from "lucide-react";
import { motion } from "framer-motion";

const GlobalOpportunitiesSection = () => {
  return (
    <section className="relative bg-white py-32 px-6 text-center overflow-hidden">
      {/* Arka Plan Efektleri */}
      <div className="absolute top-0 left-10 w-40 h-40 bg-teal-500 opacity-30 rounded-full blur-3xl animate-pulse-slow z-0" />
      <div className="absolute bottom-0 right-10 w-56 h-56 bg-emerald-500 opacity-20 rounded-full blur-3xl animate-pulse-slow z-0" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Başlık */}
        <motion.h2
          className="text-6xl font-extrabold text-black mb-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-emerald-800">İhracat</span> ile Yeni Bir Dünya Keşfedin  
          <br />
          Küresel Fırsatlar Bir Adım Uzağınızda
        </motion.h2>

        {/* Açıklama */}
        <motion.p
          className="text-lg text-gray-800 mb-16 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          **Dünyanın her yerine satış yapmaya başlamak** şimdi çok kolay.  
          Tedarika ile ürünlerinizi küresel pazarda en hızlı şekilde satışa sunun.  
          Hedef pazara, güvenli ödemelere ve hızlı kargoya sadece birkaç tıkla ulaşabilirsiniz.
        </motion.p>

        {/* 3 Adımda İhracat – Görsellerle Hedefe Ulaşın */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
          {/* Adım 1 */}
          <motion.div
            className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="w-16 h-16 bg-gradient-to-br from-teal-600 to-emerald-500 text-white rounded-xl flex items-center justify-center mb-6">
              <Globe className="w-8 h-8" />
            </div>
            <h3 className="font-semibold text-xl text-[#002222] mb-2">İhracat Yolculuğuna Başla</h3>
            <p className="text-sm text-gray-600">
              Küresel pazarda ilk adımı atın. Hedef pazarınızı seçin ve ürünlerinizi dünyaya sunmaya başlayın.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-4 px-6 py-2 bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-full"
            >
              Hedef Pazara Adım At
            </motion.button>
          </motion.div>

          {/* Adım 2 */}
          <motion.div
            className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 text-white rounded-xl flex items-center justify-center mb-6">
              <Package className="w-8 h-8" />
            </div>
            <h3 className="font-semibold text-xl text-[#002222] mb-2">Ürünlerini Yükle</h3>
            <p className="text-sm text-gray-600">
              Ürünlerini platforma yükle, açıklamalarını gir ve satışa başlamak için hazır ol!
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-4 px-6 py-2 bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-full"
            >
              Ürün Yükle
            </motion.button>
          </motion.div>

          {/* Adım 3 */}
          <motion.div
            className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-xl flex items-center justify-center mb-6">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="font-semibold text-xl text-[#002222] mb-2">Satışı Tamamla</h3>
            <p className="text-sm text-gray-600">
              Global alıcılarla güvenli ödeme ve hızlı teslimat süreci ile satışınızı hemen tamamlayın.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-4 px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full"
            >
              Ödeme ve Teslimat
            </motion.button>
          </motion.div>
        </div>

        {/* İhracat İçin Hedefe Ulaş */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <div className="flex justify-center items-center gap-4">
            <Star className="text-emerald-600 w-8 h-8" />
            <h3 className="text-2xl font-semibold text-black">Hedefine Ulaş ve Büyümeye Başla</h3>
          </div>
          <p className="text-sm text-gray-800 mt-4">İhracat fırsatlarını keşfet, büyümeye başla!</p>
          <a
            href="/seller/register"
            className="inline-block bg-emerald-700 hover:bg-emerald-800 text-white px-10 py-4 rounded-full text-lg font-semibold transition shadow-lg hover:shadow-emerald-400/40 mt-6"
          >
            Hemen Başla
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default GlobalOpportunitiesSection;
