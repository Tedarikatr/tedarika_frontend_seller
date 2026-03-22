import React, { useState } from "react";
import { format } from "date-fns";
import { Star, Reply, Send, X, CheckCircle, MessageCircle } from "lucide-react";

const StoreReviewItem = ({ review, onReply }) => {
  const [replyText, setReplyText] = useState("");
  const [showReplyBox, setShowReplyBox] = useState(false);

  // Star rendering helper
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < rating
            ? "text-yellow-500 fill-yellow-500"
            : "text-gray-300 fill-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl border-2 border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-5 border-b-2 border-gray-200">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">
                  {format(new Date(review.createdAt), "dd.MM.yyyy HH:mm")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {renderStars(review.rating)}
              <span className="ml-2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 text-sm font-bold border border-amber-300">
                {review.rating}/5
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Comment Section */}
      <div className="px-6 py-5">
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-5 border-2 border-blue-200">
          <div className="flex items-start gap-3">
            <MessageCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
            <p className="text-gray-800 leading-relaxed flex-1">{review.comment}</p>
          </div>
        </div>
      </div>

      {/* Reply Section */}
      <div className="px-6 pb-6">
        {review.sellerReply ? (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-5 border-2 border-green-300 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-green-800 mb-2 flex items-center gap-2">
                  <span>Yanıtınız</span>
                </h4>
                <p className="text-green-900 leading-relaxed">{review.sellerReply}</p>
              </div>
            </div>
          </div>
        ) : showReplyBox ? (
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-5 border-2 border-indigo-200">
              <label className="flex items-center gap-2 text-sm font-bold text-indigo-900 mb-3">
                <Reply className="w-4 h-4" />
                Yanıtınızı Yazın
              </label>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="w-full border-2 border-indigo-300 rounded-xl px-4 py-3 text-sm focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all duration-300 resize-none"
                placeholder="Yanıtınızı buraya yazın..."
                rows={4}
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  onReply(review.id, replyText);
                  setReplyText("");
                  setShowReplyBox(false);
                }}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <Send className="w-4 h-4" />
                Gönder
              </button>
              <button
                onClick={() => {
                  setShowReplyBox(false);
                  setReplyText("");
                }}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 border-2 border-gray-300"
              >
                <X className="w-4 h-4" />
                İptal
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowReplyBox(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            <Reply className="w-4 h-4" />
            Yanıtla
          </button>
        )}
      </div>
    </div>
  );
};

export default StoreReviewItem;
