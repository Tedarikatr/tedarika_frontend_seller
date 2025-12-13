import { apiRequest } from "./apiRequest";

/**
 * Satış raporu formatları
 */
export const SALES_REPORT_FORMAT = {
  Pdf: "Pdf",
  Xlsx: "Xlsx",
};

/**
 * Rapor türleri
 */
export const SALES_REPORT_TYPES = {
  DAILY_SALES: "DailySales",
  MONTHLY_SALES: "MonthlySales",
  PRODUCT_SALES: "ProductSales",
  CATEGORY_SALES: "CategorySales",
  CUSTOMER_SALES: "CustomerSales",
};

/**
 * Satış raporu export et
 * @param {Object} exportRequest
 * @param {string} exportRequest.reportType - Rapor türü
 * @param {string} exportRequest.format - Rapor formatı (Pdf/Xlsx)
 * @param {Object} exportRequest.filter - Tarih filtresi
 * @param {string} exportRequest.filter.startDate - Başlangıç tarihi (ISO format)
 * @param {string} exportRequest.filter.endDate - Bitiş tarihi (ISO format)
 * @returns {Promise<Blob>} - Dosya blob'u
 */
export const exportSalesReport = async (exportRequest) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/SellerSalesReport/export`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("sellerToken")}`,
      },
      body: JSON.stringify(exportRequest),
    }
  );

  if (!response.ok) {
    throw new Error("Rapor oluşturulamadı");
  }

  return await response.blob();
};

/**
 * Planlanmış rapor oluştur (cron job)
 * @param {Object} scheduleRequest
 * @param {string} scheduleRequest.reportType - Rapor türü
 * @param {string} scheduleRequest.format - Rapor formatı (Pdf/Xlsx)
 * @param {string} scheduleRequest.email - Raporun gönderileceği email
 * @param {string} scheduleRequest.cronExpression - Cron ifadesi (örn: "0 9 * * 1" her pazartesi saat 9)
 * @param {string} scheduleRequest.timezone - Zaman dilimi (örn: "Europe/Istanbul")
 * @param {Object} [scheduleRequest.parameters] - Ek parametreler
 * @returns {Promise<Object>} - Schedule bilgisi
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
