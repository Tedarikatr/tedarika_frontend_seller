import { apiRequest } from "./apiRequest";

/**
 * Satış raporu formatları (enum değerleri)
 */
export const SALES_REPORT_FORMAT = {
  Pdf: 0,
  Xlsx: 1,
};

/**
 * Rapor türleri
 */
export const SALES_REPORT_TYPES = {
  STANDARD_SALES_REPORT: "StandardSalesReport",
  TOP_PRODUCT_SALES_REPORT: "TopProductSalesReport",
};

/**
 * Satış raporu export et
 * @param {Object} exportRequest
 * @param {string} exportRequest.reportType - Rapor türü ("StandardSalesReport" | "TopProductSalesReport")
 * @param {number} exportRequest.format - Rapor formatı (0 = Pdf, 1 = Xlsx)
 * @param {Object} [exportRequest.filter] - Tarih filtresi (opsiyonel)
 * @param {string} [exportRequest.filter.startDate] - Başlangıç tarihi (ISO format)
 * @param {string} [exportRequest.filter.endDate] - Bitiş tarihi (ISO format)
 * @returns {Promise<Object>} - Rapor bilgisi { id, reportType, format, storagePath, expiresAt, status }
 */
export const exportSalesReport = async (exportRequest) => {
  return await apiRequest("/api/SellerSalesReport/export", "POST", exportRequest, true);
};

/**
 * Planlanmış rapor oluştur (cron job)
 * @param {Object} scheduleRequest
 * @param {string} scheduleRequest.reportType - Rapor türü ("StandardSalesReport" | "TopProductSalesReport")
 * @param {number} scheduleRequest.format - Rapor formatı (0 = Pdf, 1 = Xlsx)
 * @param {string} [scheduleRequest.email] - Raporun gönderileceği email (opsiyonel)
 * @param {string} [scheduleRequest.cronExpression] - Cron ifadesi (örn: "0 8 * * *" her gün saat 8)
 * @param {string} [scheduleRequest.timezone] - Zaman dilimi (örn: "Europe/Istanbul", default: UTC)
 * @param {Object} [scheduleRequest.parameters] - Rapor parametreleri
 * @param {string} [scheduleRequest.parameters.StartDate] - Başlangıç tarihi (ISO format)
 * @param {string} [scheduleRequest.parameters.EndDate] - Bitiş tarihi (ISO format)
 * @returns {Promise<Object>} - Schedule bilgisi { id, reportType, format, email, isActive, lastRunAt, nextRunAt, cronExpression, timezone }
 */
export const createReportSchedule = async (scheduleRequest) => {
  return await apiRequest("/api/SellerSalesReport/schedules", "POST", scheduleRequest, true);
};

/**
 * Planlanmış raporu sil
 * @param {number} scheduleId - Schedule ID
 * @returns {Promise<void>}
 */
export const deleteReportSchedule = async (scheduleId) => {
  await apiRequest(`/api/SellerSalesReport/schedules/${scheduleId}`, "DELETE", null, true);
};

/**
 * Export geçmişini listele
 * @returns {Promise<Array>} - Export listesi
 */
export const getExportHistory = async () => {
  return await apiRequest("/api/SellerSalesReport/exports", "GET", null, true);
};

/**
 * Planlanmış raporları listele
 * @returns {Promise<Array>} - Schedule listesi
 */
export const getReportSchedules = async () => {
  return await apiRequest("/api/SellerSalesReport/schedules", "GET", null, true);
};
