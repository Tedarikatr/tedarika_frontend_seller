import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  createSubscription,
  checkoutSubscription,
  getCurrentSubscription,
  getSubscriptionPackages,
} from "@/api/sellerSubscriptionService";

export default function SubscriptionPlans() {
  const [loadingId, setLoadingId] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState({}); // 👈 her plan için ayrı period sakla

  // 🎯 Planları ve mevcut aboneliği getir
  useEffect(() => {
    (async () => {
      try {
        const [packageList, currentSub] = await Promise.all([
          getSubscriptionPackages(),
          getCurrentSubscription().catch(() => null),
        ]);
        setPlans(packageList || []);
        setSubscription(currentSub || null);
      } catch (error) {
        console.error("Abonelik bilgileri alınamadı:", error);
        toast.error("Abonelik planları yüklenemedi.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // 💳 Abone ol
  const handleSubscribe = async (packageId) => {
    const period = selectedPeriod[packageId] || "SemiAnnual";
    setLoadingId(packageId);

    try {
      const selectedPlan = plans.find((p) => p.id === packageId);

      // Ücretsiz plan
      if (selectedPlan?.isFree || selectedPlan?.price === 0) {
        await createSubscription(packageId, period);
        toast.success("Ücretsiz abonelik başlatıldı 🎉");
        const current = await getCurrentSubscription();
        setSubscription(current);
        return;
      }

      // Ücretli plan
      const created = await createSubscription(packageId, period);
      const subscriptionId = created?.subscriptionId || created?.id;

      if (!subscriptionId) throw new Error("Abonelik oluşturulamadı.");

      const checkout = await checkoutSubscription(subscriptionId);
      const paymentUrl = checkout?.paymentPageUrl || checkout?.url;

      if (!paymentUrl) throw new Error("Ödeme bağlantısı alınamadı.");

      toast.success("Ödeme sayfasına yönlendiriliyorsunuz...");
      window.location.href = paymentUrl;
    } catch (err) {
      console.error("Abonelik başlatılamadı:", err);
      toast.error(err?.message || "İşlem sırasında hata oluştu.");
    } finally {
      setLoadingId(null);
    }
  };

  // ⏳ Yükleniyor ekranı
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <p className="text-gray-600 animate-pulse">Planlar yükleniyor...</p>
      </div>
    );
  }

  // ✅ Aktif abonelik
  if (subscription?.isActive) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow text-center">
        <h3 className="text-2xl font-bold text-emerald-700">
          Aktif Aboneliğiniz 🎉
        </h3>
        <p className="text-gray-700 mt-2">
          Plan:{" "}
          <span className="font-semibold text-emerald-600">
            {subscription.packageName || "Bilinmiyor"}
          </span>
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Bitiş Tarihi:{" "}
          {subscription.endDate
            ? new Date(subscription.endDate).toLocaleDateString("tr-TR")
            : "-"}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {subscription.remainingDays ?? 0} gün kaldı
        </p>
      </div>
    );
  }

  // ❌ Abone değilse plan listesi
  return (
    <div className="py-10 bg-gradient-to-b from-green-50 to-white text-gray-800 rounded-2xl shadow-sm">
      <h2 className="text-3xl font-extrabold text-center mb-2 text-[#003636]">
        Abonelik Planları
      </h2>
      <p className="text-center text-gray-500 mb-10">
        Tedarika ile işinizi büyütmeye bugün başlayın.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 md:px-10 max-w-6xl mx-auto">
        {plans.length > 0 ? (
          plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative p-6 rounded-2xl border transition duration-300 hover:shadow-xl ${
                plan.isFree
                  ? "bg-gray-50 border-gray-200"
                  : "bg-white border-emerald-500 shadow-lg"
              }`}
            >
              {plan.isFree && (
                <span className="absolute top-0 right-0 mt-4 mr-4 bg-emerald-600 text-white text-xs px-3 py-1 rounded-full font-semibold shadow">
                  Ücretsiz
                </span>
              )}

              <h3 className="text-xl font-bold text-emerald-700">{plan.name}</h3>
              <p className="text-3xl my-4 font-extrabold">₺{plan.price ?? 0}</p>
              <p className="mb-6 text-sm text-gray-600">{plan.description}</p>

              {/* 🔽 Period seçimi */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Abonelik Süresi
                </label>
                <select
                  value={selectedPeriod[plan.id] || "SemiAnnual"}
                  onChange={(e) =>
                    setSelectedPeriod({
                      ...selectedPeriod,
                      [plan.id]: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="SemiAnnual">6 Aylık</option>
                  <option value="Yearly">Yıllık</option>
                </select>
              </div>

              <ul className="text-left text-sm space-y-2 text-gray-700">
                {plan.features?.length > 0 ? (
                  plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-emerald-600 mr-2">✔</span>
                      {feature}
                    </li>
                  ))
                ) : (
                  <li className="text-gray-400 italic">
                    Özellik bilgisi bulunmuyor.
                  </li>
                )}
              </ul>

              <button
                onClick={() => handleSubscribe(plan.id)}
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
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-3">
            Şu anda plan bulunamadı.
          </p>
        )}
      </div>
    </div>
  );
}
