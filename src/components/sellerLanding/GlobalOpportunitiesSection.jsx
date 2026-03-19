import { Globe, Package, CheckCircle, Star } from "lucide-react";

const GlobalOpportunitiesSection = () => {
  return (
    <section className="relative bg-white py-12 sm:py-20 md:py-32 px-4 sm:px-6 text-center overflow-hidden">
      <div className="absolute top-0 left-10 w-40 h-40 bg-teal-500 opacity-30 rounded-full blur-3xl z-0" />
      <div className="absolute bottom-0 right-10 w-56 h-56 bg-emerald-500 opacity-20 rounded-full blur-3xl z-0" />

      <div className="max-w-6xl mx-auto relative z-10">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-black mb-6 sm:mb-8 px-2">
          <span className="text-emerald-800">Global Pazarlara</span> Profesyonel Erişim{" "}
          <br />
          B2B İhracat Fırsatları Sizi Bekliyor
        </h2>

        <p className="text-lg text-gray-800 mb-16 max-w-2xl mx-auto">
          150+ ülkeye ihracat yapmak artık çok kolay. Tedarika ile ürünlerinizi kurumsal alıcılara sunun, güvenli ödeme alın ve profesyonel lojistik desteği ile teslimat yapın.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 md:gap-12">
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-shadow duration-200">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-600 to-emerald-500 text-white rounded-xl flex items-center justify-center mb-6">
              <Globe className="w-8 h-8" />
            </div>
            <h3 className="font-semibold text-xl text-[#002222] mb-2">Hedef Pazarınızı Seçin</h3>
            <p className="text-sm text-gray-600">
              150+ ülke arasından hedef pazarınızı belirleyin ve kurumsal alıcılara ulaşmaya başlayın.
            </p>
            <a href="/seller/register" className="mt-4 inline-block px-6 py-2 bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-full">
              Pazarlara Ulaşın
            </a>
          </div>

          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-shadow duration-200">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 text-white rounded-xl flex items-center justify-center mb-6">
              <Package className="w-8 h-8" />
            </div>
            <h3 className="font-semibold text-xl text-[#002222] mb-2">Ürünlerinizi Listeleyin</h3>
            <p className="text-sm text-gray-600">
              Ürünlerinizi platforma ekleyin ve global B2B alıcılara anında görünür olun.
            </p>
            <a href="/seller/register" className="mt-4 inline-block px-6 py-2 bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-full">
              Ürün Ekle
            </a>
          </div>

          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-shadow duration-200">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-xl flex items-center justify-center mb-6">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="font-semibold text-xl text-[#002222] mb-2">Güvenli Ödeme Alın</h3>
            <p className="text-sm text-gray-600">
              Tüm ödemeleriniz garanti altında. Profesyonel lojistik desteği ile teslimatı tamamlayın.
            </p>
            <a href="/seller/register" className="mt-4 inline-block px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full">
              Ödeme Sistemi
            </a>
          </div>
        </div>

        <div className="mt-16">
          <div className="flex justify-center items-center gap-4">
            <Star className="text-emerald-600 w-8 h-8" />
            <h3 className="text-2xl font-semibold text-black">İlk İhracat Siparişinizi Alın</h3>
          </div>
          <p className="text-sm text-gray-800 mt-4">Binlerce satıcı Tedarika ile global pazarlarda büyüyor, siz de katılın.</p>
          <a
            href="/seller/register"
            className="inline-block bg-emerald-700 hover:bg-emerald-800 text-white px-10 py-4 rounded-full text-lg font-semibold transition shadow-lg hover:shadow-emerald-400/40 mt-6"
          >
            Ücretsiz Kayıt Olun
          </a>
        </div>
      </div>
    </section>
  );
};

export default GlobalOpportunitiesSection;
