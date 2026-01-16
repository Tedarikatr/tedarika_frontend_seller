import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useToast } from "@/contexts/ToastContext";
import { Check } from "lucide-react";
import { getSubscriptionPackages } from "@/api/sellerSubscriptionService";

export default function PricingSection() {
  const navigate = useNavigate();
  const toast = useToast();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🎯 Sadece mevcut ücretsiz planı çek
  useEffect(() => {
    (async () => {
      try {
        const packageList = await getSubscriptionPackages();
        const freePlan = packageList?.find((p) => p.isFree || p.price === 0);
        setPlan(freePlan || packageList?.[0] || null);
      } catch (err) {
        console.error("Plan yüklenemedi:", err);
        toast.error("Plan bilgisi alınamadı.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 text-gray-500">
        Yükleniyor...
      </div>
    );
  }

  if (!plan) {
    return null;
  }

  const benefits = [
    "Sınırsız ürün yükleme",
    "Global alıcı ağına erişim",
    "Güvenli ödeme sistemi",
    "7/24 Türkçe müşteri desteği",
    "Gelişmiş analiz ve raporlama",
    "Otomatik kargo entegrasyonu"
  ];

  return (
    <section
      id="pricing"
      className="py-24 bg-gradient-to-br from-emerald-50 to-teal-50 scroll-mt-24"
    >
      <div className="max-w-5xl mx-auto px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-extrabold mb-6 text-[#002222]"
        >
          Ücretsiz Başlayın
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-lg md:text-xl text-gray-700 mb-16 max-w-2xl mx-auto"
        >
          Hiçbir ödeme yapmadan mağazanızı açın, ürünlerinizi yükleyin ve satışa başlayın.
          <br />
          <span className="font-semibold text-emerald-700">
            {plan.name || "6 Ay Ücretsiz Deneme"}
          </span>{" "}
          ile tüm özelliklere tam erişim.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl shadow-2xl p-10 max-w-lg mx-auto border border-emerald-100"
        >
          <div className="mb-6">
            <h3 className="text-3xl font-bold text-emerald-700 mb-2">
              {plan.name || "Freemium Paketi"}
            </h3>
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-5xl font-extrabold text-gray-900">
                ₺{plan.price ?? 0}
              </span>
              <span className="text-lg text-gray-500">/ay</span>
            </div>
            <p className="text-sm text-gray-600 mt-3">
              {plan.description || "İlk 6 ay tamamen ücretsiz"}
            </p>
          </div>

          <div className="border-t border-gray-200 pt-6 mb-8">
            <ul className="space-y-3 text-left">
              {benefits.map((benefit, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={() => navigate("/seller/register")}
            className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-emerald-500/50"
          >
            Hemen Başlayın
          </button>

          <p className="text-xs text-gray-500 mt-4">
            Kredi kartı bilgisi gerekmez • İstediğiniz zaman iptal edebilirsiniz
          </p>
        </motion.div>
      </div>
    </section>
  );
}
