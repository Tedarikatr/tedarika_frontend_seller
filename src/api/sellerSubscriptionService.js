import { apiRequest } from "./apiRequest";

export const activateSubscription = (data) =>
  apiRequest("/SellerSubscription/activate", "POST", data, true);

export const getCurrentSubscription = () =>
  apiRequest("/SellerSubscription/current", "GET", null, true);
