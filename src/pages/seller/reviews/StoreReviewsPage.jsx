// src/pages/seller/reviews/StoreReviewsPage.jsx

import React, { useEffect, useState } from "react";
import { fetchStoreReviews, replyToStoreReview } from "@/api/sellerReviewService";
import StoreReviewItem from "@/components/storeProducts/StoreReviewItem";

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
      alert("Yanıt gönderildi.");
      loadReviews();
    } catch (err) {
      console.error("Yanıt gönderilemedi:", err);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Mağaza Yorumları</h1>
      {loading ? (
        <p>Yükleniyor...</p>
      ) : reviews.length === 0 ? (
        <p>Henüz yorum yok.</p>
      ) : (
        reviews.map((review) => (
          <StoreReviewItem key={review.id} review={review} onReply={handleReply} />
        ))
      )}
    </div>
  );
};

export default StoreReviewsPage; // ✅ Burası şart
