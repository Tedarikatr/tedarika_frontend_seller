import { Globe, Package, Truck } from "lucide-react";

const ExportVurgulayanSection = () => {
  return (
    <section className="relative bg-white py-12 sm:py-20 md:py-32 px-4 sm:px-6 text-center overflow-hidden">
      <div className="absolute top-10 left-10 w-40 h-40 bg-emerald-400 opacity-30 rounded-full blur-3xl z-0" />
      <div className="absolute bottom-10 right-10 w-56 h-56 bg-indigo-400 opacity-20 rounded-full blur-3xl z-0" />

      <div className="max-w-6xl mx-auto relative z-10">
        <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-extrabold text-[#003636] mb-4 sm:mb-6">
          Profesyonel İhracat Çözümü{" "}
          <span className="text-emerald-600 bg-gradient-to-br from-emerald-400 to-green-700 bg-clip-text text-transparent">
            Türk Üreticiler
          </span>{" "}
          İçin
        </h2>

        <p className="text-lg text-gray-800 max-w-2xl mx-auto mb-12">
          <span className="text-emerald-700 font-semibold">Tedarika</span> ile ürünlerinizi global B2B alıcılarla buluşturun. Belgeler, lojistik, ödeme ve güvenli ticaret için tam destek sunuyoruz.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 md:gap-12">
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 text-white flex items-center justify-center mb-6">
              <Globe className="w-8 h-8" />
            </div>
            <h3 className="font-semibold text-xl text-[#002222] mb-2">150+ Ülkeye Erişim</h3>
            <p className="text-sm text-gray-600">
              Global B2B pazarlara anında erişin. Binlerce kurumsal alıcı ürünlerinizi bekliyor.
            </p>
            <a href="/seller/register" className="mt-4 inline-block px-6 py-2 bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-full">
              Pazarlara Ulaşın
            </a>
          </div>

          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 text-white flex items-center justify-center mb-6">
              <Package className="w-8 h-8" />
            </div>
            <h3 className="font-semibold text-xl text-[#002222] mb-2">Ürünlerinizi Ekleyin</h3>
            <p className="text-sm text-gray-600">
              Ürünlerinizi hızlıca yükleyin ve global alıcılara sunun. Sınırsız ürün listeleme.
            </p>
            <a href="/seller/register" className="mt-4 inline-block px-6 py-2 bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-full">
              Ürün Ekle
            </a>
          </div>

          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-700 text-white flex items-center justify-center mb-6">
              <Truck className="w-8 h-8" />
            </div>
            <h3 className="font-semibold text-xl text-[#002222] mb-2">Güvenli Ödeme Garantisi</h3>
            <p className="text-sm text-gray-600">
              Tüm ödemeler garanti altında. Lojistik desteği ve güvenli teslimat ile satış tamamlanır.
            </p>
            <a href="/seller/register" className="mt-4 inline-block px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-700 text-white rounded-full">
              Güvenli Ödeme
            </a>
          </div>
        </div>

        <div className="mt-12">
          <h3 className="text-2xl md:text-3xl font-bold text-[#003333] mb-6">
            Bugün Kayıt Olun, Yarın İlk İhracat Siparişinizi Alın
          </h3>
          <a
            href="/seller/register"
            className="inline-block bg-gradient-to-r from-emerald-600 to-teal-600 hover:bg-emerald-700 text-white px-10 py-4 rounded-full text-lg font-semibold transition shadow-lg hover:shadow-emerald-400/40"
          >
            Ücretsiz Mağaza Açın
          </a>
        </div>
      </div>
    </section>
  );
};

export default ExportVurgulayanSection;
