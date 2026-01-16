// src/api/apiRequest.js
const BASE_URL = import.meta.env.VITE_API_URL;

// ⚠️ GÜVENLİK: Environment variable'ları production'da loglamayın
if (import.meta.env.DEV) {
  console.log("API Base URL:", BASE_URL ? "✅ Set" : "❌ Missing");
}

// URL birleştirme: sondaki/baştaki slash dertlerini çözer
const join = (base, path) =>
  `${base.replace(/\/+$/, "")}/${String(path || "").replace(/^\/+/, "")}`;

export async function apiRequest(
  endpoint,
  method = "GET",
  data = null,
  useAuth = false,
  options = {}
) {
  if (!BASE_URL) {
    throw new Error("VITE_API_URL tanımlı değil. .env / Vercel env'i kontrol edin.");
  }

  const headers = { Accept: "*/*", ...(options.headers || {}) };

  if (useAuth) {
    const token = localStorage.getItem("sellerToken");
    if (token) headers["Authorization"] = `Bearer ${token}`;
    else console.warn("⚠️ Seller token not found in localStorage");
  }

  const config = { method, headers };

  if (data) {
    if (data instanceof FormData) {
      config.body = data; // FormData ise Content-Type ekleme
    } else if (typeof data === "string" && options.rawBody) {
      if (!headers["Content-Type"]) {
        headers["Content-Type"] = "text/plain";
      }
      config.body = data;
    } else {
      headers["Content-Type"] = "application/json";
      config.body = JSON.stringify(data);
    }
  }

  let timeoutId;
  if (options.timeoutMs) {
    const controller = new AbortController();
    config.signal = controller.signal;
    timeoutId = setTimeout(() => controller.abort(), options.timeoutMs);
  } else if (options.signal) {
    config.signal = options.signal;
  }

  let response;
  try {
    response = await fetch(join(BASE_URL, endpoint), config);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    let errorMessage = "Sunucu hatası.";

    try {
      const json = errorText ? JSON.parse(errorText) : {};
      console.error("API JSON Error:", json);
      errorMessage = json.title || json.message || json.error || errorText || response.statusText;
    } catch {
      console.error("API Text Error:", errorText);
      errorMessage = errorText || response.statusText;
    }

    throw new Error(errorMessage);
  }

  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    try {
      return await response.json();
    } catch (e) {
      console.warn("⚠️ JSON parse hatası:", e);
      return {};
    }
  }
  const text = await response.text();
  return { message: text };
}
