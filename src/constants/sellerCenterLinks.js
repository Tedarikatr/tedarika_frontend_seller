/**
 * Satıcı Merkezi ve kurumsal sayfalar için merkezi link yapılandırması.
 * Header, Footer ve Satıcı Merkezi sol panel buradan beslenir.
 */
import { Info, Phone, HelpCircle, BookOpen, Calendar, MessageCircle } from "lucide-react";

/** Kurumsal / Satıcı Merkezi dropdown içeriği (Header) */
export const corporateLinks = [
  { label: "Hakkımızda", href: "/corporate/about", icon: Info },
  { label: "Satıcı Merkezi", href: "/satici-merkezi", icon: BookOpen },
  { label: "İletişim", href: "/corporate/contact", icon: Phone },
  { label: "SSS", href: "/corporate/sss", icon: HelpCircle },
];

/** Destek dropdown içeriği (Header) */
export const supportLinks = [
  { label: "Randevu Oluştur", href: "/seller/appointment", icon: Calendar },
  { label: "WhatsApp Destek", href: "https://wa.me/905382362605", external: true, icon: MessageCircle },
];

/** Satıcı Merkezi sayfalarında sol panel / in-page header bağlantıları */
export const sellerCenterNavLinks = [
  { label: "Hakkımızda", href: "/corporate/about", icon: Info },
  { label: "İletişim", href: "/corporate/contact", icon: Phone },
  { label: "SSS", href: "/corporate/sss", icon: HelpCircle },
  { label: "Satıcı Merkezi", href: "/satici-merkezi", icon: BookOpen },
  { label: "Randevu Oluştur", href: "/seller/appointment", icon: Calendar },
  { label: "WhatsApp Destek", href: "https://wa.me/905382362605", external: true, icon: MessageCircle },
];

/** Footer ana sayfa bağlantıları (Hakkımızda, Satıcı Merkezi, İletişim, KVKK, SSS) */
export const footerTopics = [
  { label: "Hakkımızda", path: "/corporate/about" },
  { label: "Satıcı Merkezi", path: "/satici-merkezi" },
  { label: "İletişim", path: "/corporate/contact" },
  { label: "KVKK", path: "/corporate/kvkk" },
  { label: "SSS", path: "/corporate/sss" },
];
