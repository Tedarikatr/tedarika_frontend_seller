import { apiRequest } from "./apiRequest";

const base = "/SellerCampaign";

const SellerCampaignService = {
  getMetadata: () => apiRequest(`${base}/metadata`, "GET", null, true),
  getAll:      () => apiRequest(base, "GET", null, true),
  getById:     (id) => apiRequest(`${base}/${id}`, "GET", null, true),
  create:      (payload) => apiRequest(base, "POST", payload, true),
  update:      (id, payload) => apiRequest(`${base}/${id}`, "PUT", payload, true),
  updateStatus:(id, status) => apiRequest(`${base}/${id}/status`, "PATCH", { status }, true),
};

export default SellerCampaignService;
