import React, { useEffect, useState, useCallback } from "react";
import { UserCircle2, RefreshCcw, MessageCircle } from "lucide-react";
import { getSellerChannels } from "@/api/chatService";
import clsx from "clsx";

const BuyerList = ({ onSelectBuyer, selectedBuyer }) => {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchChannels = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const channelsData = await getSellerChannels();

      const channelsList = channelsData.map((channel) => {
        const otherMembers = channel.members.filter(
          (member) => member.user_id !== channel.createdBy
        );
        const buyer = otherMembers[0];

        return {
          id: channel.id, // Kanal ID
          cid: channel.cid,
          name:
            buyer?.user?.name || buyer?.user?.id || "Bilinmeyen Kullanıcı",
          buyerId: buyer?.user_id, // Müşteri ID
          lastMessage: channel.lastMessage?.text || "",
          time: channel.lastMessage?.created_at
            ? new Date(channel.lastMessage.created_at).toLocaleTimeString(
                "tr-TR",
                {
                  hour: "2-digit",
                  minute: "2-digit",
                }
              )
            : new Date(channel.updatedAt).toLocaleTimeString("tr-TR", {
                hour: "2-digit",
                minute: "2-digit",
              }),
          unreadCount: channel.unreadCount || 0,
          threadId: channel.id,
        };
      });

      setChannels(channelsList);
    } catch (err) {
      setError("Müşteri listesi alınamadı.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChannels();
    const interval = setInterval(fetchChannels, 30000);
    return () => clearInterval(interval);
  }, [fetchChannels]);

  return (
    <div className="h-full flex flex-col">
      {/* Üst bar */}
      <div className="p-3 md:p-4 border-b flex items-center justify-between bg-gray-50">
        <span className="text-base md:text-lg font-semibold text-gray-800">
          Müşteriler
        </span>
        <button
          onClick={fetchChannels}
          className="p-1 hover:bg-gray-200 rounded transition"
          title="Yenile"
        >
          <RefreshCcw size={16} />
        </button>
      </div>

      {/* İçerik */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-2"></div>
            <p>Yükleniyor...</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex-1 flex items-center justify-center text-red-500">
          <div className="text-center">
            <p className="mb-2">{error}</p>
            <button
              onClick={fetchChannels}
              className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
            >
              Tekrar Dene
            </button>
          </div>
        </div>
      ) : channels.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-gray-400">
          <div className="text-center p-8">
            <MessageCircle size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">Henüz mesaj yok</p>
            <p className="text-sm">
              Müşteriler mesaj gönderdiğinde burada görünecek
            </p>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          {channels.map((channel) => (
            <button
              key={channel.id}
              onClick={() => onSelectBuyer(channel)}
              className={clsx(
                "w-full flex items-center gap-2 md:gap-3 px-3 md:px-4 py-3 hover:bg-gray-50 transition text-left border-b border-gray-100",
                selectedBuyer?.id === channel.id && "bg-gray-100"
              )}
            >
              <div className="relative">
                <UserCircle2
                  className={clsx(
                    "size-7 md:size-8",
                    selectedBuyer?.id === channel.id
                      ? "text-gray-700"
                      : "text-gray-400"
                  )}
                />
                {channel.unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gray-700 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {channel.unreadCount > 9 ? "9+" : channel.unreadCount}
                  </span>
                )}
              </div>

              <div className="flex flex-col flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900 truncate text-sm md:text-base">
                    {channel.name}
                  </span>
                  <span className="text-xs text-gray-400 ml-2 flex-shrink-0">
                    {channel.time}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-gray-500 truncate">
                    {channel.lastMessage || "Henüz mesaj yok"}
                  </span>
                  {channel.unreadCount > 0 && (
                    <div className="w-2 h-2 bg-gray-700 rounded-full flex-shrink-0 ml-2"></div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default BuyerList;
