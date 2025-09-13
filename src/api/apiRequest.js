const BASE_URL = "https://tedarikamarketplaces-akdph0cvdrezedgk.westeurope-01.azurewebsites.net/api";

/**
 * Genelleştirilmiş fetch wrapper
 * - text/plain ve application/json yanıtlarını destekler
 * - FormData gönderirken Content-Type set etmez
 * - Hata durumunda JSON ya da düz metni ekrana anlamlı şekilde taşır
 */
export async function apiRequest(endpoint, method = "GET", data = null, useAuth = false) {
  const url = `${BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  const headers = {
    // bazı endpointler text/plain döndüğü için Accept geniş
    Accept: "application/json, text/plain;q=0.9, */*;q=0.8",
  };

  if (useAuth) {
    const token = localStorage.getItem("sellerToken") || localStorage.getItem("token");
    if (token) headers.Authorization = `Bearer ${token}`;
    else console.warn("⚠️ Seller token not found in localStorage");
  }

  const config = { method, headers };

  if (data) {
    if (data instanceof FormData) {
      config.body = data; // Content-Type otomatik
    } else {
      headers["Content-Type"] = "application/json";
      config.body = JSON.stringify(data);
    }
  }

  const res = await fetch(url, config);

  // Yanıtı olabildiğince parse etmeye çalış
  const ct = res.headers.get("content-type") || "";
  let payload;
  try {
    if (ct.includes("application/json")) {
      payload = await res.json();
    } else {
      const text = await res.text();
      try { payload = JSON.parse(text); } catch { payload = text; }
    }
  } catch {
    payload = undefined;
  }

  if (!res.ok) {
    console.error("API Error payload:", payload);
    const msg =
      (typeof payload === "string" && payload) ||
      payload?.title ||
      payload?.message ||
      payload?.errorMessage ||
      payload?.error ||
      `HTTP ${res.status}`;
    throw new Error(msg);
  }

  // Bazı endpointler text/plain dönüyor
  return payload ?? {};
}
