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
  } catch (err) {
    if (timeoutId) clearTimeout(timeoutId);
    if (err?.name === "AbortError") {
      throw new Error("İşlem zaman aşımına uğradı. Lütfen tekrar deneyin.");
    }
    throw err;
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    let errorMessage = "Sunucu hatası.";

    try {
      const parsed = errorText ? JSON.parse(errorText) : {};
      const json = typeof parsed === "object" && parsed !== null ? parsed : {};
      // API 400: string body veya { message, title, error } object
      errorMessage = json.title || json.message || json.error || (typeof parsed === "string" ? parsed : errorText) || response.statusText;
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

/**
 * FormData ile yükleme - upload progress desteği (XHR)
 * Excel/XML gibi dosya yüklemelerinde process bar için kullanılır
 * @param {string} endpoint - API endpoint
 * @param {FormData} formData - FormData
 * @param {function(number): void} onUploadProgress - 0-100 arası yüzde callback
 * @param {number} timeoutMs - Timeout (ms)
 */
export function apiRequestWithUploadProgress(
  endpoint,
  formData,
  onUploadProgress,
  timeoutMs = 60 * 60 * 1000
) {
  return new Promise((resolve, reject) => {
    if (!BASE_URL) {
      reject(new Error("VITE_API_URL tanımlı değil. .env / Vercel env'i kontrol edin."));
      return;
    }

    const url = join(BASE_URL, endpoint);
    const xhr = new XMLHttpRequest();
    const token = localStorage.getItem("sellerToken");
    let timeoutId;
    let settled = false;

    const settle = (fn) => {
      if (settled) return;
      settled = true;
      if (timeoutId) clearTimeout(timeoutId);
      fn();
    };

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable && typeof onUploadProgress === "function") {
        const percent = Math.round((e.loaded / e.total) * 100);
        onUploadProgress(percent);
      }
    });

    xhr.addEventListener("load", () => {
      settle(() => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const ct = xhr.getResponseHeader("content-type") || "";
            if (ct.includes("application/json")) {
              resolve(JSON.parse(xhr.responseText || "{}"));
            } else {
              resolve({ message: xhr.responseText || "" });
            }
          } catch (e) {
            resolve({ message: xhr.responseText || "" });
          }
        } else {
          let errorMessage = "Sunucu hatası.";
          try {
            const parsed = xhr.responseText ? JSON.parse(xhr.responseText) : {};
            const json = typeof parsed === "object" && parsed !== null ? parsed : {};
            errorMessage = json.title || json.message || json.error || (typeof parsed === "string" ? parsed : xhr.responseText) || xhr.statusText;
          } catch {
            errorMessage = xhr.responseText || xhr.statusText;
          }
          reject(new Error(errorMessage));
        }
      });
    });

    xhr.addEventListener("error", () => {
      settle(() => reject(new Error("Bağlantı hatası. Lütfen tekrar deneyin.")));
    });

    xhr.addEventListener("abort", () => {
      settle(() => reject(new Error("İşlem zaman aşımına uğradı. Sunucudan yanıt gelmedi. Lütfen tekrar deneyin.")));
    });

    xhr.open("POST", url);
    if (token) xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    xhr.setRequestHeader("Accept", "*/*");

    timeoutId = setTimeout(() => {
      xhr.abort();
      settle(() => reject(new Error("İşlem zaman aşımına uğradı. Sunucudan yanıt gelmedi. Lütfen tekrar deneyin.")));
    }, timeoutMs);

    xhr.send(formData);
  });
}
