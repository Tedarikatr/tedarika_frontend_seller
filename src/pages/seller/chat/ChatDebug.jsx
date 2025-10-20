import React, { useState } from "react";
import { initializeStreamClient, getChatToken } from "@/api/chatService";
import { isStreamConfigured, STREAM_CONFIG } from "@/config/stream";

const ChatDebug = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { timestamp, message, type }]);
  };

  const runTest = async () => {
    setLoading(true);
    setLogs([]);

    try {
      // 1. Environment variables test
      addLog("1. Environment variables kontrolü...", 'info');
      const configured = isStreamConfigured();
      addLog(`API Key: ${STREAM_CONFIG.apiKey ? '✅ Set' : '❌ Missing'}`, configured ? 'success' : 'error');
      addLog(`API Secret: ${STREAM_CONFIG.apiSecret ? '✅ Set' : '❌ Missing'}`, configured ? 'success' : 'error');

      if (!configured) {
        addLog("❌ Environment variables eksik!", 'error');
        return;
      }

      // 2. Token test
      addLog("2. Stream Chat token alınıyor...", 'info');
      const tokenData = await getChatToken();
      addLog(`✅ Token alındı: ${tokenData.user.name} (${tokenData.user.id})`, 'success');

      // 3. Client initialization test
      addLog("3. Stream Chat client başlatılıyor...", 'info');
      const client = await initializeStreamClient();
      addLog(`✅ Client başarıyla başlatıldı: ${client.userID}`, 'success');

      addLog("🎉 Tüm testler başarılı!", 'success');

    } catch (error) {
      addLog(`❌ Hata: ${error.message}`, 'error');
      console.error("Debug test hatası:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Chat System Debug</h1>
          <button
            onClick={runTest}
            disabled={loading}
            className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50"
          >
            {loading ? "Test Çalışıyor..." : "Test Başlat"}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Test Logları</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
            {logs.length === 0 ? (
              <p className="text-gray-500">Test başlatmak için yukarıdaki butona tıklayın</p>
            ) : (
              logs.map((log, index) => (
                <div key={index} className={`mb-1 ${
                  log.type === 'success' ? 'text-green-400' : 
                  log.type === 'error' ? 'text-red-400' : 
                  'text-blue-400'
                }`}>
                  <span className="text-gray-500">[{log.timestamp}]</span> {log.message}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h2 className="text-lg font-semibold mb-4">Environment Variables</h2>
          <div className="space-y-2 text-sm">
            <p><strong>VITE_STREAM_API_KEY:</strong> {STREAM_CONFIG.apiKey || 'Not set'}</p>
            <p><strong>VITE_STREAM_API_SECRET:</strong> {STREAM_CONFIG.apiSecret ? 'Set' : 'Not set'}</p>
            <p><strong>Configured:</strong> {isStreamConfigured() ? '✅ Yes' : '❌ No'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatDebug;
