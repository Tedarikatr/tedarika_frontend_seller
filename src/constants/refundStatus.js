/**
 * İade durum etiketleri
 */
export const REFUND_STATUS_LABELS = {
  Pending: {
    text: "Beklemede",
    color: "amber",
    icon: "Clock",
  },
  Completed: {
    text: "Tamamlandı",
    color: "green",
    icon: "CheckCircle",
  },
  Failed: {
    text: "Başarısız",
    color: "red",
    icon: "XCircle",
  },
};

/**
 * İade talep durum etiketleri
 */
export const REFUND_REQUEST_STATUS_LABELS = {
  PendingSellerApproval: {
    text: "Satıcı Onayı Bekleniyor",
    color: "amber",
    icon: "Clock",
    description: "İade talebi satıcının onayını bekliyor",
  },
  SellerRejected: {
    text: "Satıcı Reddetti",
    color: "red",
    icon: "XCircle",
    description: "İade talebi satıcı tarafından reddedildi",
  },
  AwaitingBuyerShipment: {
    text: "Alıcı Kargosı Bekleniyor",
    color: "amber",
    icon: "Package",
    description: "Alıcının ürünü göndermesi bekleniyor",
  },
  AwaitingSellerInspection: {
    text: "Satıcı İncelemesi Bekleniyor",
    color: "amber",
    icon: "Search",
    description: "Ürün geldi, satıcının incelemesi bekleniyor",
  },
  Accepted: {
    text: "Kabul Edildi",
    color: "green",
    icon: "CheckCircle",
    description: "İade kabul edildi ve işlem tamamlandı",
  },
  RejectedAfterInspection: {
    text: "İnceleme Sonrası Reddedildi",
    color: "red",
    icon: "AlertCircle",
    description: "Ürün incelendi ve iade reddedildi",
  },
  Closed: {
    text: "Kapatıldı",
    color: "gray",
    icon: "Lock",
    description: "İade talebi kapatıldı",
  },
};
