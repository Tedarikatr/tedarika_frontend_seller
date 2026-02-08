# Rich Snippet / Rich Result – Yapılandırılmış Veri Özeti

Bu doküman, Google Arama’da [zengin sonuçlar](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data) (Rich Snippets / Rich Results) için projede kullanılan yapılandırılmış verileri listeler. Yapılandırılmış veri, sayfadaki **görünür içerikle eşleşmeli** ve [Google yönergelerine](https://developers.google.com/search/docs/appearance/structured-data/structured-data-guidelines) uygun olmalıdır.

---

## 1. Kullanılan şema türleri ve sayfalar

| Şema türü | Google Rich Result karşılığı | Kullanıldığı yer |
|-----------|------------------------------|-------------------|
| **Organization** | Bilgi paneli, sitelinks | `index.html`, Landing, Hakkımızda, İletişim |
| **WebSite** + **SearchAction** | Sitelinks arama kutusu | `index.html`, Landing |
| **BreadcrumbList** | Arama sonucunda breadcrumb | Satıcı Merkezi, Hakkımızda, İletişim, SSS, Sözleşmeler, KVKK, Başvuru, Randevu |
| **FAQPage** | SSS zengin sonucu (genişleyen soru-cevap) | SSS sayfası (`/corporate/sss`) |
| **ContactPage** | İletişim sayfası bağlamı | İletişim sayfası (`/corporate/contact`) |

---

## 2. Sayfa bazlı detay

### Ana giriş / Landing
- **index.html:** `@graph` içinde **Organization** (@id ile) ve **WebSite** (publisher, SearchAction).  
- **SellerLandingPage:** `getOrganizationSchema()`, `getWebsiteSchema(path)` ile aynı yapı; JSON-LD iki ayrı `<script>` ile veriliyor.

### SSS (Sıkça Sorulan Sorular)
- **SssPage.jsx:** `FAQPage` – `mainEntity` altında her soru için `Question` + `acceptedAnswer` (Answer.text).  
- Google’da bu sayfa için **FAQ zengin sonucu** (genişleyen SSS) gösterilebilir.

### Kurumsal / Satıcı Merkezi
- **AboutPage:** Organization (inline) + BreadcrumbList.  
- **ContactPage:** `ContactPage` şeması (description, mainEntity Organization + ContactPoint) + BreadcrumbList.  
- **SellerCenterIndexPage, SellerCenterArticle:** BreadcrumbList.  
- **ContractsPage, KvkkPage:** Sadece BreadcrumbList.  
- **SellerApplicationPage, SellerAppointment:** BreadcrumbList.

---

## 3. Yardımcı fonksiyonlar (`src/utils/seo.js`)

| Fonksiyon | Döndürdüğü şema | Açıklama |
|-----------|------------------|----------|
| `getOrganizationSchema()` | Organization | Logo, contactPoint, sameAs. |
| `getWebsiteSchema(path)` | WebSite | name, url, description, SearchAction (urlTemplate: `/seller/landing?q={search_term_string}`). |
| `getBreadcrumbSchema(items)` | BreadcrumbList | `[{ name, url }]` → ListItem listesi. |

FAQ şeması şu an yalnızca **SssPage** içinde inline tanımlı; gerekirse `getFaqSchema(faqs)` benzeri bir yardımcı da eklenebilir.

---

## 4. Google’ın kullanımdan kaldırdığı şemalar

[Google Blog (Haziran 2025)](https://developers.google.com/search/blog/2025/06/simplifying-search-results): Aşağıdaki yapılandırılmış veri türleri Google Arama’da artık desteklenmiyor. Projede bunlar **kullanılmıyor**:

- Book Actions, Course Info, Claim Review, Estimated Salary, Learning Video, Special Announcement, Vehicle Listing.

---

## 5. Kontrol listesi

- [x] Organization: logo, contactPoint, sameAs mevcut.  
- [x] WebSite + SearchAction: urlTemplate gerçek bir URL (`/seller/landing?q=...`).  
- [x] BreadcrumbList: Sayfa hiyerarşisine uygun (Ana Sayfa → … → Mevcut sayfa).  
- [x] FAQPage: Sadece SSS sayfasında; soru/cevap metinleri sayfadaki görünür içerikle aynı.  
- [x] Yapılandırılmış veri, sayfadaki görünür içerikle uyumlu (Google yönergesi).

Test için: [Zengin Sonuçlar Testi](https://search.google.com/test/rich-results) veya Search Console “Zengin sonuçlar” raporu kullanılabilir.
