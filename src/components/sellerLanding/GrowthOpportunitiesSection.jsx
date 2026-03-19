import { BarChart, TrendingUp, Users, ArrowRight, Globe } from "lucide-react";

const GrowthOpportunitiesSection = () => {
  return (
    <section className="relative bg-white py-12 sm:py-20 md:py-32 px-4 sm:px-6 text-center overflow-hidden">
      <div className="absolute top-0 left-10 w-40 h-40 bg-emerald-300 opacity-30 rounded-full blur-3xl z-0" />
      <div className="absolute bottom-0 right-10 w-56 h-56 bg-indigo-300 opacity-20 rounded-full blur-3xl z-0" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="hidden md:block w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-2xl">
            <Globe className="w-8 h-8 text-white" strokeWidth={2.5} />
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-black px-2">
            İhracatla Satışlarınızı Katlamak İçin Fırsatlar
          </h2>
        </div>

        <p className="text-lg text-gray-800 mb-12 max-w-2xl mx-auto">
          Tedarika ile global pazarlara ulaşın ve profesyonel B2B alıcılarla büyümeye başlayın. Düşük maliyet, hızlı başlangıç ve sürekli büyüme fırsatları.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 text-white rounded-xl flex items-center justify-center mb-6">
              <BarChart className="w-8 h-8" />
            </div>
            <h3 className="font-semibold text-xl text-[#002222] mb-2">Satış Artışı</h3>
            <p className="text-sm text-gray-600">
              150+ ülkeden B2B alıcılara ulaşarak cirolarınızı önemli ölçüde artırın. Binlerce aktif kurumsal alıcı.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-yellow-500 text-white rounded-xl flex items-center justify-center mb-6">
              <TrendingUp className="w-8 h-8" />
            </div>
            <h3 className="font-semibold text-xl text-[#002222] mb-2">Hızlı Büyüme</h3>
            <p className="text-sm text-gray-600">
              5 dakikada mağaza açın, anında satışa başlayın. Düşük komisyonlar, yüksek kar marjları.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl flex items-center justify-center mb-6">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="font-semibold text-xl text-[#002222] mb-2">Geniş Alıcı Ağı</h3>
            <p className="text-sm text-gray-600">
              Doğrulanmış kurumsal alıcılarla güvenli ticaret yapın. B2B odaklı profesyonel alıcı ağı.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-600 to-emerald-500 text-white rounded-xl flex items-center justify-center mb-6">
              <ArrowRight className="w-8 h-8" />
            </div>
            <h3 className="font-semibold text-xl text-[#002222] mb-2">Kolay Entegrasyon</h3>
            <p className="text-sm text-gray-600">
              Hızlı kayıt ve kullanıma hazır araçlarla dakikalar içinde satmaya başlayın.
            </p>
          </div>
        </div>

        <div className="mt-12">
          <div className="flex justify-center items-center gap-4">
            <ArrowRight className="text-emerald-600 w-8 h-8" />
            <h3 className="text-2xl font-semibold text-black">Büyümeye Bugün Başlayın</h3>
          </div>
          <p className="text-sm text-gray-800 mt-4">İlk siparişiniz için kaydolun, global pazarlarda yerinizi alın.</p>
          <a
            href="/seller/register"
            className="inline-block bg-emerald-700 hover:bg-emerald-800 text-white px-10 py-4 rounded-full text-lg font-semibold transition shadow-lg hover:shadow-emerald-400/40 mt-6"
          >
            Ücretsiz Başlayın
          </a>
        </div>
      </div>
    </section>
  );
};

export default GrowthOpportunitiesSection;
