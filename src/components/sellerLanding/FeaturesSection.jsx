import { Rocket, BadgeCheck, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: Rocket,
    bg: "from-green-400 to-emerald-600",
    title: "Hızlı Başlangıç",
    desc: "Kaydını birkaç dakikada tamamla, ürünlerini anında satışa sun.",
  },
  {
    icon: BadgeCheck,
    bg: "from-yellow-400 to-orange-500",
    title: "Geniş Erişim",
    desc: "Tedarika'nın global alıcı ağıyla binlerce B2B müşteriye ulaş.",
  },
  {
    icon: ShieldCheck,
    bg: "from-purple-400 to-indigo-600",
    title: "Güvenli Altyapı",
    desc: "Sipariş, ödeme ve kargo süreçlerini güvenle yönet. Her adımda koruma altında ol.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="relative bg-white py-16 sm:py-20 md:py-28 px-4 sm:px-6 overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" />
      <div className="absolute top-10 left-10 w-40 h-40 bg-emerald-300 opacity-20 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-56 h-56 bg-indigo-300 opacity-20 rounded-full blur-3xl" />

      <div className="max-w-6xl mx-auto relative z-10 text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#002222] mb-4 sm:mb-5">
          Neden{" "}
          <span className="bg-gradient-to-br from-emerald-400 to-green-700 bg-clip-text text-transparent">
            Tedarika?
          </span>
        </h2>

        <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto mb-10 sm:mb-16 px-2">
          Sadece bir satış platformu değil, işinizi büyütmenize yardımcı olan eksiksiz bir B2B çözümü.
          <br />
          <span className="text-emerald-700 font-semibold">
            Teknoloji, güven ve profesyonel destek tek çatı altında.
          </span>
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
          {features.map(({ icon: Icon, title, desc, bg }, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 sm:p-8 shadow-md hover:shadow-emerald-200/70 transition-shadow duration-200 group"
            >
              <div
                className={`w-14 h-14 mx-auto rounded-xl flex items-center justify-center mb-6 bg-gradient-to-br ${bg} shadow-inner`}
              >
                <Icon className="text-white w-7 h-7" />
              </div>
              <h3 className="font-semibold text-2xl text-[#002222] mb-3">{title}</h3>
              <p className="text-gray-600 leading-relaxed text-base">{desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#003333] mb-4 sm:mb-6">
            Bugün başlayın, yarın ilk siparişinizi alın
          </h3>
          <a
            href="/seller/register"
            className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-4 rounded-full text-lg font-semibold transition shadow-lg hover:shadow-emerald-400/40"
          >
            Ücretsiz Kaydol
          </a>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
