# Google Arama & SEO Kontrol Listesi – Tedarika Satıcı Paneli

Bu doküman, satıcı panelinin Google’da üst sıralarda çıkması ve Search Console ile uyumlu olması için yapılanlar ve sizin yapmanız gereken adımları özetler.

---

## Yapılan Teknik Düzenlemeler

### 1. Site haritası (Sitemap)
- **Dosyalar:** `public/sitemap.xml` (sitemap index), `public/sitemap-seller.xml`, `public/sitemap-satici.xml`
- Tüm **kamuya açık sayfalar** eklendi: ana sayfa, landing, kayıt, giriş, şifremi unuttum, başvuru, randevu, kurumsal (hakkımızda, iletişim, KVKK, SSS, sözleşmeler), satıcı merkezi alt sayfaları.
- `lastmod` alanları ISO 8601 (YYYY-MM-DD) formatında güncellendi.
- Giriş/kayıt/şifremi unuttum sayfaları sitemap’e eklendi (arama sonuçlarında “tedarika satıcı giriş” vb. için).
- Vercel’de host’a göre doğru sitemap sunuluyor: `www.seller.tedarika.com.tr/sitemap.xml` → seller, `www.satici.tedarika.com.tr/sitemap.xml` → satici.

### 2. robots.txt
- **Crawl-delay** kaldırıldı (Google desteklemiyor).
- **Allow:** `/`, `/seller/landing`, `/seller/register`, `/seller/login`, `/seller/forgot-password`, `/seller/apply`, `/corporate/`, `/satici-merkezi/`.
- **Disallow:** Giriş gerektiren panel sayfaları (dashboard, profile, orders, products, store, vb.) ve `/api/`.
- Her domain için tek **Sitemap** satırı: seller ve satici kendi sitemap URL’i ile.
- Host’a göre `robots-seller.txt` / `robots-satici.txt` Vercel rewrite ile sunuluyor.

### 3. index.html (varsayılan sayfa)
- **Favicon / OG image:** `logo.svg` yoktu; tüm referanslar `images/logo.png` olacak şekilde güncellendi (404 önlendi).
- **JSON-LD yapısal veri:** `Organization` ve `WebSite` şemaları eklendi (Google’ın site ve marka bilgisini anlaması için).
- **Google Search Console doğrulama:** `index.html` içinde meta tag için yer bırakıldı; doğrulama kodunuzu oraya ekleyebilirsiniz.

### 4. Vercel
- Sitemap ve robots için **Cache-Control: public, max-age=3600** (1 saat) eklendi.
- `Content-Type`: sitemap için `application/xml`, robots için `text/plain` zaten ayarlı.

### 5. Logo ve OG görseli
- Projede `logo.svg` olmadığı için tüm kullanımlar `images/logo.png` olacak şekilde güncellendi: `index.html`, `seo.js`, `Footer.jsx`, `AboutPage.jsx`.

---

## Sizin Yapmanız Gerekenler (Google Search Console)

1. **Mülk (property) ekleyin**
   - [Google Search Console](https://search.google.com/search-console) → Mülk ekle.
   - **URL öneki** ile ekleyin: `https://www.seller.tedarika.com.tr` ve (isterseniz) `https://www.satici.tedarika.com.tr`.

2. **Doğrulama**
   - HTML etiket yöntemini seçin; verilen meta tag’i `index.html` içindeki “Google Search Console: Doğrulama için meta tag” yorumunun yanına ekleyin:
     ```html
     <meta name="google-site-verification" content="BURAYA_KOD" />
     ```

3. **Sitemap gönderin**
   - Doğrulama sonrası: Sol menü → **Site haritaları** → “Yeni site haritası ekle”:
     - Seller: `https://www.seller.tedarika.com.tr/sitemap.xml`
     - Satici: `https://www.satici.tedarika.com.tr/sitemap.xml`
   - Gönderim sonrası “Başarılı” veya “Bulgular” durumunu kontrol edin.

4. **URL denetleme (isteğe bağlı)**
   - “URL denetleme” ile önemli sayfaları (örn. `/seller/landing`, `/seller/register`) denetleyip “Dizine ekle” ile hızlandırabilirsiniz.

5. **Canonical ve hreflang**
   - Zaten `createSeoMeta` ve sayfa bazlı Helmet ile canonical + hreflang kullanılıyor; ek işlem gerekmez.

---

## Özet

| Öğe | Durum |
|-----|--------|
| Sitemap (seller + satici) | Tamamlandı, güncel |
| robots.txt (Crawl-delay kaldırıldı, Allow/Disallow/Sitemap) | Tamamlandı |
| JSON-LD (Organization, WebSite) | index.html’e eklendi |
| Favicon / OG image (logo.png) | 404 düzeltildi |
| Vercel cache header’ları | Sitemap/robots için eklendi |
| GSC doğrulama / sitemap gönderimi | Sizin yapmanız gerekiyor |

Bu adımlarla panel, Google’ın tarama ve dizinleme kurallarına uyumlu hale getirildi. Sıralama için içerik kalitesi, sayfa hızı ve dış bağlantılar da önemli; teknik taraf bu checklist ile karşılanmış durumda.
