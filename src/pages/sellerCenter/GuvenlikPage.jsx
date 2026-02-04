import React from "react";
import SellerCenterArticle from "./SellerCenterArticle";

const GuvenlikPage = () => (
  <SellerCenterArticle
    title="Satıcı Paneli Güvenliği | Kullanıcı Rolleri, 2FA ve Erişim Kontrolü"
    description="Satıcı panelinde güvenlik. Kullanıcı rolleri, yetkilendirme, iki aşamalı doğrulama (2FA), API anahtarları ve operasyonel güvenlik önerileri."
    keywords="güvenlik, 2FA, kullanıcı rolleri, yetkilendirme, satıcı paneli güvenliği"
    h1="Güvenlik ve Yetkilendirme"
    subtitle="B2B'de en pahalı hatalardan biri yanlış kişiye erişim vermektir: fiyat listesi, müşteri verisi, tahsilat hesabı gibi kritik alanlar korunmalıdır."
    breadcrumbs={[{ name: "Güvenlik", url: "/satici-merkezi/guvenlik" }]}
  >
    <section className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">Rol önerisi (minimum)</h2>
      <ul className="list-disc list-inside space-y-1 text-gray-700">
        <li>Yönetici: finans + ayarlar</li>
        <li>Operasyon: sipariş/lojistik</li>
        <li>Katalog: ürün içerikleri</li>
        <li>Destek: mesajlaşma/teklif</li>
      </ul>
      <p className="text-gray-700 mt-2">Her role “en az yetki” prensibiyle izin verin.</p>
    </section>
    <section className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">2FA ve hesap hijyeni</h2>
      <ul className="list-disc list-inside space-y-1 text-gray-700">
        <li>2FA zorunlu yapın</li>
        <li>Şifre paylaşmayın, kullanıcı açın</li>
        <li>Ayrılan personelin erişimini aynı gün kapatın</li>
        <li>Kritik değişikliklerde (IBAN, adres) iç onay süreci koyun</li>
      </ul>
    </section>
  </SellerCenterArticle>
);

export default GuvenlikPage;
