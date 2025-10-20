// Stream Chat Configuration
export const STREAM_CONFIG = {
  apiKey: import.meta.env.VITE_STREAM_API_KEY || "zdjtpxgnhck6",
  apiSecret: import.meta.env.VITE_STREAM_API_SECRET || "m6wpw2da96wtmr3s2xbekacync8pv5wcf6m3atk4xgurw4bwhmszx95x9yn32kj8",
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
