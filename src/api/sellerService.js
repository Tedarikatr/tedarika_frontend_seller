import { apiRequest } from "./apiRequest";

export const applySeller = async (formData) => {
  return await apiRequest("/SellerApplication/apply", "POST", formData);
};
