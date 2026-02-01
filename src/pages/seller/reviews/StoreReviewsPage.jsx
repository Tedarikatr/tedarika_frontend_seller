import React, { useEffect, useState, useMemo } from "react";
import { fetchStoreReviews, replyToStoreReview } from "@/api/sellerReviewService";
import StoreReviewItem from "@/components/storeProducts/StoreReviewItem";
import { LoaderCircle, Star, MessageSquare, Sparkles, TrendingUp, Award } from "lucide-react";
import toast from "react-hot-toast";

const StoreReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const data = await fetchStoreReviews();
      setReviews(data);
    } catch (err) {
      console.error("Yorumlar alınamadı:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (reviewId, reply) => {
    try {
      await replyToStoreReview(reviewId, reply);
      toast.success("Yanıt gönderildi.");
      loadReviews();
    } catch (err) {
      toast.error("Yanıt gönderilemedi.");
      console.error("Yanıt gönderme hatası:", err);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  // Calculate stats
  const stats = useMemo(() => {
    const total = reviews.length;
    const avgRating = total > 0 
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(1)
      : 0;
    const replied = reviews.filter(r => r.sellerReply).length;
    const fiveStars = reviews.filter(r => r.rating === 5).length;
    
    return { total, avgRating, replied, fiveStars };
  }, [reviews]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-amber-50/30 px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero Header */}
        <header className="mb-6 sm:mb-8 relative bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 rounded-2xl sm:rounded-3xl shadow-2xl px-4 sm:px-6 md:px-8 py-8 sm:py-10 md:py-12 text-center overflow-hidden">
          {/* Dekoratif Arka Plan */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
          <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-40 h-40 bg-amber-400/20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-xl animate-pulse flex-shrink-0">
                <Star className="w-6 h-6 sm:w-8 sm:h-8 text-white fill-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                Mağaza Yorumları
              </h1>
              <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-300 animate-pulse hidden sm:block" />
            </div>
            <p className="text-emerald-100 text-sm sm:text-base md:text-lg font-medium px-2">
              Müşterilerinizin mağaza deneyimlerine verdiği puan ve yorumları inceleyin
            </p>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={MessageSquare}
            label="Toplam Yorum"
            value={stats.total}
            gradient="from-blue-500 to-indigo-500"
            bgGradient="from-blue-50 to-indigo-50"
          />
          <StatCard
            icon={Star}
            label="Ortalama Puan"
            value={stats.avgRating}
            gradient="from-amber-500 to-yellow-500"
            bgGradient="from-amber-50 to-yellow-50"
          />
          <StatCard
            icon={TrendingUp}
            label="Yanıtlanan"
            value={stats.replied}
            gradient="from-green-500 to-emerald-500"
            bgGradient="from-green-50 to-emerald-50"
          />
          <StatCard
            icon={Award}
            label="5 Yıldız"
            value={stats.fiveStars}
            gradient="from-purple-500 to-pink-500"
            bgGradient="from-purple-50 to-pink-50"
          />
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-lg">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-xl animate-spin mb-4">
              <LoaderCircle className="w-8 h-8 text-white" />
            </div>
            <p className="text-gray-500 text-lg font-medium">Yorumlar yükleniyor...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-lg p-12 text-center border-2 border-gray-200">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center mx-auto mb-6 shadow-lg">
              <MessageSquare className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Henüz Yorum Yok</h3>
            <p className="text-gray-600">
              Mağazanız hakkında yapılan yorumlar burada yer alacak.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <StoreReviewItem key={review.id} review={review} onReply={handleReply} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ icon: Icon, label, value, gradient, bgGradient }) => (
  <div className={`bg-gradient-to-br ${bgGradient} rounded-2xl p-6 border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-600 text-sm font-semibold mb-2">{label}</p>
        <p className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900">{value}</p>
      </div>
      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
        <Icon className="w-7 h-7 text-white" />
      </div>
    </div>
  </div>
);

export default StoreReviewsPage;
