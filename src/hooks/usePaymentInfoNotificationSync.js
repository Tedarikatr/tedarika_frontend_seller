/**
 * Ödeme bilgisi ile merkezi bildirim senkronizasyonu.
 * Satıcı alanı yüklendiğinde payout profilini kontrol eder:
 * - Eksikse: "Ödeme bilgileri eksik" bildirimi merkeze eklenir.
 * - Doluysa: Bu konudaki hatırlatma bildirimi kaldırılır (artık gönderilmez).
 * - Mağaza yoksa (404): "Ödeme bilgisi eksik" eklenmez; kullanıcı önce mağaza oluşturmalı.
 */
import { useEffect, useRef } from "react";
import { getPayoutProfile } from "@/api/sellerPayoutProfileService";
import { useNotification, PAYMENT_INFO_MISSING_ID } from "@/contexts/NotificationContext";
import { isStoreNotFoundError } from "@/utils/storeNotFound";

const hasValidPayoutProfile = (p) => {
  if (!p || typeof p !== "object") return false;
  const iban = (p.iban || "").toString().replace(/\s/g, "");
  const hasIban = /^TR\d{24}$/.test(iban);
  const hasBankName = !!((p.bankName || "").trim());
  return hasIban && hasBankName;
};

export function usePaymentInfoNotificationSync() {
  const {
    ensurePaymentInfoMissingNotification,
    removeNotification,
  } = useNotification();
  const didRun = useRef(false);

  useEffect(() => {
    if (didRun.current) return;
    didRun.current = true;

    getPayoutProfile()
      .then((profile) => {
        if (hasValidPayoutProfile(profile)) {
          // Bilgiler dolu: eksik ödeme bildirimini kaldır (artık gönderilmesin)
          removeNotification(PAYMENT_INFO_MISSING_ID);
        } else {
          // Bilgiler eksik: merkeze "ödeme bilgisi eksik" bildirimi ekle
          ensurePaymentInfoMissingNotification();
        }
      })
      .catch((err) => {
        // Mağaza yoksa (404) ödeme eksik bildirimi ekleme; kullanıcı önce mağaza oluşturmalı
        if (isStoreNotFoundError(err)) return;
        // Diğer API hatalarında eksik kabul edip bildirim ekle
        ensurePaymentInfoMissingNotification();
      });
  }, [ensurePaymentInfoMissingNotification, removeNotification]);
}
