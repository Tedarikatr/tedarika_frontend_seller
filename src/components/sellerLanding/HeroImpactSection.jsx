import { Globe, TrendingUp, DollarSign, Rocket } from "lucide-react";
import { motion } from "framer-motion";

const HeroImpactSection = () => {
  return (
    <section className="relative bg-white py-20 sm:py-32 px-4 sm:px-8 text-center overflow-hidden">
      {/* Arka Plan Efektleri */}
      <div className="absolute top-0 left-0 w-60 h-60 sm:w-80 sm:h-80 bg-emerald-600 opacity-40 rounded-full blur-3xl animate-pulse-slow z-0" />
      <div className="absolute bottom-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-teal-600 opacity-30 rounded-full blur-3xl animate-pulse-slow z-0" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Başlık */}
        <motion.h1
          className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-black mb-6 sm:mb-8 leading-snug sm:leading-tight px-2"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Hayalinizdeki <br className="sm:hidden" />
          Global Pazara <br />
          Adım Atın <br className="hidden sm:block" />
          <span className="block sm:inline">
            Tedarika ile{" "}
            <span className="text-emerald-400">E-İhracat</span> Çok Kolay!
          </span>
        </motion.h1>

        {/* Açıklama */}
        <motion.p
          className="text-base sm:text-lg md:text-xl text-gray-700 max-w-xl sm:max-w-2xl mx-auto mb-12 sm:mb-16 px-2"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Birkaç adımda kendi mağazanızı açın, ürünlerinizi dünyaya tanıtın.{" "}
          <strong>Düşük maliyet</strong>, <strong>güvenli ödeme</strong> ve{" "}
          <strong>kolay teslimat</strong> ile satışa başlayın.  
          İhracat bir tık uzağınızda!
        </motion.p>

        {/* 3 Ana Adım */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12 text-center">
          {/* Adım 1 */}
          <motion.div
            className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-transform duration-300 hover:-translate-y-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-teal-600 to-emerald-400 text-white rounded-full flex items-center justify-center mx-auto mb-5 sm:mb-6">
              <Globe className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>
            <h3 className="font-semibold text-lg sm:text-xl text-[#003636] mb-2">
              Hedef Pazarı Seç
            </h3>
            <p className="text-sm sm:text-base text-gray-600">
              Dünyanın her yerine satış yapma fırsatını keşfedin. Hedef pazarınızı kolayca belirleyin.
            </p>
          </motion.div>

          {/* Adım 2 */}
          <motion.div
            className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-transform duration-300 hover:-translate-y-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-orange-500 to-yellow-500 text-white rounded-full flex items-center justify-center mx-auto mb-5 sm:mb-6">
              <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>
            <h3 className="font-semibold text-lg sm:text-xl text-[#003636] mb-2">
              Satışınızı Yükseltin
            </h3>
            <p className="text-sm sm:text-base text-gray-600">
              Global alıcılar ile hızlıca satışa başlayın ve ticaretinizi hızla büyütün.
            </p>
          </motion.div>

          {/* Adım 3 */}
          <motion.div
            className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-transform duration-300 hover:-translate-y-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-600 to-indigo-700 text-white rounded-full flex items-center justify-center mx-auto mb-5 sm:mb-6">
              <DollarSign className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>
            <h3 className="font-semibold text-lg sm:text-xl text-[#003636] mb-2">
              Kazancınızı Hızla Artırın
            </h3>
            <p className="text-sm sm:text-base text-gray-600">
              Güvenli ödeme entegrasyonu ile kazancınızı hızlı ve güvenli şekilde alın.
            </p>
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          className="mt-12 sm:mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4">
            <Rocket className="text-emerald-600 w-8 h-8 sm:w-10 sm:h-10" />
            <h3 className="text-xl sm:text-2xl font-semibold text-black">
              İhracat Başladı, Sen de Katıl!
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-gray-700 mt-3 sm:mt-4">
            Sana sadece global pazarda yerini almak kaldı!
          </p>
          <a
            href="/seller/register"
            className="inline-block bg-emerald-700 hover:bg-emerald-800 text-white px-8 sm:px-12 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold transition shadow-lg hover:shadow-emerald-400/40 mt-5"
          >
            Hemen Satışa Başla
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroImpactSection;
