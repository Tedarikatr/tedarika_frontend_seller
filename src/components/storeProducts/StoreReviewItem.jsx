import React, { useState } from "react";
import { format } from "date-fns";

const StoreReviewItem = ({ review, onReply }) => {
  const [replyText, setReplyText] = useState("");
  const [showReplyBox, setShowReplyBox] = useState(false);

  return (
    <div className="border rounded-lg p-4 shadow-sm bg-white mb-4">
      <div className="mb-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">{format(new Date(review.createdAt), "dd.MM.yyyy HH:mm")}</span>
          <span className="text-yellow-500 text-sm">Puan: {review.rating}/5</span>
        </div>
        <p className="text-gray-800 mt-2">{review.comment}</p>
      </div>

      {review.sellerReply ? (
        <div className="bg-green-50 border border-green-200 rounded p-2 text-sm text-green-800 mt-2">
          <strong>Yanıt:</strong> {review.sellerReply}
        </div>
      ) : (
        <>
          {showReplyBox ? (
            <div className="mt-3 flex flex-col gap-2">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="border rounded px-2 py-1 text-sm"
                placeholder="Yanıtınızı yazın..."
              />
              <div className="flex gap-2">
                <button
                  onClick={() => onReply(review.id, replyText)}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                >
                  Gönder
                </button>
                <button
                  onClick={() => setShowReplyBox(false)}
                  className="text-sm text-gray-600 hover:underline"
                >
                  İptal
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowReplyBox(true)}
              className="mt-2 text-blue-600 text-sm hover:underline"
            >
              Yanıtla
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default StoreReviewItem;
