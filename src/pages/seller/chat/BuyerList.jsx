import React, { useEffect, useState, useCallback } from "react";
import { UserCircle2, RefreshCcw } from "lucide-react";
import { getChatThreads } from "@/api/chatService";
import clsx from "clsx";

const BuyerList = ({ onSelectBuyer, selectedBuyer }) => {
  const [buyers, setBuyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBuyers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const threads = await getChatThreads();

      const list = threads.map((t) => ({
        id: t.buyerUserId,
        name: t.buyerName || "Bilinmeyen Kullanıcı",
        lastMessage: t.lastMessageBody || "",
        time: new Date(t.updatedAt).toLocaleTimeString("tr-TR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        threadId: t.id,
      }));

      setBuyers(list);
    } catch (err) {
      console.error("Buyer listesi alınamadı:", err);
      setError("Müşteri listesi alınamadı 😕");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBuyers();
  }, [fetchBuyers]);

  return (
    <div className="h-full flex flex-col">
      {/* Başlık */}
      <div className="p-4 border-b flex items-center justify-between bg-gray-50">
        <span className="text-lg font-semibold text-gray-800">Müşteriler</span>
        <button
          onClick={fetchBuyers}
          className="p-1 hover:bg-gray-200 rounded transition"
          title="Yenile"
        >
          <RefreshCcw size={16} />
        </button>
      </div>

      {/* İçerik */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          Yükleniyor...
        </div>
      ) : error ? (
        <div className="flex-1 flex items-center justify-center text-red-500">
          {error}
        </div>
      ) : buyers.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-gray-400">
          Henüz mesaj yok
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          {buyers.map((buyer) => (
            <button
              key={buyer.id}
              onClick={() => onSelectBuyer(buyer)}
              className={clsx(
                "w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 transition text-left",
                selectedBuyer?.id === buyer.id &&
                  "bg-teal-50 border-l-4 border-teal-600"
              )}
            >
              <UserCircle2 className="text-teal-600" size={32} />
              <div className="flex flex-col flex-1">
                <span className="font-medium text-gray-900">{buyer.name}</span>
                <span className="text-xs text-gray-500 truncate">
                  {buyer.lastMessage}
                </span>
              </div>
              <span className="text-xs text-gray-400">{buyer.time}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default BuyerList;
