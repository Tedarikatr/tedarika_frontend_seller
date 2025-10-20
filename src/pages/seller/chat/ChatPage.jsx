import React, { useState, useEffect } from "react";
import { MessageSquare, Users, ArrowLeft } from "lucide-react";
import BuyerList from "./BuyerList";
import ChatWindow from "./ChatWindow";
import { initializeStreamClient, disconnectStreamClient } from "@/api/chatService";

const ChatPage = () => {
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    const initClient = async () => {
      try {
        setLoading(true);
        setError(null);
        
        await initializeStreamClient();
        setIsConnected(true);
      } catch (error) {
        setError(error.message || "Chat sistemi başlatılamadı");
        setIsConnected(false);
      } finally {
        setLoading(false);
      }
    };

    initClient();

    return () => {
      window.removeEventListener('resize', checkMobile);
      disconnectStreamClient();
      setIsConnected(false);
    };
  }, []);

  const handleSelectBuyer = (buyer) => {
    setSelectedBuyer(buyer);
    if (isMobile) {
      setShowChat(true);
    }
  };

  const handleBackToList = () => {
    setShowChat(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chat sistemi başlatılıyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <div className="text-center max-w-md">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="text-red-600 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-red-800 mb-2">Chat Sistemi Hatası</h3>
            <p className="text-red-700 mb-4">{error}</p>
            <div className="space-y-2 text-sm text-red-600">
              <p>• .env dosyasında VITE_STREAM_API_KEY var mı?</p>
              <p>• Backend API çalışıyor mu?</p>
              <p>• Seller token'ı geçerli mi?</p>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Sayfayı Yenile
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="h-[calc(100vh-120px)] bg-gray-50">
        {!showChat ? (
          <aside className="w-full h-full bg-white">
            <div className="h-full flex flex-col">
              <div className="p-4 border-b bg-white flex-shrink-0">
                <div className="flex items-center gap-2">
                  <MessageSquare className="text-gray-600" size={20} />
                  <h2 className="text-lg font-medium text-gray-900">Mesajlaşma</h2>
                </div>
              </div>
              
              <div className="flex-1 min-h-0">
                <BuyerList
                  onSelectBuyer={handleSelectBuyer}
                  selectedBuyer={selectedBuyer}
                />
              </div>
            </div>
          </aside>
        ) : (
          <main className="w-full h-full bg-white">
            <div className="h-full flex flex-col">
              <div className="p-4 border-b bg-white flex items-center gap-3">
                <button
                  onClick={handleBackToList}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <ArrowLeft size={20} />
                </button>
                <div>
                  <h2 className="text-lg font-medium text-gray-900">
                    {selectedBuyer?.name}
                  </h2>
                  <p className="text-sm text-gray-500">Çevrimiçi</p>
                </div>
              </div>
              
              <div className="flex-1 min-h-0">
                <ChatWindow buyer={selectedBuyer} />
              </div>
            </div>
          </main>
        )}
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-120px)] bg-gray-50 max-w-7xl mx-auto">
      <aside className="w-80 border-r border-gray-200 bg-white shadow-sm">
        <div className="h-full flex flex-col">
          <div className="p-4 border-b bg-white flex-shrink-0">
            <div className="flex items-center gap-2">
              <MessageSquare className="text-gray-600" size={20} />
              <h2 className="text-lg font-medium text-gray-900">Mesajlaşma</h2>
            </div>
          </div>
          
          <div className="flex-1 min-h-0">
            <BuyerList
              onSelectBuyer={setSelectedBuyer}
              selectedBuyer={selectedBuyer}
            />
          </div>
        </div>
      </aside>

      <main className="flex-1 bg-white">
        {selectedBuyer ? (
          <ChatWindow buyer={selectedBuyer} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500 p-8">
              <Users size={64} className="mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-medium mb-2">Müşteri Seçin</h3>
              <p className="text-gray-400">
                Sol panelden bir müşteri seçerek konuşmaya başlayın
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ChatPage;
