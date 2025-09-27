import { apiRequest } from "./apiRequest";

// "/" ve "endpoint" birleşimini güvenli hale getir
const join = (base, path) =>
  `${String(base || "").replace(/\/+$/, "")}/${String(path || "").replace(/^\/+/, "")}`;

/**
 * Tek dosya yükleme (multipart/form-data)
 * @param {File|Blob} file - Yüklenecek dosya/Blob
 * @param {Object} options
 * @param {string}  [options.endpoint="/Upload/file"] - Backend upload endpoint
 * @param {string}  [options.fieldName="file"]        - Form field adı
 * @param {boolean} [options.useAuth=true]            - Authorization header eklensin mi
 * @param {Object}  [options.extraFields={}]          - Ek form alanları
 * @param {string[]} [options.allowedTypes]           - İzinli MIME/uzantı listesi (örn: ["image/png","jpg"])
 * @param {number}   [options.maxSize]                - Maks. boyut (byte)
 */
export async function uploadFile(
  file,
  {
    endpoint = "/Upload/file",
    fieldName = "file",
    useAuth = true,
    extraFields = {},
    allowedTypes,
    maxSize,
  } = {}
) {
  // Giriş doğrulama
  if (!file) {
    throw new Error("Yüklenecek dosya bulunamadı.");
  }

  // Tür kontrolü (MIME boş dönebilir; uzantı fallback)
  if (allowedTypes && allowedTypes.length) {
    const mimeOrExt =
      (/** @type {File} */ (file).type) ||
      (/** @type {File} */ (file).name?.split(".").pop() || "").toLowerCase();
    const ok = allowedTypes.some((t) => t.toLowerCase() === mimeOrExt);
    if (!ok) {
      throw new Error(`Desteklenmeyen dosya türü: ${mimeOrExt}`);
    }
  }

  // Boyut kontrolü
  if (maxSize && /** @type {File} */ (file).size > maxSize) {
    const limitMB = (maxSize / (1024 * 1024)).toFixed(2);
    throw new Error(`Dosya boyutu ${limitMB} MB sınırını aşıyor.`);
  }

  // FormData
  const form = new FormData();
  form.append(fieldName, file);
  Object.entries(extraFields).forEach(([k, v]) => form.append(k, v));

  // İstek
  let res;
  try {
    // apiRequest kendi içinde Content-Type'ı FormData için ayarlamıyor (gerek de yok)
    // endpoint'in baş/son slash durumları için join kullan
    res = await apiRequest(join("", endpoint), "POST", form, useAuth);
  } catch (e) {
    // Daha okunur hata
    throw new Error(e?.message || "Yükleme sırasında bir hata oluştu.");
  }

  // Response normalizasyonu
  const url =
    res?.url ||
    res?.data?.url ||
    res?.fileUrl ||
    res?.data?.fileUrl ||
    res?.location ||
    res?.Location ||
    res?.path ||
    res?.data?.path;

  if (!url) {
    // Tanı için ham yanıtı loglayıp anlamlı bir hata döndür
    // (Uygun yerde Sentry vb. ile yakalanabilir)
    // eslint-disable-next-line no-console
    console.error("Upload response (no URL):", res);
    throw new Error("Yükleme başarılı fakat URL bulunamadı.");
  }

  return { url, raw: res };
}
