// Stream Chat Configuration
// ⚠️ GÜVENLİK: API key ve secret sadece environment variable'lardan alınmalı
export const STREAM_CONFIG = {
  apiKey: import.meta.env.VITE_STREAM_API_KEY,
  apiSecret: import.meta.env.VITE_STREAM_API_SECRET,
};

// Environment kontrolü
export const isStreamConfigured = () => {
  return !!(STREAM_CONFIG.apiKey && STREAM_CONFIG.apiSecret);
};

// Configuration durumunu logla
if (import.meta.env.DEV) {
  console.log("Stream Chat Configuration:", {
    apiKey: STREAM_CONFIG.apiKey ? "Set" : "Missing",
    apiSecret: STREAM_CONFIG.apiSecret ? "Set" : "Missing",
    configured: isStreamConfigured()
  });
}
