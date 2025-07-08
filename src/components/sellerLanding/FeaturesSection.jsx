// src/components/sellerLanding/FeaturesSection.jsx
import { Rocket, BadgeCheck, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: <Rocket className="text-white w-6 h-6" />,
    bg: "bg-gradient-to-br from-green-400 to-emerald-600",
    title: "Hızlı Başlangıç",
    desc: "Kaydını tamamla, hemen mağazanı oluştur."
  },
  {
    icon: <BadgeCheck className="text-white w-6 h-6" />,
    bg: "bg-gradient-to-br from-yellow-400 to-orange-500",
    title: "Geniş Erişim",
    desc: "Tedarika'nın ağı ile daha çok müşteriye ulaş."
  },
  {
    icon: <ShieldCheck className="text-white w-6 h-6" />,
    bg: "bg-gradient-to-br from-purple-400 to-indigo-600",
    title: "Güvenli Altyapı",
    desc: "Siparişlerinizi güvenle yönetin, satışa odaklanın."
  }
];

const FeaturesSection = () => (
  <section className="bg-emerald-50 py-20 px-6">
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-12">Neden Tedarika?</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map(({ icon, title, desc, bg }, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${bg} shadow-inner`}>
              {icon}
            </div>
            <h3 className="font-semibold text-lg text-[#003636] mb-1">{title}</h3>
            <p className="text-sm text-gray-600">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection;
