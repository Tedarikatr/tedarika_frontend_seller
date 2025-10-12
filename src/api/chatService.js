import axios from "axios";

const API_URL =
  "https://tedarikamarketplaces-akdph0cvdrezedgk.westeurope-01.azurewebsites.net/api/Chat";

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("sellerToken")}`,
  Accept: "application/json",
});

// 🔑 Chat token al
export const getChatToken = async () => {
  const response = await axios.post(`${API_URL}/token`, null, {
    headers: authHeader(),
  });
  return response.data;
};

// 🧵 Buyer ile yeni thread oluştur
export const createThreadBuyerToStore = async ({ storeId, buyerUserId }) => {
  const response = await axios.post(
    `${API_URL}/threads/buyer-to-store`,
    { storeId, buyerUserId },
    { headers: authHeader() }
  );
  return response.data; // örn: { threadId, buyerUserId, buyerName }
};

// 💬 Thread mesajlarını getir
export const getThreadMessages = async (threadId) => {
  const response = await axios.get(`${API_URL}/threads/${threadId}/messages`, {
    headers: authHeader(),
  });
  return response.data; // örn: [{ body, senderId, createdAt }]
};

// ✅ Yeni: Thread listesi oluştur (mevcut endpoint yoksa fallback olarak)
export const getChatThreads = async (threadIds = []) => {
  try {
    const allThreads = await Promise.all(
      threadIds.map(async (id) => {
        const messages = await getThreadMessages(id);
        const lastMessage = messages[messages.length - 1];

        return {
          id,
          buyerUserId: lastMessage?.buyerUserId ?? null,
          buyerName: lastMessage?.buyerName ?? "Bilinmeyen Kullanıcı",
          lastMessageBody: lastMessage?.body ?? "",
          updatedAt: lastMessage?.createdAt ?? null,
        };
      })
    );

    // Yeni gelenleri tarihe göre sırala (son mesaj en üstte)
    return allThreads.sort(
      (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
    );
  } catch (error) {
    console.error("Thread listesi alınamadı:", error);
    return [];
  }
};
