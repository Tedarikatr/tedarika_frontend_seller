import React, { useState } from "react";
import { format } from "date-fns";
import { Star, Reply, Send, X } from "lucide-react";

const StoreReviewItem = ({ review, onReply }) => {
  const [replyText, setReplyText] = useState("");
  const [showReplyBox, setShowReplyBox] = useState(false);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition">
      {/* Üst Bilgiler */}
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <p className="text-sm text-gray-500">
            {format(new Date(review.createdAt), "dd.MM.yyyy HH:mm")}
          </p>
          <div className="flex items-center gap-1 text-yellow-500 text-sm">
            <Star className="w-4 h-4 fill-yellow-500" />
            <span>{review.rating}/5</span>
          </div>
        </div>
      </div>

      {/* Yorum */}
      <div className="mt-3 text-gray-800 text-sm leading-relaxed">
        {review.comment}
      </div>

      {/* Satıcı Yanıtı */}
      {review.sellerReply ? (
        <div className="mt-4 bg-green-50 border border-green-200 rounded-md p-3 text-sm text-green-800 relative">
          <strong className="block font-semibold mb-1">🟢 Yanıtınız</strong>
          {review.sellerReply}
        </div>
      ) : showReplyBox ? (
        <div className="mt-4 space-y-2">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Yanıtınızı buraya yazın..."
            rows={3}
          />
          <div className="flex gap-3">
            <button
              onClick={() => onReply(review.id, replyText)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm hover:bg-blue-700 transition"
            >
              <Send size={16} />
              Gönder
            </button>
            <button
              onClick={() => setShowReplyBox(false)}
              className="flex items-center gap-1 text-gray-500 hover:text-gray-700 text-sm"
            >
              <X size={16} />
              İptal
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowReplyBox(true)}
          className="mt-3 inline-flex items-center gap-1 text-sm text-blue-600 hover:underline hover:text-blue-700 transition"
        >
          <Reply size={16} />
          Yanıtla
        </button>
      )}
    </div>
  );
};

export default StoreReviewItem;
