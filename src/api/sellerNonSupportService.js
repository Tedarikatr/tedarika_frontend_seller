import { apiRequest } from "./apiRequest";

// multipart/form-data isteği yapacağız
export async function sendSellerNonSupport(data) {
  const formData = new FormData();
  formData.append("FirstName", data.FirstName);
  formData.append("LastName", data.LastName);
  formData.append("Phone", data.Phone || "");
  formData.append("Email", data.Email);
  formData.append("AllowContact", data.AllowContact);
  formData.append("RequestType", data.RequestType);
  formData.append("Message", data.Message);
  if (data.Attachment) formData.append("Attachment", data.Attachment);

  return await apiRequest("/SellerSubscribedNonSupport", "POST", formData, false);
}
