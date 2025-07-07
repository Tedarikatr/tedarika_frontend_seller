import { apiRequest } from "./apiRequest";

// Şirket var mı kontrolü (true/false döner)
export const hasCompany = async () => {
    const response = await apiRequest("/SellerCompany/has-company", "GET", null, true);
    return response.hasCompany === true;
  };
// Şirket oluşturma
export const createCompany = (data) => {
  return apiRequest("/SellerCompany/register", "POST", data, true);
};
export const getMyCompany = () => {
    return apiRequest("/SellerCompany/my-company", "GET", null, true);
  };
  
  export const updateCompany = (data) => {
    return apiRequest("/SellerCompany/update-my-company", "PUT", data, true);
  };
