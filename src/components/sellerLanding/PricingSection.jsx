import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const pricingPlans = [
  {
    name: "Başlangıç",
    price: "₺0",
    description: "Mağazanızı keşfetmeye başlayın, ürünlerinizi listeleyin ve Tedarika'yı deneyimleyin.",
    features: [
      "Ücretsiz mağaza açılışı",
      "Sınırsız ürün listeleme",
      "Temel istatistik görünümü",
      "Kargo & teslimat entegrasyonu",
      "Temel müşteri mesajlaşma",
    ],
  },
  {
    name: "Standart",
    price: "₺299",
    highlight: true,
    description: "Markanızı yansıtın, satışlarınızı artırın ve güçlü entegrasyonlarla işinizi büyütün.",
    features: [
      "Başlangıç paketine ek olarak:",
      "Gelişmiş satış raporları",
      "Özel mağaza sayfası & markalama",
      "Stok & fiyat yönetimi araçları",
      "Sipariş ve iade yönetimi",
      "WhatsApp & e-posta entegrasyonu",
      "Mobil panel erişimi",
    ],
  },
  {
    name: "Premium",
    price: "₺499",
    description: "En yüksek verimlilik ve otomasyonla Tedarika’nın tüm gücünden faydalanın.",
    features: [
      "Standart pakete ek olarak:",
      "Asistan hesabı yönetimi",
      "İleri düzey müşteri analizleri",
      "Kampanya ve indirim yönetimi",
      "Otomatik fiyat optimizasyonu",
      "Özel destek ve danışmanlık",
    ],
  },
];

export default function PricingSection() {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-gradient-to-br from-green-900 via-emerald-800 to-green-900 text-white">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-4xl font-extrabold mb-4 drop-shadow">Satışa Güçlü Bir Başlangıç Yapın</h2>
        <p className="mb-16 text-lg text-gray-200 max-w-2xl mx-auto">
          İster yeni başlıyor olun, ister markanızı büyütmek isteyin — Tedarika sizin için burada. İhtiyacınıza uygun planı seçin, satışa başlayın.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.2 }}
              className={`rounded-2xl p-8 text-left shadow-xl bg-white relative overflow-hidden hover:scale-[1.02] transition-transform duration-300 ${
                plan.highlight ? "border-4 border-emerald-500 ring-2 ring-green-300 z-10" : ""
              }`}
            >
              {plan.highlight && (
                <div className="absolute top-0 right-0 bg-emerald-500 text-white text-xs px-3 py-1 rounded-bl-xl font-semibold">
                  En Popüler
                </div>
              )}
              <h3 className="text-2xl font-bold text-green-700 mb-2">{plan.name}</h3>
              <p className="text-4xl font-extrabold text-gray-800 mb-2">
                {plan.price}
                <span className="text-base font-medium text-gray-500"> /ay</span>
              </p>
              <p className="text-gray-600 mb-6">{plan.description}</p>
              <ul className="space-y-2 text-sm text-gray-700">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-green-600 font-bold mr-2">✔</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => navigate("/seller/apply")}
                className="mt-6 w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg font-semibold transition"
              >
                Hemen Başla
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
