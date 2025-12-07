/**
 * Ürün Başvuru Durumları
 */

export const PRODUCT_DRAFT_STATUS = {
  Pending: 0,
  Approved: 1,
  Rejected: 2,
};

export const DRAFT_STATUS_LABELS = {
  0: { text: "Beklemede", color: "amber", icon: "Clock" },
  1: { text: "Onaylandı", color: "green", icon: "CheckCircle" },
  2: { text: "Reddedildi", color: "red", icon: "XCircle" },
  Pending: { text: "Beklemede", color: "amber", icon: "Clock" },
  Approved: { text: "Onaylandı", color: "green", icon: "CheckCircle" },
  Rejected: { text: "Reddedildi", color: "red", icon: "XCircle" },
};

export const SOURCE_TYPE_LABELS = {
  Excel: { text: "Excel", icon: "FileSpreadsheet", color: "green" },
  Json: { text: "JSON", icon: "FileCode", color: "blue" },
  Xml: { text: "XML", icon: "FileCode", color: "purple" },
};
