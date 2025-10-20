import React, { useEffect, useState } from "react";
import {
  Chat,
  Channel,
  ChannelHeader,
  MessageList,
  MessageInput,
  Window,
  LoadingIndicator,
  Thread,
} from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";
import { 
  initializeStreamClient,
  createThreadBuyerToStore 
} from "@/api/chatService";

const ChatWindow = ({ buyer }) => {
  const [client, setClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    
    const initChat = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const chatClient = await initializeStreamClient();
        
        if (!isMounted) return;

        let channelInstance;
        let threadId = buyer.threadId;
        
        if (!threadId && (buyer.id || buyer.buyerId)) {
          try {
            const threadData = await createThreadBuyerToStore(buyer.id || buyer.buyerId);
            threadId = threadData.threadId || threadData.id;
          } catch (backendError) {
            threadId = `thread_${chatClient.userID}_${buyer.id || buyer.buyerId}`;
          }
        }
        
        if (threadId) {
          const buyerId = buyer.id || buyer.buyerId;
          const members = [buyerId];
          
          channelInstance = chatClient.channel("messaging", threadId, {
            name: `${buyer.name} ile konuşma`,
            members: members,
            threadId: threadId,
            buyerId: buyerId,
            sellerId: chatClient.userID,
          });
          
          try {
            await channelInstance.watch();
          } catch (channelError) {
            const fallbackMembers = [buyer.id || buyer.buyerId];
            channelInstance = chatClient.channel("messaging", {
              members: fallbackMembers,
              name: `${buyer.name} ile konuşma`,
            });
            await channelInstance.create();
          }
        } else {
          throw new Error("Thread ID oluşturulamadı. Buyer bilgileri eksik.");
        }

        if (!isMounted) return;
        
        setClient(chatClient);
        setChannel(channelInstance);
      } catch (err) {
        if (isMounted) {
          setError("Chat yüklenemedi. Lütfen sayfayı yenileyin.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (buyer) {
      initChat();
    }

    return () => {
      isMounted = false;
    };
  }, [buyer]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingIndicator />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-red-500">
        <div className="text-center">
          <p className="mb-2">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Sayfayı Yenile
          </button>
        </div>
      </div>
    );
  }


  if (!client || !channel) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center">
          <p className="mb-2">Chat yüklenemedi 😕</p>
          <p className="text-sm">Lütfen bir müşteri seçin</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full max-h-[calc(100vh-160px)] md:max-h-[calc(100vh-160px)] overflow-hidden">
      <Chat client={client} theme="str-chat__theme-light">
        <Channel 
          channel={channel}
        >
          <Window>
            <ChannelHeader 
              title={buyer.name}
              subtitle={`${buyer.name} ile konuşma`}
            />
            <MessageList 
              disableDateSeparator={false}
              messageActions={['edit', 'delete', 'flag']}
            />
            <MessageInput 
              focus={true}
              uploadsEnabled={true}
              placeholder="Mesaj yazın..."
              sendButton={<button type="submit">Gönder</button>}
            />
          </Window>
          <Thread />
        </Channel>
      </Chat>
      
    </div>
  );
};

export default ChatWindow;
