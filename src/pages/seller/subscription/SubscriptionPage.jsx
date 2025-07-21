import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { activateSubscription } from "@/api/sellerSubscriptionService";
import { refreshToken } from "@/api/sellerAuthService";
import { toast } from "react-hot-toast";

const plans = [
  {
    id: 1,
    name: "Başlangıç",
    price: "₺0",
    description:
      "Mağazanızı keşfetmeye başlayın, ürünlerinizi listeleyin ve Tedarika'yı deneyimleyin.",
    features: [
      "Ücretsiz mağaza açılışı",
      "Sınırsız ürün listeleme",
      "Temel istatistik görünümü",
      "Kargo & teslimat entegrasyonu",
      "Temel müşteri mesajlaşma",
    ],
  },
  {
    id: 2,
    name: "Standart",
    price: "₺299",
    highlight: true,
    description:
      "Markanızı yansıtın, satışlarınızı artırın ve güçlü entegrasyonlarla işinizi büyütün.",
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
    id: 3,
    name: "Premium",
    price: "₺499",
    description:
      "En yüksek verimlilik ve otomasyonla Tedarika’nın tüm gücünden faydalanın.",
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

export default function SubscriptionPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("sellerToken");
    if (raw) {
      try {
        const payload = JSON.parse(atob(raw.split(".")[1]));
        const isActive = payload?.SubscriptionActive === true || payload?.SubscriptionActive === "true";

        if (isActive) {
          const hasCompany = payload?.HasCompany === true || payload?.HasCompany === "true";
          navigate(hasCompany ? "/seller/dashboard" : "/seller/company");
        }
      } catch (err) {
        console.error("🔑 Token çözümlenemedi:", err);
      }
    }
  }, [navigate]);

  const handleSubscribe = async (packageId) => {
    try {
      setIsLoading(true);

      await activateSubscription({
        subscriptionPackageId: packageId,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        paymentReference: "initial-subscription",
      });

      const oldToken = localStorage.getItem("sellerToken");
      if (!oldToken) {
        toast.error("Token bulunamadı");
        setIsLoading(false);
        return;
      }

      const response = await refreshToken({ token: oldToken });
      const newToken = response.token;

      if (newToken) {
        localStorage.setItem("sellerToken", newToken);
        toast.success("Abonelik başarıyla başlatıldı");

        const payload = JSON.parse(atob(newToken.split(".")[1]));
        const hasCompany = payload?.HasCompany === true || payload?.HasCompany === "true";

        setTimeout(() => {
          navigate(hasCompany ? "/seller/dashboard" : "/seller/company");
        }, 800);
      } else {
        toast.error("Yeni token alınamadı");
        setIsLoading(false);
      }
    } catch (err) {
      console.error(err);
      toast.error("Abonelik başlatılamadı");
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-900 text-white text-xl font-semibold">
        Abonelik başlatılıyor, lütfen bekleyin...
      </div>
    );
  }

  return (
    <section className="py-20 bg-green-900 text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-4">Satışa Güçlü Bir Başlangıç Yap</h2>
        <p className="mb-16 text-lg">
          İster yeni başlıyor olun, ister markanızı büyütmek isteyin — Tedarika sizin için burada.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-2xl shadow-lg p-8 bg-white text-gray-800 transition-all ${
                plan.highlight ? "border-4 border-green-500 scale-105" : "border"
              }`}
            >
              <h3 className="text-xl font-semibold text-green-700">{plan.name}</h3>
              <p className="text-4xl font-bold my-4">
                {plan.price} <span className="text-base font-medium text-gray-600">/ay</span>
              </p>
              <p className="mb-6 text-gray-600">{plan.description}</p>
              <ul className="space-y-2 text-left text-sm text-gray-700">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-green-600 font-bold mr-2">✔</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleSubscribe(plan.id)}
                className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition"
              >
                Hemen Başla
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
