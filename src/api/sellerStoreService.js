// src/api/sellerStoreService.js
import { apiRequest } from "./apiRequest";

export const getMyStore = () =>
  apiRequest("/SellerStore/my-store", "GET", null, true);

export const createStore = (data) =>
  apiRequest("/SellerStore/create-store", "POST", data, true);

export const updateStore = (id, data) =>
  apiRequest(`/SellerStore/update-store/${id}`, "PUT", data, true);
