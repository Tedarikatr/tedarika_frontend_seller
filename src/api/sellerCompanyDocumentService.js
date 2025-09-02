import { apiRequest } from "./apiRequest";

export const getMyDocuments = () =>
  apiRequest("/SellerCompanyDocument/my-documents", "GET", null, true);

export const addDocument = ({ documentType, file, description }) => {
  const fd = new FormData();
  fd.append("DocumentType", documentType); // örn: "TaxCertificate"
  fd.append("File", file);                 // seçilen dosya
  if (description) fd.append("Description", description);

  return apiRequest("/SellerCompanyDocument/add", "POST", fd, true);
};

export const updateDocument = (id, data) =>
  apiRequest(`/SellerCompanyDocument/update/${id}`, "PUT", data, true);

export const deleteDocument = (id) =>
  apiRequest(`/SellerCompanyDocument/delete/${id}`, "DELETE", null, true);
