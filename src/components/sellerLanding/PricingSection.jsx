import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { getSubscriptionPackages } from "@/api/sellerSubscriptionService";

export default function PricingSection() {
  const navigate = useNavigate();
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
      <div className="flex justify-center items-center py-20 text-gray-200">
        Yükleniyor...
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="flex justify-center items-center py-20 text-gray-200">
        Şu anda mevcut bir plan bulunamadı.
      </div>
    );
  }

  return (
    <section className="py-24 bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-600 text-white">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-extrabold mb-6 drop-shadow"
        >
          Şimdi Mağazanı Ücretsiz Aç
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-lg md:text-xl text-gray-200 mb-16 max-w-2xl mx-auto"
        >
          Hiçbir ücret ödemeden mağazanı oluştur, ürünlerini listele ve satışa
          başla.{" "}
          <span className="font-semibold text-white">
            {plan.name || "6 Aylık Ücretsiz Deneme Paketi"}
          </span>{" "}
          ile Tedarika dünyasını keşfet!
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white text-gray-800 rounded-2xl shadow-xl p-8 max-w-md mx-auto"
        >
          <h3 className="text-2xl font-bold text-emerald-700">
            {plan.name || "Freemium"}
          </h3>
          <p className="text-4xl font-extrabold text-gray-900 mt-2">
            ₺{plan.price ?? 0}
            <span className="text-base font-medium text-gray-500"> /ay</span>
          </p>
          <p className="text-sm text-gray-600 mt-3">
            {plan.description || "6 aylık ücretsiz deneme paketi."}
          </p>

          <p className="text-sm text-gray-400 italic mt-4">
            Özellik bilgisi bulunmuyor.
          </p>

          <button
            onClick={() => navigate("/seller/register")}
            className="mt-6 w-full py-3 rounded-lg font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition transform hover:scale-105"
          >
            Hemen Başla
          </button>
        </motion.div>
      </div>
    </section>
  );
}
