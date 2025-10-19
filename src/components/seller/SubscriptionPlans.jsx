import { useEffect, useState } from "react";
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
    description: "En yüksek verimlilik ve destekle tüm gücümüz yanınızda.",
    features: ["Asistan hesapları", "Kampanya yönetimi", "Özel destek"],
  },
];

export default function SubscriptionPlans() {
  const [loadingId, setLoadingId] = useState(null);
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const sub = await getCurrentSubscription();
        setSubscription(sub);
      } catch (error) {
        console.error("Abonelik durumu alınamadı:", error);
      }
    })();
  }, []);

  const handleSubscribe = async (packageId, period = "Yearly") => {
    setLoadingId(packageId);
    try {
      const created = await createSubscription(packageId, period);
      const subscriptionId = created?.subscriptionId || created?.id;

      if (!subscriptionId) throw new Error("Abonelik oluşturulamadı.");

      const checkout = await checkoutSubscription(subscriptionId);
      const paymentUrl = checkout?.paymentPageUrl || checkout?.url;

      if (!paymentUrl) throw new Error("Ödeme bağlantısı alınamadı.");

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

  // ✅ Aktif abonelik varsa
  if (subscription?.isActive) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow text-center">
        <h3 className="text-2xl font-bold text-emerald-700">
          Aktif Aboneliğiniz Var 🎉
        </h3>
        <p className="text-gray-700 mt-2">
          Plan:{" "}
          <span className="font-semibold text-emerald-600">
            {subscription.packageName || "Bilinmiyor"}
          </span>
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Bitiş Tarihi:{" "}
          {new Date(subscription.endDate).toLocaleDateString("tr-TR")}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {subscription.remainingDays} gün kaldı
        </p>
      </div>
    );
  }

  // 🔄 Süresi dolmuşsa
  if (subscription && !subscription.isActive) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow text-center border border-red-200">
        <h3 className="text-2xl font-bold text-red-600">
          Aboneliğiniz Sona Erdi 💡
        </h3>
        <p className="text-gray-700 mt-2">
          Plan:{" "}
          <span className="font-semibold text-red-600">
            {subscription.packageName || "Bilinmiyor"}
          </span>
        </p>
        <button
          onClick={() =>
            handleSubscribe(subscription.subscriptionPackageId || 1, "Yearly")
          }
          className="mt-5 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition"
        >
          Aboneliği Yenile
        </button>
      </div>
    );
  }

  // 📦 Aboneliği olmayan kullanıcılar için plan listesi
  return (
    <div className="py-10 bg-gradient-to-b from-green-50 to-white text-gray-800 rounded-2xl shadow-sm">
      <h2 className="text-3xl font-extrabold text-center mb-2 text-[#003636]">
        Abonelik Planları
      </h2>
      <p className="text-center text-gray-500 mb-10">
        Tedarika ile işinizi büyütmeye bugün başlayın.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 md:px-10 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative p-6 rounded-2xl border transition duration-300 hover:shadow-xl ${
              plan.highlight
                ? "bg-white border-emerald-500 shadow-lg"
                : "bg-gray-50 border-gray-200"
            }`}
          >
            {plan.highlight && (
              <span className="absolute top-0 right-0 mt-4 mr-4 bg-emerald-600 text-white text-xs px-3 py-1 rounded-full font-semibold shadow">
                En Popüler
              </span>
            )}

            <h3 className="text-xl font-bold text-emerald-700">{plan.name}</h3>
            <p className="text-3xl my-4 font-extrabold">{plan.price}</p>
            <p className="mb-6 text-sm text-gray-600">{plan.description}</p>

            <ul className="text-left text-sm space-y-2 text-gray-700">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start">
                  <span className="text-emerald-600 mr-2">✔</span>
                  {feature}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSubscribe(plan.id, "SemiAnnual")}
              disabled={loadingId === plan.id}
              className={`mt-6 w-full py-2.5 rounded-lg font-semibold text-white transition ${
                loadingId === plan.id
                  ? "bg-emerald-400 cursor-wait"
                  : "bg-emerald-600 hover:bg-emerald-700"
              }`}
            >
              {loadingId === plan.id ? "İşleniyor..." : "Abone Ol"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
