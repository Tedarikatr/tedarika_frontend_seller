export const statusOptions = [
  { value: "Created", label: "Oluşturuldu" },
  { value: "AwaitingPayment", label: "Ödeme Bekleniyor" },
  { value: "Paid", label: "Ödendi" },
  { value: "Shipped", label: "Kargoya Verildi" },
  { value: "Delivered", label: "Teslim Edildi" },
  { value: "Cancelled", label: "İptal Edildi" },
  { value: "Refunded", label: "İade Edildi" },
  { value: "PaymentFailed", label: "Ödeme Başarısız" },
  { value: "Completed", label: "Tamamlandı" },
];

export const statusLabels = {
  Created:        { text: "Oluşturuldu", color: "bg-gray-100 text-gray-800" },
  AwaitingPayment:{ text: "Ödeme Bekleniyor", color: "bg-yellow-100 text-yellow-700" },
  Paid:           { text: "Ödendi", color: "bg-blue-100 text-blue-700" },
  Shipped:        { text: "Kargoya Verildi", color: "bg-purple-100 text-purple-700" },
  Delivered:      { text: "Teslim Edildi", color: "bg-green-100 text-green-700" },
  Cancelled:      { text: "İptal Edildi", color: "bg-red-100 text-red-700" },
  Refunded:       { text: "İade Edildi", color: "bg-orange-100 text-orange-700" },
  PaymentFailed:  { text: "Ödeme Başarısız", color: "bg-red-100 text-red-700" },
  Completed:      { text: "Tamamlandı", color: "bg-emerald-100 text-emerald-700" },
};
