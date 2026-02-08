# Google Arama Uyumluluk Raporu – Tedarika Satıcı Paneli

Bu rapor, [Google Tarama ve Dizine Ekleme](https://developers.google.com/search/docs/crawling-indexing?hl=tr) dokümanına göre sitenin teknik uyumluluğunu ve arama sıralamasına yönelik önerileri özetler.

---

## 1. Site haritaları (Sitemaps)

| Gereksinim | Durum | Açıklama |
|------------|--------|----------|
| Yeni/güncel sayfaları Google'a bildirme | ✅ | `sitemap-seller.xml` / `sitemap-satici.xml` tüm kamuya açık sayfaları listeliyor. |
| Sitemap formatı | ✅ | XML, `urlset`, `loc`, `lastmod`, `changefreq`, `priority` kullanılıyor. |
| Sitemap konumu | ✅ | `robots.txt` içinde `Sitemap:` ile belirtildi; host'a göre doğru dosya sunuluyor (Vercel rewrite). |
| Resim site haritası | ✅ | Ana sayfa için `image:image` (logo) eklendi. |

**Yapılacak:** Google Search Console’da her mülk için ilgili sitemap URL’ini gönderin (örn. `https://www.seller.tedarika.com.tr/sitemap.xml`).

---

## 2. robots.txt

| Gereksinim | Durum | Açıklama |
|------------|--------|----------|
| Tarayıcılara izin/kısıtlama | ✅ | [robots.txt giriş](https://developers.google.com/search/docs/crawling-indexing/robots/intro?hl=tr): `Allow` / `Disallow` ile kamu ve özel alanlar ayrıldı. |
| Sitemap referansı | ✅ | Her domain için tek `Sitemap:` satırı var. |
| Crawl-delay | ✅ | Kaldırıldı (Google desteklemiyor). |
| Özel/panel sayfaları | ✅ | Dashboard, profil, siparişler, ürünler, mağaza vb. `Disallow` ile işaretlendi. |

---

## 3. URL standartlaştırma (Canonicalization)

| Gereksinim | Durum | Açıklama |
|------------|--------|----------|
| Yinelenen içerik | ✅ | Kök URL (`/`) client-side ile `/seller/landing`’e yönlendiği için, `index.html` canonical ve hreflang artık **`/seller/landing`** olarak ayarlandı. Böylece [standart URL](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls?hl=tr) tek ve net. |
| Sayfa bazlı canonical | ✅ | Kamu sayfalarında Helmet + `createSeoMeta` ile her sayfa kendi canonical URL’ini veriyor. |

---

## 4. Meta etiketler ve sayfa meta verisi

| Gereksinim | Durum | Açıklama |
|------------|--------|----------|
| robots meta | ✅ | Varsayılan: `index, follow`. Özel (giriş gerektiren) alanlarda **noindex, nofollow** (SellerLayout’ta Helmet ile). |
| noindex | ✅ | [noindex ile dizine eklemeyi engelleme](https://developers.google.com/search/docs/crawling-indexing/block-indexing?hl=tr): Panel sayfaları (dashboard, profil, siparişler vb.) `SellerLayout` içinde `noindex, nofollow` alıyor. |
| Başlık ve açıklama | ✅ | `index.html` ve her kamu sayfasında Helmet ile `title`, `meta description`, `keywords` kullanılıyor. |
| Geçerli meta etiketleri | ✅ | [Google’ın anladığı meta etiketler](https://developers.google.com/search/docs/crawling-indexing/special-tags?hl=tr) ile uyumlu (description, robots, og:, twitter:). |

---

## 5. Yapılandırılmış veri (JSON-LD)

| Gereksinim | Durum | Açıklama |
|------------|--------|----------|
| Organization | ✅ | `index.html` içinde kurumsal bilgi, logo, iletişim, sameAs. |
| WebSite | ✅ | Site adı, URL, açıklama, SearchAction (arama kutusu önerisi). |
| Sayfa bazlı şema | ✅ | Örneğin Hakkımızda, İletişim, SSS, Satıcı Merkezi sayfalarında BreadcrumbList ve sayfa tipine uygun kullanım. |

---

## 6. JavaScript ve SPA (React)

| Gereksinim | Durum | Açıklama |
|------------|--------|----------|
| İlk HTML | ✅ | Kritik meta (title, description, canonical, robots, JSON-LD) `index.html`’de; JS yüklenmeden de mevcut. |
| Client-side routing | ✅ | Her kamu route’unda Helmet ile sayfa bazlı title/description/canonical güncelleniyor; Google JS’i çalıştırdığında doğru meta görür. |
| Bağlantıların taranabilirliği | ✅ | [Taranabilir bağlantılar](https://developers.google.com/search/docs/crawling-indexing/links-crawlable?hl=tr): `<a href="...">` kullanılıyor, gerekli sayfalar sitemap’te. |

Not: İleride çok büyük ölçek veya ağır JS kullanımında, kritik sayfalar için sunucu taraflı render (SSR) veya ön-işleme (pre-render) değerlendirilebilir.

---

## 7. Mobil ve sayfa deneyimi

| Gereksinim | Durum | Açıklama |
|------------|--------|----------|
| viewport | ✅ | `width=device-width, initial-scale=1, maximum-scale=5`. |
| Mobil meta | ✅ | `mobile-web-app-capable`, `apple-mobile-web-app-capable` vb. |
| Sayfa deneyimi | ⚠️ | Core Web Vitals (LCP, FID, CLS) için [PageSpeed Insights](https://pagespeed.web.dev/) ile periyodik ölçüm önerilir. |

---

## 8. Özet tablo – Google tarama ve dizine ekleme

| Konu | Doküman referansı | Sitedeki durum |
|------|-------------------|-----------------|
| Dizine eklenebilir dosya türleri | [Dosya türleri](https://developers.google.com/search/docs/crawling-indexing/indexable-file-types?hl=tr) | HTML/JS/CSS; sitemap XML. |
| URL yapısı | [URL yapısı](https://developers.google.com/search/docs/crawling-indexing/url-structure?hl=tr) | Anlamlı, tutarlı path’ler (`/seller/landing`, `/satici-merkezi/...`, `/corporate/...`). |
| Site haritaları | [Site haritaları](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview?hl=tr) | Gönderildi, güncel. |
| robots.txt | [robots.txt](https://developers.google.com/search/docs/crawling-indexing/robots/intro?hl=tr) | Allow/Disallow ve Sitemap doğru. |
| Standartlaştırma | [Yinelenen URL’ler](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls?hl=tr) | Canonical kök → landing; sayfa bazlı canonical. |
| Meta etiketler | [Meta etiketler](https://developers.google.com/search/docs/crawling-indexing/special-tags?hl=tr) | title, description, robots, canonical, og, twitter. |
| noindex | [Dizine eklemeyi engelleme](https://developers.google.com/search/docs/crawling-indexing/block-indexing?hl=tr) | Panel sayfalarında noindex, nofollow. |

---

## 9. Arama sıralaması için ek öneriler

Teknik tarama/dizine ekleme uyumluluğu bu raporla karşılanıyor. Sıralamayı desteklemek için:

1. **İçerik kalitesi:** Satıcı Merkezi ve kurumsal sayfalarda kullanıcı odaklı, özgün ve güncel metinler (ör. [yararlı içerik yönergesi](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)).  
2. **Anahtar kelime uyumu:** Title ve description’da hedef kelimeler (B2B, satıcı paneli, ihracat, Tedarika vb.) doğal biçimde kullanılıyor; yeni sayfalarda da aynı tutarlılık.  
3. **Backlink ve güven:** Ana site (tedarika.com.tr) ve güvenilir kaynaklardan gelen bağlantılar.  
4. **Search Console:** Sitemap gönderimi, URL denetleme, “Dizine ekle” ile önemli sayfaların hızlandırılması.  
5. **Core Web Vitals:** Sayfa hızı ve etkileşim metrikleri (LCP, INP, CLS) iyileştirilerek [sayfa deneyimi](https://developers.google.com/search/docs/appearance/page-experience) sinyali güçlendirilebilir.

---

## 10. Bu raporda yapılan güncellemeler

- **Canonical (index.html):** Kök `/` için standart URL `https://www.seller.tedarika.com.tr/seller/landing` olacak şekilde güncellendi (yinelenen içerik riski azaltıldı).  
- **OG/Twitter url:** Varsayılan og:url ve twitter:url `/seller/landing` ile uyumlu hale getirildi.  
- **noindex (panel):** Giriş gerektiren tüm panel sayfalarında `SellerLayout` üzerinden `<meta name="robots" content="noindex, nofollow" />` eklendi.

Bu rapor, [Google Arama Merkezi – Tarama ve dizine ekleme](https://developers.google.com/search/docs/crawling-indexing?hl=tr) dokümanına göre hazırlanmıştır.
