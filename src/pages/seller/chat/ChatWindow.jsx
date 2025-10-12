import React, { useEffect, useState } from "react";
import { StreamChat } from "stream-chat";
import {
  Chat,
  Channel,
  ChannelHeader,
  MessageList,
  MessageInput,
  Window,
  LoadingIndicator,
} from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";
import { getChatToken } from "@/api/chatService";

const ChatWindow = ({ buyer }) => {
  const [client, setClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const initChat = async () => {
      try {
        const { apiKey, token, user } = await getChatToken();
        const chatClient = StreamChat.getInstance(apiKey);

        await chatClient.connectUser(
          { id: user.id, name: user.name || "Satıcı", role: "seller" },
          token
        );

        const channelInstance = chatClient.channel("messaging", buyer.threadId, {
          name: buyer.name,
        });

        await channelInstance.watch();

        if (!isMounted) return;
        setClient(chatClient);
        setChannel(channelInstance);
      } catch (err) {
        console.error("Chat başlatma hatası:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initChat();

    return () => {
      isMounted = false;
      if (client) client.disconnectUser();
    };
  }, [buyer]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingIndicator />
      </div>
    );

  if (!client || !channel)
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Chat yüklenemedi 😕
      </div>
    );

  return (
    <Chat client={client} theme="str-chat__theme-light">
      <Channel channel={channel}>
        <Window>
          <ChannelHeader title={buyer.name} />
          <MessageList />
          <MessageInput focus uploadsEnabled placeholder="Mesaj yazın..." />
        </Window>
      </Channel>
    </Chat>
  );
};

export default ChatWindow;
