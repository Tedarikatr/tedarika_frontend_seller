// src/pages/seller/reviews/ProductReviewsPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProductReviews, replyToProductReview } from "@/api/sellerReviewService";
import ProductReviewItem from "@/components/storeProducts/ProductReviewItem";

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
      alert("Yanıt gönderildi.");
      loadReviews();
    } catch (err) {
      alert("Yanıt gönderilemedi.");
      console.error("Yanıt hatası:", err);
    }
  };

  useEffect(() => {
    if (productId) {
      loadReviews();
    }
  }, [productId]);

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Ürün Yorumları</h1>
      {loading ? (
        <p className="text-sm text-gray-500">Yükleniyor...</p>
      ) : reviews.length === 0 ? (
        <p className="text-sm text-gray-600">Henüz yorum yok.</p>
      ) : (
        reviews.map((review) => (
          <ProductReviewItem key={review.id} review={review} onReply={handleReply} />
        ))
      )}
    </div>
  );
};

export default ProductReviewsPage;
