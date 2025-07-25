// src/constants/quotationStatus.js

export const QuotationRequestStatus = {
    Pending: {
      label: "Beklemede",
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    },
    Countered: {
      label: "Karşı Teklif Verildi",
      color: "bg-blue-100 text-blue-700 border-blue-200",
    },
    SellerAccepted: {
      label: "Kabul Edildi",
      color: "bg-green-100 text-green-800 border-green-200",
    },
    SellerRejected: {
      label: "Reddedildi",
      color: "bg-red-100 text-red-800 border-red-200",
    },
    Cancelled: {
      label: "İptal Edildi",
      color: "bg-gray-100 text-gray-500 border-gray-200",
    },
    Expired: {
      label: "Süresi Doldu",
      color: "bg-orange-100 text-orange-700 border-orange-200",
    },
  };
  
  export const getQuotationStatusProps = (status) =>
    QuotationRequestStatus[status] || {
      label: "Bilinmeyen",
      color: "bg-gray-100 text-gray-600 border-gray-200",
    };
  