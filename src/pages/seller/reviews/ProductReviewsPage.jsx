import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProductReviews, replyToProductReview } from "@/api/sellerReviewService";
import ProductReviewItem from "@/components/storeProducts/ProductReviewItem";
import { LoaderCircle } from "lucide-react";

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
    <section className="max-w-5xl mx-auto px-4 py-8">
      {/* Başlık */}
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-[#003333]">Ürün Yorumları</h1>
        <p className="text-sm text-gray-500 mt-1">Müşteri geri bildirimlerini görüntüleyin ve yanıtlayın.</p>
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
