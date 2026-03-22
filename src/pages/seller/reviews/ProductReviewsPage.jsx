import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProductReviews, replyToProductReview } from "@/api/sellerReviewService";
import ProductReviewItem from "@/components/storeProducts/ProductReviewItem";
import { MessageSquare } from "lucide-react";
import TedarikaLoader from "@/components/ui/TedarikaLoader";
import toast from "react-hot-toast";

const ProductReviewsPage = ({ productId: defaultId }) => {
  const params = useParams();
  const productId = parseInt(params.productId || defaultId);

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const data = await fetchProductReviews(productId);
      setReviews(data);
    } catch (err) {
      console.error("Ürün yorumları alınamadı:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (reviewId, reply) => {
    try {
      await replyToProductReview(reviewId, reply);
      toast.success("Yanıt gönderildi.");
      loadReviews();
    } catch (err) {
      toast.error("Yanıt gönderilemedi.");
      console.error("Yanıt hatası:", err);
    }
  };

  useEffect(() => {
    if (productId) {
      loadReviews();
    }
  }, [productId]);

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 overflow-hidden">
      {/* Başlık */}
      <div className="mb-4 sm:mb-6 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#003333]">Ürün Yorumları</h1>
        <p className="text-sm text-gray-500 mt-1">Müşteri geri bildirimlerini görüntüleyin ve yanıtlayın.</p>
      </div>

      {/* İçerik */}
      {loading ? (
        <div className="flex justify-center items-center min-h-[10rem]">
          <TedarikaLoader variant="inline" label="Yorumlar yükleniyor..." />
        </div>
      ) : reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-12 text-gray-500">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mb-4">
            <MessageSquare size={48} className="text-gray-400" />
          </div>
          <p className="text-lg font-medium">Henüz yorum yapılmamış</p>
          <p className="text-sm mt-1">Ürününüze gelen yorumlar burada listelenecek.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <ProductReviewItem key={review.id} review={review} onReply={handleReply} />
          ))}
        </div>
      )}
    </section>
  );
};

export default ProductReviewsPage;
