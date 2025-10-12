import React, { useState } from "react";
import BuyerList from "./BuyerList";
import ChatWindow from "./ChatWindow";

const ChatPage = () => {
  const [selectedBuyer, setSelectedBuyer] = useState(null);

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-50">
      {/* Sol Panel - Müşteri Listesi */}
      <aside className="w-80 border-r border-gray-200 bg-white shadow-sm">
        <BuyerList
          onSelectBuyer={setSelectedBuyer}
          selectedBuyer={selectedBuyer}
        />
      </aside>

      {/* Sağ Panel - Chat Penceresi */}
      <main className="flex-1">
        {selectedBuyer ? (
          <ChatWindow buyer={selectedBuyer} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Bir müşteri seçin 👈
          </div>
        )}
      </main>
    </div>
  );
};

export default ChatPage;
