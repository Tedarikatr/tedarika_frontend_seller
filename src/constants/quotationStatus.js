// src/constants/quotationStatus.js

const statusMap = {
  0: {
    label: "Beklemede",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  1: {
    label: "Karşı Teklif Verildi",
    color: "bg-blue-100 text-blue-700 border-blue-200",
  },
  2: {
    label: "Kabul Edildi",
    color: "bg-green-100 text-green-800 border-green-200",
  },
  3: {
    label: "Reddedildi",
    color: "bg-red-100 text-red-800 border-red-200",
  },
  4: {
    label: "İptal Edildi",
    color: "bg-gray-100 text-gray-500 border-gray-200",
  },
  5: {
    label: "Süresi Doldu",
    color: "bg-orange-100 text-orange-700 border-orange-200",
  },
  7: {
    label: "Siparişe Dönüştü",
    color: "bg-purple-100 text-purple-700 border-purple-200",
  },
};

export const getQuotationStatusProps = (status) =>
  statusMap[status] || {
    label: "Bilinmeyen",
    color: "bg-gray-100 text-gray-600 border-gray-200",
  };
