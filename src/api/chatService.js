import axios from "axios";
import { StreamChat } from "stream-chat";
import { STREAM_CONFIG, isStreamConfigured } from "@/config/stream";

const API_URL =
  "https://tedarikamarketplaces-akdph0cvdrezedgk.westeurope-01.azurewebsites.net/api/Chat";

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("sellerToken")}`,
  Accept: "application/json",
});

// Stream Chat client instance (singleton)
let streamClient = null;

// 🔑 Stream Chat token al
export const getChatToken = async () => {
  try {
    console.log("🔑 Backend'den chat token alınıyor...", `${API_URL}/token`);
    
    // Backend'den chat token al
    const response = await axios.post(`${API_URL}/token`, null, {
      headers: authHeader(),
    });
    
    console.log("✅ Backend token response:", response.data);
    const tokenData = response.data;
    
    return {
      apiKey: STREAM_CONFIG.apiKey,
      token: tokenData.token || await generateStreamToken(tokenData.user?.id || "seller"),
      user: {
        id: tokenData.user?.id || "seller",
        name: tokenData.user?.name || "Satıcı",
        image: tokenData.user?.avatar || null,
        role: "seller"
      }
    };
  } catch (error) {
    console.error("❌ Backend token alınamadı:", error);
    
    // Fallback: LocalStorage'dan seller bilgilerini al
    console.log("🔄 Fallback: LocalStorage'dan seller token alınıyor...");
    try {
      const sellerToken = localStorage.getItem("sellerToken");
      console.log("📦 Seller token bulundu:", sellerToken ? "Evet" : "Hayır");
      
      if (!sellerToken) {
        throw new Error("Seller token bulunamadı");
      }
      
      // Token'dan user ID çıkarmaya çalış (basit decode)
      const payload = JSON.parse(atob(sellerToken.split('.')[1]));
      const userId = payload.sub || payload.user_id || "seller";
      console.log("👤 User ID çıkarıldı:", userId);
      
      const token = await generateStreamToken(userId);
      console.log("✅ Fallback token oluşturuldu");
      
      return {
        apiKey: STREAM_CONFIG.apiKey,
        token: token,
        user: {
          id: userId,
          name: "Satıcı",
          image: null,
          role: "seller"
        }
      };
    } catch (fallbackError) {
      console.error("❌ Fallback token oluşturma hatası:", fallbackError);
      throw new Error("Chat token alınamadı. Seller giriş yapmış mı kontrol edin.");
    }
  }
};


// 🔐 Stream Chat token oluştur
const generateStreamToken = async (userId) => {
  try {
    // Stream Chat SDK ile token oluştur
    const { StreamChat } = await import('stream-chat');
    
    // Token oluşturmak için client oluştur
    const tempClient = StreamChat.getInstance(STREAM_CONFIG.apiKey, STREAM_CONFIG.apiSecret);
    
    // Token oluştur
    const token = tempClient.createToken(userId);
    
    return token;
  } catch (error) {
    console.error("Stream token oluşturma hatası:", error);
    
    // Alternatif token oluşturma
    const payload = {
      user_id: userId,
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24), // 24 saat
      iat: Math.floor(Date.now() / 1000)
    };
    
    return btoa(JSON.stringify(payload));
  }
};

// 🏪 Stream Chat client'ı başlat
export const initializeStreamClient = async () => {
  // Stream configuration kontrolü
  if (!isStreamConfigured()) {
    throw new Error("Stream Chat API anahtarı ve secret'ı eksik. .env dosyasını kontrol edin.");
  }

  // Eğer client zaten bağlıysa, direkt döndür
  if (streamClient && streamClient.userID) {
    console.log("✅ Stream Chat client zaten bağlı:", streamClient.userID);
    return streamClient;
  }

  try {
    console.log("🔑 Stream Chat token alınıyor...");
    const { apiKey, token, user } = await getChatToken();
    
    console.log("🏗️ Stream Chat client oluşturuluyor...");
    streamClient = StreamChat.getInstance(apiKey);
    
    // Eğer client zaten bağlıysa, disconnect et
    if (streamClient.userID) {
      console.log("🔄 Mevcut bağlantı kesiliyor...");
      await streamClient.disconnectUser();
    }
    
    console.log("👤 Kullanıcı bağlanıyor...", user.name);
    await streamClient.connectUser(
      {
        id: user.id,
        name: user.name || "Satıcı",
        role: user.role || "seller",
        image: user.image,
      },
      token
    );

    console.log("✅ Stream Chat client başarıyla başlatıldı:", user.name);
    return streamClient;
  } catch (error) {
    console.error("❌ Stream client başlatma hatası:", error);
    
    // Daha detaylı hata mesajı
    if (error.message?.includes("API")) {
      throw new Error("Stream Chat API anahtarı geçersiz. .env dosyasını kontrol edin.");
    } else if (error.message?.includes("token")) {
      throw new Error("Stream Chat token oluşturulamadı. Backend API'yi kontrol edin.");
    } else if (error.message?.includes("user")) {
      throw new Error("Kullanıcı bilgileri alınamadı. Seller token'ını kontrol edin.");
    } else {
      throw new Error(`Stream Chat başlatılamadı: ${error.message}`);
    }
  }
};


// 🔌 Stream Chat client'ı bağlantısını kapat
export const disconnectStreamClient = async () => {
  if (streamClient) {
    await streamClient.disconnectUser();
    streamClient = null;
  }
};

// 📋 Satıcının kanallarını getir (Stream Chat)
export const getSellerChannels = async () => {
  try {
    const client = await initializeStreamClient();
    
    const channels = await client.queryChannels({
      type: "messaging",
      members: { $in: [client.userID] },
      // Stream Chat API'si sort field'larını sınırlı destekliyor
      // En güvenli yöntem: sort kullanmamak veya created_at kullanmak
    });

    // Kanalları frontend'de sırala (son mesaj tarihine göre)
    const sortedChannels = channels.sort((a, b) => {
      const aLastMessage = a.state.messages[a.state.messages.length - 1];
      const bLastMessage = b.state.messages[b.state.messages.length - 1];
      
      const aTime = aLastMessage?.created_at || a.created_at;
      const bTime = bLastMessage?.created_at || b.created_at;
      
      return new Date(bTime) - new Date(aTime);
    });

    return sortedChannels.map(channel => ({
      id: channel.id,
      cid: channel.cid,
      name: channel.data.name || channel.data.id,
      lastMessage: channel.state.messages[channel.state.messages.length - 1],
      unreadCount: channel.state.unreadCount,
      members: Object.values(channel.state.members),
      createdAt: channel.created_at,
      updatedAt: channel.updated_at,
    }));
  } catch (error) {
    console.error("Kanal listesi alınamadı:", error);
    throw error;
  }
};

export const getChatThreads = async () => {
  // Stream kanallarını getir
  const channels = await getSellerChannels();
  
  return channels.map(channel => {
    const lastMessage = channel.lastMessage;
    const members = channel.members.filter(m => m.user_id !== streamClient?.userID);
    const buyer = members[0];
    
    return {
      id: channel.id,
      buyerUserId: buyer?.user_id,
      buyerName: buyer?.user?.name || "Bilinmeyen Kullanıcı",
      lastMessageBody: lastMessage?.text || "",
      updatedAt: lastMessage?.created_at || channel.updatedAt,
      threadId: channel.id,
    };
  });
};

// 💬 Thread mesajlarını getir
export const getThreadMessages = async (threadId) => {
  try {
    const response = await axios.get(`${API_URL}/threads/${threadId}/messages`, {
      headers: authHeader(),
    });
    return response.data; // [{ body, senderId, createdAt }]
  } catch (error) {
    console.error("Mesajlar alınamadı:", error);
    return [];
  }
};

// 🆕 Thread oluştur (buyer-to-store)
export const createThreadBuyerToStore = async (buyerUserId) => {
  try {
    console.log("🧵 Backend'de thread oluşturuluyor:", buyerUserId);
    
    const response = await axios.post(
      `${API_URL}/threads/buyer-to-store`,
      { buyerUserId },
      { headers: authHeader() }
    );
    
    console.log("✅ Backend thread oluşturuldu:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Thread oluşturulamadı:", error);
    throw error;
  }
};

// 📤 Mesaj gönder
export const sendMessage = async (threadId, messageBody) => {
  try {
    const response = await axios.post(
      `${API_URL}/messages`,
      { 
        threadId: threadId,
        body: messageBody 
      },
      { headers: authHeader() }
    );
    return response.data;
  } catch (error) {
    console.error("Mesaj gönderilemedi:", error);
    throw error;
  }
};

// 🔄 Thread listesini yenile
export const refreshChatThreads = async () => {
  try {
    // API'den thread listesi al
    const response = await axios.get(`${API_URL}/threads`, {
      headers: authHeader(),
    });
    
    return response.data.map(thread => ({
      id: thread.id,
      buyerUserId: thread.buyerUserId,
      buyerName: thread.buyerName || "Bilinmeyen Kullanıcı",
      lastMessageBody: thread.lastMessage || "",
      updatedAt: thread.updatedAt,
      threadId: thread.id,
    }));
  } catch (error) {
    console.error("Thread listesi yenilenemedi:", error);
    return [];
  }
};
