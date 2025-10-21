import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  createSubscription,
  checkoutSubscription,
  getCurrentSubscription,
  getSubscriptionPackages,
} from "@/api/sellerSubscriptionService";
import { refreshToken } from "@/api/sellerAuthService";

export default function SubscriptionPlans() {
  const [loadingId, setLoadingId] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  // Planları ve mevcut aboneliği getir
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

  // Abonelik başlat
  const handleSubscribe = async (packageId) => {
    setLoadingId(packageId);
    try {
      const selectedPlan = plans.find((p) => p.id === packageId);

      // Ücretsiz plan
      if (selectedPlan?.isFree || selectedPlan?.price === 0) {
        await createSubscription(packageId);
        toast.success("Ücretsiz abonelik başlatıldı.");
        await handleTokenRefresh();
        const current = await getCurrentSubscription();
        setSubscription(current);
        return;
      }

      // Ücretli plan
      const created = await createSubscription(packageId);
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

  // Token yenileme
  const handleTokenRefresh = async () => {
    try {
      const token = localStorage.getItem("sellerToken");
      if (!token) throw new Error("Mevcut token bulunamadı.");

      const refreshed = await refreshToken({ token });

      if (refreshed?.token) {
        localStorage.setItem("sellerToken", refreshed.token);

        if (refreshed?.subscriptionActive !== undefined)
          localStorage.setItem(
            "sellerSubscriptionActive",
            String(refreshed.subscriptionActive)
          );
        if (refreshed?.isthesystemactive !== undefined)
          localStorage.setItem(
            "sellerSystemActive",
            String(refreshed.isthesystemactive || refreshed.Status)
          );

        toast.success("Token yenilendi.");
        setTimeout(() => window.location.reload(), 1000);
      } else {
        toast.error("Token yenilenemedi. Lütfen tekrar giriş yapın.");
      }
    } catch (err) {
      console.error("Token yenileme hatası:", err);
      toast.error("Token yenileme başarısız. Lütfen tekrar giriş yapın.");
    }
  };

  // Yükleniyor durumu
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <p className="text-gray-600 animate-pulse text-lg">
          Planlar yükleniyor...
        </p>
      </div>
    );
  }

  // Aktif abonelik
  if (subscription?.isActive) {
    return (
      <div className="bg-white p-10 rounded-2xl shadow-lg text-center max-w-md mx-auto">
        <h3 className="text-2xl font-bold text-emerald-700 mb-3">
          Aktif Aboneliğiniz
        </h3>
        <p className="text-gray-700">
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
          Kalan Süre: {subscription.remainingDays ?? 0} gün
        </p>
      </div>
    );
  }

  // Abonelik listesi
  return (
    <section className="py-16 bg-gradient-to-b from-emerald-50 to-white text-gray-800 rounded-2xl">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-extrabold mb-4 text-[#003636]">
          Abonelik Planları
        </h2>
        <p className="text-gray-500 mb-12">
          İşinizi büyütmek için size en uygun planı seçin.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.length > 0 ? (
            plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative p-8 rounded-2xl border transition duration-300 hover:shadow-2xl bg-white ${
                  plan.isFree
                    ? "border-gray-200 hover:border-emerald-300"
                    : "border-emerald-500 hover:border-emerald-600"
                }`}
              >
                {plan.isFree && (
                  <div className="absolute top-4 right-4 bg-emerald-600 text-white text-xs px-3 py-1 rounded-full font-medium shadow">
                    Ücretsiz
                  </div>
                )}

                <h3 className="text-2xl font-bold text-emerald-700">
                  {plan.name}
                </h3>
                <p className="text-4xl font-extrabold mt-3 text-gray-900">
                  ₺{plan.price ?? 0}
                  <span className="text-base font-medium text-gray-500">
                    /ay
                  </span>
                </p>
                <p className="text-sm text-gray-600 mt-4 mb-6">
                  {plan.description || "Açıklama bulunmuyor."}
                </p>

                <ul className="text-left text-sm space-y-2 text-gray-700 border-t border-gray-100 pt-4 min-h-[130px]">
                  {plan.features?.length > 0 ? (
                    plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-emerald-600 mr-2">✓</span>
                        <span>{feature}</span>
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
                  className={`mt-8 w-full py-3 rounded-lg font-semibold text-white transition ${
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
            <p className="text-gray-500 col-span-3">
              Şu anda görüntülenecek plan bulunmuyor.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
