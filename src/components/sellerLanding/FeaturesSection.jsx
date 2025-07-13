import { Rocket, BadgeCheck, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: <Rocket className="text-white w-6 h-6" />,
    bg: "bg-gradient-to-br from-green-400 to-emerald-600",
    title: "Hızlı Başlangıç",
    desc: "Kaydını birkaç dakikada tamamla, ürünlerini hemen satışa sun.",
  },
  {
    icon: <BadgeCheck className="text-white w-6 h-6" />,
    bg: "bg-gradient-to-br from-yellow-400 to-orange-500",
    title: "Geniş Erişim",
    desc: "Tedarika'nın kurumsal ağı sayesinde binlerce alıcıya tek tıkla ulaş.",
  },
  {
    icon: <ShieldCheck className="text-white w-6 h-6" />,
    bg: "bg-gradient-to-br from-purple-400 to-indigo-600",
    title: "Güvenli Altyapı",
    desc: "Tüm siparişlerinizi, ödemelerinizi ve operasyonlarınızı güvenle yönetin.",
  },
];

const FeaturesSection = () => (
  <section className="bg-emerald-50 py-24 px-6">
    <div className="max-w-6xl mx-auto">
      {/* Başlık */}
      <h2 className="text-4xl font-extrabold text-center text-[#003636] mb-4">Neden Tedarika?</h2>
      <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto text-lg">
        Tedarika, size sadece bir mağaza değil; <span className="font-semibold text-emerald-700">güvenli, hızlı ve erişilebilir bir satış altyapısı</span> sunar.
      </p>

      {/* Özellik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map(({ icon, title, desc, bg }, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${bg} shadow-inner`}>
              {icon}
            </div>
            <h3 className="font-semibold text-xl text-[#002222] mb-2">{title}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection;
