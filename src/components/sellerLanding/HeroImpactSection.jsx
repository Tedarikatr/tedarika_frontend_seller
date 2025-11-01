import { Globe, TrendingUp, Package, DollarSign, Rocket } from "lucide-react";
import { motion } from "framer-motion";

const HeroImpactSection = () => {
  return (
    <section className="relative bg-gradient-to-r from-emerald-700 to-teal-500 py-40 px-6 text-center overflow-hidden">
      {/* Arka Plan Etkisi - Hareketli ve Parlak */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-emerald-600 opacity-40 rounded-full blur-3xl animate-pulse-slow z-0" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-teal-600 opacity-30 rounded-full blur-3xl animate-pulse-slow z-0" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Başlık */}
        <motion.h1
          className="text-6xl md:text-7xl font-extrabold text-white mb-8"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Hayalinizdeki Global Pazara Adım Atın
          <br />
          Tedarika ile <span className="text-emerald-300">İhracat</span> Çok Kolay!
        </motion.h1>

        {/* Açıklama */}
        <motion.p
          className="text-xl text-gray-100 max-w-2xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Birkaç adımda kendi mağazanızı açın, ürünlerinizi dünyaya tanıtın.  
          **Düşük maliyet**, **güvenli ödeme**, ve **kolay teslimat** ile satışa başlayın.  
          İhracat bir tık uzağınızda!
        </motion.p>

        {/* 3 Ana Adım */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {/* Adım 1 */}
          <motion.div
            className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-transform duration-300 hover:-translate-y-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="w-20 h-20 bg-gradient-to-br from-teal-600 to-emerald-400 text-white rounded-full flex items-center justify-center mb-6">
              <Globe className="w-10 h-10" />
            </div>
            <h3 className="font-semibold text-xl text-[#003636] mb-2">Hedef Pazarı Seç</h3>
            <p className="text-sm text-gray-600">
              Dünyanın her yerine satış yapma fırsatını keşfedin. Hedef pazarınızı kolayca belirleyin.
            </p>
          </motion.div>

          {/* Adım 2 */}
          <motion.div
            className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-transform duration-300 hover:-translate-y-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-yellow-500 text-white rounded-full flex items-center justify-center mb-6">
              <TrendingUp className="w-10 h-10" />
            </div>
            <h3 className="font-semibold text-xl text-[#003636] mb-2">Satışınızı Yükseltin</h3>
            <p className="text-sm text-gray-600">
              Global alıcılar ile hızlıca satışa başlayın ve ticaretinizi hızla büyütün.
            </p>
          </motion.div>

          {/* Adım 3 */}
          <motion.div
            className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-transform duration-300 hover:-translate-y-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-indigo-700 text-white rounded-full flex items-center justify-center mb-6">
              <DollarSign className="w-10 h-10" />
            </div>
            <h3 className="font-semibold text-xl text-[#003636] mb-2">Kazancınızı Hızla Artırın</h3>
            <p className="text-sm text-gray-600">
              Güvenli ödeme entegrasyonu ile kazancınızı hızlı ve güvenli şekilde alın.
            </p>
          </motion.div>
        </div>

        {/* Eylem Çağrısı */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <div className="flex justify-center items-center gap-4">
            <Rocket className="text-emerald-600 w-10 h-10" />
            <h3 className="text-2xl font-semibold text-white">İhracat Başladı, Sen de Katıl!</h3>
          </div>
          <p className="text-sm text-gray-100 mt-4">Sana sadece global pazarda yerini almak kaldı!</p>
          <a
            href="/seller/register"
            className="inline-block bg-emerald-800 hover:bg-emerald-900 text-white px-12 py-4 rounded-full text-lg font-semibold transition shadow-lg hover:shadow-emerald-400/40 mt-6"
          >
            Hemen Satışa Başla
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroImpactSection;
