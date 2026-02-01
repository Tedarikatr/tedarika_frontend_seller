/**
 * Yükleme aşamasına göre process bar yüzdesi
 * SellerProductDraftController API dokümantasyonu - Bölüm 5
 *
 * @param {string} phase - 'validating' | 'uploading' | 'processing' | 'done' | 'error'
 * @param {number} uploadPercent - 0-100 (uploading aşamasında, fetch ile kullanılamaz)
 * @returns {number} 0-100 arası yüzde
 */
export function getUploadProgress(phase, uploadPercent = 0) {
  switch (phase) {
    case "validating":
      return 5;
    case "uploading":
      return Math.min(80, 5 + uploadPercent * 0.75); // 5% - 80%
    case "processing":
      return 95;
    case "done":
      return 100;
    case "error":
      return 0;
    default:
      return 0;
  }
}
