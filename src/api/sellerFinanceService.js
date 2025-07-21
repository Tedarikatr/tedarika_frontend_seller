import { apiRequest } from "./apiRequest";

export function getDashboardSummary() {
  return apiRequest("/SellerFinance/dashboard", "GET", null, true);
}

export function getWeeklyFinance() {
  return apiRequest("/SellerFinance/weekly", "GET", null, true);
}

export function getDailyFinance(date) {
  return apiRequest(`/SellerFinance/daily?date=${date}`, "GET", null, true);
}
