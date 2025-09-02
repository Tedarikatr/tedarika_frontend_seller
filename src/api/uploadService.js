import { apiRequest } from "./apiRequest";

/**
 * Tek dosya yükleme (multipart/form-data)
 * - endpoint: backend upload endpoint'in (ör: "/Upload/file" ya da "/Storage/upload")
 * - fieldName: backend'in beklediği form alan adı (çoğu yerde "file")
 * - useAuth: seller token gerekiyorsa true
 * - extraFields: gerekiyorsa ilave alanlar
 */
export async function uploadFile(file, {
  endpoint = "/Upload/file",
  fieldName = "file",
  useAuth = true,
  extraFields = {},
} = {}) {
  const form = new FormData();
  form.append(fieldName, file);
  Object.entries(extraFields).forEach(([k, v]) => form.append(k, v));

  const res = await apiRequest(endpoint, "POST", form, useAuth);

  // Olası response ihtimallerini normalize et
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
    console.error("Upload response:", res);
    throw new Error("Yükleme başarılı fakat URL bulunamadı.");
  }
  return { url };
}
