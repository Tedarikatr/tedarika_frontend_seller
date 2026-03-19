import { Globe, Package, Truck, DollarSign } from "lucide-react";

const ExportMadeEasySection = () => {
  return (
    <section className="relative bg-white py-12 sm:py-16 md:py-24 px-4 sm:px-6 text-center overflow-hidden">
      <div className="absolute top-10 left-10 w-40 h-40 bg-emerald-300 opacity-30 rounded-full blur-3xl z-0" />
      <div className="absolute bottom-10 right-10 w-56 h-56 bg-indigo-300 opacity-20 rounded-full blur-3xl z-0" />

      <div className="max-w-6xl mx-auto relative z-10">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#003636] mb-4 sm:mb-6 px-2">
          4 Adımda Profesyonel İhracat Süreciniz Başlasın
        </h2>

        <p className="text-gray-600 text-lg mb-10 max-w-2xl mx-auto">
          Tedarika ile ihracat süreci basit ve güvenli. Belgeler, lojistik ve ödemeler için profesyonel destek alın.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-md hover:shadow-xl transition-shadow duration-200">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-600 to-green-700 text-white flex items-center justify-center mb-6">
              <Globe className="w-8 h-8" />
            </div>
            <h3 className="font-semibold text-xl text-[#002222] mb-2">Hedef Pazar Belirleyin</h3>
            <p className="text-sm text-gray-600">
              150+ ülke arasından hedef pazarınızı seçin ve B2B alıcılara ulaşın.
            </p>
            <a href="/seller/register" className="mt-4 inline-block px-6 py-2 bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-full">
              Pazar Seç
            </a>
          </div>

          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-md hover:shadow-xl transition-shadow duration-200">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 text-white flex items-center justify-center mb-6">
              <Package className="w-8 h-8" />
            </div>
            <h3 className="font-semibold text-xl text-[#002222] mb-2">Ürün Ekleyin</h3>
            <p className="text-sm text-gray-600">
              Ürünlerinizi platforma yükleyin ve global alıcılara görünür olun.
            </p>
            <a href="/seller/register" className="mt-4 inline-block px-6 py-2 bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-full">
              Ürün Ekle
            </a>
          </div>

          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-md hover:shadow-xl transition-shadow duration-200">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center mb-6">
              <Truck className="w-8 h-8" />
            </div>
            <h3 className="font-semibold text-xl text-[#002222] mb-2">Lojistik ve Ödeme</h3>
            <p className="text-sm text-gray-600">
              Profesyonel kargo entegrasyonu ve güvenli ödeme sistemi ile satış tamamlanır.
            </p>
            <a href="/seller/register" className="mt-4 inline-block px-6 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-full">
              Lojistik
            </a>
          </div>

          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-md hover:shadow-xl transition-shadow duration-200">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-green-400 to-teal-600 text-white flex items-center justify-center mb-6">
              <DollarSign className="w-8 h-8" />
            </div>
            <h3 className="font-semibold text-xl text-[#002222] mb-2">Güvenli Ödeme Alın</h3>
            <p className="text-sm text-gray-600">
              Siparişler tamamlandığında ödemeleriniz garanti altında hesabınıza yatırılır.
            </p>
            <a href="/seller/register" className="mt-4 inline-block px-6 py-2 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-full">
              Ödeme Sistemi
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExportMadeEasySection;
