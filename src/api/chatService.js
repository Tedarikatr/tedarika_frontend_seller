import { StreamChat } from "stream-chat";
import { STREAM_CONFIG, isStreamConfigured } from "@/config/stream";
import { apiRequest } from "@/api/apiRequest";

let streamClient = null;

// 🔑 Stream Chat token al
export const getChatToken = async () => {
  try {
    console.log("🔑 Backend'den chat token alınıyor...");
    const tokenData = await apiRequest("Chat/token", "POST", null, true);

    return {
      apiKey: STREAM_CONFIG.apiKey,
      token: tokenData.token || (await generateStreamToken(tokenData.user?.id || "seller")),
      user: {
        id: tokenData.user?.id || "seller",
        name: tokenData.user?.name || "Satıcı",
        image: tokenData.user?.avatar || null,
        role: "seller",
      },
    };
  } catch (error) {
    console.error("❌ Backend token alınamadı:", error);
    return await fallbackToken();
  }
};

// 🔄 Local fallback token
const fallbackToken = async () => {
  const sellerToken = localStorage.getItem("sellerToken");
  if (!sellerToken) throw new Error("Seller token bulunamadı.");

  const payload = JSON.parse(atob(sellerToken.split(".")[1]));
  const userId = payload.sub || payload.user_id || "seller";
  const token = await generateStreamToken(userId);

  return {
    apiKey: STREAM_CONFIG.apiKey,
    token,
    user: { id: userId, name: "Satıcı", image: null, role: "seller" },
  };
};

// 🔐 Stream Chat token oluştur
const generateStreamToken = async (userId) => {
  try {
    const { StreamChat } = await import("stream-chat");
    const tempClient = StreamChat.getInstance(STREAM_CONFIG.apiKey, STREAM_CONFIG.apiSecret);
    return tempClient.createToken(userId);
  } catch (error) {
    console.error("Stream token oluşturma hatası:", error);
    const payload = {
      user_id: userId,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
      iat: Math.floor(Date.now() / 1000),
    };
    return btoa(JSON.stringify(payload));
  }
};

// 🏪 Stream Chat client başlat
export const initializeStreamClient = async () => {
  if (!isStreamConfigured()) {
    throw new Error("Stream Chat API anahtarı eksik. .env dosyasını kontrol edin.");
  }

  if (streamClient?.userID) return streamClient;

  const { apiKey, token, user } = await getChatToken();
  streamClient = StreamChat.getInstance(apiKey);

  if (streamClient.userID) await streamClient.disconnectUser();
  await streamClient.connectUser(user, token);

  console.log("✅ Stream Chat client bağlı:", user.name);
  return streamClient;
};

// 🔌 Bağlantıyı kapat
export const disconnectStreamClient = async () => {
  if (streamClient) {
    await streamClient.disconnectUser();
    streamClient = null;
  }
};

// 📋 Satıcının kanallarını getir
export const getSellerChannels = async () => {
  try {
    const client = await initializeStreamClient();
    const channels = await client.queryChannels({
      type: "messaging",
      members: { $in: [client.userID] },
    });

    return channels
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
      .map((c) => ({
        id: c.id,
        cid: c.cid,
        name: c.data.name || c.id,
        lastMessage: c.state.messages.at(-1),
        unreadCount: c.state.unreadCount,
        members: Object.values(c.state.members),
        createdAt: c.created_at,
        updatedAt: c.updated_at,
      }));
  } catch (error) {
    console.error("Kanal listesi alınamadı:", error);
    throw error;
  }
};

// 💬 Thread mesajlarını getir
export const getThreadMessages = async (threadId) => {
  try {
    return await apiRequest(`Chat/threads/${threadId}/messages`, "GET", null, true);
  } catch (error) {
    console.error("Mesajlar alınamadı:", error);
    return [];
  }
};

// 🧵 Thread oluştur
export const createThreadBuyerToStore = async (buyerUserId) => {
  try {
    return await apiRequest("Chat/threads/buyer-to-store", "POST", { buyerUserId }, true);
  } catch (error) {
    console.error("Thread oluşturulamadı:", error);
    throw error;
  }
};

// 📤 Mesaj gönder
export const sendMessage = async (threadId, messageBody) => {
  try {
    return await apiRequest("Chat/messages", "POST", { threadId, body: messageBody }, true);
  } catch (error) {
    console.error("Mesaj gönderilemedi:", error);
    throw error;
  }
};

// 🔄 Thread listesini yenile
export const refreshChatThreads = async () => {
  try {
    const threads = await apiRequest("Chat/threads", "GET", null, true);
    return threads.map((t) => ({
      id: t.id,
      buyerUserId: t.buyerUserId,
      buyerName: t.buyerName || "Bilinmeyen Kullanıcı",
      lastMessageBody: t.lastMessage || "",
      updatedAt: t.updatedAt,
      threadId: t.id,
    }));
  } catch (error) {
    console.error("Thread listesi yenilenemedi:", error);
    return [];
  }
};
