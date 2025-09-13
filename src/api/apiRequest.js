// src/api/apiRequest.js
const BASE_URL = import.meta.env.VITE_API_URL;

// URL birleştirme: sondaki/baştaki slash dertlerini çözer
const join = (base, path) =>
  `${base.replace(/\/+$/, "")}/${String(path || "").replace(/^\/+/, "")}`;

export async function apiRequest(
  endpoint,
  method = "GET",
  data = null,
  useAuth = false
) {
  if (!BASE_URL) {
    throw new Error("VITE_API_URL tanımlı değil. .env / Vercel env'i kontrol edin.");
  }

  const headers = { Accept: "*/*" };

  if (useAuth) {
    const token = localStorage.getItem("sellerToken");
    if (token) headers["Authorization"] = `Bearer ${token}`;
    else console.warn("⚠️ Seller token not found in localStorage");
  }

  const config = { method, headers };

  if (data) {
    if (data instanceof FormData) {
      config.body = data; // FormData ise Content-Type ekleme
    } else {
      headers["Content-Type"] = "application/json";
      config.body = JSON.stringify(data);
    }
  }

  const response = await fetch(join(BASE_URL, endpoint), config);

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
