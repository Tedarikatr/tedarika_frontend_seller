import React, { useEffect, useState } from "react";
import { fetchStoreReviews, replyToStoreReview } from "@/api/sellerReviewService";
import StoreReviewItem from "@/components/storeProducts/StoreReviewItem";
import { LoaderCircle } from "lucide-react";
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

  return (
    <section className="max-w-5xl mx-auto px-4 py-8">
      {/* Başlık */}
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-[#003333]">Mağaza Yorumları</h1>
        <p className="text-sm text-gray-500 mt-1">Müşterilerinizin mağaza deneyimlerine verdiği puan ve yorumları inceleyin.</p>
      </div>

      {/* İçerik */}
      {loading ? (
        <div className="flex justify-center items-center h-40 text-gray-500">
          <LoaderCircle className="animate-spin w-6 h-6 mr-2" />
          Yorumlar yükleniyor...
        </div>
      ) : reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-12 text-gray-500">
          <img src="/tedarika/assets/images/empty-state.svg" alt="Boş" className="w-32 mb-4 opacity-80" />
          <p className="text-lg font-medium">Henüz yorum yapılmamış</p>
          <p className="text-sm mt-1">Mağazanız hakkında yapılan yorumlar burada yer alacak.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <StoreReviewItem key={review.id} review={review} onReply={handleReply} />
          ))}
        </div>
      )}
    </section>
  );
};

export default StoreReviewsPage;
