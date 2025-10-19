import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  createSubscription,
  checkoutSubscription,
  getCurrentSubscription,
} from "@/api/sellerSubscriptionService";

const plans = [
  {
    id: 1,
    name: "Başlangıç",
    price: "₺0",
    description:
      "Mağazanızı keşfetmeye başlayın, ürünlerinizi listeleyin ve Tedarika'yı deneyin.",
    features: [
      "Ücretsiz mağaza açılışı",
      "Sınırsız ürün listeleme",
      "Temel istatistik görünümü",
    ],
  },
  {
    id: 2,
    name: "Standart",
    price: "₺299",
    highlight: true,
    description:
      "Markanızı yansıtın, satışlarınızı artırın ve işinizi büyütün.",
    features: [
      "Gelişmiş raporlar",
      "Özel mağaza sayfası",
      "Stok & fiyat yönetimi",
    ],
  },
  {
    id: 3,
    name: "Premium",
    price: "₺499",
    description:
      "En yüksek verimlilik ve destekle tüm gücümüz yanınızda.",
    features: [
      "Asistan hesapları",
      "Kampanya yönetimi",
      "Özel destek",
    ],
  },
];

export default function SubscriptionPage() {
  const [loadingId, setLoadingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const verifySubscription = async () => {
      const params = new URLSearchParams(window.location.search);
      const status = params.get("status");

      try {
        const result = await getCurrentSubscription();
        if (result?.isActive) {
          if (status === "success") {
            toast.success("Ödemeniz başarıyla alındı.");
          } else if (status === "fail") {
            toast.error("Ödeme işlemi başarısız veya iptal edildi.");
            return;
          }
          navigate("/seller/dashboard");
        }
      } catch (error) {
        console.error("Abonelik kontrolü sırasında hata:", error);
        toast.error("Abonelik durumu alınamadı.");
      }
    };

    verifySubscription();
  }, [navigate]);

  const handleSubscribe = async (packageId, period = "Yearly") => {
    setLoadingId(packageId);

    try {
      const created = await createSubscription(packageId, period);
      const subscriptionId = created?.subscriptionId || created?.id;

      if (!subscriptionId)
        throw new Error("Abonelik oluşturulamadı.");

      const checkout = await checkoutSubscription(subscriptionId);
      const paymentUrl = checkout?.paymentPageUrl || checkout?.url;

      if (!paymentUrl)
        throw new Error("Ödeme bağlantısı alınamadı.");

      toast.success("İyzico ödeme sayfasına yönlendiriliyorsunuz...");
      window.location.href = paymentUrl;
    } catch (err) {
      console.error("Abonelik başlatılamadı:", err);
      toast.error(
        err?.message || "İşlem sırasında beklenmedik bir hata oluştu."
      );
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <section className="min-h-screen py-20 bg-gradient-to-b from-green-950 to-green-800 text-white">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold mb-4">Abonelik Planları</h2>
        <p className="text-lg mb-12 text-green-200">
          Tedarika ile işinizi büyütmeye bugün başlayın
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative p-8 rounded-2xl shadow-2xl transform transition duration-300 hover:scale-105 ${
                plan.highlight
                  ? "bg-white text-green-900 border-4 border-green-500"
                  : "bg-green-100 text-gray-900 border"
              }`}
            >
              {plan.highlight && (
                <span className="absolute top-0 right-0 mt-4 mr-4 bg-green-600 text-white text-xs px-3 py-1 rounded-full font-semibold shadow">
                  En Popüler
                </span>
              )}

              <h3 className="text-xl font-bold text-green-700">{plan.name}</h3>
              <p className="text-3xl my-4 font-extrabold">{plan.price}</p>
              <p className="mb-6 text-sm text-gray-600">{plan.description}</p>
              <ul className="text-left text-sm space-y-2 text-gray-700">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-green-600 mr-2">✔</span>
                    {feature}
                  </li>
                ))}
              </ul>

              {/* Abonelik tipi seçimi (SemiAnnual / Yearly) */}
              <div className="mt-4">
                <select
                  id={`period-${plan.id}`}
                  className="w-full border rounded-md py-2 px-3 text-sm text-gray-700"
                  defaultValue="Yearly"
                  onChange={(e) =>
                    handleSubscribe(plan.id, e.target.value)
                  }
                  disabled={!!loadingId}
                >
                  <option value="Yearly">Yıllık</option>
                  <option value="SemiAnnual">6 Aylık</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
