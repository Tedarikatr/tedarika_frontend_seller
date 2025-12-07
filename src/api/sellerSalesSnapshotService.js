import { apiRequest } from "./apiRequest";

/**
 * Get dashboard summary with total orders, active products, revenue, etc.
 * @returns {Promise<Object>} Dashboard data
 */
export function getDashboardSnapshot() {
  return apiRequest("/SellerSalesSnapshot/dashboard", "GET", null, true);
}

/**
 * Get daily sales snapshot (total orders and amount)
 * @returns {Promise<Object>} Daily sales data
 */
export function getDailySnapshot() {
  return apiRequest("/SellerSalesSnapshot/daily", "GET", null, true);
}

/**
 * Get weekly sales snapshot (total orders and amount)
 * @returns {Promise<Object>} Weekly sales data
 */
export function getWeeklySnapshot() {
  return apiRequest("/SellerSalesSnapshot/weekly", "GET", null, true);
}
